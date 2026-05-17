const fs = require('fs');
const path = require('path');

const components = [
    'Input', 'Select', 'Checkbox', 'Radio', 'Switch', 'Badge', 'Avatar', 
    'Card', 'Dialog', 'Drawer', 'Menu', 'Popover', 'Tooltip', 'Alert', 
    'Progress', 'Spinner', 'Tabs', 'Slider'
];

console.log('🚀 Scaling Figma Code Connect from 2 to 20 components...');

let generatedCount = 0;

components.forEach(cmp => {
    const dir = path.resolve(__dirname, `../packages/react/src/components/${cmp}`);
    if (fs.existsSync(dir)) {
        const file = path.join(dir, `${cmp}.figma.tsx`);
        if (!fs.existsSync(file)) {
            const content = `import React from 'react';
import figma from '@figma/code-connect';
import { ${cmp} } from './${cmp}';

/**
 * Figma Code Connect: ${cmp}
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 * 
 * TODO: Replace node-id=TBD with the exact Figma component node ID.
 */
figma.connect(${cmp}, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
  props: {
    // Map Figma variant properties to React props here dynamically
    // example: disabled: figma.boolean("Disabled")
  },
  example: (props) => <${cmp} {...props} />
});
`;
            fs.writeFileSync(file, content);
            console.log(`✅ Generated ${cmp}.figma.tsx`);
            generatedCount++;
        } else {
            console.log(`ℹ️ Skipped ${cmp}.figma.tsx (Already exists)`);
        }
    } else {
        console.warn(`⚠️ Component directory missing: ${cmp}`);
    }
});

console.log(`\n🎉 Generated ${generatedCount} Code Connect files successfully!`);
