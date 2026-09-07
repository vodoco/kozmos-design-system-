import StyleDictionary from "style-dictionary";
import { register } from "@tokens-studio/sd-transforms";
import fs from "fs";
import path from "path";

register(StyleDictionary);

console.log("🏗️  Starting Style Dictionary Build (v5)...");

const pointrPaletteDir = process.env.POINTR_COLOR_PALETTE_DIR;

function optionalPointrPlatform(destination) {
  if (!pointrPaletteDir) return {};

  const buildPath = pointrPaletteDir.endsWith(path.sep)
    ? pointrPaletteDir
    : `${pointrPaletteDir}${path.sep}`;

  return {
    pointr: {
      transformGroup: "css",
      buildPath,
      files: [
        {
          destination,
          format: "pointr/color-palette",
        },
      ],
    },
  };
}

function resolveDarkAlias(root, value, depth = 0) {
  const match = /^\{(.+)\}$/.exec(String(value).trim());
  if (!match || depth > 10) return value;
  const target = match[1]
    .split(".")
    .reduce(
      (node, key) => (node && node[key] !== undefined ? node[key] : undefined),
      root,
    );
  if (!target) return value;
  return resolveDarkAlias(root, target.value || target.$value, depth + 1);
}

// Helper to merge Dark tokens into Light tokens as 'darkValue'
function mergeDarkTokens(light, dark, darkRoot = dark) {
  for (const key in light) {
    if (dark && dark[key]) {
      if (
        light[key].hasOwnProperty("value") ||
        light[key].hasOwnProperty("$value")
      ) {
        // A dark value written as an alias ("{Primitives.Colors.background.200}")
        // must be resolved against the dark tree, or the alias string itself
        // reaches the generated Swift as a hex — which is what happened to the
        // first semantic colour alias, Semantics.Border, on 2026-09-03.
        const darkVal = resolveDarkAlias(
          darkRoot,
          dark[key].value || dark[key].$value,
        );
        if (darkVal) {
          if (!light[key].attributes) light[key].attributes = {};
          light[key].attributes.darkValue = darkVal;
        }
      } else if (typeof light[key] === "object") {
        // It's a group, recurse
        mergeDarkTokens(light[key], dark[key], darkRoot);
      }
    }
  }
  return light;
}

// Helper for camelCase
function toCamelCase(path) {
  let result = path
    .join(" ")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part, index) => {
      if (index === 0) return part.toLowerCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("");

  // Prevent invalid identifiers in Swift/Kotlin
  if (/^[0-9]/.test(result)) {
    result = "_" + result;
  }
  return result;
}

StyleDictionary.registerTransform({
  name: "name/kozmos/camel",
  type: "name",
  transform: (token) => toCamelCase(token.path || [token.name]),
});

// Fix for Android AAPT not allowing floats in <integer>
function fixAndroidXML(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    // Replace <integer> with float value to <item type="dimen" format="float">
    content = content.replace(
      /<integer name="([^"]+)">([-0-9]+\.[0-9]+)<\/integer>/g,
      '<item name="$1" type="dimen" format="float">$2</item>',
    );

    // Convert rem to dp (1rem = 16dp) and string to dimen
    content = content.replace(
      /<string name="([^"]+)">([-0-9.]+)rem<\/string>/g,
      (match, name, val) => {
        return `<dimen name="${name}">${parseFloat(val) * 16}dp</dimen>`;
      },
    );

    // Convert px string to dimen
    content = content.replace(
      /<string name="([^"]+)">([-0-9.]+)px<\/string>/g,
      '<dimen name="$1">$2px</dimen>',
    );

    // Ensure all names are valid for AAPT (no hyphens, no periods)
    content = content.replace(/name="([^"]+)"/g, (match, name) => {
      let sanitized = name.replace(/[-.\s]/g, "_");
      if (/^[0-9]/.test(sanitized)) sanitized = "_" + sanitized;
      return `name="${sanitized}"`;
    });

    fs.writeFileSync(filePath, content);
  }
}

// Custom Format for iOS Dynamic Colors
StyleDictionary.registerFormat({
  name: "ios-swift/dynamic",
  format: ({ dictionary }) => {
    return `import SwiftUI

#if canImport(UIKit)
import UIKit

// Extension to create Color from Hex safely natively
extension UIColor {
    convenience init(hex: String?) {
        guard let hex = hex else {
            self.init(white: 0, alpha: 0)
            return
        }
        let hexString = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hexString).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hexString.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        self.init(red: CGFloat(r) / 255, green: CGFloat(g) / 255, blue: CGFloat(b) / 255, alpha: CGFloat(a) / 255)
    }
}
#elseif canImport(AppKit)
import AppKit

extension NSColor {
    convenience init(hex: String?) {
        guard let hex = hex else {
            self.init(white: 0, alpha: 0)
            return
        }
        let hexString = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hexString).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hexString.count {
        case 3: 
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: 
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: 
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        self.init(red: CGFloat(r) / 255, green: CGFloat(g) / 255, blue: CGFloat(b) / 255, alpha: CGFloat(a) / 255)
    }
}
#endif

public class KozmosColors {
${dictionary.allTokens
  .filter((token) => {
    const isColor =
      (token.attributes && token.attributes.category === "color") ||
      token.type === "color" ||
      token.$type === "color" ||
      token.path[0] === "color" ||
      token.name.toLowerCase().includes("color");
    return isColor;
  })
  .map((token) => {
    // Try all possible value locations (StyleDictionary puts custom properties in token.original)
    const lightVal = firstDefinedTokenValue(token);
    const darkVal =
      (token.attributes && token.attributes.darkValue) || lightVal;

    const varName = toCamelCase(token.path);

    return `    public static var ${varName}: Color {
        #if canImport(UIKit)
        return Color(UIColor { traitCollection in
            return traitCollection.userInterfaceStyle == .dark ? UIColor(hex: "${darkVal}") : UIColor(hex: "${lightVal}")
        })
        #elseif canImport(AppKit)
        return Color(NSColor(name: nil, dynamicProvider: { appearance in
            return appearance.name == .darkAqua ? NSColor(hex: "${darkVal}") : NSColor(hex: "${lightVal}")
        }))
        #else
        return Color.clear
        #endif
    }`;
  })
  .join("\n")}
}`;
  },
});

// A token whose value is 0 is a real value, not a missing one. The old
// `token.value || token.$value || ...` chain treated it as absent and fell
// through to the unresolved alias string, so a zero-valued dimension that
// arrived by reference was dropped from the native outputs entirely.
// parseFloat("1rem") is 1, so a rem-valued dimension reached the native
// outputs as one point instead of sixteen: primitivesRadiusCard, Input and
// Button all emitted `1`. Nothing used them, which is the only reason it never
// showed up as a hairline corner on a card.
function toNumericPx(value) {
  if (typeof value === "string" && value.trim().endsWith("rem")) {
    const rem = Number.parseFloat(value);
    return Number.isNaN(rem) ? Number.NaN : rem * 16;
  }
  return Number.parseFloat(value);
}

function firstDefinedTokenValue(token) {
  const candidates = [
    token.value,
    token.$value,
    token.original && token.original.value,
    token.original && token.original.$value,
  ];
  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null) return candidate;
  }
  return undefined;
}

/**
 * A pill is a shape, not a length.
 *
 * `Semantics.Radius.Pill` is the sentinel 9999 — CSS idiom for "as round as this
 * box allows", and meaningless as a native dimension. Emitted as a number it is
 * a loaded gun: `semanticsRadiusPill: CGFloat = 9999` reads like a value and
 * gives 9999pt to anyone who applies it. Worse, it cannot be reasoned about —
 * a ring 4px outside a pill wants `9999 + 4`, which is the answer to nothing.
 *
 * Every component already does the right thing without it: SwiftUI `Capsule()`,
 * Compose `RoundedCornerShape(percent = 50)`. So the constant is skipped rather
 * than exported, and the generated file says so where it would have been.
 */
const PILL_SENTINEL = 9999;
// Keyed on the path as well as the value. Keying on the number alone also ate
// the screen breakpoints, which arrive here at 16x their real size — 768 comes
// out as 12288 — so they clear 9999 without being sentinels at all. That
// inflation is a separate, older bug and is deliberately left visible rather
// than hidden behind this filter.
const isPillSentinel = (token, value) =>
  Number(value) >= PILL_SENTINEL &&
  token.path.some((part) => String(part).toLowerCase().includes("radius"));

StyleDictionary.registerFormat({
  name: "android-compose/dimensions",
  format: ({ dictionary, options }) => {
    const className = options.className || "KozmosDimensions";
    return `// Do not edit directly, this file was auto-generated.
package com.kozmos.tokens

import androidx.compose.ui.unit.dp

object ${className} {
${dictionary.allTokens
  .filter((token) => {
    return (
      (token.attributes && token.attributes.category === "dimension") ||
      token.type === "dimension" ||
      token.$type === "dimension" ||
      token.path.includes("radius") ||
      token.path.includes("spacing") ||
      token.path.includes("dimension") ||
      token.path.includes("Layout") ||
      token.path.includes("Width")
    );
  })
  .map((token) => {
    const lightVal = firstDefinedTokenValue(token);
    const varName = toCamelCase(token.path);

    let val = toNumericPx(lightVal);
    if (isNaN(val)) return "";
    if (isPillSentinel(token, val)) {
      return (
        "  // " +
        varName +
        " is not emitted: a pill is a shape, not a length." +
        " Use RoundedCornerShape(percent = 50)."
      );
    }

    return "  val " + varName + " = " + val + ".dp";
  })
  .filter(Boolean)
  .join("\n")}
}`;
  },
});

StyleDictionary.registerFormat({
  name: "ios-swift/dimensions",
  format: ({ dictionary, options }) => {
    const className = options.className || "KozmosDimensions";
    return `import Foundation
import CoreGraphics

public struct ${className} {
${dictionary.allTokens
  .filter((token) => {
    return (
      (token.attributes && token.attributes.category === "dimension") ||
      token.type === "dimension" ||
      token.$type === "dimension" ||
      token.path.includes("radius") ||
      token.path.includes("spacing") ||
      token.path.includes("dimension") ||
      token.path.includes("Layout") ||
      token.path.includes("Width")
    );
  })
  .map((token) => {
    const lightVal = firstDefinedTokenValue(token);
    const varName = toCamelCase(token.path);

    let val = toNumericPx(lightVal);
    if (isNaN(val)) return "";
    if (isPillSentinel(token, val)) {
      return (
        "    // " +
        varName +
        " is not emitted: a pill is a shape, not a" +
        " length. Use Capsule()."
      );
    }

    return "    public static let " + varName + ": CGFloat = " + val;
  })
  .filter(Boolean)
  .join("\n")}
}`;
  },
});

StyleDictionary.registerFormat({
  name: "android-compose/exact",
  format: ({ dictionary, options }) => {
    const className = options.className || "KozmosColors";
    return `// Do not edit directly, this file was auto-generated.
package com.kozmos.tokens

import androidx.compose.ui.graphics.Color

object ${className} {
${dictionary.allTokens
  .filter((token) => {
    return (
      (token.attributes && token.attributes.category === "color") ||
      token.type === "color" ||
      token.$type === "color" ||
      token.path[0] === "color" ||
      (token.name && token.name.toLowerCase().includes("color")) ||
      token.path.includes("Colors") ||
      token.path.includes("colors")
    );
  })
  .map((token) => {
    const lightVal = firstDefinedTokenValue(token);
    const varName = toCamelCase(token.path);

    // Extract pre-compiled Tokens Studio compose payloads explicitly ignoring double wraps natively
    const composeMatch = String(lightVal).match(/Color\(0x([0-9a-fA-F]{8})\)/i);
    if (composeMatch) {
      return `  val ${varName} = Color(0x${composeMatch[1]})`;
    }

    let val = String(lightVal || "#000000");
    const rgbaMatch = val.match(
      /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/,
    );
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1], 10).toString(16).padStart(2, "0");
      const g = parseInt(rgbaMatch[2], 10).toString(16).padStart(2, "0");
      const b = parseInt(rgbaMatch[3], 10).toString(16).padStart(2, "0");
      const a = rgbaMatch[4]
        ? Math.round(parseFloat(rgbaMatch[4]) * 255)
            .toString(16)
            .padStart(2, "0")
        : "ff";
      val = `#${r}${g}${b}${a}`;
    }

    // Format CSS Hex to Kotlin 0xAARRGGBB
    let hex = val.replace("#", "").toLowerCase();
    if (hex.length === 6) hex = "ff" + hex;
    if (hex.length === 3)
      hex =
        "ff" +
        hex
          .split("")
          .map((c) => c + c)
          .join("");
    if (hex.length === 8) {
      // CSS is #RRGGBBAA. Android is #AARRGGBB.
      const r = hex.substr(0, 2);
      const g = hex.substr(2, 2);
      const b = hex.substr(4, 2);
      const a = hex.substr(6, 2);
      hex = a + r + g + b;
    }

    return `  val ${varName} = Color(0x${hex})`;
  })
  .join("\n")}
}`;
  },
});

StyleDictionary.registerFormat({
  name: "android-compose/shadows",
  format: ({ dictionary, options }) => {
    const className = options.className || "KozmosShadows";
    return `// Do not edit directly, this file was auto-generated.
package com.kozmos.tokens

import androidx.compose.ui.unit.dp

object ${className} {
${dictionary.allTokens
  .filter(
    (token) =>
      token.type === "shadow" ||
      token.$type === "shadow" ||
      (token.attributes && token.attributes.category === "shadow"),
  )
  .map((token) => {
    const lightVal = token.value || token.$value;
    const varName = toCamelCase(token.path);

    const parts = lightVal.split("px");
    if (parts.length > 2) {
      let val = parseFloat(parts[1].trim());
      if (isNaN(val)) val = 4;
      return "  val " + varName + " = " + val + ".dp";
    }
    return "";
  })
  .filter(Boolean)
  .join("\n")}
}`;
  },
});

StyleDictionary.registerFormat({
  name: "ios-swift/shadows",
  format: ({ dictionary, options }) => {
    const className = options.className || "KozmosShadows";
    return `import Foundation
import CoreGraphics
import SwiftUI

public struct ShadowToken {
    public let color: Color
    public let radius: CGFloat
    public let x: CGFloat
    public let y: CGFloat
}

public struct ${className} {
${dictionary.allTokens
  .filter(
    (token) =>
      token.type === "shadow" ||
      token.$type === "shadow" ||
      (token.attributes && token.attributes.category === "shadow"),
  )
  .map((token) => {
    const lightVal = token.value || token.$value;
    const varName = toCamelCase(token.path);

    const rgbaMatch = lightVal.match(
      /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/,
    );
    let r = 0,
      g = 0,
      b = 0,
      a = 0.1;
    if (rgbaMatch) {
      r = parseInt(rgbaMatch[1], 10) / 255;
      g = parseInt(rgbaMatch[2], 10) / 255;
      b = parseInt(rgbaMatch[3], 10) / 255;
      a = parseFloat(rgbaMatch[4] || "1");
    }

    const dimMatch = lightVal.match(/([\d.-]+)(px)?/g);
    let x = 0,
      y = 4,
      blur = 8;
    if (dimMatch && dimMatch.length >= 3) {
      x = parseFloat(dimMatch[0]);
      y = parseFloat(dimMatch[1]);
      blur = parseFloat(dimMatch[2]);
    }

    return (
      "    public static let " +
      varName +
      " = ShadowToken(color: Color(red: " +
      r +
      ", green: " +
      g +
      ", blue: " +
      b +
      ", opacity: " +
      a +
      "), radius: " +
      blur +
      ", x: " +
      x +
      ", y: " +
      y +
      ")"
    );
  })
  .filter(Boolean)
  .join("\n")}
}`;
  },
});

StyleDictionary.registerFormat({
  name: "pointr/color-palette",
  format: ({ dictionary, file }) => {
    const colors = {};
    dictionary.allTokens.forEach((token) => {
      const isColor =
        (token.attributes && token.attributes.category === "color") ||
        token.type === "color" ||
        token.$type === "color" ||
        token.path[0] === "color" ||
        token.name.toLowerCase().includes("color");
      if (isColor) {
        // Pointr MapLibre style JSON expects snake_case for Python $var regex compatibility
        const name = token.name.replace(/-/g, "_");
        let val =
          token.value ||
          token.$value ||
          (token.original && token.original.value) ||
          (token.original && token.original.$value);

        colors[name] = val;
      }
    });

    const isDark = file.destination.includes("dark");
    const payload = {
      name: `Kozmos Design System (${isDark ? "Dark" : "Light"})`,
      description: "Automatically synced from Kozmos Design System Tokens",
      created_at: new Date().toISOString(),
      colors: colors,
      updated_at: new Date().toISOString(),
    };

    return JSON.stringify(payload, null, 2);
  },
});

async function build() {
  try {
    // 1. Light Mode (CSS)
    console.log("\n☀️  Building Light Mode...");
    const sdLight = new StyleDictionary({
      log: { verbosity: "verbose" },
      source: ["src/tokens-light.json"],
      platforms: {
        css: {
          transformGroup: "css",
          buildPath: "dist/css/",
          files: [
            {
              destination: "variables-light.css",
              format: "css/variables",
              options: { selector: ":root" },
            },
          ],
        },
        ...optionalPointrPlatform("kozmos-light.json"),
      },
    });
    await sdLight.buildAllPlatforms();

    // 2. Dark Mode (CSS)
    console.log("\n🌙  Building Dark Mode...");
    const sdDark = new StyleDictionary({
      source: ["src/tokens-dark.json"],
      platforms: {
        css: {
          transformGroup: "css",
          buildPath: "dist/css/",
          files: [
            {
              destination: "variables-dark.css",
              format: "css/variables",
              options: { selector: "[data-theme='dark']" },
            },
          ],
        },
        ...optionalPointrPlatform("kozmos-dark.json"),
      },
    });
    await sdDark.buildAllPlatforms();

    // 3. JS
    console.log("\n📦  Building JS/TS...");
    const sdJS = new StyleDictionary({
      source: ["src/tokens-light.json"],
      platforms: {
        js: {
          transformGroup: "js",
          buildPath: "dist/js/",
          files: [
            { destination: "tokens.js", format: "javascript/module-flat" },
            { destination: "tokens.mjs", format: "javascript/es6" },
            {
              destination: "tokens.d.ts",
              format: "typescript/es6-declarations",
            },
          ],
        },
      },
    });
    await sdJS.buildAllPlatforms();

    // 4. Android
    console.log("\n🤖 Building Android (XML Resources)...");
    const sdAndroidLight = new StyleDictionary({
      source: ["src/tokens-light.json"],
      platforms: {
        android: {
          transformGroup: "android",
          buildPath: "dist/android/src/main/res/values/",
          files: [
            {
              destination: "colors.xml",
              format: "android/resources",
              options: { outputReferences: true },
            },
          ],
        },
      },
    });
    await sdAndroidLight.buildAllPlatforms();
    fixAndroidXML("dist/android/src/main/res/values/colors.xml");

    const sdAndroidDark = new StyleDictionary({
      source: ["src/tokens-dark.json"],
      platforms: {
        android: {
          transformGroup: "android",
          buildPath: "dist/android/src/main/res/values-night/",
          files: [
            {
              destination: "colors.xml",
              format: "android/resources",
              options: { outputReferences: true },
            },
          ],
        },
      },
    });
    await sdAndroidDark.buildAllPlatforms();
    fixAndroidXML("dist/android/src/main/res/values-night/colors.xml");

    StyleDictionary.registerFilter({
      name: "isColor",
      filter: function (token) {
        return token.$type === "color" || token.type === "color";
      },
    });

    StyleDictionary.registerFilter({
      name: "isSemanticOrComponentColor",
      filter: function (token) {
        const isColor = token.$type === "color" || token.type === "color";
        return (
          isColor &&
          (token.path.includes("Semantics") ||
            token.path.includes("semantics") ||
            token.path.includes("Components") ||
            token.path.includes("components"))
        );
      },
    });

    const sdAndroidCompose = new StyleDictionary({
      source: ["src/tokens-light.json"],
      platforms: {
        androidCompose: {
          transformGroup: "compose",
          buildPath: "dist/android/src/main/java/com/kozmos/tokens/",
          files: [
            {
              destination: "KozmosColors.kt",
              format: "android-compose/exact",
              filter: "isColor",
              options: { className: "KozmosColors" },
            },
            {
              destination: "KozmosDesignTokens.kt",
              format: "android-compose/exact",
              filter: "isSemanticOrComponentColor",
              options: { className: "KozmosDesignTokens" },
            },
          ],
        },
      },
    });
    await sdAndroidCompose.buildAllPlatforms();

    const sdAndroidComposeDimensions = new StyleDictionary({
      source: ["src/tokens-light.json"],
      platforms: {
        androidCompose: {
          transformGroup: "compose",
          buildPath: "dist/android/src/main/java/com/kozmos/tokens/",
          files: [
            {
              destination: "KozmosDimensions.kt",
              format: "android-compose/dimensions",
              options: { className: "KozmosDimensions" },
            },
            {
              destination: "KozmosShadows.kt",
              format: "android-compose/shadows",
              options: { className: "KozmosShadows" },
            },
          ],
        },
      },
    });
    await sdAndroidComposeDimensions.buildAllPlatforms();

    const sdAndroidComposeDark = new StyleDictionary({
      source: ["src/tokens-dark.json"],
      platforms: {
        androidCompose: {
          transformGroup: "compose",
          buildPath: "dist/android/src/main/java/com/kozmos/tokens/",
          files: [
            {
              destination: "KozmosColorsDark.kt",
              format: "android-compose/exact",
              filter: "isColor",
              options: { className: "KozmosColorsDark" },
            },
          ],
        },
      },
    });
    await sdAndroidComposeDark.buildAllPlatforms();

    // 5. iOS (Swift Dynamic)
    console.log("\n🍎 Building iOS (Dynamic Swift)...");

    // Load and Merge Tokens
    const lightTokens = JSON.parse(
      fs.readFileSync("src/tokens-light.json", "utf8"),
    );
    const darkTokens = JSON.parse(
      fs.readFileSync("src/tokens-dark.json", "utf8"),
    );

    // Mutate lightTokens
    const mergedTokens = mergeDarkTokens(lightTokens, darkTokens);
    fs.writeFileSync(
      "src/tokens-merged-temp.json",
      JSON.stringify(mergedTokens, null, 2),
    );

    const sdIOS = new StyleDictionary({
      log: { verbosity: "verbose" },
      source: ["src/tokens-merged-temp.json"],
      platforms: {
        ios: {
          transforms: ["attribute/cti", "name/kozmos/camel"],
          buildPath: "dist/ios/",
          files: [
            {
              destination: "KozmosColors.swift",
              format: "ios-swift/dynamic",
              options: {
                className: "KozmosColors",
              },
            },
            {
              destination: "KozmosDimensions.swift",
              format: "ios-swift/dimensions",
              options: {
                className: "KozmosDimensions",
              },
            },
            {
              destination: "KozmosShadows.swift",
              format: "ios-swift/shadows",
              options: {
                className: "KozmosShadows",
              },
            },
          ],
        },
      },
    });
    await sdIOS.buildAllPlatforms();

    if (fs.existsSync("src/tokens-merged-temp.json"))
      fs.unlinkSync("src/tokens-merged-temp.json");

    console.log("\n✅ Build Complete.");
  } catch (error) {
    console.error("❌ Build Failed:", error);
    if (fs.existsSync("src/tokens-merged-temp.json"))
      fs.unlinkSync("src/tokens-merged-temp.json");
    process.exit(1);
  }
}

build();
