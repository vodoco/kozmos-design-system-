import fs from 'fs';
import path from 'path';

function findAndCleanStubs(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findAndCleanStubs(fullPath);
        } else if (fullPath.endsWith('.figma.tsx') && !fullPath.includes('Button.figma.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8').trim();
            if (content === 'export {};' || content === '') {
                fs.unlinkSync(fullPath);
                console.log(`Purged dead stub: ${fullPath}`);
            }
        }
    }
}

findAndCleanStubs(path.resolve(process.cwd(), 'packages'));
console.log('Global Figma Code Connect Stubs Purged.');
