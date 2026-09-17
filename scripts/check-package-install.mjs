/**
 * Install every published package the way a stranger would, and use it.
 *
 * Nothing else here tests what npm will actually hand people. The build can
 * pass, the types can check and every gate can be green while the tarball is
 * wrong: #27 put 92 `*.figma.d.ts` files into @kozmos/react's dist, and
 * `files: ["dist"]` would have published them — found only by counting dist.
 * An `exports` map is sharper still: a path it does not list simply stops
 * resolving, for everyone outside the repo and for nobody inside it.
 *
 * So this packs each package with pnpm, which rewrites `workspace:*` to real
 * versions exactly as a publish does, and reads what is in each tarball. It
 * installs all of them together into an empty project with plain npm, then
 * resolves every export, requires every CommonJS entry, renders a component on
 * the server, and type-checks every code sample in every README against the
 * installed types — so a README cannot promise an import that does not work.
 *
 * It reads packages/* for anything not marked private rather than naming
 * packages, so a new one is checked the day it appears, and one that must not
 * ship has to say so in its own package.json.
 *
 * It needs built packages and the network: run
 * `pnpm --filter "@kozmos/react..." build` first.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const PACKAGES = path.join(ROOT, "packages");
const problems = [];
const ok = (m) => console.log(`  ok    ${m}`);
const fail = (m) => {
  problems.push(m);
  console.log(`  FAIL  ${m}`);
};

// A tarball is what strangers get. None of these belong in it.
const FORBIDDEN = [
  [/\.figma\.[cm]?[jt]sx?$|\.figma\.d\.ts$/, "a Code Connect file"],
  [/\.(test|spec)\.[cm]?[jt]sx?$|\.(test|spec)\.d\.ts$/, "a test"],
  [/\.stories\.[cm]?[jt]sx?$|\.stories\.d\.ts$/, "a story"],
  [/^package\/src\//, "source"],
  [/__tests__\//, "a test directory"],
  [/(^|\/)\.env/, "an env file"],
  [/(^|\/)tsconfig[^/]*\.json$/, "a tsconfig"],
];

function run(cmd, args, cwd) {
  return execFileSync(cmd, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, npm_config_update_notifier: "false" },
  });
}

function finish() {
  console.log(
    `\n${problems.length === 0 ? "ok    every package installs and works from its tarball" : `${problems.length} problem(s)`}`,
  );
  process.exit(problems.length === 0 ? 0 : 1);
}

console.log("Packages, installed from their tarballs\n");

const publishable = fs
  .readdirSync(PACKAGES, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(PACKAGES, entry.name))
  .filter((dir) => fs.existsSync(path.join(dir, "package.json")))
  .map((dir) => ({
    dir,
    manifest: JSON.parse(
      fs.readFileSync(path.join(dir, "package.json"), "utf8"),
    ),
  }))
  .filter(({ manifest }) => manifest.name && manifest.private !== true);

ok(
  `publishable: ${publishable.map(({ manifest }) => manifest.name).join(", ")}`,
);

// ---- before packing: what npm copies from the package directory itself ----

const rootLicense = path.join(ROOT, "LICENSE");
const licenseText = fs.existsSync(rootLicense)
  ? fs.readFileSync(rootLicense, "utf8")
  : null;
if (!licenseText) {
  fail(
    "there is no LICENSE at the repository root to hold the packages' copies to",
  );
}

for (const { dir, manifest } of publishable) {
  const name = manifest.name;
  if (!fs.existsSync(path.join(dir, "dist"))) {
    fail(`${name} has no dist — build before running this check`);
  }
  if (manifest.license !== "MIT") {
    fail(
      `${name} declares license ${JSON.stringify(manifest.license)}, not "MIT"`,
    );
  }
  if (!fs.existsSync(path.join(dir, "README.md"))) {
    fail(`${name} has no README.md, so its npm page would be blank`);
  }
  // npm includes a LICENSE from the package's own directory, never from the
  // monorepo root, so without a copy here the tarball carries no licence text.
  const own = path.join(dir, "LICENSE");
  if (!fs.existsSync(own)) {
    fail(
      `${name} has no LICENSE of its own, so its tarball would ship without one`,
    );
  } else if (licenseText && fs.readFileSync(own, "utf8") !== licenseText) {
    fail(`${name}/LICENSE differs from the root LICENSE`);
  }
}

if (problems.length > 0) finish();

// ---- pack ----

const work = fs.mkdtempSync(path.join(os.tmpdir(), "kozmos-install-"));
const tarballs = path.join(work, "tarballs");
fs.mkdirSync(tarballs);

const packed = [];
for (const { dir, manifest } of publishable) {
  const before = new Set(fs.readdirSync(tarballs));
  try {
    run("pnpm", ["pack", "--pack-destination", tarballs], dir);
  } catch (error) {
    fail(
      `${manifest.name} did not pack: ${String(error.stderr || error)
        .trim()
        .split("\n")
        .pop()}`,
    );
    continue;
  }
  const problemsBefore = problems.length;
  const file = fs.readdirSync(tarballs).find((f) => !before.has(f));
  const tarball = path.join(tarballs, file);
  const files = run("tar", ["-tzf", tarball], work).split("\n").filter(Boolean);

  for (const required of [
    "package/package.json",
    "package/README.md",
    "package/LICENSE",
  ]) {
    if (!files.includes(required)) {
      fail(
        `${manifest.name}'s tarball has no ${required.slice("package/".length)}`,
      );
    }
  }
  const leaked = [];
  for (const entry of files) {
    for (const [pattern, what] of FORBIDDEN) {
      if (pattern.test(entry)) leaked.push(`${entry} (${what})`);
    }
  }
  if (leaked.length > 0) {
    fail(
      `${manifest.name}'s tarball carries ${leaked.length} file(s) that should not ship, e.g. ${leaked.slice(0, 3).join(", ")}`,
    );
  }
  const packedManifest = run(
    "tar",
    ["-xzOf", tarball, "package/package.json"],
    work,
  );
  if (packedManifest.includes("workspace:")) {
    fail(
      `${manifest.name}'s packed package.json still says workspace:, which npm cannot install`,
    );
  }
  packed.push({ manifest, tarball, files });
  if (problems.length === problemsBefore) {
    ok(
      `${manifest.name} packs: ${files.length} file(s), nothing that should not ship`,
    );
  }
}

if (problems.length > 0) finish();

// ---- install into a project that has never seen the repo ----

const app = path.join(work, "app");
fs.mkdirSync(app);
fs.writeFileSync(
  path.join(app, "package.json"),
  JSON.stringify(
    { name: "kozmos-install-check", private: true, type: "module" },
    null,
    2,
  ),
);

const react = JSON.parse(
  fs.readFileSync(path.join(PACKAGES, "react", "package.json"), "utf8"),
);
const lucide = react.dependencies["lucide-react"];

try {
  run(
    "npm",
    [
      "install",
      "--no-audit",
      "--no-fund",
      "--ignore-scripts",
      "--loglevel=error",
      ...packed.map(({ tarball }) => tarball),
      "react@19",
      "react-dom@19",
      `lucide-react@${lucide}`,
      "typescript@5",
      "@types/react@19",
      "@types/react-dom@19",
    ],
    app,
  );
  ok("all packages install together with npm into an empty project");
} catch (error) {
  fail(
    `npm install failed: ${String(error.stderr || error)
      .trim()
      .split("\n")
      .slice(-3)
      .join(" / ")}`,
  );
  finish();
}

// ---- use it: every export resolves, every require works, a component renders ----

const specifiers = [];
for (const { manifest, files } of packed) {
  for (const [key, target] of Object.entries(manifest.exports ?? {})) {
    if (!key.includes("*")) {
      specifiers.push(
        key === "." ? manifest.name : `${manifest.name}${key.slice(1)}`,
      );
      continue;
    }
    // A pattern export: prove it with a real file it should reach.
    const targetPrefix = `package/${String(target).replace(/^\.\//, "").split("*")[0]}`;
    const sample = files.find((f) => f.startsWith(targetPrefix));
    if (sample) {
      const rest = sample.slice(targetPrefix.length);
      specifiers.push(`${manifest.name}${key.slice(1).replace("*", rest)}`);
    }
  }
}
// And whatever a README tells people to import, which the map must also reach:
// a README promising `@kozmos/react/style.css` after the map dropped it would
// otherwise pass, because a `*.css` declaration types any CSS import at all.
for (const { manifest } of packed) {
  const readme = fs.readFileSync(
    path.join(PACKAGES, manifest.name.split("/")[1], "README.md"),
    "utf8",
  );
  for (const block of readme.matchAll(/```(?:tsx?|css)\n([\s\S]*?)```/g)) {
    for (const found of block[1].matchAll(
      /(?:from\s+|import\s+|@import\s+)["'](@kozmos\/[^"']+)["']/g,
    )) {
      if (!specifiers.includes(found[1])) specifiers.push(found[1]);
    }
  }
}

const requirable = packed
  .filter(({ manifest }) => manifest.exports?.["."]?.require)
  .map(({ manifest }) => manifest.name);

fs.writeFileSync(
  path.join(app, "probe.mjs"),
  `import fs from "node:fs";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const results = [];

for (const spec of ${JSON.stringify(specifiers)}) {
  try {
    const url = import.meta.resolve(spec);
    results.push([fs.existsSync(new URL(url)), "resolves " + spec]);
  } catch (error) {
    results.push([false, "resolves " + spec + " — " + error.message]);
  }
}

for (const name of ${JSON.stringify(requirable)}) {
  try {
    const mod = require(name);
    results.push([Object.keys(mod).length > 0, "require(" + name + ") returns its exports"]);
  } catch (error) {
    results.push([false, "require(" + name + ") — " + error.message]);
  }
}

console.warn = () => {};
const kozmos = await import("@kozmos/react");
const html = renderToStaticMarkup(
  createElement(kozmos.Button, { emotion: "success" }, createElement(kozmos.Icon, { name: "check" }), "Save"),
);
results.push([html.includes("<button") && html.includes("Save") && html.includes("<svg"), "renders a Button with an Icon on the server"]);

process.stdout.write(JSON.stringify(results));
`,
);

try {
  const results = JSON.parse(run("node", ["probe.mjs"], app));
  const failed = results.filter(([passed]) => !passed);
  for (const [, what] of failed) fail(what);
  if (failed.length === 0) {
    ok(
      `${specifiers.length} export(s) resolve, ${requirable.length} CommonJS entr(y/ies) load, and a Button renders on the server`,
    );
  }
} catch (error) {
  fail(
    `the probe crashed: ${String(error.stderr || error)
      .trim()
      .split("\n")
      .slice(0, 3)
      .join(" / ")}`,
  );
}

// ---- every README sample type-checks against what was installed ----

const samples = path.join(app, "readme");
fs.mkdirSync(samples);
let count = 0;
for (const { manifest } of packed) {
  const readme = path.join(PACKAGES, manifest.name.split("/")[1], "README.md");
  const text = fs.readFileSync(readme, "utf8");
  for (const match of text.matchAll(/```(tsx?|ts)\n([\s\S]*?)```/g)) {
    count += 1;
    const ext = match[1] === "tsx" ? "tsx" : "ts";
    const body = match[2];
    // Every sample is its own module, as it would be in an app.
    fs.writeFileSync(
      path.join(samples, `${manifest.name.split("/")[1]}-${count}.${ext}`),
      `${body}\nexport {};\n`,
    );
  }
}
// What a README sample leaves to the reader: the app it wraps, and where
// analytics events go. And what a bundler provides: a type for CSS imports.
fs.writeFileSync(
  path.join(samples, "reader.d.ts"),
  `declare const app: import("react").ReactNode;
declare function send(events: unknown[]): void;
declare module "*.css";
`,
);
fs.writeFileSync(
  path.join(app, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        strict: true,
        noEmit: true,
        jsx: "react-jsx",
        module: "esnext",
        moduleResolution: "bundler",
        target: "es2022",
        skipLibCheck: true,
        allowUnusedLabels: false,
      },
      include: ["readme"],
    },
    null,
    2,
  ),
);
try {
  run(
    path.join(app, "node_modules", ".bin", "tsc"),
    ["-p", "tsconfig.json"],
    app,
  );
  ok(
    `${count} README code sample(s) type-check against the installed packages`,
  );
} catch (error) {
  const lines = String(error.stdout || error.stderr || error)
    .trim()
    .split("\n")
    .filter((line) => line.includes("error TS"))
    .slice(0, 5);
  fail(
    `README samples do not type-check:\n          ${lines.join("\n          ")}`,
  );
}

if (problems.length === 0) {
  fs.rmSync(work, { recursive: true, force: true });
} else {
  console.log(`\n  The install is kept for inspection at ${work}`);
}
finish();
