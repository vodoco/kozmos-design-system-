import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

/**
 * Scans component implementation status across Web, iOS, and Android.
 *
 * Default: writes STATUS.md.
 * --check: fails when STATUS.md is stale without mutating the workspace.
 * --no-write: prints only.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../");
const STATUS_PATH = path.join(ROOT_DIR, "STATUS.md");
const args = new Set(process.argv.slice(2));

const PATHS = {
  web: {
    root: "packages/react/src/components",
    component: (name: string) =>
      `packages/react/src/components/${name}/${name}.tsx`,
    story: (name: string) =>
      `packages/react/src/components/${name}/${name}.stories.tsx`,
    test: (name: string) =>
      `packages/react/src/components/${name}/${name}.test.tsx`,
    figma: (name: string) =>
      `packages/react/src/components/${name}/${name}.figma.tsx`,
    barrel: (name: string) => `packages/react/src/components/${name}/index.ts`,
  },
  ios: {
    root: "packages/ios/Sources/Components",
    component: (name: string) =>
      `packages/ios/Sources/Components/${name}/${name}.swift`,
    figma: (name: string) =>
      `packages/ios/Sources/Components/${name}/${name}.figma.swift`,
  },
  android: {
    root: "packages/android/src/main/java/com/kozmos/components",
    component: (name: string) =>
      `packages/android/src/main/java/com/kozmos/components/${name}/${name}.kt`,
    figma: (name: string) =>
      `packages/android/src/main/java/com/kozmos/components/${name}/${name}.figma.kt`,
  },
};

interface ComponentStatus {
  name: string;
  web: {
    component: boolean;
    story: boolean;
    test: boolean;
    figmaFile: boolean;
    codeConnect: boolean;
    barrel: boolean;
    exported: boolean;
  };
  ios: {
    component: boolean;
    figmaFile: boolean;
    codeConnect: boolean;
  };
  android: {
    component: boolean;
    figmaFile: boolean;
    codeConnect: boolean;
  };
}

function exists(repoPath: string): boolean {
  return fs.existsSync(path.join(ROOT_DIR, repoPath));
}

function read(repoPath: string): string {
  return fs.readFileSync(path.join(ROOT_DIR, repoPath), "utf-8");
}

function hasRealCodeConnectMapping(repoPath: string): boolean {
  if (!exists(repoPath)) return false;

  const content = read(repoPath);
  const placeholderPatterns = [
    /node-id=TBD/i,
    /TODO:\s*Replace node-id/i,
    /^\s*\/\/\s*Placeholder\b/im,
    /BUTTON_NODE_ID/,
    /FILE_KEY/,
    /https:\/\/(?:www\.)?figma\.com\/(?:file|design)\/XXXXX/i,
  ];

  if (placeholderPatterns.some((pattern) => pattern.test(content))) {
    return false;
  }

  return /figma\.connect\(|@FigmaConnect|figmaNodeUrl|FigmaConnect\(/.test(
    content,
  );
}

function hasCodeConnectFile(repoPath: string): boolean {
  return exists(repoPath);
}

function readComponentDirectories(repoPath: string): string[] {
  const absPath = path.join(ROOT_DIR, repoPath);
  if (!fs.existsSync(absPath)) return [];

  return fs
    .readdirSync(absPath)
    .filter((name) => fs.statSync(path.join(absPath, name)).isDirectory())
    .sort((a, b) => a.localeCompare(b));
}

function discoverComponents(): string[] {
  const names = new Set<string>([
    ...readComponentDirectories(PATHS.web.root),
    ...readComponentDirectories(PATHS.ios.root),
    ...readComponentDirectories(PATHS.android.root),
  ]);

  return [...names].sort((a, b) => a.localeCompare(b));
}

async function checkExports(componentNames: string[]): Promise<Set<string>> {
  const indexPath = path.join(ROOT_DIR, "packages/react/src/index.ts");
  const exportedSet = new Set<string>();

  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, "utf-8");
    componentNames.forEach((name) => {
      if (content.includes(`./components/${name}`)) {
        exportedSet.add(name);
      }
    });
  }

  return exportedSet;
}

async function runCheck() {
  console.log("🔍 Checking Component Implementation Status...");
  console.log(`📂 Root: ${ROOT_DIR}\n`);

  const components = discoverComponents();
  const exportedComponents = await checkExports(components);
  const statuses: ComponentStatus[] = [];

  for (const component of components) {
    const webFigmaPath = PATHS.web.figma(component);
    const iosFigmaPath = PATHS.ios.figma(component);
    const androidFigmaPath = PATHS.android.figma(component);

    statuses.push({
      name: component,
      web: {
        component: exists(PATHS.web.component(component)),
        story: exists(PATHS.web.story(component)),
        test: exists(PATHS.web.test(component)),
        figmaFile: hasCodeConnectFile(webFigmaPath),
        codeConnect: hasRealCodeConnectMapping(webFigmaPath),
        barrel: exists(PATHS.web.barrel(component)),
        exported: exportedComponents.has(component),
      },
      ios: {
        component: exists(PATHS.ios.component(component)),
        figmaFile: hasCodeConnectFile(iosFigmaPath),
        codeConnect: hasRealCodeConnectMapping(iosFigmaPath),
      },
      android: {
        component: exists(PATHS.android.component(component)),
        figmaFile: hasCodeConnectFile(androidFigmaPath),
        codeConnect: hasRealCodeConnectMapping(androidFigmaPath),
      },
    });
  }

  printTable(statuses);

  const markdown = await formatMarkdown(generateMarkdown(statuses));

  if (args.has("--check")) {
    const current = fs.existsSync(STATUS_PATH)
      ? fs.readFileSync(STATUS_PATH, "utf-8")
      : "";
    if (current !== markdown) {
      console.error(
        "\n❌ STATUS.md is out of date. Run `pnpm tsx scripts/skills/check-completion.ts --write` and commit the result.",
      );
      process.exit(1);
    }
    console.log("\n✅ STATUS.md is up to date.");
  } else if (args.has("--write") || !args.has("--no-write")) {
    fs.writeFileSync(STATUS_PATH, markdown);
    console.log("\n✅ STATUS.md updated.");
  }

  printSummary(statuses);
}

function printTable(statuses: ComponentStatus[]) {
  const headers = [
    "Component",
    "Web (C)",
    "Web (S)",
    "Web (T)",
    "Web (CCF)",
    "Web (CCL)",
    "Web (B)",
    "Web (E)",
    "iOS (C)",
    "iOS (CCF)",
    "iOS (CCL)",
    "And (C)",
    "And (CCF)",
    "And (CCL)",
  ];

  const pad = (str: string, len: number) => str.padEnd(len);
  const colWidths = [22, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
  const rowLine = colWidths.map((w) => "-".repeat(w)).join(" | ");

  console.log(headers.map((h, i) => pad(h, colWidths[i])).join(" | "));
  console.log(rowLine);

  statuses.forEach((s) => {
    const row = [
      s.name,
      icon(s.web.component),
      icon(s.web.story),
      icon(s.web.test),
      icon(s.web.figmaFile),
      icon(s.web.codeConnect),
      icon(s.web.barrel),
      icon(s.web.exported),
      icon(s.ios.component),
      icon(s.ios.figmaFile),
      icon(s.ios.codeConnect),
      icon(s.android.component),
      icon(s.android.figmaFile),
      icon(s.android.codeConnect),
    ];
    console.log(row.map((c, i) => pad(c, colWidths[i])).join(" | "));
  });
}

function generateMarkdown(statuses: ComponentStatus[]): string {
  const headers = [
    "Component",
    "Web (Comp)",
    "Web (Story)",
    "Web (Test)",
    "Web (Code Connect File)",
    "Web (Code Connect Linked)",
    "Web (Barrel)",
    "Web (Export)",
    "iOS (Comp)",
    "iOS (Code Connect File)",
    "iOS (Code Connect Linked)",
    "Android (Comp)",
    "Android (Code Connect File)",
    "Android (Code Connect Linked)",
  ];

  let md = "# Kozmos Design System - Implementation Status\n\n";
  md +=
    "Generated from the component directories by `scripts/skills/check-completion.ts`.\n\n";
  md +=
    "`Code Connect File` means a scaffold or mapping file exists. `Code Connect Linked` means the mapping uses a real Figma node ID and has no placeholder markers such as `node-id=TBD`.\n\n";

  md += `| ${headers.join(" | ")} |\n`;
  md += `| ${headers.map(() => "---").join(" | ")} |\n`;

  statuses.forEach((s) => {
    const row = [
      s.name,
      icon(s.web.component),
      icon(s.web.story),
      icon(s.web.test),
      icon(s.web.figmaFile),
      icon(s.web.codeConnect),
      icon(s.web.barrel),
      icon(s.web.exported),
      icon(s.ios.component),
      icon(s.ios.figmaFile),
      icon(s.ios.codeConnect),
      icon(s.android.component),
      icon(s.android.figmaFile),
      icon(s.android.codeConnect),
    ];
    md += `| ${row.join(" | ")} |\n`;
  });

  md += "\n## Summary\n";
  md += summaryLines(statuses)
    .map((line) => `- ${line}`)
    .join("\n");
  md += "\n";

  return md;
}

async function formatMarkdown(markdown: string): Promise<string> {
  const config = (await prettier.resolveConfig(STATUS_PATH)) ?? {};

  return prettier.format(markdown, {
    ...config,
    parser: "markdown",
  });
}

function printSummary(statuses: ComponentStatus[]) {
  console.log("\n📊 Summary:");
  summaryLines(statuses).forEach((line) => console.log(line));
}

function summaryLines(statuses: ComponentStatus[]): string[] {
  const total = statuses.length;
  const count = (selector: (status: ComponentStatus) => boolean) =>
    statuses.filter(selector).length;

  return [
    `Web components: ${count((s) => s.web.component)}/${total}`,
    `Web stories: ${count((s) => s.web.story)}/${total}`,
    `Web tests: ${count((s) => s.web.test)}/${total}`,
    `Web Code Connect files: ${count((s) => s.web.figmaFile)}/${total}`,
    `Web Code Connect scaffolds: ${count((s) => s.web.figmaFile && !s.web.codeConnect)}/${total}`,
    `Web Code Connect linked: ${count((s) => s.web.codeConnect)}/${total}`,
    `iOS components: ${count((s) => s.ios.component)}/${total}`,
    `iOS Code Connect files: ${count((s) => s.ios.figmaFile)}/${total}`,
    `iOS Code Connect scaffolds: ${count((s) => s.ios.figmaFile && !s.ios.codeConnect)}/${total}`,
    `iOS Code Connect linked: ${count((s) => s.ios.codeConnect)}/${total}`,
    `Android components: ${count((s) => s.android.component)}/${total}`,
    `Android Code Connect files: ${count((s) => s.android.figmaFile)}/${total}`,
    `Android Code Connect scaffolds: ${count((s) => s.android.figmaFile && !s.android.codeConnect)}/${total}`,
    `Android Code Connect linked: ${count((s) => s.android.codeConnect)}/${total}`,
  ];
}

function icon(bool: boolean): string {
  return bool ? "✅" : "❌";
}

runCheck();
