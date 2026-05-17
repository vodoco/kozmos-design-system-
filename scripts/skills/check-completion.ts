
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Skill: Component Completion Checker
 * Role: DevOps / QA
 * Description: Scans the codebase to verirfy the implementation status of UI components across Web, iOS, and Android.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');

// Paths to check
const PATHS = {
    web: {
        component: (name: string) => `packages/react/src/components/${name}/${name}.tsx`,
        story: (name: string) => `packages/react/src/components/${name}/${name}.stories.tsx`,
        test: (name: string) => `packages/react/src/components/${name}/${name}.test.tsx`,
        figma: (name: string) => `packages/react/src/components/${name}/${name}.figma.tsx`,
        barrel: (name: string) => `packages/react/src/components/${name}/index.ts`,
    },
    ios: {
        component: (name: string) => `packages/ios/Sources/Components/${name}/${name}.swift`,
        figma: (name: string) => `packages/ios/Sources/Components/${name}/${name}.figma.swift`,
    },
    android: {
        component: (name: string) => `packages/android/src/main/java/com/kozmos/components/${name}/${name}.kt`,
        figma: (name: string) => `packages/android/src/main/java/com/kozmos/components/${name}/${name}.figma.kt`,
    }
};

// Component list (from component_inventory.md)
// We could parse the MD file, but hardcoding ensures strict checking against a known list.
const COMPONENTS = [
    // Foundations
    'ThemeProvider', 'Box', 'Stack', 'Grid', 'Container', 'Text', 'Heading', 'Icon',
    // Actions
    'Button', 'IconButton', 'FloatingActionButton', 'SplitButton', 'ToggleButton', 'SegmentedControl',
    // Inputs
    'Input', 'Textarea', 'Select', 'Checkbox', 'Radio', 'Switch', 'Slider', 'Rating', 'FileUpload', 'DatePicker', 'TimePicker', 'Search', 'OTPInput',
    // Navigation
    'Tabs', 'Breadcrumb', 'Menu', 'Sidebar', 'BottomNavigation', 'Stepper', 'Pagination', 'Link', 'Navbar',
    // Feedback
    'Alert', 'Toast', 'Progress', 'Skeleton', 'Spinner', 'Dialog', 'Drawer', 'Backdrop',
    // Data Display
    'Table', 'List', 'Card', 'Avatar', 'Badge', 'Tag', 'Tree', 'Timeline', 'Tooltip', 'Popover', 'Accordion', 'Separator',
    // Pointr Specific
    'MapView', 'WayfindingCard', 'FloorSelector', 'POICard', 'LocationPin', 'DirectionStep', 'BottomSheet'
];

interface ComponentStatus {
    name: string;
    web: {
        component: boolean;
        story: boolean;
        test: boolean;
        figma: boolean;
        barrel: boolean;
        exported: boolean;
    };
    ios: {
        component: boolean;
        figma: boolean;
    };
    android: {
        component: boolean;
        figma: boolean;
    };
}

async function checkExports(componentNames: string[]): Promise<Set<string>> {
    const indexPath = path.join(ROOT_DIR, 'packages/react/src/index.ts');
    const exportedSet = new Set<string>();

    if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8');
        // Simple regex valid check for `export * from './components/Name'` or `export { Name }`
        // This is a basic heuristic.
        componentNames.forEach(name => {
            if (content.includes(name)) { // Very naive check, but good enough for now
                exportedSet.add(name);
            }
        });
    }
    return exportedSet;
}

async function runCheck() {
    console.log('🔍 Checking Component Implementation Status...');
    console.log(`📂 Root: ${ROOT_DIR}\n`);

    const exportedComponents = await checkExports(COMPONENTS);
    const statuses: ComponentStatus[] = [];

    for (const component of COMPONENTS) {
        const status: ComponentStatus = {
            name: component,
            web: {
                component: fs.existsSync(path.join(ROOT_DIR, PATHS.web.component(component))),
                story: fs.existsSync(path.join(ROOT_DIR, PATHS.web.story(component))),
                test: fs.existsSync(path.join(ROOT_DIR, PATHS.web.test(component))),
                figma: fs.existsSync(path.join(ROOT_DIR, PATHS.web.figma(component))),
                barrel: fs.existsSync(path.join(ROOT_DIR, PATHS.web.barrel(component))),
                exported: exportedComponents.has(component),
            },
            ios: {
                component: fs.existsSync(path.join(ROOT_DIR, PATHS.ios.component(component))),
                figma: fs.existsSync(path.join(ROOT_DIR, PATHS.ios.figma(component))),
            },
            android: {
                component: fs.existsSync(path.join(ROOT_DIR, PATHS.android.component(component))),
                figma: fs.existsSync(path.join(ROOT_DIR, PATHS.android.figma(component))),
            }
        };
        statuses.push(status);
    }

    // Print Table
    printTable(statuses);

    // Generate Markdown for STATUS.md
    const markdown = generateMarkdown(statuses);
    fs.writeFileSync(path.join(ROOT_DIR, 'STATUS.md'), markdown);
    console.log(`\n✅ STATUS.md updated.`);

    // Calculate Totals
    const total = COMPONENTS.length;
    const webComplete = statuses.filter(s => s.web.component).length;
    const iosComplete = statuses.filter(s => s.ios.component).length;
    const androidComplete = statuses.filter(s => s.android.component).length;

    console.log(`\n📊 Summary:`);
    console.log(`Web (React):     ${webComplete}/${total} (${Math.round(webComplete / total * 100)}%)`);
    console.log(`iOS (SwiftUI):   ${iosComplete}/${total} (${Math.round(iosComplete / total * 100)}%)`);
    console.log(`Android (Jetpack): ${androidComplete}/${total} (${Math.round(androidComplete / total * 100)}%)`);
}

function printTable(statuses: ComponentStatus[]) {
    // Header
    const headers = [
        'Component',
        'Web (C)', 'Web (S)', 'Web (T)', 'Web (F)', 'Web (B)', 'Web (E)',
        'iOS (C)', 'iOS (F)',
        'And (C)', 'And (F)'
    ];

    // Formatting helper
    const pad = (str: string, len: number) => str.padEnd(len);
    const colWidths = [20, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
    const rowLine = colWidths.map(w => '-'.repeat(w)).join(' | ');

    console.log(headers.map((h, i) => pad(h, colWidths[i])).join(' | '));
    console.log(rowLine);

    statuses.forEach(s => {
        const row = [
            s.name,
            icon(s.web.component), icon(s.web.story), icon(s.web.test), icon(s.web.figma), icon(s.web.barrel), icon(s.web.exported),
            icon(s.ios.component), icon(s.ios.figma),
            icon(s.android.component), icon(s.android.figma)
        ];
        console.log(row.map((c, i) => pad(c, colWidths[i])).join(' | '));
    });
}

function generateMarkdown(statuses: ComponentStatus[]): string {
    const headers = [
        'Component',
        'Web (Comp)', 'Web (Story)', 'Web (Test)', 'Web (Figma)', 'Web (Barrel)', 'Web (Export)',
        'iOS (Comp)', 'iOS (Figma)',
        'Android (Comp)', 'Android (Figma)'
    ];

    let md = `# Kozmos Design System - Implementation Status\n\n`;
    md += `**Last Updated:** ${new Date().toUTCString()}\n\n`;

    md += `| ${headers.join(' | ')} |\n`;
    md += `| ${headers.map(() => '---').join(' | ')} |\n`;

    statuses.forEach(s => {
        const row = [
            s.name,
            icon(s.web.component), icon(s.web.story), icon(s.web.test), icon(s.web.figma), icon(s.web.barrel), icon(s.web.exported),
            icon(s.ios.component), icon(s.ios.figma),
            icon(s.android.component), icon(s.android.figma)
        ];
        md += `| ${row.join(' | ')} |\n`;
    });

    // Calculate Summary
    const total = statuses.length;
    const webComplete = statuses.filter(s => s.web.component).length;
    const iosComplete = statuses.filter(s => s.ios.component).length;
    const androidComplete = statuses.filter(s => s.android.component).length;

    md += `\n## Summary\n`;
    md += `- **Web (React):** ${webComplete}/${total} (${Math.round(webComplete / total * 100)}%)\n`;
    md += `- **iOS (SwiftUI):** ${iosComplete}/${total} (${Math.round(iosComplete / total * 100)}%)\n`;
    md += `- **Android (Jetpack):** ${androidComplete}/${total} (${Math.round(androidComplete / total * 100)}%)\n`;

    return md;
}

function icon(bool: boolean): string {
    return bool ? '✅' : '❌'; // '⬜'
}

runCheck();
