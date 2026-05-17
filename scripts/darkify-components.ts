import fs from 'fs';
import path from 'path';

const TARGET_FILE = path.join(process.cwd(), 'packages/tokens/src/raw/Components (dark).tokens.json');

// Mapping of Light Mode Hex -> Dark Mode Hex
// Based on standard Dark Mode inversion patterns for this system
const COLOR_MAP: Record<string, string> = {
    // Backgrounds (White/Light -> Dark)
    "#FFFFFF": "#17191C", // Surface 0 -> Surface 100
    "#F8F9FA": "#17191C", // Surface 100 -> Surface 100
    "#E9ECEF": "#2E3138", // Surface 200 -> Surface 200
    "#DEE2E6": "#464A53", // Surface 300 -> Surface 300
    "#CED4DA": "#464A53", // Border/Surface? -> Surface 300

    // Foregrounds (Black/Dark -> White/Light)
    "#000000": "#FFFFFF", // Black -> White
    "#212529": "#F8F9FA", // Gray 900 -> Gray 100
    "#343A40": "#E9ECEF", // Gray 800 -> Gray 200
    "#495057": "#DEE2E6", // Gray 700 -> Gray 300
    "#868E96": "#ADB5BD", // Gray 600 -> Gray 400

    // Neutral Button Specifics
    "#C7CAD1": "#464A53", // Neutral Idle -> Dark Surface
    "#ABAFBA": "#5C6069", // Neutral Hover -> Lighter Dark Surface
    "#E3E4E8": "#2E3138", // Neutral Active -> Darker? Or Lighter? Active usually darker in Light mode. 
    // Light Mode: C7CAD1 -> E3E4E8 (Lighter). 
    // Dark Mode: 464A53 -> 5C6069 (Lighter)

    // Secondary Button (White Bg, Brand Text -> Dark Bg, Brand Text)
    // Secondary Buttons usually use transparent or surface background.
    // If they explicitly use #FFFFFF, they map to #17191C above.

    // Tertiary Button (Transparent? or specific color?)
    // If not in map, it stays same.
};

function transformColors(obj: any) {
    if (!obj) return;

    // If it's a color token with a direct value string (legacy)
    if (typeof obj === 'string' && obj.startsWith('#')) {
        return COLOR_MAP[obj.toUpperCase()] || obj;
    }

    // Traverse
    for (const k in obj) {
        if (k === '$value') {
            const val = obj[k];

            // Case 1: Simple String
            if (typeof val === 'string') {
                const hex = val.toUpperCase();
                if (COLOR_MAP[hex]) {
                    obj[k] = COLOR_MAP[hex];
                }
            }
            // Case 2: Complex Object (Figma raw)
            else if (typeof val === 'object' && val.hex) {
                let hex = val.hex.toUpperCase();
                // Apply Dark Mode Transform
                if (COLOR_MAP[hex]) {
                    hex = COLOR_MAP[hex];
                }
                // FLATTEN: Replace complex object with simple string
                obj[k] = hex;
            }
        } else if (typeof obj[k] === 'object') {
            transformColors(obj[k]);
        }
    }
}

// Read
try {
    const raw = fs.readFileSync(TARGET_FILE, 'utf8');
    const data = JSON.parse(raw);

    console.log(`Processing ${TARGET_FILE}...`);
    transformColors(data);

    // Write back
    fs.writeFileSync(TARGET_FILE, JSON.stringify(data, null, 2));
    console.log("Done.");

} catch (e) {
    console.error("Error processing file:", e);
}
