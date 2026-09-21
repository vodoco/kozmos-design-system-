/**
 * The Kozmos components an example imports, read from its source text. Type
 * imports are left out: they name shapes, not parts on the page.
 */
const importStatement =
  /import\s+(type\s+)?\{([^}]*)\}\s+from\s+["']@kozmos\/react["']/g;

export function kozmosImports(source: string): string[] {
  const names = new Set<string>();
  for (const match of source.matchAll(importStatement)) {
    if (match[1]) continue;
    for (const specifier of match[2].split(",")) {
      const trimmed = specifier.trim();
      if (!trimmed || trimmed.startsWith("type ")) continue;
      const name = trimmed.split(/\s+as\s+/)[0].trim();
      if (name) names.add(name);
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}
