/**
 * Read real metrics out of a font file, so nobody has to guess them.
 *
 * Swapping a brand font for a system one changes how big the text *looks* even
 * at an identical font-size, because the visual size of a typeface is its
 * x-height, not its em. Correcting for that needs the actual numbers from the
 * actual files — recalled ratios are how a design system ends up with text that
 * is subtly wrong everywhere.
 *
 * Usage:
 *   node scripts/measure-font-metrics.mjs <brand.ttf> [fallback.ttf ...]
 *
 * With one file it prints that font's metrics. With more, it treats the first
 * as the brand font and prints, for each fallback, the CSS @font-face
 * descriptors that make the fallback render at the brand font's apparent size:
 *
 *   size-adjust        x-height ratio, the correction that matters visually
 *   ascent-override    so line boxes match and nothing reflows on font swap
 *   descent-override
 *   line-gap-override
 *
 * Those four are what `size-adjust` was designed for: a page rendered with the
 * brand font and one rendered without it become hard to tell apart, which is
 * what lets a build drop the font (an iOS App Clip under its size budget, say)
 * without the layout shifting.
 *
 * Parses sfnt directly — no dependency, and no need for the font to be
 * installed. Takes .ttf/.otf/.ttc; woff2 must be decompressed first.
 */
import fs from "node:fs";
import path from "node:path";

function readTables(buffer, offset = 0) {
  const tag = buffer.readUInt32BE(offset);
  // 'ttcf' — a collection; use its first face.
  if (tag === 0x74746366)
    return readTables(buffer, buffer.readUInt32BE(offset + 12));
  const numTables = buffer.readUInt16BE(offset + 4);
  const tables = {};
  for (let i = 0; i < numTables; i += 1) {
    const record = offset + 12 + i * 16;
    tables[buffer.toString("ascii", record, record + 4)] = {
      offset: buffer.readUInt32BE(record + 8),
      length: buffer.readUInt32BE(record + 12),
    };
  }
  return tables;
}

/** Font family and subfamily from the name table, for readable output. */
function readName(buffer, table) {
  if (!table) return null;
  const base = table.offset;
  const count = buffer.readUInt16BE(base + 2);
  const stringOffset = buffer.readUInt16BE(base + 4);
  const found = {};
  for (let i = 0; i < count; i += 1) {
    const record = base + 6 + i * 12;
    const platformId = buffer.readUInt16BE(record);
    const languageId = buffer.readUInt16BE(record + 4);
    const nameId = buffer.readUInt16BE(record + 6);
    if (nameId !== 1 && nameId !== 2) continue;
    // Take only the English record, or a localised one wins on some system
    // fonts and the report comes back in whatever language happens to sort
    // first. 0x409 is en-US on Windows, 0 is English on Macintosh.
    const english = platformId === 3 ? languageId === 0x409 : languageId === 0;
    if (!english) continue;
    const length = buffer.readUInt16BE(record + 8);
    const offset = base + stringOffset + buffer.readUInt16BE(record + 10);
    const encoding = platformId === 1 ? "latin1" : "utf16le";
    let value = buffer.subarray(offset, offset + length);
    if (encoding === "utf16le") value = Buffer.from(value).swap16();
    found[nameId] = value.toString(encoding).replace(/\0/g, "").trim();
  }
  return [found[1], found[2]].filter(Boolean).join(" ") || null;
}

export function measure(file) {
  const buffer = fs.readFileSync(file);
  const tables = readTables(buffer);
  if (!tables.head || !tables["OS/2"] || !tables.hhea) {
    throw new Error(`${file}: missing head, OS/2 or hhea`);
  }

  const unitsPerEm = buffer.readUInt16BE(tables.head.offset + 18);
  const os2 = tables["OS/2"].offset;
  const version = buffer.readUInt16BE(os2);
  // sxHeight and sCapHeight only exist from OS/2 version 2.
  const xHeight = version >= 2 ? buffer.readInt16BE(os2 + 86) : 0;
  const capHeight = version >= 2 ? buffer.readInt16BE(os2 + 88) : 0;

  const hhea = tables.hhea.offset;
  return {
    file,
    name: readName(buffer, tables.name) || path.basename(file),
    unitsPerEm,
    xHeight,
    capHeight,
    ascender: buffer.readInt16BE(hhea + 4),
    descender: buffer.readInt16BE(hhea + 6),
    lineGap: buffer.readInt16BE(hhea + 8),
    get xHeightRatio() {
      return this.xHeight / this.unitsPerEm;
    },
    get capHeightRatio() {
      return this.capHeight / this.unitsPerEm;
    },
  };
}

const percent = (value) => `${(value * 100).toFixed(2)}%`;

function report(brand, fallback) {
  if (!brand.xHeight || !fallback.xHeight) {
    console.log(
      `\n  ${fallback.name}: no x-height in OS/2 (version < 2), cannot compute size-adjust`,
    );
    return;
  }
  // Match the apparent size: scale the fallback so its x-height lands where the
  // brand font's does.
  const sizeAdjust = brand.xHeightRatio / fallback.xHeightRatio;
  // The overrides are expressed against the *adjusted* em, so divide them by
  // the same factor or the line box moves even though the glyphs match.
  const scale = fallback.unitsPerEm * sizeAdjust;

  console.log(`\n  ${fallback.name}`);
  console.log(
    `    x-height ${fallback.xHeightRatio.toFixed(4)} vs brand ${brand.xHeightRatio.toFixed(4)}`,
  );
  console.log(`    size-adjust:        ${percent(sizeAdjust)}`);
  console.log(`    ascent-override:    ${percent(brand.ascender / scale)}`);
  console.log(
    `    descent-override:   ${percent(Math.abs(brand.descender) / scale)}`,
  );
  console.log(`    line-gap-override:  ${percent(brand.lineGap / scale)}`);
  console.log(
    `    native size scale:  ${sizeAdjust.toFixed(4)}  (multiply point sizes by this when the brand font is absent)`,
  );
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error(
    "usage: node scripts/measure-font-metrics.mjs <brand> [fallback ...]",
  );
  process.exit(2);
}

const measured = files.map(measure);
for (const font of measured) {
  console.log(
    `${font.name}\n  upem ${font.unitsPerEm}  x-height ${font.xHeight} (${font.xHeightRatio.toFixed(4)})  ` +
      `cap ${font.capHeight}  asc ${font.ascender}  desc ${font.descender}  gap ${font.lineGap}`,
  );
}

if (measured.length > 1) {
  const [brand, ...fallbacks] = measured;
  console.log(`\nFallback descriptors, matched to ${brand.name}:`);
  for (const fallback of fallbacks) report(brand, fallback);
}
