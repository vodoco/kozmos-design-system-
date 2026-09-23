/* eslint-disable @typescript-eslint/no-require-imports */
const test = require("node:test");
const assert = require("node:assert/strict");
const postcss = require("postcss");
const plugin = require("./scoped-css.cjs");
const compile = async (css) =>
  (await postcss([plugin()]).process(css, { from: undefined })).root;

test("tokens and owned recipes work without scope; legacy utilities remain bounded", async () => {
  const root = await compile(
    ':root {--surface:white} [data-theme="dark"] {--surface:black} .bg-background {background:var(--surface)} @kozmos-owned {.kozmos-input {background:var(--surface)}}',
  );
  const owned = [];
  root.walkRules(".kozmos-input", (r) => owned.push(r));
  assert.equal(owned.length, 1);
  assert.equal(owned[0].parent, root);
  const legacy = [];
  root.walkRules(":scope .bg-background", (r) => legacy.push(r));
  assert.equal(legacy[0].parent.name, "scope");
  root.walkAtRules("scope", (r) => r.remove());
  assert.match(root.toString(), /\[data-kozmos-root\] \{--surface:white\}/);
  assert.match(
    root.toString(),
    /\[data-kozmos-root\]\[data-theme="dark"\] \{--surface:black\}/,
  );
  assert.doesNotMatch(root.toString(), /:root|@kozmos-owned|\.bg-background/);
});

test("each keyframe is named exactly once and references agree after moving", async () => {
  const root = await compile(
    "@keyframes enter {from {opacity:0} to {opacity:1}} @keyframes exit {to {opacity:0}} .animate {animation:enter 1s} @kozmos-owned {.kozmos-popover {animation-name:exit} @keyframes spin {to {transform:rotate(360deg)}} .kozmos-loader {animation:spin 1s linear infinite}}",
  );
  const names = [];
  root.walkAtRules(/keyframes$/, (r) => {
    names.push(r.params);
    assert.equal(r.parent, root);
  });
  assert.deepEqual(names.sort(), [
    "kozmos-enter",
    "kozmos-exit",
    "kozmos-spin",
  ]);
  root.walkDecls(/animation/, (d) =>
    assert.match(d.value, /^kozmos-(enter|exit|spin)/),
  );
});

test("conditioned keyframes keep their media condition", async () => {
  const root = await compile(
    "@media (prefers-reduced-motion: no-preference) {@keyframes appear {to {opacity:1}}}",
  );
  root.walkAtRules("keyframes", (r) => {
    assert.equal(r.parent.name, "media");
    assert.equal(r.params, "kozmos-appear");
  });
});

test("Tailwind defaults are initialized only on owned elements outside scope", async () => {
  const root = await compile(
    "*,\n::before,\n::after {--tw-translate-x:0; --tw-ring-offset-width:0px; box-sizing:border-box}",
  );
  root.walkAtRules("scope", (r) => r.remove());
  assert.match(root.toString(), /\.kozmos-reset::before/);
  assert.match(root.toString(), /--tw-ring-offset-width:0px/);
  assert.doesNotMatch(root.toString(), /box-sizing/);
});

test("legacy compiler defaults cannot reset owned transform and ring variables", async () => {
  const root = await compile(
    "*,::before,::after {--tw-translate-y:0;--tw-ring-offset-width:0px}",
  );
  const scope = root.nodes.find(
    (n) => n.type === "atrule" && n.name === "scope",
  );
  assert.deepEqual(scope.first.selectors, [
    ":scope *:not(:where(.kozmos-reset))",
    ":scope :not(:where(.kozmos-reset))::before",
    ":scope :not(:where(.kozmos-reset))::after",
  ]);
});

test("owned CSS rejects a native scope dependency", async () => {
  await assert.rejects(
    compile("@kozmos-owned {@scope (.root) {.kozmos-input {color:red}}}"),
    /must not depend on @scope/,
  );
});

test("legacy preflight excludes owned targets, including pseudo-elements, but utilities do not", async () => {
  const root = postcss.parse(
    "input, textarea::placeholder {padding:0} .p-4 {padding:1rem}",
  );
  root.first.raws.tailwind = { layer: "base" };
  const result = (await postcss([plugin()]).process(root, { from: undefined }))
    .css;
  assert.match(result, /input:not\(:where\(\.kozmos-reset\)\)/);
  assert.match(result, /textarea:not\(:where\(\.kozmos-reset\)\)::placeholder/);
  assert.match(result, /:scope \.p-4 \{padding:1rem\}/);
  assert.match(
    result,
    /:where\(:scope input:not\(:where\(\.kozmos-reset\)\)\)/,
  );
});
