import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PLATFORMS = {
    ios: {
        dir: 'packages/ios',
        config: 'packages/ios/figma.linked.config.json',
    },
    android: {
        dir: 'packages/android',
        config: 'packages/android/figma.linked.config.json',
    },
};

const COMMANDS = new Set(['parse', 'publish', 'unpublish']);

function usage() {
    console.error('Usage: node scripts/figma-connect-native.mjs <ios|android> <parse|publish|unpublish> [...figma args]');
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

function findUp(startDir, fileName) {
    let current = startDir;
    while (true) {
        const candidate = path.join(current, fileName);
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

const [platformName, command, ...extraArgs] = process.argv.slice(2).filter((arg) => arg !== '--');
const platform = PLATFORMS[platformName];

if (!platform || !COMMANDS.has(command)) {
    usage();
    process.exit(1);
}

const workspaceFile = findUp(process.cwd(), 'pnpm-workspace.yaml');
const workspaceRoot = workspaceFile ? path.dirname(workspaceFile) : process.cwd();
const dotEnvValues = parseDotEnv(findDotEnv(process.cwd()));
const env = { ...dotEnvValues, ...process.env };

const dir = path.resolve(workspaceRoot, platform.dir);
const config = path.resolve(workspaceRoot, platform.config);
const figmaBin = path.resolve(workspaceRoot, 'packages/react/node_modules/.bin/figma');

if (!fs.existsSync(figmaBin)) {
    console.error('Figma Code Connect CLI was not found at packages/react/node_modules/.bin/figma.');
    console.error('Run pnpm install before using the native Code Connect scripts.');
    process.exit(1);
}

const result = spawnSync(
    figmaBin,
    [
        'connect',
        command,
        '--config',
        config,
        '--skip-update-check',
        '--exit-on-unreadable-files',
        ...extraArgs,
    ],
    {
        stdio: 'inherit',
        env,
        cwd: dir,
    }
);

process.exit(result.status ?? 1);
