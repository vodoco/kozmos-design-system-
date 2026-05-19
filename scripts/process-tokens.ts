import fs from "fs";
import path from "path";

/**
 * script: process-tokens.ts
 * Purpose: Ingest a 'variables.json' file exported from a Figma Plugin and convert it to DTCG.
 * Usage: pnpm exec tsx scripts/process-tokens.ts
 * Prerequisite: Place 'variables.json' in 'packages/tokens/src/raw/'
 */

const RAW_DIR = path.resolve(process.cwd(), "packages/tokens/src/raw");
const OUTPUT_DIR = path.resolve(process.cwd(), "packages/tokens/src");
const VARIABLES_FILE = path.join(RAW_DIR, "variables.json");

async function main() {
  console.log("🔄 processing Figma Variables Export...");

  if (!fs.existsSync(VARIABLES_FILE)) {
    console.error(`❌ Missing file: ${VARIABLES_FILE}`);
    console.error(
      '👉 Please export your variables using a Figma Plugin (e.g. "Variables Import/Export") and save as variables.json',
    );
    process.exit(1);
  }

  try {
    const rawData = JSON.parse(fs.readFileSync(VARIABLES_FILE, "utf-8"));
    console.log(`✅ Loaded keys: ${Object.keys(rawData).join(", ")}`);

    // Helper to mix and match sets
    const generateHybrid = (
      baseKey: string,
      overrideKey: string,
      semanticKey: string = "Semantic Tokens/idle",
    ) => {
      const base = rawData[baseKey] || {};
      const override = rawData[overrideKey] || {};
      const semantic = rawData[semanticKey] || {};

      // Deep merge logic: Start with Base
      const merged = { ...base, ...semantic };

      // Override specific sections (Background, Foreground, Transparent)
      if (base.Colors && override.Colors) {
        merged.Colors = {
          ...base.Colors,
          background: override.Colors.background,
          foreground: override.Colors.foreground,
          Transparent: override.Colors.Transparent,
          "Transparent - Inverted": override.Colors["Transparent - Inverted"],
        };
      }
      return merged;
    };

    // 1. Generate Light Mode
    // Base: Light (Correct Theme) | Overrides: Dark (Correct Background/Foreground)
    const lightTokens = generateHybrid(
      "Primitive Tokens/Light",
      "Primitive Tokens/Dark",
    );
    fs.writeFileSync(
      path.join(OUTPUT_DIR, "tokens-light.json"),
      JSON.stringify(lightTokens, null, 2),
    );

    // 2. Generate Dark Mode
    // Base: Dark (Correct Theme) | Overrides: Light (Correct Background/Foreground)
    const darkTokens = generateHybrid(
      "Primitive Tokens/Dark",
      "Primitive Tokens/Light",
    );
    fs.writeFileSync(
      path.join(OUTPUT_DIR, "tokens-dark.json"),
      JSON.stringify(darkTokens, null, 2),
    );

    console.log("✅ Generated tokens-light.json and tokens-dark.json");
  } catch (error) {
    console.error("❌ Processing failed:", error);
    process.exit(1);
  }
}

main();
