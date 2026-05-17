#!/usr/bin/env node

/**
 * Skill: Component Scaffolder
 * Role: Coordinator / Builder
 * Description: Generates the folder structure for a new React component.
 */

import fs from 'fs';
import path from 'path';

const componentName = process.argv[2];

if (!componentName) {
  console.error('Please provide a component name.');
  process.exit(1);
}

const baseDir = path.join(process.cwd(), 'packages/react/src/components', componentName);

if (fs.existsSync(baseDir)) {
  console.error(`Component ${componentName} already exists.`);
  process.exit(1);
}

fs.mkdirSync(baseDir, { recursive: true });


// 1. Component File
const componentContent = `import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const ${componentName.toLowerCase()}Variants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ${componentName}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ${componentName.toLowerCase()}Variants> {
  asChild?: boolean;
}

export const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(${componentName.toLowerCase()}Variants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

${componentName}.displayName = '${componentName}';
`;

fs.writeFileSync(path.join(baseDir, `${componentName}.tsx`), componentContent);

// 2. Index File
fs.writeFileSync(path.join(baseDir, 'index.ts'), `export * from './${componentName}';\n`);

// 3. Story File
const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { 
      control: 'select', 
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] 
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon']
    }
  },
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '${componentName}',
    variant: 'default',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};
`;

fs.writeFileSync(path.join(baseDir, `${componentName}.stories.tsx`), storyContent);

// 4. Test File
const testContent = `import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    render(<${componentName}>Test Content</${componentName}>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
`;

fs.writeFileSync(path.join(baseDir, `${componentName}.test.tsx`), testContent);

// 5. Update Main Export
const mainIndexData = fs.readFileSync(path.join(process.cwd(), 'packages/react/src/index.ts'), 'utf-8');
if (!mainIndexData.includes(`./components/${componentName}/${componentName}`)) {
  fs.appendFileSync(path.join(process.cwd(), 'packages/react/src/index.ts'), `export * from './components/${componentName}/${componentName}';\n`);
  console.log(`✅ Exported ${componentName} in packages/react/src/index.ts`);
}

console.log(`✅ Component ${componentName} scaffolded successfully at ${baseDir}`);
