/**
 * Every edge a native component draws — a stroke, a border, a divider, a
 * text field's outline — with the colour expression it is drawn in, read
 * across line breaks: an edge call's colour is often on the line after it.
 *
 * Used by scripts/check-border-parity.mjs to hold the components to the
 * Semantics.Border roles.
 */
import fs from "node:fs";
import path from "node:path";

const SWIFT_CALLS = [
  /\.stroke\(/g,
  /\.strokeBorder\(/g,
  /\.border\(/g,
  /\bDivider\(\)/g,
];
const KOTLIN_CALLS = [
  /\bBorderStroke\(/g,
  /\.border\(/g,
  /\b(?:Horizontal|Vertical)?Divider\(/g,
  /\b(?:unfocused|focused|disabled|error)BorderColor\s*=/g,
  /\b(?:val|var)\s+\w*[Bb]order\w*\s*=/g,
  // A named argument: `border = statusColor ?: …`.
  /(?<![\w.])border\s*=(?!=)/g,
];

function walk(dir, extension, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, extension, files);
    else if (entry.name.endsWith(extension)) files.push(full);
  }
  return files;
}

/** The text of a call from its opening parenthesis to the one that closes it. */
function callText(source, start) {
  const open = source.indexOf("(", start);
  const assign = source.indexOf("=", start);
  // An assignment (`unfocusedBorderColor = …`, `val borderColor = …`): to the
  // end of its line, or of the expression if it continues.
  if (assign !== -1 && (open === -1 || assign < open)) {
    const end = source.indexOf("\n", assign);
    return source.slice(start, end === -1 ? undefined : end);
  }
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "(") depth += 1;
    if (source[i] === ")") {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return source.slice(start);
}

export function nativeEdges(root) {
  const edges = [];
  const platforms = [
    [
      "SwiftUI",
      path.join(root, "packages/ios/Sources/Components"),
      ".swift",
      SWIFT_CALLS,
    ],
    [
      "Compose",
      path.join(root, "packages/android/src/main/java/com/kozmos/components"),
      ".kt",
      KOTLIN_CALLS,
    ],
  ];
  for (const [platform, dir, extension, calls] of platforms) {
    for (const file of walk(dir, extension)) {
      const source = fs.readFileSync(file, "utf8");
      for (const pattern of calls) {
        for (const match of source.matchAll(pattern)) {
          let text = callText(source, match.index);
          // A SwiftUI Divider draws the system's separator colour unless a
          // modifier after it lays another over it: that modifier's colour
          // is the divider's.
          if (match[0] === "Divider()") {
            const rest = source.slice(match.index + text.length);
            const next = rest.match(/^\s*\.(overlay|background)\(/);
            if (next) text += callText(rest, next.index).trim();
          }
          const line = source.slice(0, match.index).split("\n").length;
          edges.push({
            platform,
            file: path.relative(root, file),
            line,
            call: match[0],
            text: text.replace(/\s+/g, " ").trim(),
          });
        }
      }
    }
  }
  return edges;
}
