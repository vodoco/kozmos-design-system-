
import fs from 'fs';
import path from 'path';

/**
 * script: sync-figma.ts
 * Purpose: Fetch local variables from Figma API and save as DTCG tokens.
 * Usage: FIGMA_ACCESS_TOKEN=x FIGMA_FILE_KEY=y npx tsx scripts/sync-figma.ts
 */

const { FIGMA_FILE_KEY, FIGMA_ACCESS_TOKEN } = process.env;

if (!FIGMA_FILE_KEY || !FIGMA_ACCESS_TOKEN) {
    console.error('❌ Missing FIGMA_FILE_KEY or FIGMA_ACCESS_TOKEN in .env');
    process.exit(1);
}

// Fixed: Explicit type assertion for headers to satisfy TypeScript "HeadersInit"
const HEADERS = {
    'X-Figma-Token': FIGMA_ACCESS_TOKEN as string
};

const TOKENS_DIR = path.resolve(process.cwd(), 'packages/tokens/src');

async function main() {
    console.log('🔄 Connecting to Figma API (Deep Diagnostic)...');

    try {
        // 0. DIAGNOSTIC: Test Identity (Often reveals scope issues)
        const meRes = await fetch('https://api.figma.com/v1/me', { headers: HEADERS });
        if (meRes.ok) {
            const me = await meRes.json();
            console.log(`✅ Token Identity: ${me.handle} (${me.email})`);
        } else {
            console.warn(`⚠️ Token Identity Check Failed: ${meRes.status}. Your token might lack 'profile:read' scope.`);
        }

        // 1. DIAGNOSTIC: Test File Metadata
        console.log(`Testing File Access: ${FIGMA_FILE_KEY}...`);
        const basicRes = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_KEY}?depth=1`, { headers: HEADERS });

        if (!basicRes.ok) {
            throw new Error(`File Access Failed: ${basicRes.status} ${basicRes.statusText}`);
        }

        const fileData = await basicRes.json();
        console.log(`✅ File Found: "${fileData.name}" (Last Modified: ${fileData.lastModified})`);
        console.log(`ℹ️ User Role on File: ${fileData.role}`); // 'owner', 'editor', 'viewer'
        console.log(`ℹ️ Editor Type: ${fileData.editorType}`); // 'figma', 'figjam'

        if (fileData.role === 'viewer') {
            console.warn('⚠️ Warning: You are a Viewer on this file. Variables API usually requires Editor access in some implementations, but Viewer should work for READ.');
        }

        // 2. Fetch File Variables
        console.log('Fetching Variables (/local)...');
        const varPath = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`;
        const response = await fetch(varPath, { headers: HEADERS });

        if (!response.ok) {
            console.error(`❌ API Response Payload:`, await response.text()); // Log exact error message from Figma
            if (response.status === 403) {
                throw new Error(`Variables Access Failed (403). Ensure token has 'file_variables:read' scope.`);
            }
            throw new Error(`Figma API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const { meta } = data; // variables, variableCollections

        console.log(`✅ Found ${Object.keys(meta.variables).length} variables in ${Object.keys(meta.variableCollections).length} collections.`);

        // 3. Transform Figma RAW AST -> Token Studio DTCG Format
        const variables = meta.variables;
        const collections = meta.variableCollections;

        const tokensLight: any = {};
        const tokensDark: any = {};

        const globalLightIds = new Set<string>();
        const globalDarkIds = new Set<string>();

        Object.values(collections).forEach((c: any) => {
            if (c.modes.length === 1) {
                globalLightIds.add(c.modes[0].modeId);
                globalDarkIds.add(c.modes[0].modeId);
            } else {
                c.modes.forEach((m: any) => {
                    const name = m.name.toLowerCase();
                    if (name.includes('light')) globalLightIds.add(m.modeId);
                    else if (name.includes('dark')) globalDarkIds.add(m.modeId);
                    else globalLightIds.add(m.modeId); // default fallback
                });
            }
        });

        const rgbaToHex = ({ r, g, b, a }: any) => {
            const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
            if (a === 1 || a === undefined) return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
        };

        const resolveValue = (val: any): any => {
            if (val && val.type === 'VARIABLE_ALIAS') {
                const targetVar = variables[val.id];
                if (!targetVar) return val.id;
                return `{${targetVar.name.replace(/\//g, '.')}}`;
            }
            if (val && val.r !== undefined) return rgbaToHex(val);
            return val;
        };

        const setNested = (obj: any, pathArray: string[], value: any) => {
            let current = obj;
            for (let i = 0; i < pathArray.length - 1; i++) {
                if (!current[pathArray[i]]) current[pathArray[i]] = {};
                current = current[pathArray[i]];
            }
            current[pathArray[pathArray.length - 1]] = value;
        };

        Object.values(variables).forEach((v: any) => {
            const type = v.resolvedType === 'COLOR' ? 'color' : 'number';
            const pathArray = v.name.split('/').map((part: string) => {
                let sanitized = part.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                // Ensure the path part doesn't start with a number (invalid for Android XML/code variables)
                if (/^[0-9]/.test(sanitized)) sanitized = '_' + sanitized;
                return sanitized;
            });

            let lightVal = null;
            let darkVal = null;

            for (const [modeId, val] of Object.entries(v.valuesByMode)) {
                if (globalLightIds.has(modeId)) lightVal = resolveValue(val);
                if (globalDarkIds.has(modeId)) darkVal = resolveValue(val);
            }

            if (!lightVal) lightVal = Object.values(v.valuesByMode).map(resolveValue)[0];
            if (!darkVal) darkVal = lightVal;

            if (lightVal) setNested(tokensLight, pathArray, { $value: lightVal, $type: type });
            if (darkVal) setNested(tokensDark, pathArray, { $value: darkVal, $type: type });
        });

        fs.writeFileSync(path.join(TOKENS_DIR, 'tokens-light.json'), JSON.stringify(tokensLight, null, 2));
        fs.writeFileSync(path.join(TOKENS_DIR, 'tokens-dark.json'), JSON.stringify(tokensDark, null, 2));

        console.log('✅ Generated tokens-light.json and tokens-dark.json directly from Figma RAW metadata seamlessly!');

    } catch (error) {
        if (error instanceof Error) {
            console.error('❌ Sync failed:', error.message);
        } else {
            console.error('❌ Sync failed:', error);
        }
        process.exit(1);
    }
}

main();
