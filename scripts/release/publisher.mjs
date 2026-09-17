import assert from "node:assert/strict";
import semver from "semver";

// All registry reads complete before the first irreversible write. Dependencies
// publish before dependants. Reruns accept only byte-identical existing versions.
export async function preparePublication(
  entries,
  workspaceNames,
  getPackage,
  tag = "next",
) {
  const selected = new Map(entries.map((entry) => [entry.name, entry]));
  const registry = new Map();
  const lookup = async (name) => {
    if (!registry.has(name)) registry.set(name, await getPackage(name));
    return registry.get(name);
  };
  for (const entry of entries) {
    const existing = (await lookup(entry.name))?.versions?.[entry.version];
    if (existing)
      assert.equal(
        existing.dist?.integrity,
        entry.integrity,
        `${entry.name}@${entry.version} already exists with different bytes; do not overwrite or retag it`,
      );
    entry.alreadyPublished = Boolean(existing);
    if (existing)
      assert.equal(
        (await lookup(entry.name))["dist-tags"]?.[tag],
        entry.version,
        "Registry tag differs; inspect before publishing any package",
      );
  }
  const ordered = [];
  const visiting = new Set();
  const visited = new Set();
  const visit = async (entry) => {
    if (visited.has(entry.name)) return;
    assert.ok(
      !visiting.has(entry.name),
      "Cyclic internal release dependencies require a separate release plan",
    );
    visiting.add(entry.name);
    const dependencies = {
      ...entry.manifest.peerDependencies,
      ...entry.manifest.optionalDependencies,
      ...entry.manifest.dependencies,
    };
    for (const [name, range] of Object.entries(dependencies)) {
      if (!workspaceNames.has(name)) continue;
      assert.ok(
        semver.validRange(range),
        `Invalid packed dependency: ${name}@${range}`,
      );
      const dependency = selected.get(name);
      if (dependency) {
        assert.ok(
          semver.satisfies(dependency.version, range),
          `Planned ${name} does not satisfy ${range}`,
        );
        await visit(dependency);
      } else {
        const published = await lookup(name);
        assert.ok(
          semver.maxSatisfying(Object.keys(published?.versions ?? {}), range),
          `Unpublished internal dependency: ${name}@${range}`,
        );
      }
    }
    visiting.delete(entry.name);
    visited.add(entry.name);
    ordered.push(entry);
  };
  for (const entry of entries) await visit(entry);
  return ordered;
}

export async function publishPrepared(entries, tag, publish, getPackage) {
  for (const entry of entries) {
    if (!entry.alreadyPublished) await publish(entry, tag);
    const registered = await getPackage(entry.name);
    assert.equal(
      registered?.versions?.[entry.version]?.dist?.integrity,
      entry.integrity,
      "Published bytes could not be confirmed; stop and inspect the registry",
    );
    assert.equal(
      registered?.["dist-tags"]?.[tag],
      entry.version,
      "Registry tag differs; do not retag automatically",
    );
  }
}
