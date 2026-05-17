import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const MAX_SIZE_KB = 50; // Hard budget for the base React package
const REACT_PKG_DIR = path.resolve(__dirname, '../../packages/react');
const DIST_FILE = path.resolve(REACT_PKG_DIR, 'dist/kozmos-react.es.js');

console.log('🔄 Building @kozmos/react and its dependencies for performance analysis...');
try {
  // We use turbo to ensure transitive dependencies like @kozmos/tokens are generated first
  execSync('ANALYZE=true pnpm turbo run build --filter=@kozmos/react', { stdio: 'inherit' });
} catch (e) {
  console.error('❌ Build failed! Bundle analysis aborted.');
  process.exit(1);
}

if (!fs.existsSync(DIST_FILE)) {
    console.error(`❌ Output file not found: ${DIST_FILE}`);
    process.exit(1);
}

const stats = fs.statSync(DIST_FILE);
const sizeKB = stats.size / 1024;

console.log(`\n📊 Bundle Size Analysis:`);
console.log(`---------------------------------`);
console.log(`Actual: ${sizeKB.toFixed(2)} KB`);
console.log(`Budget: ${MAX_SIZE_KB.toFixed(2)} KB`);
console.log(`---------------------------------`);

if (sizeKB > MAX_SIZE_KB) {
  console.error(`❌ ERROR: Bundle size exceeds the ${MAX_SIZE_KB}KB limit! Consider treeshaking or removing heavy dependencies.`);
  process.exit(1);
} else {
  console.log(`✅ SUCCESS: Bundle size is securely under the ${MAX_SIZE_KB}KB budget. Excellent work.`);
}
