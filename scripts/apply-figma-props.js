const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../packages/react/src/components');

// Block D definitions (Empty Stubs)
const blockD = {
  FloatingActionButton: "  props: { disabled: figma.boolean('Disabled') }",
  Grid: "  props: { cols: figma.enum('Columns'), gap: figma.enum('Gap') }",
  IconButton: "  props: { variant: figma.enum('Variant'), disabled: figma.boolean('Disabled') }",
  SplitButton: "  props: { disabled: figma.boolean('Disabled') }",
  ToggleButton: "  props: { variant: figma.enum('Variant'), pressed: figma.boolean('Pressed'), disabled: figma.boolean('Disabled') }"
};

// Block E definitions (TBD Stubs)
const blockE = {
  Input: "  props: { disabled: figma.boolean('Disabled'), error: figma.boolean('Error'), placeholder: figma.string('Placeholder') }",
  Select: "  props: { disabled: figma.boolean('Disabled'), error: figma.boolean('Error') } /* Connect to SelectTrigger */",
  Checkbox: "  props: { checked: figma.boolean('Checked'), disabled: figma.boolean('Disabled') }",
  Radio: "  props: { checked: figma.boolean('Checked'), disabled: figma.boolean('Disabled') }",
  Switch: "  props: { checked: figma.boolean('Checked'), disabled: figma.boolean('Disabled') }",
  Badge: "  props: { variant: figma.enum('Variant') }",
  Avatar: "  props: { src: figma.string('Image') } /* Connect to AvatarImage */",
  Card: "  props: { children: figma.children('*') }",
  Dialog: "  props: { children: figma.children('*') } /* Connect to DialogContent */",
  Drawer: "  props: { side: figma.enum('Side') } /* Connect to DrawerContent */",
  Menu: "  props: { children: figma.children('*') } /* Connect to MenuContent */",
  Popover: "  props: { children: figma.children('*') } /* Connect to PopoverContent */",
  Tooltip: "  props: { children: figma.children('*') } /* Connect to TooltipContent */",
  Alert: "  props: { variant: figma.enum('Variant') }",
  Progress: "  props: { value: figma.number('Value') }",
  Spinner: "  props: { size: figma.enum('Size') }",
  Tabs: "  props: { children: figma.children('*') } /* Connect to TabsList */",
  Slider: "  props: { disabled: figma.boolean('Disabled'), min: figma.number('Min'), max: figma.number('Max') }"
};

const allMappings = { ...blockD, ...blockE };

Object.entries(allMappings).forEach(([cmp, propString]) => {
  const file = path.join(srcDir, cmp, `${cmp}.figma.tsx`);
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // For Block D components which currently "export {}", overwrite them entirely or replace the file.
    if (content.includes('export {}')) {
      content = `import React from 'react';
import figma from '@figma/code-connect';
import { ${cmp} } from './${cmp}';

/**
 * Figma Code Connect: ${cmp}
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 */
figma.connect(${cmp}, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
${propString},
  example: (props) => <${cmp} {...props} />
});`;
    } else {
      // Replace empty props block with mapped props block natively
      content = content.replace(/props:\s*\{[\s\S]*?\}/g, propString);
    }
    
    fs.writeFileSync(file, content);
    console.log(`✅ Applied props to ${cmp}.figma.tsx`);
  } else {
    console.warn(`⚠️ File not found: ${cmp}.figma.tsx`);
  }
});
