const fs = require("fs");
const path = require("path");
const componentsDir = "./packages/react/src/components";
const dirs = fs.readdirSync(componentsDir).filter(d => fs.statSync(path.join(componentsDir, d)).isDirectory());

const stories = [];
for (const d of dirs) {
    const storyFile = path.join(componentsDir, d, `${d}.stories.tsx`);
    if (fs.existsSync(storyFile)) {
        const content = fs.readFileSync(storyFile, "utf-8");
        const titleMatch = content.match(/title:\s*['"](.+)['"]/);
        if (titleMatch) {
            const title = titleMatch[1];
            // convert title to id format: lowercased, spaces to dashes, slashes to dashes
            let idPrefix = title.toLowerCase().replace(/[\/\s+]/g, "-");
            // Storybook handles multiple dashes differently, but usually it collapses them.
            idPrefix = idPrefix.replace(/-+/g, "-");
            
            // Check for the name of the exported default story. Often "Default", but let's check
            const exportMatch = content.match(/export const (\w+): Story =/);
            const storyName = exportMatch ? exportMatch[1].toLowerCase() : "default";
            
            stories.push(`    { id: '${idPrefix}--${storyName}', name: '${d}' }`);
        }
    }
}
console.log(stories.join(",\n"));
