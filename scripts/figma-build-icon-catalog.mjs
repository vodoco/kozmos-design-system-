import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DEFAULT_FILE_KEY = 'PpbQbvpNTMvwqCx9dD4efJ';
const DEFAULT_ROOT_NODE_ID = '181:128951';
const DEFAULT_OUTPUT = path.join(ROOT_DIR, 'docs/figma-pointr-icon-catalog.json');

function parseArgs(argv) {
    const args = {
        fileKey: DEFAULT_FILE_KEY,
        rootNodeId: DEFAULT_ROOT_NODE_ID,
        output: DEFAULT_OUTPUT,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        const next = argv[index + 1];

        if (arg === '--file-key' && next) {
            args.fileKey = next;
            index += 1;
        } else if (arg === '--root-node-id' && next) {
            args.rootNodeId = next;
            index += 1;
        } else if (arg === '--out' && next) {
            args.output = path.resolve(ROOT_DIR, next);
            index += 1;
        }
    }

    return args;
}

function findDotEnv(startDir) {
    let current = startDir;

    while (true) {
        const candidate = path.join(current, '.env');
        if (fs.existsSync(candidate)) return candidate;

        const parent = path.dirname(current);
        if (parent === current) return null;
        current = parent;
    }
}

function parseDotEnv(filePath) {
    const values = {};
    if (!filePath) return values;

    for (const line of fs.readFileSync(filePath, 'utf-8').split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (!match) continue;

        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        values[match[1]] = value;
    }

    return values;
}

async function figmaRequest(pathname, token) {
    const response = await fetch(`https://api.figma.com/v1${pathname}`, {
        headers: {
            'X-Figma-Token': token,
        },
    });

    const text = await response.text();
    let body;
    try {
        body = JSON.parse(text);
    } catch {
        body = { message: text };
    }

    if (!response.ok) {
        const reason = body?.err || body?.message || `HTTP ${response.status}`;
        throw new Error(`Figma API request failed for ${pathname}: ${reason}`);
    }

    return body;
}

function collectComponents(node, categoryName, categoryNodeId, output) {
    if (!node) return;

    if (node.type === 'COMPONENT') {
        output.push({
            name: node.name,
            nodeId: node.id,
            category: categoryName,
            categoryNodeId,
        });
    }

    for (const child of node.children || []) {
        collectComponents(child, categoryName, categoryNodeId, output);
    }
}

function buildCategories(rootNode, componentMetaByNodeId) {
    const categories = [];

    for (const child of rootNode.children || []) {
        if (child.type !== 'FRAME' || child.name === 'Cover') continue;

        const icons = [];
        collectComponents(child, child.name, child.id, icons);

        categories.push({
            name: child.name,
            nodeId: child.id,
            iconCount: icons.length,
            icons: icons.map((icon) => {
                const meta = componentMetaByNodeId.get(icon.nodeId);
                return {
                    name: icon.name,
                    nodeId: icon.nodeId,
                    componentKey: meta?.key || null,
                    description: meta?.description || '',
                };
            }),
        });
    }

    return categories;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const env = {
        ...parseDotEnv(findDotEnv(ROOT_DIR)),
        ...process.env,
    };
    const token = env.FIGMA_ACCESS_TOKEN;

    if (!token) {
        throw new Error('Missing FIGMA_ACCESS_TOKEN. Add it to .env before running figma:icons.');
    }

    const [nodeResponse, componentResponse] = await Promise.all([
        figmaRequest(`/files/${args.fileKey}/nodes?ids=${encodeURIComponent(args.rootNodeId)}&depth=3`, token),
        figmaRequest(`/files/${args.fileKey}/components`, token),
    ]);

    const rootNode = nodeResponse.nodes?.[args.rootNodeId]?.document;
    if (!rootNode) {
        throw new Error(`Could not find icon root node ${args.rootNodeId} in file ${args.fileKey}.`);
    }

    const publishedComponents = componentResponse.meta?.components || [];
    const componentMetaByNodeId = new Map(publishedComponents.map((component) => [component.node_id, component]));
    const categories = buildCategories(rootNode, componentMetaByNodeId);
    const icons = categories.flatMap((category) => (
        category.icons.map((icon) => ({
            ...icon,
            category: category.name,
            categoryNodeId: category.nodeId,
        }))
    ));

    const catalog = {
        generatedAt: new Date().toISOString(),
        source: {
            fileKey: args.fileKey,
            fileUrl: `https://www.figma.com/design/${args.fileKey}/Pointr-Icon-Library`,
            rootNodeId: args.rootNodeId,
            rootNodeUrl: `https://www.figma.com/design/${args.fileKey}/Pointr-Icon-Library?node-id=${args.rootNodeId.replace(':', '-')}`,
            publishedComponentCount: publishedComponents.length,
        },
        summary: {
            categoryCount: categories.length,
            iconCount: icons.length,
            unmatchedPublishedComponents: publishedComponents.length - icons.length,
        },
        categories,
        icons,
    };

    fs.mkdirSync(path.dirname(args.output), { recursive: true });
    fs.writeFileSync(args.output, `${JSON.stringify(catalog, null, 2)}\n`);

    console.log(`Wrote ${path.relative(ROOT_DIR, args.output)} with ${icons.length} icons across ${categories.length} categories.`);
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
