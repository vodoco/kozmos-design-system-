import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { gzipSync } from "zlib";

// Raw is the coarse guard; gzip is what consumers actually download, so it is
// the tighter of the two on purpose. The raw ceiling was set when the library
// had 79 components — the Product / SDK wave took it to 97, including several
// expensive ones (ColorPicker, DatePicker, DateRangePicker, Combobox,
// MultiSelect), and the ESM bundle went from 128.80 KB to 254.07 KB. Gzip moved
// 26.15 KB -> 51.06 KB, still well inside its own budget, so the ceiling is
// raised rather than the delivery guarantee weakened.
//
// If this is hit again, prefer subpath exports over another bump: a single
// entry point means every consumer pays for ColorPicker whether or not they
// import it.
const MAX_RAW_SIZE_KB = 300;
const MAX_GZIP_SIZE_KB = 70;
const REACT_PKG_DIR = path.resolve(__dirname, "../../packages/react");
const DIST_FILE = path.resolve(REACT_PKG_DIR, "dist/kozmos-react.mjs");

console.log(
  "🔄 Building @kozmos/react and its dependencies for performance analysis...",
);
try {
  // We use turbo to ensure transitive dependencies like @kozmos/tokens are generated first
  execSync("ANALYZE=true pnpm turbo run build --filter=@kozmos/react", {
    stdio: "inherit",
  });
} catch (e) {
  console.error("❌ Build failed! Bundle analysis aborted.");
  process.exit(1);
}

if (!fs.existsSync(DIST_FILE)) {
  console.error(`❌ Output file not found: ${DIST_FILE}`);
  process.exit(1);
}

const stats = fs.statSync(DIST_FILE);
const sizeKB = stats.size / 1024;
const gzipKB = gzipSync(fs.readFileSync(DIST_FILE)).length / 1024;

console.log(`\n📊 Bundle Size Analysis:`);
console.log(`---------------------------------`);
console.log(
  `Raw:    ${sizeKB.toFixed(2)} KB / ${MAX_RAW_SIZE_KB.toFixed(2)} KB`,
);
console.log(
  `Gzip:   ${gzipKB.toFixed(2)} KB / ${MAX_GZIP_SIZE_KB.toFixed(2)} KB`,
);
console.log(`---------------------------------`);

if (sizeKB > MAX_RAW_SIZE_KB || gzipKB > MAX_GZIP_SIZE_KB) {
  console.error(
    `❌ ERROR: Bundle size exceeds the configured budget. Consider subpath exports, lazy entry points, or removing heavy dependencies.`,
  );
  process.exit(1);
} else {
  console.log(`✅ SUCCESS: Bundle size is within budget.`);
}
