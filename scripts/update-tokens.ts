import fs from 'fs';
import path from 'path';

const TOKENS_PATH = path.join(process.cwd(), 'packages/tokens/src/tokens-light.json');
const TARGET_PATH = path.join(process.cwd(), 'packages/tokens/src/tokens-light.json'); // Overwrite
const LEGACY_PATH = path.join(process.cwd(), 'packages/tokens/src/tokens.json'); // Sync

// Helper to create a standard token object
const makeToken = (value: string | number, type: string = 'other') => ({
    $value: value,
    $type: type,
    $extensions: { "com.figma.scopes": ["ALL_SCOPES"] }
});

const makeColor = (value: string) => makeToken(value, 'color');
const makeDimension = (value: string) => makeToken(value, 'dimension');
const makeNumber = (value: number) => makeToken(value, 'number');
// FTS Specific Types
const makeBorderRadius = (value: string) => makeToken(value, 'borderRadius');
const makeBorderWidth = (value: string) => makeToken(value, 'borderWidth');
const makeOpacity = (value: number) => makeToken(value, 'opacity');
const makeSpacing = (value: string) => makeToken(value, 'spacing');
const makeBoxShadow = (value: string | any) => makeToken(value, 'boxShadow'); // Shadows can be complex objects

function updateTokens(filePath: string, isLight: boolean) {
    const rawData = fs.readFileSync(filePath, 'utf8');
    let tokens = JSON.parse(rawData);

    // REFACTOR: Change 'const tokens' to 'let tokens' at line 21.

    // --- 0. RAW DATA INGESTION (Fix for Dark Mode) ---
    // We need to verify if we have better source data in `src/raw`
    const rawDir = path.join(process.cwd(), 'packages/tokens/src/raw');

    // Determine raw filenames based on mode
    const suffix = isLight ? '' : ' (dark)';
    const rawComponentsPath = path.join(rawDir, `Components${suffix}.tokens.json`);
    const rawPrimitivesPath = path.join(rawDir, `Primitives${suffix}.tokens.json`);
    const rawSemanticsPath = path.join(rawDir, `Semantics${suffix}.tokens.json`);

    // Helper to merge raw data if file exists
    const mergeRaw = (targetObj: any, filePath: string, targetKey?: string) => {
        if (fs.existsSync(filePath)) {
            console.log(`[${isLight ? 'Light' : 'Dark'}] Merging raw data from ${path.basename(filePath)}`);
            try {
                const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                // If the target object is nested (has the key), merge deeply into that key
                if (targetKey && targetObj[targetKey]) {
                    console.log(`   -> Merging into ${targetKey}`);
                    Object.assign(targetObj[targetKey], raw);
                } else {
                    // Fallback to root (or if structure is already flat)
                    Object.assign(targetObj, raw);
                }
            } catch (e) {
                console.error(`Error reading ${filePath}`, e);
            }
        }
    };

    // If we are in recursive update loop (idempotency), 'tokens' is already flat.
    // But if we are running fresh, 'tokens' might be the recovered file.
    // We should prioritize RAW data for Components strings.

    // Let's attach raw data to 'tokens' before processing.
    // Note: 'tokens' variable holds the base.

    // Ingest Components
    // We'll process them later in step 3, but let's ensure they exist in 'tokens'
    mergeRaw(tokens, rawComponentsPath, 'Components');

    // Ingest Primitives (if any specific overrides exist in raw)
    mergeRaw(tokens, rawPrimitivesPath, 'Primitives');

    // Ingest Semantics
    mergeRaw(tokens, rawSemanticsPath, 'Semantics');

    // --- 0.2 FIX STRUCTURAL MISMATCH FOR PRIMARY BUTTONS ---
    // Raw files often have 'neutral', 'success', 'danger', etc. as siblings of 'Primary Buttons',
    // whereas the system expects them nested inside 'Primary Buttons'.
    const orphanedVariants = ['neutral', 'success', 'danger', 'alert', 'informative'];

    // Locate Primary Buttons container
    let primaryButtonsContainer = tokens;
    if (tokens.Components && tokens.Components['Primary Buttons']) {
        primaryButtonsContainer = tokens.Components;
    }

    const primaryButtons = primaryButtonsContainer['Primary Buttons'];

    if (primaryButtons) {
        orphanedVariants.forEach(variant => {
            // Orphans might be at root or in Components, depending on where mergeRaw put them.
            // Since we upgraded mergeRaw to put them in [targetKey], they are likely in primaryButtonsContainer.
            if (primaryButtonsContainer[variant]) {
                console.log(`[Fix] Moving orphaned '${variant}' into 'Primary Buttons'`);
                if (!primaryButtons[variant]) {
                    primaryButtons[variant] = {};
                }
                // Merge the orphaned variant into the nested one
                Object.assign(primaryButtons[variant], primaryButtonsContainer[variant]);

                // Cleanup: Remove the orphan to avoid duplication or processing issues
                delete primaryButtonsContainer[variant];
            }
        });
    }

    // --- 0.5 IDEMPOTENCY CHECK ---
    // If the file is already structured with Primitives/Semantics/Components, flatten it first.
    if (tokens.Primitives || tokens.Semantics || tokens.Components) {
        console.log(`[${path.basename(filePath)}] Detected nested structure. Flattening for update...`);
        const flat = {};
        const groups = [tokens.Primitives, tokens.Semantics, tokens.Components];
        groups.forEach(group => {
            if (group) {
                Object.assign(flat, group);
            }
        });
        // Assign back to tokens
        tokens = flat;
    }

    // REFACTOR: Change 'const tokens' to 'let tokens' at line 21.


    // --- 1. Renaming Radius ---
    // If it exists (or we just created it), populate/overwrite it
    const r = tokens.Radius || {};
    tokens.Radius = {
        "none": r["0"] || makeBorderRadius("0rem"),
        "sm": r["50"] || makeBorderRadius("0.25rem"),
        "base": r["100"] || makeBorderRadius("0.5rem"), // Renamed md -> base
        "md": r["200"] || makeBorderRadius("1rem"),
        "lg": makeBorderRadius("1rem"),       // 16px (Fixing logic from spec)
        "xl": makeBorderRadius("1.5rem"),     // 24px
        "2xl": makeBorderRadius("2rem"),      // 32px
        "full": makeBorderRadius("9999px")
    };

    // --- 2. Fix Motion ---
    if (tokens.Motion && tokens.Motion["Duration Scale"]) {
        tokens.Motion["Scale"] = tokens.Motion["Duration Scale"];
        delete tokens.Motion["Duration Scale"];
    }

    // --- 3. Add Missing Categories (Primitives) ---

    // Border Width
    tokens["Border Width"] = {
        "none": makeBorderWidth("0px"),
        "sm": makeBorderWidth("1px"),
        "md": makeBorderWidth("2px"),
        "lg": makeBorderWidth("4px")
    };

    // Opacity
    tokens["Opacity"] = {
        "0": makeOpacity(0),
        "5": makeOpacity(0.05),
        "10": makeOpacity(0.1),
        "25": makeOpacity(0.25),
        "50": makeOpacity(0.5),
        "75": makeOpacity(0.75),
        "100": makeOpacity(1)
    };

    // Z-Index (Layer)
    tokens["Layer"] = {
        "auto": makeToken("auto", "other"), // Layer doesn't have a strict FTS type, keep 'other' or 'number'
        "0": makeNumber(0),
        "10": makeNumber(10),
        "20": makeNumber(20),
        "30": makeNumber(30),
        "40": makeNumber(40),
        "50": makeNumber(50)
    };

    // Layout Grid
    tokens["Grid"] = {
        "cols": makeNumber(12),
        "gutter": makeSpacing("24px"),
        "margin": makeSpacing("32px")
    };

    // Breakpoints
    tokens["Screen"] = {
        "mobile": makeDimension("375px"), // Dimension is fine for breakpoints
        "tablet": makeDimension("768px"),
        "laptop": makeDimension("1024px"),
        "desktop": makeDimension("1440px")
    };

    // Aspect Ratio
    tokens["Aspect"] = {
        "square": makeToken("1/1"),
        "video": makeToken("16/9"),
        "portrait": makeToken("3/4")
    };

    // Touch Targets
    tokens["Touch"] = {
        "min": makeSpacing("44px"),
        "comfortable": makeSpacing("48px")
    };

    // Animation Ease
    tokens["Ease"] = {
        "linear": makeToken("0, 0, 1, 1", "cubicBezier"), // FTS supports cubicBezier
        "in": makeToken("0.4, 0, 1, 1", "cubicBezier"),
        "out": makeToken("0, 0, 0.2, 1", "cubicBezier"),
        "in-out": makeToken("0.4, 0, 0.2, 1", "cubicBezier"),
        "elastic": makeToken("0.175, 0.885, 0.32, 1.275", "cubicBezier")
    };

    // Data Visualization
    tokens["Data"] = {
        "Blue": makeColor("#2563EB"),
        "Purple": makeColor("#9333EA"),
        "Teal": makeColor("#0D9488"),
        "Orange": makeColor("#EA580C"),
        "Red": makeColor("#DC2626"),
        "Yellow": makeColor("#D97706")
    };

    // --- 4. Architectural Aliasing (Semantics) ---

    // Surface
    if (isLight) {
        tokens["Surface"] = {
            "0": makeColor("#FFFFFF"),
            "100": makeColor("#F8F9FA"),
            "200": makeColor("#E9ECEF"),
            "300": makeColor("#DEE2E6")
        };
    } else {
        // Dark Mode Surface (approx based on background palette)
        tokens["Surface"] = {
            "0": makeColor("#000000"),     // black
            "100": makeColor("#17191C"),   // background-100
            "200": makeColor("#2E3138"),   // background-200
            "300": makeColor("#464A53")    // background-300
        };

        // [Fix] Override Primitives.Colors.background to ensure Dark Mode has dark backgrounds
        // (If raw files fail to provide overrides)
        let colors = tokens.Colors;
        // Fallback if structure is nested
        if (!colors && tokens.Primitives && tokens.Primitives.Colors) {
            colors = tokens.Primitives.Colors;
        }

        if (colors && colors.background) {
            colors.background["0"] = makeColor("#000000");
            colors.background["100"] = makeColor("#17191C");
            colors.background["200"] = makeColor("#2E3138");
            colors.background["300"] = makeColor("#464A53");
        }
    }

    // Semantic Radius (Using aliases)
    tokens["Radius"]["Card"] = {
        "$value": "{Radius.lg}",
        "$type": "dimension"
    };
    tokens["Radius"]["Input"] = {
        "$value": "{Radius.md}",
        "$type": "dimension"
    };
    tokens["Radius"]["Button"] = {
        "$value": "{Radius.md}",
        "$type": "dimension"
    };

    // Icon Stroke
    tokens["Icon"] = {
        "Stroke": {
            "sm": makeDimension("1.5px"),
            "md": makeDimension("2px"),
            "lg": makeDimension("2.5px")
        }
    };

    // Motion Micro-Interactions
    if (!tokens.Motion) tokens.Motion = {};
    tokens.Motion["Slide"] = {
        "sm": makeDimension("4px"),
        "md": makeDimension("8px")
    };
    tokens.Motion["Enter"] = makeToken("0.95"); // Scale start
    tokens.Motion["Exit"] = makeToken("0.95");  // Scale end

    // Safe Area
    tokens["Inset"] = {
        "Safe": {
            "Top": makeDimension("0px"),
            "Bottom": makeDimension("0px")
        }
    };

    // Scrim
    tokens["Overlay"] = {
        "Scrim": makeColor("rgba(0, 0, 0, 0.5)"),
        "Dim": makeColor("rgba(0, 0, 0, 0.2)")
    };

    // --- RESTUCTURING INTO COLLECTIONS ---

    // Define Containers
    const Primitives: any = {};
    const Semantics: any = {};
    const Components: any = {};

    // 1. Move generated/updated tokens into containers
    Primitives["Radius"] = tokens.Radius; // From step 1

    // Primitives
    Primitives["Border Width"] = tokens["Border Width"];
    Primitives["Opacity"] = tokens["Opacity"];
    Primitives["Layer"] = tokens["Layer"];
    Primitives["Grid"] = tokens["Grid"];
    Primitives["Screen"] = tokens["Screen"];
    Primitives["Aspect"] = tokens["Aspect"];
    Primitives["Touch"] = tokens["Touch"];
    Primitives["Ease"] = tokens["Ease"];
    Primitives["Icon"] = tokens["Icon"];
    Primitives["Inset"] = tokens["Inset"];
    Primitives["Shadow"] = tokens.Shadow || tokens.Effect?.Shadow; // Handle shadow move

    // Colors - Move existing Colors to Primitives
    // Note: Colors object in tokens-light.json is huge, we move the whole thing.
    if (tokens.Colors) Primitives["Colors"] = tokens.Colors;
    if (tokens["Design Dictionary"]) Primitives["Design Dictionary"] = tokens["Design Dictionary"];
    if (tokens["Border"]) Primitives["Border"] = tokens["Border"]; // Existing key
    if (tokens["Typography"]) Primitives["Typography"] = tokens["Typography"];
    if (tokens["Layout"]) Primitives["Layout"] = tokens["Layout"];

    // Semantics
    Semantics["Surface"] = tokens["Surface"];
    Semantics["Data"] = tokens["Data"];
    Semantics["Overlay"] = tokens["Overlay"];
    Semantics["Motion"] = tokens["Motion"];

    // Effects (Glass, etc) - Shadow was moved to Primitives.Shadow
    if (tokens["Effect"]) {
        // If we want to keep non-Shadow effects:
        // We already assigned tokens.Shadow = tokens.Effect.Shadow
        // So we can delete Shadow from Effect and move the rest.
        // Copy to avoid mutation issues if we reference it later (though we are building new obj)
        const effects = { ...tokens["Effect"] };
        delete effects.Shadow;
        if (Object.keys(effects).length > 0) {
            Semantics["Effect"] = effects;
        }
    }

    // Preserve "Semantic Tokens" legacy existing group
    if (tokens["Semantic Tokens"]) {
        Semantics["Semantic Tokens"] = tokens["Semantic Tokens"];
    }

    // Components
    // Move all button categories and HTML elements
    const componentKeys = [
        "Primary Buttons",
        "Secondary Buttons",
        "Tertiary Buttons",
        "HTML elements"
    ];

    componentKeys.forEach(key => {
        if (tokens[key]) {
            Components[key] = tokens[key];
        }
    });

    // Helper to simplify Figma API value objects { r, g, b, alpha, hex } -> "#HEX" or "#HEXAA"
    function simplifyTokenValues(obj: any) {
        if (!obj || typeof obj !== 'object') return;

        if (obj.$value && typeof obj.$value === 'object' && obj.$value.hex) {
            let hex = obj.$value.hex;
            const alpha = obj.$value.alpha;

            // Handle Alpha if present and < 1
            if (typeof alpha === 'number' && alpha < 0.999) {
                // Convert alpha (0-1) to 2-digit hex
                const alphaHex = Math.round(alpha * 255).toString(16).toUpperCase().padStart(2, '0');
                hex += alphaHex;
            }

            obj.$value = hex;
        }

        for (const k in obj) {
            if (k !== '$value' && typeof obj[k] === 'object') {
                simplifyTokenValues(obj[k]);
            }
        }
    }

    // Helper to flatten specific deep Figma structures
    function flattenComponentStructure(obj: any) {
        if (!obj || typeof obj !== 'object') return;

        // 1. Flatten "symbol" -> "or" -> "text" => "content"
        if (obj.symbol && obj.symbol.or && obj.symbol.or.text) {
            // Move all children of 'text' to 'content'
            obj.content = obj.symbol.or.text;
            delete obj.symbol; // Remove the old path
        }

        // 2. Flatten States
        // "on" -> "hover" => "hover"
        // "on" -> "mouse" -> "down" => "pressed"
        if (obj.on) {
            if (obj.on.hover) {
                obj.hover = obj.on.hover;
            }
            if (obj.on.mouse && obj.on.mouse.down) {
                obj.pressed = obj.on.mouse.down;
            }
            delete obj.on; // Remove key container
        }

        // "in" -> "focus" -> "selected" => "focus"
        if (obj.in && obj.in.focus && obj.in.focus.selected) {
            obj.focus = obj.in.focus.selected;
            delete obj.in;
        }

        // Recurse
        for (const k in obj) {
            if (typeof obj[k] === 'object') {
                flattenComponentStructure(obj[k]);
            }
        }
    }

    // Helper to flatten "base" keys: { "500": { "base": { $value: ... } } } -> { "500": { $value: ... } }
    function flattenBaseKeys(obj: any) {
        if (!obj || typeof obj !== 'object') return;

        // If this object has a 'base' property which is itself a token (has $value)
        if (obj.base && typeof obj.base === 'object' && obj.base.$value !== undefined) {
            // Check if there are other "child" keys (siblings to base)
            // We ignore $-prefixed keys ($type, $value, $extensions) when counting children
            const siblingKeys = Object.keys(obj).filter(k => k !== 'base' && !k.startsWith('$'));

            if (siblingKeys.length > 0) {
                // HYBRID CASE: The object has `base` AND other children (e.g. `Radius` has `base` and `sm`).
                // Flattening `base` to the parent would make the parent a Token ($value) and a Group (children).
                // Style Dictionary often fails to resolve aliases to children in this "Composite" state.
                // SOLUTION: Rename `base` to `DEFAULT` (or keep it as a sibling token) instead of hoisting.
                // Since user wants to remove "(base)", `DEFAULT` is a safe standard convention.
                obj.DEFAULT = obj.base;
                delete obj.base;
            } else {
                // CLEAN CASE: `base` is the only child. Safe to hoist.
                // Copy all properties from base to parent
                Object.assign(obj, obj.base);
                delete obj.base;
            }
        }

        // Recurse
        for (const k in obj) {
            if (typeof obj[k] === 'object') {
                flattenBaseKeys(obj[k]);
            }
        }
    }

    // Helper to flatten Typography structures
    function flattenTypographyStructure(obj: any) {
        if (!obj || typeof obj !== 'object') return;

        // 1. Flatten Font Family: "font" -> "family" -> [name] -> "font" -> "family" => [name] contains the value
        if (obj.font && obj.font.family) {
            for (const name in obj.font.family) {
                const group = obj.font.family[name];
                if (group.font && group.font.family) {
                    // Hoist the leaf token to replace the group's content
                    obj.font.family[name] = group.font.family;
                }
            }
        }

        // 2. Flatten Font Weight: "font" -> "weight" -> [scale] -> "font" -> [weights] => [scale] -> [weights]
        // Note: The structure in the file is "weight" (top level under Typography) -> "main" -> "font" -> ...
        // Using a recursive search for this specific pattern might be safer if the path varies,
        // but based on "Primitives.tokens.json", it's Typography -> font -> weight OR Typography -> weight?
        // Let's verify the path. The file showed: Typography -> font -> family. AND Typography -> font -> weight?
        // Wait, line 2506 showed "weight" inside "font". So it IS "font.weight".
        if (obj.font && obj.font.weight) {
            for (const scale in obj.font.weight) {
                const group = obj.font.weight[scale];
                if (group.font) {
                    // Hoist all children of 'font' (regular, bold, etc) to 'group'
                    Object.assign(group, group.font);
                    delete group.font;
                }
            }
        }

        // Recurse
        for (const k in obj) {
            if (typeof obj[k] === 'object') {
                flattenTypographyStructure(obj[k]);
            }
        }
    }

    // Helper to flatten Concept structures (Design Dictionary)
    function flattenConceptsStructure(obj: any) {
        if (!obj || typeof obj !== 'object') return;

        // 1. Flatten "states" -> "in" -> "focus" => "states" -> "focus"
        if (obj.states && obj.states.in && obj.states.in.focus) {
            obj.states.focus = obj.states.in.focus;
            delete obj.states.in;
        }

        // 2. Flatten "sizes" -> "x" -> "large"/"small" => "sizes" -> "xlarge"/"xsmall"
        if (obj.sizes && obj.sizes.x) {
            if (obj.sizes.x.large) {
                obj.sizes.xlarge = obj.sizes.x.large;
            }
            if (obj.sizes.x.small) {
                obj.sizes.xsmall = obj.sizes.x.small;
            }
            delete obj.sizes.x;
        }

        // Recurse
        for (const k in obj) {
            if (typeof obj[k] === 'object') {
                flattenConceptsStructure(obj[k]);
            }
        }
    }

    // Simplify values before processing
    // console.log("[DEBUG] Running simplifyTokenValues...");
    simplifyTokenValues(tokens);
    flattenComponentStructure(tokens);
    flattenBaseKeys(tokens);
    flattenTypographyStructure(tokens);
    flattenConceptsStructure(tokens);
    // console.log("[DEBUG] simplifyTokenValues and Flattening complete.");

    // 4. FIX ALIASES & TYPES
    // Since we moved Colors -> Primitives.Colors, {Colors.theme.0} is broken.
    // We need to traverse and update.

    function fixAliases(obj: any) {
        if (!obj) return;
        if (typeof obj === 'string') return;

        for (const k in obj) {
            const v = obj[k];
            if (typeof v === 'string') {
                if (v.includes('{')) {
                    obj[k] = updateAliasString(v);
                }
            } else if (typeof v === 'object') {
                fixAliases(v);
            }
        }
    }

    function updateAliasString(str: string): string {
        const mappings: Record<string, string> = {
            "Colors": "Primitives.Colors",
            "Radius": "Primitives.Radius",
            "Border Width": "Primitives.Border Width",
            "Opacity": "Primitives.Opacity",
            "Layer": "Primitives.Layer",
            "Grid": "Primitives.Grid",
            "Screen": "Primitives.Screen",
            "Aspect": "Primitives.Aspect",
            "Touch": "Primitives.Touch",
            "Ease": "Primitives.Ease",
            "Icon": "Primitives.Icon",
            "Inset": "Primitives.Inset",
            "Shadow": "Primitives.Shadow",
            "Design Dictionary": "Primitives.Design Dictionary",
            "Border": "Primitives.Border",
            "Typography": "Primitives.Typography", // Add Typography mapping

            "Surface": "Semantics.Surface",
            "Data": "Semantics.Data",
            "Overlay": "Semantics.Overlay",
            "Motion": "Semantics.Motion",
            "Semantic Tokens": "Semantics.Semantic Tokens"
        };

        let newStr = str;
        for (const key of Object.keys(mappings)) {
            const search = `{${key}.`;
            const replace = `{${mappings[key]}.`;
            newStr = newStr.split(search).join(replace);

            if (newStr === `{${key}}`) {
                newStr = `{${mappings[key]}}`;
            }
        }
        return newStr;
    }

    // Fix Typography Types Recursive Function
    function fixTypographyTypes(obj: any, parentKey: string = '') {
        if (!obj || typeof obj !== 'object') return;

        // Check current key context
        if (obj.$value) {
            // It's a token, check parent/grandparent context
            if (parentKey === 'size' || parentKey === 'fontSize') {
                obj.$type = 'fontSizes';
            } else if (parentKey === 'family' || parentKey === 'fontFamily') {
                obj.$type = 'fontFamilies';
            } else if (parentKey === 'weight' || parentKey === 'fontWeight') {
                obj.$type = 'fontWeights';
            } else if (parentKey === 'height' || parentKey === 'lineHeight') {
                // usually inside 'line' -> 'height'
                obj.$type = 'lineHeights';
            } else if (parentKey === 'spacing' || parentKey === 'letterSpacing') {
                // disambiguate letter vs paragraph spacing if possible via path, 
                // but typically 'spacing' inside 'letter' object.
                // We will rely on caller to pass path context or check deeper?
                // Simple heuristic: if strict match.
                // Actually relying on parentKey is weak if we don't know grandparent.
                // Let's rely on specific structure traversal below.
            }
            return;
        }

        // Traverse children
        for (const k in obj) {
            const v = obj[k];
            // Context aware traversal
            if (k === 'font') {
                // font.size, font.family, font.weight
                if (v.size) setTypeRecursive(v.size, 'fontSizes');
                if (v.family) setTypeRecursive(v.family, 'fontFamilies');
                if (v.weight) setTypeRecursive(v.weight, 'fontWeights');
                // continue traversal for others
                fixTypographyTypes(v, 'font');
            } else if (k === 'line' && v.height) {
                setTypeRecursive(v.height, 'lineHeights');
            } else if (k === 'letter' && v.spacing) {
                setTypeRecursive(v.spacing, 'letterSpacing');
            } else if (k === 'paragraph' && v.spacing) {
                setTypeRecursive(v.spacing, 'paragraphSpacing');
            } else {
                fixTypographyTypes(v, k);
            }
        }
    }

    function setTypeRecursive(target: any, type: string, depth = 0) {
        if (!target || depth > 200) return;
        if (target.$value) {
            target.$type = type;
        } else {
            for (const k in target) {
                setTypeRecursive(target[k], type, depth + 1);
            }
        }
    }


    // 3. Assemble Final Object
    // We want the file to strictly have these 3 top-level keys.
    const finalTokens = {
        "Primitives": Primitives,
        "Semantics": Semantics,
        "Components": Components
    };

    // Apply fixes
    fixAliases(finalTokens);

    // Apply Typography Type Fixes
    if (Primitives.Typography) fixTypographyTypes(Primitives.Typography);
    if (Components["HTML elements"]) fixTypographyTypes(Components["HTML elements"]);

    // Write back
    fs.writeFileSync(filePath, JSON.stringify(finalTokens, null, 2));
    if (isLight) {
        fs.writeFileSync(LEGACY_PATH, JSON.stringify(finalTokens, null, 2));
    }
    console.log(`Updated ${filePath} with centralized collections, fixed aliases, and strict FTS types.`);
}

const LIGHT_PATH = path.join(process.cwd(), 'packages/tokens/src/tokens-light.json');
const DARK_PATH = path.join(process.cwd(), 'packages/tokens/src/tokens-dark.json');

// Run for Light
console.log("Updating Light Tokens...");
updateTokens(LIGHT_PATH, true);

// Run for Dark
console.log("Updating Dark Tokens...");
updateTokens(DARK_PATH, false);
