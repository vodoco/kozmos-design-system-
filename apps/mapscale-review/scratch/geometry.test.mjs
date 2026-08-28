/**
 * The map shell's geometry engines, under test — MAP-566.
 *
 * Twelve of them now — SPLIT, SNAP, GUIDE, COMBINE, SQUARE, FOCUS, BOX, EDGE, PATHS, REACH and the
 * two behind the GeoJSON floor render. All of them live inside `public/map/index.html` between
 * marker comments and are extracted from it rather than copied here, so what is tested is what
 * ships.
 *
 * ⚠️ **Two of the checks here are not about arithmetic at all** — they are about whether the shell
 * EVALUATES, because nothing else in this repo asks that question (trap 3: `public/map/index.html`
 * is checked by nothing, and `node --check` cannot see a temporal dead zone). They run before the
 * engines: a static read-before-declaration pass over the whole script body, and a probe that
 * evaluates the extracted blocks in the browser's own file order. Both exist because the shell once
 * shipped dead while 582 checks passed.
 *
 * `public/map/index.html` is a script tag, not a module, so there is nothing to import. Rather than
 * copy the algorithm here — where it would rot the moment somebody fixed a bug in the real one —
 * this extracts the code BETWEEN THE MARKERS out of that file, writes it out as a module, and
 * imports it. The code under test is therefore literally the code that ships; delete the markers
 * and this fails loudly rather than quietly testing a stale copy.
 *
 *     node scratch/geometry.test.mjs
 *
 * Plain screen-space arithmetic throughout, so no map, no DOM, no browser.
 */
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
// The parser only — `tsc` already ships with this app, and its parser reads plain JS. Nothing here
// type-checks anything; it is used to find out WHERE things are declared and WHERE they are read.
import ts from "typescript";

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, "..", "public", "map", "index.html"), "utf8");

/** Every marker-delimited engine in the map shell, in the order they must be defined. */
const BLOCKS = ["INK",
                "SPLIT-ENGINE", "SNAP-ENGINE", "GUIDE-ENGINE", "COMBINE-ENGINE", "SQUARE-ENGINE",
                "FOCUS-ENGINE",
                "BOX-ENGINE",
                "GJRENDER-ENGINE", "GJSWAP-ENGINE",
                "EDGE-ENGINE", "PATHS-ENGINE", "REACH-ENGINE",
                "PREVIEW-ENGINE", "FPSRC-ENGINE"];
const found = BLOCKS.map((name) => {
  const from = src.indexOf(`/* ${name}-START`);
  const to = src.indexOf(`/* ${name}-END */`);
  if (from < 0 || to < 0) {
    console.error(`could not find the ${name} markers in public/map/index.html`);
    process.exit(1);
  }
  return { name, from, body: src.slice(src.indexOf("*/", from) + 2, to) };
});

/**
 * BLOCKS is ordered by DEPENDENCY, not by position in the file, and that is deliberate — the
 * generated module has to evaluate. But the browser evaluates the file in FILE order, so a module
 * that is fine here can still be a shell that dies on load. `fileOrdered` below is the same blocks
 * concatenated the way the browser meets them, and it is imported purely to prove it evaluates.
 *
 * ⚠️ **This exists because the harness once passed while the shipped file was broken.** On
 * 2026-08-18 `EDIT_INK` was hoisted into its own block and listed FIRST in BLOCKS, while in the
 * file it still sat below `WF_COLOUR`, which reads it. 582 checks passed; the real page threw
 * `Cannot access 'EDIT_INK' before initialization` at evaluation, the whole shell died, and nothing
 * on the map loaded. `node --check` cannot see it either — a temporal dead zone is valid syntax.
 * Only evaluating it in the browser's own order catches this class of fault.
 */
const engine = found.map((b) => b.body).join("\n");
const fileOrdered = [...found].sort((a, b) => a.from - b.from).map((b) => b.body).join("\n");

/**
 * The shell's globals, stubbed, for the one block that is not pure — `GJSWAP-ENGINE`, the render
 * swap, which drives the map object itself.
 *
 * Everything here is declared in `public/map/index.html` too, somewhere the extraction does not
 * reach. ⚠️ **The soft spot in this harness**: a global the swap starts using that is not listed
 * here makes the generated module fail to evaluate, which is loud — but a global whose *behaviour*
 * differs from the real one is a fiction the tests would happily agree with. Keep these thin, and
 * keep them honest.
 */
const PRELUDE = `
let map = null;
/**
 * ⚠️ **The editor's state, which the paint expressions read.** Leaving it out of these stubs is not
 * a missing convenience: every one of these helpers wraps its body in try/catch, so an undeclared
 * global becomes a silent no-op — the map draws nothing new and says nothing about why. That is
 * precisely the failure that was reported twice as "the highlight isn't working".
 */
let GEOM = null;
/* The connection the map booted with. Only its persona is read by these blocks. */
const CONN = { persona: "facilityManager" };
const TARGET = { level: 0, building: "B2", site: "S" };
const prefs = { floorplan: true, hidePoiLabels: false, geojsonFloor: true };
const FP_LAYERS = [];
const HIDDEN_FILTERS = new Map();
const POSTED = [];
function post(type, extra) { POSTED.push({ type, ...(extra || {}) }); }
// The two the swap calls back into. The real ones re-apply the label preference and rebuild the
// floor-plan outline; neither decides anything the swap's own state machine depends on.
let applyPrefsCalls = 0, addFloorplanCalls = 0;
function applyPrefs() { applyPrefsCalls++; }
function addFloorplan() { addFloorplanCalls++; }
function __setMap(m) { map = m; }
function __env() { return { TARGET, prefs, POSTED, FP_LAYERS, HIDDEN_FILTERS,
  applyPrefsCalls, addFloorplanCalls }; }
`;

/**
 * ⚠️ **Trap 2, statically — across the WHOLE file rather than the third of it that sits between
 * markers.**
 *
 * The file-order probe below evaluates the extracted blocks in the order the browser meets them,
 * which is what caught the 2026-08-18 shell death. But it can only evaluate what it can extract:
 * the marker blocks are **30.9% of the script body**, so a `const` read above its own declaration
 * anywhere in the other 69% still ships. That was measured, not assumed — inserting one such read
 * into unmarked code leaves all 582 checks passing on a shell that dies on load.
 *
 * So: parse the script body, note every top-level `const` / `let` / `class`, and walk the code that
 * runs while the script is EVALUATING — top-level statements, and the bodies of functions that are
 * immediately invoked. Function bodies that run later are skipped, because a closure reading a
 * constant declared below it is ordinary and correct.
 *
 * The two guards are complementary and both are kept: this one sees the whole file but does not
 * follow calls, and the probe follows everything but only sees the blocks.
 */
const scriptOpen = /<script(?![^>]*\bsrc=)[^>]*>/.exec(src);
const scriptFrom = scriptOpen.index + scriptOpen[0].length;
const scriptBody = src.slice(scriptFrom, src.indexOf("</script>", scriptFrom));
const shellLineAt = (off) => src.slice(0, scriptFrom + off).split("\n").length;

{
  const sf = ts.createSourceFile("shell.js", scriptBody, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);

  const bindingNames = (n, out) => {
    if (ts.isIdentifier(n)) out.push(n);
    else if (ts.isObjectBindingPattern(n) || ts.isArrayBindingPattern(n))
      for (const el of n.elements) if (ts.isBindingElement(el)) bindingNames(el.name, out);
    return out;
  };

  /** name → the offset at which it becomes readable, and the identifiers that ARE the binding. */
  const declaredAt = new Map();
  const bindings = new Set();
  for (const st of sf.statements) {
    if (ts.isVariableStatement(st)) {
      const f = st.declarationList.flags;
      // `var` hoists and initialises to undefined — no dead zone, so nothing to check.
      if (!(f & ts.NodeFlags.Const) && !(f & ts.NodeFlags.Let)) continue;
      for (const d of st.declarationList.declarations)
        for (const id of bindingNames(d.name, [])) {
          bindings.add(id);
          if (!declaredAt.has(id.text)) declaredAt.set(id.text, st.end);
        }
    } else if (ts.isClassDeclaration(st) && st.name) {
      bindings.add(st.name);
      if (!declaredAt.has(st.name.text)) declaredAt.set(st.name.text, st.end);
    }
  }

  const runsLater = (n) =>
    ts.isFunctionDeclaration(n) || ts.isFunctionExpression(n) || ts.isArrowFunction(n) ||
    ts.isMethodDeclaration(n) || ts.isGetAccessor(n) || ts.isSetAccessor(n) ||
    ts.isConstructorDeclaration(n) || ts.isClassDeclaration(n) || ts.isClassExpression(n);
  const unparen = (n) => { while (ts.isParenthesizedExpression(n)) n = n.expression; return n; };

  const dead = [];
  const walkNow = (node) => {
    if (runsLater(node)) return;
    if (ts.isIdentifier(node)) {
      if (bindings.has(node)) return;                       // the declaration itself, not a read
      const at = declaredAt.get(node.text);
      if (at !== undefined && node.getStart(sf) < at)
        dead.push({ name: node.text, off: node.getStart(sf), at });
      return;
    }
    // `a.b` reads `a`; `b` is a property name, not a binding. Same for `{ b: … }` and labels.
    if (ts.isPropertyAccessExpression(node)) return walkNow(node.expression);
    if (ts.isPropertyAssignment(node)) return walkNow(node.initializer);
    if (ts.isBindingElement(node)) return void (node.initializer && walkNow(node.initializer));
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
      const callee = unparen(node.expression);
      // an IIFE's body DOES run now, so it is the one function body worth descending into
      if (ts.isFunctionExpression(callee) || ts.isArrowFunction(callee)) walkNow(callee.body);
      else walkNow(node.expression);
      for (const a of node.arguments || []) walkNow(a);
      return;
    }
    ts.forEachChild(node, walkNow);
  };
  for (const st of sf.statements) walkNow(st);

  if (dead.length) {
    console.error(
      "the map shell reads a const/let above where it is declared — the browser would die on load:");
    for (const d of dead)
      console.error(`  '${d.name}' is read at line ${shellLineAt(d.off)} but only becomes readable ` +
                    `at line ${shellLineAt(d.at)} of public/map/index.html`);
    console.error("  Move the declaration above its first top-level use IN THE FILE.");
    process.exit(1);
  }
}

const fileOrderProbe = join(here, "geometry.fileorder.mjs");
writeFileSync(
  fileOrderProbe,
  `// GENERATED by geometry.test.mjs — the blocks in FILE order, evaluated to prove the browser's\n` +
    `// own order is sound. Do not edit, do not commit.\n${PRELUDE}\n${fileOrdered}\nexport const ok = true;\n`,
);
try {
  await import(pathToFileURL(fileOrderProbe).href);
} catch (e) {
  // ⚠️ The probe is deliberately LEFT ON DISK when it fails — it is the only readable form of the
  // browser's own evaluation order, and reading it is how you find which declaration to move.
  console.error(
    "the map shell does not evaluate in its own FILE order — the browser would die on load:\n  " +
    (e && e.message) +
    "\n  Something declared with const/let is used above where it is declared. Move the declaration up." +
    "\n  The offending order is left in scratch/geometry.fileorder.mjs — read it there.");
  process.exit(1);
}
// It passed, so there is nothing left to read: clear it the way its sibling clears itself, or it
// sits untracked in a working tree that `vercel deploy` ships whole (trap 6).
unlinkSync(fileOrderProbe);

const generated = join(here, "geometry.generated.mjs");
writeFileSync(
  generated,
  `// GENERATED by geometry.test.mjs from public/map/index.html — do not edit, do not commit.\n` +
    `${PRELUDE}\n${engine}\nexport { splitRingsByLine, ringSignedArea, ringOpen,\n` +
      `  segClosest, buildSnapIndex, snapQuery, dominantAngle, squareRings,\n` +
      `  angleGuide, alignGuides, resolveGuides, bestAngleGuide, rayIntersect,\n` +
      `  guideTolFor, GUIDE_TOLS, GUIDE_WIDE_TOLS, GUIDE_STEP_FREE, GUIDE_STEP_SNAP,\n` +
      `  findBridge, bridgeRings, combineRings,\n` +
      `  ringGap, ringSetArea, largestSet, liesBetween,\n` +
      `  focusView, focusPan, FOCUS_MARGIN,\n` +
      `  unwrapGrid, orientedBox, geomResizeCursor,\n` +
      `  flatType, sourceLayerIndex, groupBySourceLayer, cloneLayerDef,\n` +
      `  GJ, GJ_SRC, GJ_LYR, gjTick, gjTeardown, gjLive, indoorPairs, srcLayerOf,\n` +
      `  layerTypeGroup, typeHidden, applyHiddenTypes, HIDDEN_BY_TYPE,\n` +
      `  applyWayfinding, wfRemove, wfFilter, WF_NODE, WF_TRANSITION, WF_HIDE, WF_EDGE,\n` +
      `  edgeKeys, selectedEdgeCount, grabOffset, aimPoint, networkEdges, moveNetworkNode,\n` +
      `  networkComponents, networkRun, networkAdjacency, deleteNetworkNodes,\n` +
      `  unlinkNetworkNodes,\n` +
      `  wfBuildEdges, wfEnsureEdges, WF_NODES, wfPaint,\n` +
      `  wfSetEditing, wfNetworkNodes, wfHighlight, WF_R, wfNearerEnd, wfNodeAt, personaOk,\n` +
      `  featureAt, editableAt, hoverableAt,\n` +
      `  outcomeOf, outcomeInk, previewFate, setEditingChange, DECISION_INK, OVERRIDE_INK,\n` +
      `  fpMode, FP_PREFIX,\n` +
      `  LEVEL_FEATS, LEVEL_FEATS_LVL, __setMap, __env, TARGET, prefs, POSTED };\n` +
      `export function __setLevelFeats(f, lvl) { LEVEL_FEATS = f; LEVEL_FEATS_LVL = lvl; }\n` +
      `export function __setNodes(n) { WF_NODES = n; WF_EDGES = null; }\n` +
      `export function __sel(f) {\n` +
      `  GEOM = f.length ? { kind: "network", sel: new Set(f), nodes: [], net: 0 } : null;\n` +
      `  wfPaint();\n` +
      `}\n` +
      `export function __edges() { return WF_EDGES; }\n` +
      `export function __setReach(section, blocked, quiet) {\n` +
      `  SECTION_TYPE = section; BLOCKED_TYPES = blocked && new Set(blocked);\n` +
      `  QUIET_TYPES = quiet && new Set(quiet);\n` +
      `}\n` +
      `export function __setHidden(t) {\n` +
      `  HIDDEN_TYPES = t && new Set(t);\n` +
      `  HIDDEN_FLAT = t && new Set(t.map(flatType));\n` +
      `}\n`,
);

let mod;
try {
  mod = await import(pathToFileURL(generated).href);
} finally {
  unlinkSync(generated);
}
const {
  splitRingsByLine, ringSignedArea, ringOpen,
  segClosest, buildSnapIndex, snapQuery, dominantAngle, squareRings,
  angleGuide, alignGuides, resolveGuides, bestAngleGuide, rayIntersect,
  guideTolFor, GUIDE_TOLS, GUIDE_WIDE_TOLS, GUIDE_STEP_FREE, GUIDE_STEP_SNAP,
  findBridge, bridgeRings, combineRings,
  ringGap, ringSetArea, largestSet, liesBetween,
  focusView, focusPan, FOCUS_MARGIN,
  unwrapGrid, orientedBox, geomResizeCursor,
  flatType, sourceLayerIndex, groupBySourceLayer, cloneLayerDef,
  gjTick, gjTeardown, gjLive, indoorPairs, srcLayerOf,
  layerTypeGroup, typeHidden, applyHiddenTypes, HIDDEN_BY_TYPE,
  applyWayfinding, wfRemove, wfFilter, WF_NODE, WF_TRANSITION, WF_HIDE, WF_EDGE,
  edgeKeys, selectedEdgeCount, grabOffset, aimPoint, networkEdges, moveNetworkNode,
  networkComponents, networkRun, deleteNetworkNodes, unlinkNetworkNodes,
  wfBuildEdges, wfEnsureEdges, wfPaint,
  wfSetEditing, wfNetworkNodes, wfHighlight, WF_R, wfNearerEnd, personaOk,
  editableAt, hoverableAt,
  outcomeOf, outcomeInk, previewFate, setEditingChange, DECISION_INK, OVERRIDE_INK,
  fpMode, FP_PREFIX,
  __setMap, __setLevelFeats, __setHidden, __setReach, __setNodes, __sel, __edges,
  __env, TARGET, prefs, POSTED,
} = mod;

/* ── helpers ──────────────────────────────────────────────────────────────── */

let failures = 0;
let checks = 0;

function check(name, cond, detail) {
  checks++;
  if (cond) return;
  failures++;
  console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

const area = (ring) => Math.abs(ringSignedArea(ringOpen(ring)));
const areaOf = (rings) => rings.reduce((n, r) => n + area(r), 0);

/** Do two segments *properly* cross — not merely touch at a shared endpoint? */
function segsCross(p1, p2, p3, p4) {
  const d = (a, b, c) =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2);
  const d3 = d(p1, p2, p3), d4 = d(p1, p2, p4);
  const E = 1e-9;
  // Touching counts as collinear-or-through-an-endpoint, which rings do legitimately: a bridge
  // jamb lands exactly on a corner, and `bridgeRings` closes back onto its own first point.
  if (Math.abs(d1) < E || Math.abs(d2) < E || Math.abs(d3) < E || Math.abs(d4) < E) return false;
  return d1 > 0 !== d2 > 0 && d3 > 0 !== d4 > 0;
}

/**
 * ⚠️ **Does this ring's boundary cross itself?**
 *
 * The check the suite did not have, and the one that matters most for Combine: a bridge walked the
 * wrong way round produces a ring with the right area, the right point count and a perfectly
 * well-formed look — and renders as a self-crossing mess. `wellFormed` would pass it, every area
 * assertion would pass it, and only a human looking at the map would ever have caught it.
 *
 * O(n²) and only ever run over test shapes, so the naive pair scan is the right one.
 */
function selfIntersects(ring) {
  const r = ringOpen(ring);
  const n = r.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue; // the closing pair shares a vertex by construction
      if (segsCross(r[i], r[(i + 1) % n], r[j], r[(j + 1) % n]))
        return `segments ${i} and ${j} cross`;
    }
  }
  return null;
}

/** Is this a ring anyone can trust? Closed, at least a triangle, no repeated neighbours. */
function wellFormed(ring) {
  if (ring.length < 4) return "fewer than 3 distinct points";
  const first = ring[0], last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) return "not closed";
  for (const [x, y] of ring) if (!Number.isFinite(x) || !Number.isFinite(y)) return "non-finite point";
  const open = ringOpen(ring);
  for (let i = 0; i < open.length; i++) {
    const p = open[i], q = open[(i + 1) % open.length];
    if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-9) return `repeated point at ${i}`;
  }
  if (Math.abs(ringSignedArea(open)) < 1e-9) return "zero area";
  return null;
}

/**
 * The invariants every successful cut must satisfy, whatever the shape:
 * both halves exist, every ring is well formed, and the pieces add back up to the original.
 */
function expectSplit(name, rings, a, b, { leftRings, rightRings }) {
  const res = splitRingsByLine(rings, a, b);
  if (!res.ok) {
    check(name, false, `expected a split, was refused with "${res.reason}"`);
    return null;
  }
  check(`${name} · left ring count`, res.left.length === leftRings,
        `expected ${leftRings}, got ${res.left.length}`);
  check(`${name} · right ring count`, res.right.length === rightRings,
        `expected ${rightRings}, got ${res.right.length}`);
  for (const [side, list] of [["left", res.left], ["right", res.right]]) {
    list.forEach((r, i) => {
      const bad = wellFormed(r);
      check(`${name} · ${side}[${i}] well formed`, !bad, bad || "");
    });
  }
  // Area is the honest check: a cut neither creates nor destroys floor.
  const before = areaOf(rings);
  const after = areaOf(res.left) + areaOf(res.right);
  check(`${name} · area conserved`, Math.abs(before - after) < before * 1e-9,
        `before ${before.toFixed(6)}, after ${after.toFixed(6)}`);
  // Provenance: the caller needs to know which input ring each piece came from to keep track of
  // what is new, and it cannot recover that from two flattened lists.
  check(`${name} · every piece says where it came from`,
        res.leftFrom.length === res.left.length &&
          res.rightFrom.length === res.right.length &&
          [...res.leftFrom, ...res.rightFrom].every((j) => j >= 0 && j < rings.length),
        `leftFrom ${JSON.stringify(res.leftFrom)}, rightFrom ${JSON.stringify(res.rightFrom)}`);
  check(`${name} · every input ring is accounted for`,
        rings.every((_, j) => typeof res.wasCut[j] === "boolean" &&
                              [...res.leftFrom, ...res.rightFrom].includes(j)),
        `wasCut ${JSON.stringify(res.wasCut)}`);
  return res;
}

function expectNoSplit(name, rings, a, b, reason) {
  const res = splitRingsByLine(rings, a, b);
  check(name, !res.ok && res.reason === reason,
        res.ok ? `split into ${res.left.length}/${res.right.length}` : `refused with "${res.reason}"`);
}

const close = (pts) => [...pts.map((p) => p.slice()), pts[0].slice()];

/* ── the shapes ───────────────────────────────────────────────────────────── */

// A plain 10×10 room.
const SQUARE = close([[0, 0], [10, 0], [10, 10], [0, 10]]);

// A U, opening upward: arms at x∈[0,3] and x∈[7,10], joined by a base at y∈[0,3].
// The shape MAP-566 called out by name — a horizontal cut across both arms must give three pieces.
const U = close([
  [0, 0], [10, 0], [10, 10], [7, 10], [7, 3], [3, 3], [3, 10], [0, 10],
]);

// An L.
const L = close([[0, 0], [10, 0], [10, 4], [4, 4], [4, 10], [0, 10]]);

// A comb with three teeth — six crossings' worth of concavity, to push the chord pairing.
const COMB = close([
  [0, 0], [12, 0], [12, 10], [10, 10], [10, 4], [8, 4], [8, 10],
  [6, 10], [6, 4], [4, 4], [4, 10], [2, 10], [2, 4], [0, 4],
]);

console.log("split engine");

/* 1. The easy one, and the one a convex-only implementation also gets right. */
expectSplit("square, cut across the middle", [SQUARE], [-5, 5], [15, 5],
            { leftRings: 1, rightRings: 1 });

/* 2. Diagonal — the cut hits two edges at an angle, not at right angles. */
expectSplit("square, diagonal cut", [SQUARE], [-5, -4], [15, 6],
            { leftRings: 1, rightRings: 1 });

/* 3. The recorded bar: a concave U cut across BOTH arms. Four crossings, two chords. Above the cut
      the arms are two separate pieces; below it the base is one. A convex-only implementation
      joins the arm tips through thin air and mangles the floor — this is the case that catches it. */
{
  const res = expectSplit("U, cut across both arms", [U], [-5, 6], [15, 6],
                          { leftRings: 2, rightRings: 1 });
  if (res) {
    // The two upper pieces must be the arm TIPS: 3 wide, 4 tall.
    const tips = res.left.map(area).sort((x, y) => x - y);
    check("U · arm tips are 3×4", tips.every((t) => Math.abs(t - 12) < 1e-9),
          `got ${tips.map((t) => t.toFixed(3)).join(", ")}`);
    // …and nothing spans the gap between them.
    for (const r of res.left) {
      const xs = ringOpen(r).map((p) => p[0]);
      const span = Math.max(...xs) - Math.min(...xs);
      check("U · no piece spans the gap", span <= 3 + 1e-9, `span ${span.toFixed(3)}`);
    }
  }
}

/* 4. The same U, cut low enough to miss the arms — one crossing pair, two ordinary pieces. */
expectSplit("U, cut below the arms", [U], [-5, 1.5], [15, 1.5],
            { leftRings: 1, rightRings: 1 });

/* 5. A vertical cut down the U's left arm. */
expectSplit("U, cut down one arm", [U], [1.5, -5], [1.5, 15],
            { leftRings: 1, rightRings: 1 });

/* 6. L, cut either way through the reflex corner region. */
expectSplit("L, horizontal cut", [L], [-5, 2], [15, 2], { leftRings: 1, rightRings: 1 });
expectSplit("L, vertical cut", [L], [2, -5], [2, 15], { leftRings: 1, rightRings: 1 });

/* 7. Three teeth: a cut across all of them yields three tips on one side, the spine on the other.
      Six crossings, three chords — the pairing has to get every one of them right. */
{
  const res = expectSplit("comb, cut across all three teeth", [COMB], [-5, 7], [20, 7],
                          { leftRings: 3, rightRings: 1 });
  if (res) {
    const tips = res.left.map(area);
    check("comb · every tooth is 2×3", tips.every((t) => Math.abs(t - 6) < 1e-9),
          `got ${tips.map((t) => t.toFixed(3)).join(", ")}`);
  }
}

/* 8. Straight through two opposite VERTICES. Both are already on the line, so nothing is inserted
      and the whole thing rests on the run/crossing classification. */
expectSplit("square, corner to corner through the vertices", [SQUARE], [-5, -5], [15, 15],
            { leftRings: 1, rightRings: 1 });

/* 9. A cut that only TOUCHES a corner — `y = x + 10` rests on (0,10) with the square below it.
      The classic trap: one on-line vertex, no crossing, and an implementation that counts touches
      produces a zero-area second piece and calls it a room. */
expectNoSplit("square, line grazing a corner", [SQUARE], [-5, 5], [5, 15], "miss");

/* 10. A cut running ALONG an edge — a whole collinear run on the line, still not a cut. */
expectNoSplit("square, line along the bottom edge", [SQUARE], [-5, 0], [15, 0], "miss");

/* 11. Misses entirely. */
expectNoSplit("square, line well clear", [SQUARE], [-5, 20], [15, 20], "miss");

/* 12. A degenerate cut — the two clicks landed on the same pixel. */
expectNoSplit("square, zero-length cut", [SQUARE], [5, 5], [5, 5], "miss");

/* 12b. ⚠️ The degenerate this suite was written to find. A cut laid exactly along the U's inner
        edge crosses at x=0 and x=10, but the stretch between x=3 and x=7 is OUTSIDE the shape —
        so pairing those two crossings joins the arms straight through the notch. Area still
        balances, which is exactly why area alone is not enough of a check. It must be refused. */
expectNoSplit("U, cut exactly along the inner edge", [U], [-5, 3], [15, 3], "tangent");

/* 12c. …and the same refusal for a cut that crosses cleanly AND grazes the reflex corner on the
        way. `y = 8 − x` passes through the L's inner corner (4,4) with both its neighbours above
        the line, and crosses the outline properly at (8,0) and (0,8). Two crossings and one touch:
        pair the crossings and you get a plausible-looking piece bounded by a line that never
        entered the shape. */
expectNoSplit("L, cut crossing but grazing the reflex corner", [L], [-2, 10], [12, -4], "tangent");

/* 12d. The collinear run that IS a crossing must still work — an edge lying along the cut while
        the ring passes from one side to the other. Nothing to refuse here; the run's far end
        carries the crossing and the on-line points add no area to whichever piece they land in. */
{
  const STEP = close([[0, 0], [10, 0], [10, 5], [6, 5], [6, 10], [0, 10]]);
  const res = expectSplit("step, cut along the horizontal edge", [STEP], [-5, 5], [15, 5],
                          { leftRings: 1, rightRings: 1 });
  if (res) {
    check("step · pieces are 50 and 30",
          Math.abs(areaOf(res.right) - 50) < 1e-9 && Math.abs(areaOf(res.left) - 30) < 1e-9,
          `got ${areaOf(res.right).toFixed(3)} and ${areaOf(res.left).toFixed(3)}`);
  }
}

/* 13. A cut down the U's notch separates the two arms, and must not invent geometry in the gap. */
expectSplit("U, cut down the notch", [U], [5, -5], [5, 15], { leftRings: 1, rightRings: 1 });

/* 14. A feature that is already two rings. The line crosses one and misses the other — the missed
       ring must travel whole to its own side rather than vanish. */
{
  const far = close([[20, 0], [30, 0], [30, 10], [20, 10]]);
  const res = expectSplit("two rings, cut through one", [SQUARE, far], [5, -5], [5, 15],
                          { leftRings: 1, rightRings: 2 });
  if (res) {
    check("two rings · the untouched ring survives whole",
          res.right.some((r) => Math.abs(area(r) - 100) < 1e-9),
          `right areas ${res.right.map((r) => area(r).toFixed(1)).join(", ")}`);
    // The caller mints new piece ids for cut rings only, so this distinction has to be right or an
    // untouched ring is announced as a brand-new piece of a feature nobody split.
    check("two rings · only the crossed ring is marked cut",
          res.wasCut[0] === true && res.wasCut[1] === false,
          `wasCut ${JSON.stringify(res.wasCut)}`);
  }
}

/* 15. Both rings cut by the same line. */
{
  const far = close([[20, 0], [30, 0], [30, 10], [20, 10]]);
  expectSplit("two rings, cut through both", [SQUARE, far], [-5, 5], [40, 5],
              { leftRings: 2, rightRings: 2 });
}

/* 16. Winding must not matter — the same square, wound the other way. */
expectSplit("square wound clockwise", [close([[0, 0], [0, 10], [10, 10], [10, 0]])],
            [-5, 5], [15, 5], { leftRings: 1, rightRings: 1 });

/* 17. Direction of the cut must not matter either: a→b and b→a swap the labels, nothing else. */
{
  const ab = splitRingsByLine([U], [-5, 6], [15, 6]);
  const ba = splitRingsByLine([U], [15, 6], [-5, 6]);
  check("cut direction only swaps the sides",
        ab.ok && ba.ok && ab.left.length === ba.right.length && ab.right.length === ba.left.length,
        ab.ok && ba.ok
          ? `${ab.left.length}/${ab.right.length} vs ${ba.left.length}/${ba.right.length}`
          : "refused");
}

/* 18. Real-world scale. The tolerance is relative to the cut's length, so a long cut across a
       small shape must still behave — this is the one that catches an absolute epsilon. */
expectSplit("long cut across a small shape",
            [close([[100, 100], [104, 100], [104, 104], [100, 104]])],
            [-5000, 102], [5000, 102], { leftRings: 1, rightRings: 1 });


/* ══ snap engine ═══════════════════════════════════════════════════════════════ */

console.log("\nsnap engine");

/* S1. The nearest point on a segment, including past both ends. */
{
  const near = (n, got, want) => check(n, Math.hypot(got[0]-want[0], got[1]-want[1]) < 1e-9,
    `got ${got}, want ${want}`);
  near("foot lands mid-segment", segClosest(5, 5, 0, 0, 10, 0), [5, 0]);
  near("clamps past the start", segClosest(-5, 3, 0, 0, 10, 0), [0, 0]);
  near("clamps past the end", segClosest(99, 3, 0, 0, 10, 0), [10, 0]);
  near("a zero-length segment is its own point", segClosest(4, 4, 7, 7, 7, 7), [7, 7]);
  near("works on a diagonal", segClosest(0, 10, 0, 0, 10, 10), [5, 5]);
}

/* S2. A corner wins a near-tie — meeting a corner has to stay easy. */
{
  const idx = buildSnapIndex([[100, 100]], [[80, 96, 200, 96]], 24);
  const hit = snapQuery(idx, 100, 99, 10);   // corner 1px away, edge 3px away
  check("a corner wins a near-tie", hit && hit.kind === "corner",
        hit ? hit.kind + " @" + hit.d.toFixed(2) : "null");
}

/* S2b. ⚠️ THE REGRESSION. A corner in range used to win outright, so in floor-plan geometry — where
        some corner is nearly always within the radius — the edge was found and then always lost.
        Edge snapping was unreachable in exactly the geometry it was built for. Here the corner is
        9px off and the edge 1px: the edge is plainly what you were aiming at. */
{
  const idx = buildSnapIndex([[100, 91]], [[0, 100, 400, 100]], 24);
  const hit = snapQuery(idx, 100, 99, 10);
  check("a clearly closer edge beats a distant corner", hit && hit.kind === "edge",
        hit ? `${hit.kind} @${hit.d.toFixed(2)}` : "null");
}

/* S2c. The bias is the whole rule: just inside it the corner holds, just outside it the edge takes
        over. Pinned so the constant cannot drift without a test noticing. */
{
  const edge = [[0, 100, 400, 100]];
  const held = snapQuery(buildSnapIndex([[100, 96]], edge, 24), 100, 100, 10); // corner 4, edge 0
  check("corner holds inside the bias", held && held.kind === "corner",
        held ? held.kind : "null");
  const lost = snapQuery(buildSnapIndex([[100, 94]], edge, 24), 100, 100, 10); // corner 6, edge 0
  check("…and yields outside it", lost && lost.kind === "edge", lost ? lost.kind : "null");
}

/* S3. An edge is found when no corner is in range — the case that did not exist before. */
{
  const idx = buildSnapIndex([[500, 500]], [[0, 200, 400, 200]], 24);
  const hit = snapQuery(idx, 210, 206, 10);
  check("snaps onto an edge", hit && hit.kind === "edge", hit ? hit.kind : "null");
  check("edge snap is the perpendicular foot",
        hit && Math.abs(hit.x - 210) < 1e-9 && Math.abs(hit.y - 200) < 1e-9,
        hit ? `${hit.x}, ${hit.y}` : "null");
}

/* S4. Nothing within the radius means no snap — a tool that always snaps is unusable. */
{
  const idx = buildSnapIndex([[0, 0]], [[0, 200, 400, 200]], 24);
  check("out of range returns null", snapQuery(idx, 210, 260, 10) === null);
  check("a null index never throws", snapQuery(null, 1, 2, 10) === null);
}

/* S5. The grid must not change the answer — the index is an optimisation, not a behaviour.
       Brute force over random data, against the same query. */
{
  let mismatches = 0;
  let seed = 12345;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const verts = Array.from({ length: 400 }, () => [rnd() * 2000, rnd() * 2000]);
  const segs = Array.from({ length: 400 }, () => {
    const x = rnd() * 2000, y = rnd() * 2000;
    return [x, y, x + (rnd() - 0.5) * 300, y + (rnd() - 0.5) * 300];
  });
  const idx = buildSnapIndex(verts, segs, 24);
  for (let i = 0; i < 500; i++) {
    const px = rnd() * 2000, py = rnd() * 2000, R = 10;
    // the honest O(n) answer, with the same biased corner-beats-edge rule
    let bv = null, bvd = R, be = null, bed = R;
    for (const v of verts) { const d = Math.hypot(v[0]-px, v[1]-py); if (d < bvd) { bvd = d; bv = v; } }
    for (const sg of segs) {
      const q = segClosest(px, py, sg[0], sg[1], sg[2], sg[3]);
      const d = Math.hypot(q[0]-px, q[1]-py); if (d < bed) { bed = d; be = q; }
    }
    const BIAS = 5;   // must match SNAP_CORNER_BIAS in the shell
    const want = bv && (!be || bvd <= bed + BIAS) ? { kind: "corner", d: bvd }
               : be ? { kind: "edge", d: bed } : null;
    const got = snapQuery(idx, px, py, R);
    const same = (!want && !got) ||
      (want && got && want.kind === got.kind && Math.abs(want.d - got.d) < 1e-9);
    if (!same) mismatches++;
  }
  check("the index agrees with brute force on 500 random queries", mismatches === 0,
        `${mismatches} disagreed`);
}


/* ══ guide engine ══════════════════════════════════════════════════════════════ */

console.log("\nguide engine");

/* G1. A cursor near a 15° ray is pulled onto it; one that is not, is not. */
{
  const on = angleGuide(0, 0, 100, 2, 15, 2.5);          // ~1.1° off horizontal
  check("a near-horizontal drag catches 0°", on && Math.abs(on.deg % 180) < 1e-9,
        on ? `${on.deg}°` : "null");
  check("…and lands exactly on the ray", on && Math.abs(on.y) < 1e-9, on ? String(on.y) : "null");
  check("a deliberate 8° is left alone", angleGuide(0, 0, 100, 14, 15, 2.5) === null);
}

/* G2. The projection is perpendicular — the point slides onto the guide, it does not jump along it. */
{
  const g = angleGuide(0, 0, 100, 3, 15, 5);
  check("distance along the ray is the projection, not the raw length",
        g && Math.abs(g.x - 100) < 0.2, g ? `x=${g.x.toFixed(3)}` : "null");
}

/* G3. Every 15° step is reachable, including the diagonals and behind the anchor. */
{
  for (const want of [0, 45, 90, 135, 180, 270]) {
    const a = want * Math.PI / 180;
    const g = angleGuide(0, 0, Math.cos(a) * 80, Math.sin(a) * 80, 15, 2.5);
    check(`${want}° is a guide`, g && Math.abs(((g.deg - want) % 360 + 360) % 360) < 1e-6,
          g ? `${g.deg}°` : "null");
  }
}

/* G4. Tracking: x and y are independent, and catching BOTH is the point — the cursor lands on an
       intersection that neither corner occupies. */
{
  const refs = [[100, 500], [700, 300]];
  const g = resolveGuides(null, 103, 297, refs, false);
  check("x is taken from one corner", Math.abs(g.x - 100) < 1e-9, String(g.x));
  check("y is taken from another", Math.abs(g.y - 300) < 1e-9, String(g.y));
  check("and both are explained", g.guides.length === 2, String(g.guides.length));
}

/* G5. Nothing near means nothing happens — a guide that always fires is a guide you fight. */
{
  const g = resolveGuides(null, 400, 400, [[100, 500], [700, 300]], false);
  check("no alignment leaves the point alone",
        g.x === 400 && g.y === 400 && g.guides.length === 0, `${g.x},${g.y}`);
}

/* G6. ⚠️ The precedence rule. Alignment beats a tight angle guide, because agreeing with the room
       next door matters more than a round number of degrees — but the modifier means "on the
       angle" and overrides it outright. */
{
  const refs = [[103, 9999]];                      // an x-alignment 0px away at the cursor
  const free = resolveGuides([0, 0], 103, 1, refs, false);
  check("alignment wins when free", free.guides.some((g) => g.kind === "align"),
        JSON.stringify(free.guides.map((g) => g.kind)));
  const held = resolveGuides([0, 0], 103, 1, refs, true);
  check("the modifier forces the angle", held.guides.length === 1 && held.guides[0].kind === "angle",
        JSON.stringify(held.guides.map((g) => g.kind)));
  check("…and the modifier's wider capture reaches further",
        angleGuide(0, 0, 100, 12, 15, 2.5) === null && angleGuide(0, 0, 100, 12, 15, 7.5) !== null);
}

/* G7. With no anchor there is no angle to guide by, and that must not throw. */
{
  const g = resolveGuides(null, 50, 50, [], false);
  check("no anchor, no refs, no crash", g.x === 50 && g.y === 50 && g.guides.length === 0);
  check("an anchor on top of the cursor is not a direction",
        angleGuide(10, 10, 10, 10, 15, 2.5) === null);
}


/* G8. ⚠️ THE REGRESSION. Guides are measured from a REFERENCE WALL, not from the screen.
       A building at 23° is still a rectilinear building; offering it right angles to the monitor
       is offering it nothing. Here the reference wall runs at 23° and the cursor is dragged
       roughly square to it — that must catch, and screen-absolute guides cannot see it. */
{
  const base = 23;
  const want = base + 90;
  const a = want * Math.PI / 180;
  const px = Math.cos(a) * 100, py = Math.sin(a) * 100;
  check("square to a 23° wall is not a screen angle",
        angleGuide(0, 0, px, py, 15, 2.5, 0) === null);
  const g = angleGuide(0, 0, px, py, 15, 2.5, base);
  check("…but is caught when measured from that wall", g !== null);
  check("…and is reported as 90° TO THE WALL, not 113° to the screen",
        g && Math.abs(g.rel - 90) < 1e-9, g ? `rel ${g.rel}` : "null");
  check("…while the ray drawn is the absolute bearing",
        g && Math.abs(g.deg - 113) < 1e-9, g ? `deg ${g.deg}` : "null");
}

/* G9. Carrying straight on from a wall is 0° relative — the other thing you constantly want. */
{
  const base = -37;
  const a = base * Math.PI / 180;
  const g = angleGuide(0, 0, Math.cos(a) * 60, Math.sin(a) * 60, 15, 2.5, base);
  check("continuing a wall reads as 0°", g && Math.abs(g.rel) < 1e-9, g ? `rel ${g.rel}` : "null");
}

/* G10. Several walls to refer to: the nearest reference wins, so the guide that appears is the one
        the geometry justifies rather than whichever was listed first. */
{
  const bases = [10, 80];               // two walls, 70° apart
  const a = 79 * Math.PI / 180;         // 1° off the second wall's own direction
  const px = Math.cos(a) * 100, py = Math.sin(a) * 100;
  const g = bestAngleGuide(0, 0, px, py, 15, 2.5, bases);
  check("the nearer reference wall wins", g && Math.abs(g.base - 80) < 1e-9,
        g ? `base ${g.base}` : "null");
  check("…and it reads as 0° to that wall", g && Math.abs(g.rel) < 1e-9,
        g ? `rel ${g.rel}` : "null");
}

/* G11. With nothing to refer to — the first edge of a shape drawn from nothing — screen axes are
        the honest fallback rather than an error. */
{
  const g = bestAngleGuide(0, 0, 100, 1, 15, 2.5, []);
  check("no reference falls back to the screen", g && Math.abs(g.deg) < 1e-9,
        g ? `deg ${g.deg}` : "null");
  check("an undefined base list does not throw",
        bestAngleGuide(0, 0, 100, 1, 15, 2.5, undefined) !== null);
}


/** Screen bearing a→b in degrees — the test's own copy, for building fixtures. */
const bearingOf = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;

/* G12. Ray crossing, and its refusal to guess. */
{
  const X = rayIntersect([0, 0], [1, 0], [10, -10], [0, 1]);
  check("two rays cross where they should",
        X && Math.abs(X[0] - 10) < 1e-9 && Math.abs(X[1]) < 1e-9, X ? String(X) : "null");
  check("parallel rays have no crossing", rayIntersect([0, 0], [1, 0], [0, 5], [1, 0]) === null);
  check("near-parallel rays are refused, not chased to infinity",
        rayIntersect([0, 0], [1, 0], [0, 5], [1, 0.01]) === null);
}

/* G13. ⚠️ THE ONE OLCAY ASKED FOR: square at the corner BEFORE and the corner AFTER at once.
        Outline runs (0,0) → P(100,0) → V → N(200,100) → (200,200). A ray from P square to the wall
        arriving at it is vertical through x=100; a ray from N square to the wall leaving it is
        horizontal through y=100. The corner that squares BOTH ends is exactly (100,100) — a point
        neither guide could have produced alone. */
{
  const ring = [[0, 0], [100, 0], [140, 60], [200, 100], [200, 200]];
  const anchors = [
    { at: [100, 0], bases: [bearingOf([0, 0], [100, 0])] },      // wall arriving at P
    { at: [200, 100], bases: [bearingOf([200, 100], [200, 200])] }, // wall leaving N
  ];
  const g = resolveGuides(anchors, 104, 96, [], true);   // cursor near the crossing, Shift held
  check("both rays catch and the corner goes to their crossing", g.crossed === true,
        JSON.stringify(g.guides.map((x) => x.kind)));
  check("…which is exactly the double-square position",
        Math.abs(g.x - 100) < 1e-6 && Math.abs(g.y - 100) < 1e-6,
        `${g.x.toFixed(3)}, ${g.y.toFixed(3)}`);
  check("…and both guides are drawn, not just the winner", g.guides.length === 2,
        String(g.guides.length));
  void ring;
}

/* G14. Two guards, and they catch different things.
        Parallel rays never meet at all; rays a few degrees apart DO meet, but a thousand pixels
        away — which is a teleport, not a snap. */
{
  const parallel = resolveGuides(
    [{ at: [0, 0], bases: [0] }, { at: [0, 20], bases: [0] }], 300, 10, [], true);
  check("parallel guides do not pretend to cross", !parallel.crossed);
  check("…but one of them still guides", parallel.guides.length === 1,
        String(parallel.guides.length));

  // 3° apart: past the parallel guard, so only the distance check can refuse it. The rays meet
  // around x = -572, well over a thousand pixels from a cursor at (500, 15).
  const far = resolveGuides(
    [{ at: [0, 0], bases: [0] }, { at: [0, 30], bases: [3] }], 500, 15, [], true);
  check("a crossing a thousand pixels away is refused", !far.crossed);
}

/* G15. One anchor still behaves as it did — the cut passes a bare point and its bases. */
{
  const g = resolveGuides([0, 0], 100, 2, [], false, [0]);
  check("a bare anchor still guides", g.guides.length === 1 && g.guides[0].kind === "angle",
        JSON.stringify(g.guides));
  check("…and lands on the ray", Math.abs(g.y) < 1e-9, String(g.y));
}


/* G16. ⚠️ FREE MODE MUST BE FINE. Olcay: "still ignores less then 15 and tags them as 90 or 0."
        A corner at 86° is not a right angle, and a tool that rounds it to one and then prints
        "90°" has stopped reporting and started deciding. Every 5° is its own answer, and anything
        between them is left alone. */
{
  const at = (d, step, tols) => {
    const a = d * Math.PI / 180;
    return bestAngleGuide(0, 0, Math.cos(a) * 100, Math.sin(a) * 100, step, tols, [0]);
  };
  const free = (d) => at(d, GUIDE_STEP_FREE, GUIDE_TOLS);

  check("85° is its own guide, not a rounding of 90°",
        free(85) && Math.abs(free(85).rel - 85) < 1e-9,
        free(85) ? `${free(85).rel}°` : "MISSED");
  check("95° likewise", free(95) && Math.abs(free(95).rel - 95) < 1e-9,
        free(95) ? `${free(95).rel}°` : "MISSED");
  check("86° is nobody's guide and is left free", free(86) === null,
        free(86) ? `dragged to ${free(86).rel}°` : "free");
  check("87° too", free(87) === null, free(87) ? `dragged to ${free(87).rel}°` : "free");
  check("88° is left alone rather than called square", free(88) === null,
        free(88) ? `dragged to ${free(88).rel}°` : "free");
  check("90° still catches when you are all but on it",
        free(89.5) && Math.abs(free(89.5).rel - 90) < 1e-9,
        free(89.5) ? `${free(89.5).rel}°` : "MISSED");
  /**
   * ⚠️ The guarantee that matters is not how much of the circle is magnetised — it is **how far
   * anything is moved**. "Tagged as 90 or 0" was a complaint about corners being dragged up to 6°
   * onto a round number. Free mode may now nudge by at most `cardinal`, and by less than a degree
   * for an ordinary angle, so the readout never disagrees with the shape by more than a whisker.
   */
  let worst = 0, worstAt = null;
  for (let d = 0; d < 360; d += 0.1) {
    const g = free(d);
    if (!g) continue;
    let off = Math.abs(((g.rel - d) % 360 + 540) % 360 - 180);
    if (off > worst) { worst = off; worstAt = d; }
  }
  check("nothing is pulled further than the cardinal tolerance",
        worst <= GUIDE_TOLS.cardinal + 1e-6, `${worst.toFixed(2)}° at ${worstAt}°`);
  check("…and an ordinary angle by under a degree",
        GUIDE_TOLS.other < 1, `${GUIDE_TOLS.other}°`);
}

/* G17. ⚠️ AND SHIFT MUST BE COARSE — that is what Olcay asked for the round before: "when pressing
        shift … 90 degree". 85° and 95° land on square, because that is what the modifier is for. */
{
  const held = (d) => {
    const a = d * Math.PI / 180;
    return bestAngleGuide(0, 0, Math.cos(a) * 100, Math.sin(a) * 100,
                          GUIDE_STEP_SNAP, GUIDE_WIDE_TOLS, [0]);
  };
  for (const d of [85, 87, 90, 93, 95])
    check(`${d}° lands on square under the modifier`, held(d) && Math.abs(held(d).rel - 90) < 1e-9,
          held(d) ? `${held(d).rel}°` : "MISSED");
  check("…and the modifier still respects the 15° grid", held(75) && Math.abs(held(75).rel - 75) < 1e-9);
}

/* G18. No magnet may exceed half a step, or it steals from its neighbour and two guides claim the
        same cursor. */
{
  for (const k of ["cardinal", "half", "other"])
    check(`the free ${k} tolerance stays inside half a FREE step`,
          GUIDE_TOLS[k] <= GUIDE_STEP_FREE / 2 + 1e-9, `${GUIDE_TOLS[k]}° vs ${GUIDE_STEP_FREE / 2}°`);
  for (const k of ["cardinal", "half", "other"])
    check(`the modifier's ${k} tolerance stays inside half a SNAP step`,
          GUIDE_WIDE_TOLS[k] <= GUIDE_STEP_SNAP / 2 + 1e-9, `${GUIDE_WIDE_TOLS[k]}°`);
  check("the modifier's grid is coarser than the free one", GUIDE_STEP_SNAP > GUIDE_STEP_FREE,
        `${GUIDE_STEP_SNAP} vs ${GUIDE_STEP_FREE}`);
  check("grading picks cardinal for 90", guideTolFor(90, GUIDE_TOLS) === GUIDE_TOLS.cardinal);
  check("grading picks cardinal for 0", guideTolFor(0, GUIDE_TOLS) === GUIDE_TOLS.cardinal);
  check("grading picks half for 45", guideTolFor(45, GUIDE_TOLS) === GUIDE_TOLS.half);
  check("grading picks other for 75", guideTolFor(75, GUIDE_TOLS) === GUIDE_TOLS.other);
  check("grading wraps past a full turn", guideTolFor(450, GUIDE_TOLS) === GUIDE_TOLS.cardinal);
  check("grading handles negatives", guideTolFor(-90, GUIDE_TOLS) === GUIDE_TOLS.cardinal);
}


/* ══ combine engine ════════════════════════════════════════════════════════════ */

console.log("\ncombine engine");

/** Two 100×60 rooms with a wall-sized gap between them, left and right. */
const roomL = close([[0, 0], [100, 0], [100, 60], [0, 60]]);
const roomR = (gap) => close([[100 + gap, 0], [200 + gap, 0], [200 + gap, 60], [100 + gap, 60]]);

/* C1 is gone with `segPairClosest`. It measured the closest approach between two segments, which
   `findBridge` used until the bridge learned to span the whole facing edge rather than touch at a
   point (2026-08-16). A test kept for a function nobody calls is worse than no test: it reads as
   coverage of the engine and covers something the engine no longer does. */

/* C2. A wall-sized gap is bridged; a corridor-sized one is not. That threshold is the whole
       safeguard against combining two rooms that merely happen to be on the same floor. */
{
  check("a 6px wall is found", findBridge(roomL, roomR(6), 12) !== null);
  check("a 40px corridor is not", findBridge(roomL, roomR(40), 12) === null);
}

/**
 * Is `p` inside this ring? Ray casting — only ever used to assert what a join *contains*, which is
 * the one thing an area figure cannot tell you on its own: the right total can still be the wrong
 * shape.
 */
function inRing(ring, p) {
  const r = ringOpen(ring);
  let inside = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > p[1]) !== (yj > p[1]) &&
        p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/* C3. The join is ONE ring, and it holds both rooms plus the wall between them — **exactly**. */
{
  const out = bridgeRings(roomL, roomR(6), 12);
  check("two rooms become one ring", out !== null);
  const bad = out && wellFormed(out);
  check("…and it is well formed", out && !bad, bad || "null");
  const a = out ? Math.abs(ringSignedArea(ringOpen(out))) : 0;
  /**
   * ⚠️ 6000 + 6000 for the rooms and 360 for the 6×60 wall, to the last decimal rather than within
   * a few hundred. The tolerance used to be ±400 and it was hiding the bug: the old stitch bridged
   * through the two NEAREST points, so it swallowed a wedge of the gap instead of the whole of it
   * and came out at 12180 — inside the tolerance, and visibly a seam on the map.
   */
  check("…with the whole wall's area inside it", Math.abs(a - 12360) < 1e-6, a.toFixed(4));
}

/* C3b. ⚠️ **The gap is genuinely FILLED**, which is the thing area alone cannot prove — the same
        total can be the wrong shape. Olcay, 2026-08-16: *"Combine should make 1 geometry by
        filling in between neatly."* Every one of these points was OUTSIDE the old join. */
{
  const out = bridgeRings(roomL, roomR(6), 12);
  for (const y of [1, 15, 30, 45, 59]) {
    check(`the middle of the wall at y=${y} is inside the joined room`,
          out && inRing(out, [103, y]));
  }
  check("…and so is each room's own middle",
        out && inRing(out, [50, 30]) && inRing(out, [156, 30]));
  check("…while the floor beyond the pair is still outside",
        out && !inRing(out, [-10, 30]) && !inRing(out, [220, 30]));
}

/* C4. ⚠️ Winding must be normalised. Two rings traversed opposite ways stitch into a
       figure-of-eight whose area partly cancels — the classic silent failure here. */
{
  const flipped = close([[100 + 6, 0], [100 + 6, 60], [200 + 6, 60], [200 + 6, 0]]);
  const out = bridgeRings(roomL, flipped, 12);
  check("opposite winding still joins cleanly", out !== null);
  const a = out ? Math.abs(ringSignedArea(ringOpen(out))) : 0;
  check("…and the area does not cancel itself away", Math.abs(a - 12360) < 1e-6, a.toFixed(4));
}

/* C5. Nothing near enough is `null`, not "one of them" — a combine that silently drops a room is
       worse than one that refuses. */
{
  check("far apart refuses", bridgeRings(roomL, roomR(200), 12) === null);
}

/* C6. Three in a row combine into one, whatever order they arrive in. */
{
  const a = close([[0, 0], [100, 0], [100, 60], [0, 60]]);
  const b = close([[106, 0], [206, 0], [206, 60], [106, 60]]);
  const c = close([[212, 0], [312, 0], [312, 60], [212, 60]]);
  for (const order of [[a, b, c], [c, a, b], [b, c, a]]) {
    const r = combineRings(order, 12);
    check("three in a row make one", r.rings.length === 1 && r.joined === 2,
          `${r.rings.length} ring(s), ${r.joined} join(s)`);
  }
}

/* C7. A room across the building is left alone rather than dragged in — two results, not one
       impossible one. */
{
  const near = close([[106, 0], [206, 0], [206, 60], [106, 60]]);
  const far = close([[900, 0], [1000, 0], [1000, 60], [900, 60]]);
  const r = combineRings([roomL, near, far], 12);
  check("the unreachable room stays separate", r.rings.length === 2 && r.joined === 1,
        `${r.rings.length} ring(s)`);
  const areas = r.rings.map((x) => Math.abs(ringSignedArea(ringOpen(x)))).sort((p, q) => p - q);
  check("…and keeps its own area untouched", Math.abs(areas[0] - 6000) < 1, areas[0].toFixed(0));
}

/* C8. A single ring in is the same ring out — combine of one is not an error. */
{
  const r = combineRings([roomL], 12);
  check("one ring passes through", r.rings.length === 1 && r.joined === 0);
}

/* C9. Rooms stacked vertically bridge just as well as side by side — no axis is special. */
{
  const top = close([[0, 0], [100, 0], [100, 60], [0, 60]]);
  const bot = close([[0, 66], [100, 66], [100, 126], [0, 126]]);
  const out = bridgeRings(top, bot, 12);
  check("a vertical wall bridges too", out !== null);
  const a = out ? Math.abs(ringSignedArea(ringOpen(out))) : 0;
  check("…with the same area logic", Math.abs(a - 12600) < 1e-6, a.toFixed(4));
}

/* ── the interaction's own rules ──────────────────────────────────────────────
   Everything above answers "what shape comes out". These four answer the questions the
   INTERACTION asks — which feature survives, and which walls are now inside — and they are
   engine code for the same reason the rest is: they are decisions, and a decision that is not
   tested is a decision somebody will quietly change. */

/* C10. The gap between two rings, both ways round. The second case is the one a vertex-to-vertex
        measure gets wrong: the nearest point is in the MIDDLE of an edge, not on a corner. */
{
  check("side-by-side rooms measure their wall",
        Math.abs(ringGap(roomL, roomR(6)) - 6) < 1e-6, String(ringGap(roomL, roomR(6))));
  // A ring whose only near point is mid-edge: a stub poking at the middle of roomL's right wall.
  const stub = close([[106, 28], [130, 28], [130, 32], [106, 32]]);
  check("a mid-edge approach is found", Math.abs(ringGap(roomL, stub) - 6) < 1e-6,
        String(ringGap(roomL, stub)));
  check("touching rings measure zero", ringGap(roomL, roomR(0)) < 1e-9);
}

/* C11. Area, and the identity rule built on it. ⚠️ If this ever silently returns 0 the rule
        degenerates to "whichever was clicked first", which is the exact thing it exists to avoid. */
{
  check("a 100×60 room is 6000", Math.abs(ringSetArea([roomL]) - 6000) < 1e-6);
  const big = close([[106, 0], [400, 0], [400, 60], [106, 60]]);
  check("the larger room keeps the identity", largestSet([[roomL], [big]]) === 1);
  check("…whichever order it arrives in", largestSet([[big], [roomL]]) === 0);
  // A tie goes to the first, which is the feature already open — the least surprising answer, and
  // the only one that does not depend on click order.
  check("a tie goes to the feature already open", largestSet([[roomL], [roomR(6)]]) === 0);
  /**
   * Two rings for one feature: a room and its annexe both count towards "largest". Sized so the
   * point is actually made — 6000 + 6000 beats 10000, while either ring ALONE would lose to it.
   */
  const mid = close([[500, 0], [600, 0], [600, 100], [500, 100]]);
  check("a multi-ring feature counts all of its rings",
        largestSet([[roomL, roomR(6)], [mid]]) === 0);
  check("…and one of those rings alone would not",
        largestSet([[roomL], [mid]]) === 1);
}

/* C12. Which walls a combine swallows. The rule is BETWEEN, not inside — see the note on
        `liesBetween` for why a point-in-polygon test answers "no" for exactly these walls. */
{
  const dividing = close([[100, 0], [106, 0], [106, 60], [100, 60]]);   // the wall in the gap
  const outer = close([[-6, 0], [0, 0], [0, 60], [-6, 60]]);            // roomL's far side
  const sets = [[roomL], [roomR(6)]];
  check("the wall between two rooms goes", liesBetween([dividing], sets, 1) === true);
  check("the wall on the outside stays", liesBetween([outer], sets, 1) === false);
  // The threshold is the whole safeguard: a wall that touches both only because the tolerance is
  // absurd is not a wall between them.
  const distant = close([[300, 0], [306, 0], [306, 60], [300, 60]]);
  check("a wall nowhere near either stays", liesBetween([distant], sets, 1) === false);
  check("…and no threshold reaches it", liesBetween([distant], sets, 50) === false);
}

/* C13. Three rooms in a row: the middle two walls go, the two end walls stay. The case Olcay
        described — *"remove the combined walls from wall type"* — with more than one wall in it. */
{
  const a = close([[0, 0], [100, 0], [100, 60], [0, 60]]);
  const b = close([[106, 0], [206, 0], [206, 60], [106, 60]]);
  const c = close([[212, 0], [312, 0], [312, 60], [212, 60]]);
  const sets = [[a], [b], [c]];
  const between1 = close([[100, 0], [106, 0], [106, 60], [100, 60]]);
  const between2 = close([[206, 0], [212, 0], [212, 60], [206, 60]]);
  const endWall = close([[312, 0], [318, 0], [318, 60], [312, 60]]);
  check("the first interior wall goes", liesBetween([between1], sets, 1) === true);
  check("the second interior wall goes", liesBetween([between2], sets, 1) === true);
  check("the end wall stays", liesBetween([endWall], sets, 1) === false);
  // …and the shape they leave behind is one room.
  const r = combineRings([a, b, c], 12);
  check("and the three become one", r.rings.length === 1 && r.joined === 2,
        `${r.rings.length} ring(s)`);
}

/* C13b. ⚠️ **The detector must be able to fail**, or C14's thirty green assertions prove nothing.
         A bow-tie is the canonical crossing ring; a plain square is the canonical clean one. */
{
  const bowtie = close([[0, 0], [100, 100], [100, 0], [0, 100]]);
  check("a bow-tie is caught", !!selfIntersects(bowtie), String(selfIntersects(bowtie)));
  check("a square is not", !selfIntersects(close([[0, 0], [10, 0], [10, 10], [0, 10]])));
  /**
   * A ring that merely **touches** itself at a point is legitimate here — a bridge jamb lands
   * exactly on a corner — so the test must not report those, or every real combine would fail it.
   * Two squares meeting at one vertex, which is the shape that distinction is about.
   *
   * ⚠️ The first attempt at this case was itself a crossing ring, and the detector said so: proof
   * from the other direction that it is not merely returning `null`.
   */
  const touching = close([
    [0, 0], [10, 0], [10, 10], [20, 10], [20, 20], [10, 20], [10, 10], [0, 10],
  ]);
  check("a ring that only touches itself is allowed", !selfIntersects(touching),
        String(selfIntersects(touching)));
}

/* C14. ⚠️ **The shapes a real floor has, each checked for SELF-INTERSECTION** — the failure mode
        that has the right area, the right point count, and renders as a crossed mess. A screenshot
        of a terminal-sized shape with a straight line through it (Olcay, 2026-08-16) is what sent
        the engine back for this; it turned out to be clean and the fault was in its INPUTS, but the
        suite had no way of saying so, which is why these live here now. */
{
  const rotate = (pts, deg, ox, oy) => {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    return pts.map(([x, y]) => [
      ox + (x - ox) * c - (y - oy) * s,
      oy + (x - ox) * s + (y - oy) * c,
    ]);
  };
  const ring = (n, ox) =>
    close(
      Array.from({ length: n }, (_, i) => {
        const t = (i / n) * Math.PI * 2;
        return [ox + 50 + 48 * Math.cos(t), 30 + 28 * Math.sin(t)];
      }),
    );
  const cases = [
    ["a small room against a long wall",
      [close([[0, 0], [400, 0], [400, 200], [0, 200]]),
       close([[406, 20], [446, 20], [446, 60], [406, 60]])], 1],
    ["an L beside a box",
      [close([[0, 0], [100, 0], [100, 40], [40, 40], [40, 100], [0, 100]]),
       close([[106, 0], [206, 0], [206, 100], [106, 100]])], 1],
    ["a notched room",
      [close([[0, 0], [100, 0], [100, 25], [80, 30], [100, 35], [100, 60], [0, 60]]),
       roomR(6)], 1],
    ["the same pair turned 37°",
      [close(rotate(ringOpen(roomL), 37, 100, 30)),
       close(rotate(ringOpen(roomR(6)), 37, 100, 30))], 1],
    ["a corner-only touch",
      [roomL, close([[100, 60], [200, 60], [200, 120], [100, 120]])], 1],
    ["two 40-sided rooms", [ring(40, 0), ring(40, 104)], 1],
    // …and the one that must NOT join, so a permissive bridge cannot pass by joining everything.
    ["rooms across the building", [roomL, roomR(500)], 2],
  ];
  for (const [name, rings, expect] of cases) {
    const res = combineRings(rings, 12);
    check(`${name}: ${expect} ring(s)`, res.rings.length === expect,
          `${res.rings.length}`);
    for (const r of res.rings) {
      const bad = wellFormed(r);
      check(`${name}: well formed`, !bad, bad || "");
      const x = selfIntersects(r);
      check(`${name}: does not cross itself`, !x, x || "");
    }
    // A join neither creates nor destroys floor beyond the gaps it fills.
    const before = areaOf(rings), after = areaOf(res.rings);
    check(`${name}: area stays sane`, after >= before - 1e-6 && after < before * 1.25,
          `${before.toFixed(0)} → ${after.toFixed(0)}`);
  }
}

/* ══ square engine ═════════════════════════════════════════════════════════════ */

console.log("\nsquare engine");

/** How far the worst edge is from the shape's own grid, in degrees. 0 = perfectly square. */
function worstOffGrid(rings) {
  const th = dominantAngle(rings);
  let worst = 0;
  for (const r of rings) {
    const open = ringOpen(r);
    for (let i = 0; i < open.length; i++) {
      const a = open[i], b = open[(i + 1) % open.length];
      const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) - th) * 180 / Math.PI;
      const d = ((ang % 90) + 90) % 90;          // 0..90 from the grid
      worst = Math.max(worst, Math.min(d, 90 - d));   // ..and 0..45 to the NEAREST grid line

    }
  }
  return worst;
}

/* Q1. A jittered rectangle comes out square. */
{
  const wonky = close([[0, 0], [100, 3], [97, 60], [-2, 57]]);
  const before = worstOffGrid([wonky]);
  const after = worstOffGrid(squareRings([wonky], 20, 60));
  check("a jittered rectangle starts off-grid", before > 1, `${before.toFixed(2)}°`);
  check("…and comes out square", after < 0.01, `${after.toFixed(4)}°`);
}

/* Q2. ⚠️ It squares to the SHAPE's grid, not to north — a building at an angle stays at its angle. */
{
  const th = 23 * Math.PI / 180, c = Math.cos(th), s = Math.sin(th);
  const rot = ([x, y]) => [x * c - y * s, x * s + y * c];
  const tilted = close([[0, 0], [100, 2], [98, 60], [-1, 58]].map(rot));
  const out = squareRings([tilted], 20, 60);
  check("a tilted rectangle comes out square", worstOffGrid(out) < 0.01,
        `${worstOffGrid(out).toFixed(4)}°`);
  // Against the INPUT's own bearing, not the nominal 23° — the input is deliberately jittered, so
  // its dominant angle is near 23 but not equal to it. What matters is that squaring does not TURN
  // the shape, only straighten it.
  const got = dominantAngle(out) * 180 / Math.PI;
  const want = dominantAngle([tilted]) * 180 / Math.PI;
  const diff = Math.min(Math.abs(got - want), Math.abs(got + 90 - want), Math.abs(got - 90 - want));
  check("…and is not turned in the process", diff < 0.5,
        `bearing ${want.toFixed(2)}° -> ${got.toFixed(2)}°`);
}

/* Q3. ⚠️ A genuine diagonal must SURVIVE — squaring must not invent a right angle. */
{
  const chamfered = close([[0, 0], [80, 0], [100, 20], [100, 60], [0, 60]]);
  const out = squareRings([chamfered], 20, 60)[0];
  const open = ringOpen(out);
  const angs = open.map((a, i) => {
    const b = open[(i + 1) % open.length];
    return Math.abs(Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI);
  });
  check("the 45° chamfer is still a diagonal",
        angs.some((a) => Math.abs(a - 45) < 5), angs.map((a) => a.toFixed(1)).join(", "));
  check("the chamfered shape keeps all its corners", open.length === 5, String(open.length));
}

/* Q4. Squaring keeps the shape recognisable: same corner count, area within a few percent. */
{
  const wonky = close([[0, 0], [100, 3], [97, 60], [-2, 57]]);
  const out = squareRings([wonky], 20, 60);
  const a0 = Math.abs(ringSignedArea(ringOpen(wonky)));
  const a1 = Math.abs(ringSignedArea(ringOpen(out[0])));
  check("corner count is unchanged", ringOpen(out[0]).length === 4, String(ringOpen(out[0]).length));
  check("area is preserved within 5%", Math.abs(a1 - a0) / a0 < 0.05,
        `${a0.toFixed(1)} -> ${a1.toFixed(1)}`);
  for (const r of out) {
    const bad = wellFormed(r);
    check("the squared ring is well formed", !bad, bad || "");
  }
}

/* Q5. Already-square input is a no-op, not a nudge. */
{
  const sq = close([[0, 0], [100, 0], [100, 50], [0, 50]]);
  const out = squareRings([sq], 20, 60)[0];
  let moved = 0;
  ringOpen(sq).forEach((p, i) => {
    moved = Math.max(moved, Math.hypot(p[0] - out[i][0], p[1] - out[i][1]));
  });
  check("a square shape is left alone", moved < 1e-6, `moved ${moved.toExponential(2)}`);
}

/* Q6. A tolerance of 0 changes nothing at all — the guard against a runaway tolerance. */
{
  const wonky = close([[0, 0], [100, 3], [97, 60], [-2, 57]]);
  const out = squareRings([wonky], 0, 60)[0];
  let moved = 0;
  ringOpen(wonky).forEach((p, i) => {
    moved = Math.max(moved, Math.hypot(p[0] - out[i][0], p[1] - out[i][1]));
  });
  check("zero tolerance is a no-op", moved < 1e-9, `moved ${moved}`);
}

/* Q7. Multi-ring features square together, on one shared grid. */
{
  const a = close([[0, 0], [100, 2], [98, 60], [-1, 58]]);
  const b = close([[200, 1], [300, 4], [297, 61], [198, 58]]);
  const out = squareRings([a, b], 20, 60);
  check("both rings come out square", worstOffGrid(out) < 0.01, `${worstOffGrid(out).toFixed(4)}°`);
  check("both rings survive", out.length === 2, String(out.length));
}

/* ══ focus engine ══════════════════════════════════════════════════════════════
   Selecting a feature must NOT change the zoom (Olcay, 2026-08-16: *"respect the user's zoom
   choice but center it if it's off screen"*), so the whole decision is "does the camera move at
   all, and if so by how much" — and the answer that matters most is `null`. */

console.log("\nfocus engine");

const M = FOCUS_MARGIN;
/** A 1440×900 map with no panel, and the same with the 384px properties panel open. */
const bare = focusView(1440, 900, 0);
const withPanel = focusView(1440, 900, 384);
const at = (x, y, w, h) => ({ x0: x, x1: x + w, y0: y, y1: y + h });

/* F1. The whole point: a feature you can already see does not move the camera. */
{
  check("a feature in the middle does not move the map",
        focusPan(at(600, 400, 120, 90), bare) === null);
  // Right up against the margin, and still left alone — the test is inclusive on purpose, or a
  // feature that has JUST been centred would be nudged again by the next click.
  check("a feature exactly on the margin is left alone",
        focusPan(at(M, M, 100, 100), bare) === null);
}

/* F2. Off screen, and it comes back to the middle of the map you can SEE. */
{
  const p = focusPan(at(2000, 400, 100, 100), bare);
  check("a feature off to the right pans", !!p);
  // Its centre is at x=2050; the visible centre is 720. Nothing about zoom enters into it.
  check("…by exactly the offset to the visible centre", p && Math.abs(p[0] - (2050 - 720)) < 1e-9,
        p ? String(p[0]) : "null");
  check("…and not vertically, since it was already level",
        p && Math.abs(p[1] - (450 - 450)) < 1e-9, p ? String(p[1]) : "null");
  check("a feature above the top pans too", !!focusPan(at(600, -500, 100, 100), bare));
}

/* F3. ⚠️ One corner poking out is still off screen. The margin is what stops this being a nuisance
       — a shape merely near the edge is fine; one crossing the margin is not. */
{
  check("a feature straddling the right edge pans",
        !!focusPan(at(1380, 400, 100, 100), bare));
  check("a feature comfortably inside does not",
        focusPan(at(1200, 400, 100, 100), bare) === null);
}

/* F4. The properties panel is not map you can use, so "centre" means centre of what is left. */
{
  const p = focusPan(at(1000, 400, 60, 60), withPanel);
  // The panel starts at 1440-384=1056, so the usable strip is 48..1008 and its centre is 528.
  check("with the panel open a feature under it is moved out", !!p);
  check("…to the centre of the map that is still visible",
        p && Math.abs(p[0] - (1030 - 528)) < 1e-9, p ? String(p[0]) : "null");
  // The same feature, same place, with no panel: comfortably visible and nothing happens.
  check("…and the very same feature is fine without the panel",
        focusPan(at(1000, 400, 60, 60), bare) === null);
}

/* F5. ⚠️ A feature too big to fit is judged on its CENTRE. Containment would say "not visible"
       for a concourse every single time, and pan on every click — including the clicks where you
       were already looking straight at it. */
{
  const huge = at(-2000, -1000, 6000, 3000);       // far larger than the viewport, centred on it
  check("a feature larger than the map does not pan when you are inside it",
        focusPan(huge, bare) === null);
  const away = at(-6000, -1000, 6000, 3000);       // same size, its centre now off to the left
  check("…but does when its centre has gone off screen", !!focusPan(away, bare));
}

/* F6. A panel wider than the map leaves nothing to centre into, and saying so beats dividing by a
       negative width and panning somewhere arbitrary. */
{
  check("no usable map means no view", focusView(300, 900, 400) === null);
  check("…and no pan", focusPan(at(0, 0, 10, 10), focusView(300, 900, 400)) === null);
}

/* ══ box engine ════════════════════════════════════════════════════════════════
   The transform box hugs the SHAPE's grid, not the screen's (Olcay, 2026-08-16: *"Can we hug the
   geometry much better instead of putting the control points relative to the view?"*). The claim
   is a measurement, so these measure it. */

console.log("\nbox engine");

const rot = (pts, deg, ox = 0, oy = 0) => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y]) => [
    ox + (x - ox) * c - (y - oy) * s,
    oy + (x - ox) * s + (y - oy) * c,
  ]);
};
/** The screen-aligned box, i.e. exactly what this replaced. */
const aabbArea = (pts) => {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
};
const side = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/* B1. Square to the screen, the box is the bounding box — the case that already worked. */
{
  const r = [[0, 0], [200, 0], [200, 100], [0, 100]];
  const b = orientedBox(r, 0, 0, 0);
  check("an unrotated box is 200 wide", Math.abs(b.w - 200) < 1e-9, String(b.w));
  check("…and 100 high", Math.abs(b.h - 100) < 1e-9, String(b.h));
  check("…centred on the shape", Math.abs(b.cx - 100) < 1e-9 && Math.abs(b.cy - 50) < 1e-9,
        `${b.cx}, ${b.cy}`);
  check("…with its corners in clockwise order from the top-left",
        b.corners[0][0] === 0 && b.corners[0][1] === 0 && b.corners[2][0] === 200,
        JSON.stringify(b.corners));
}

/* B2. Padding is applied in the BOX's frame, so it is even around the shape rather than around
       the screen — the difference that makes a rotated box hug rather than merely contain. */
{
  const r = [[0, 0], [200, 0], [200, 100], [0, 100]];
  const b = orientedBox(r, 0, 12, 0);
  check("padding widens both sides", Math.abs(b.w - 224) < 1e-9, String(b.w));
  check("…and both ends", Math.abs(b.h - 124) < 1e-9, String(b.h));
  check("…without moving the centre", Math.abs(b.cx - 100) < 1e-9 && Math.abs(b.cy - 50) < 1e-9);
}

/* B3. ⚠️ THE POINT. A room turned 30° gets a box the size of the ROOM, not the size of its
       screen shadow — which for this one is nearly twice the area. */
{
  const room = rot([[0, 0], [200, 0], [200, 100], [0, 100]], 30, 100, 50);
  const b = orientedBox(room, (30 * Math.PI) / 180, 0, 0);
  check("a 30° room still measures 200 across", Math.abs(b.w - 200) < 1e-6, String(b.w));
  check("…and 100 deep", Math.abs(b.h - 100) < 1e-6, String(b.h));
  const hugged = b.w * b.h, screenBox = aabbArea(room);
  check("…and the screen-aligned box it replaced was far bigger",
        screenBox > hugged * 1.6, `hugged ${hugged.toFixed(0)}, screen ${screenBox.toFixed(0)}`);
  // Every corner of the room is ON the box, not somewhere inside it.
  for (const p of room) {
    const near = b.corners.some((q) => side(p, q) < 1e-6);
    check("…and each of the room's corners is a box corner", near, JSON.stringify(p));
  }
}

/* B4. The knob comes off the box's own top edge, not off the screen's up. */
{
  const room = rot([[0, 0], [200, 0], [200, 100], [0, 100]], 30, 100, 50);
  const b = orientedBox(room, (30 * Math.PI) / 180, 0, 26);
  check("the knob stands 26 off the top edge", Math.abs(side(b.topMid, b.knob) - 26) < 1e-6,
        String(side(b.topMid, b.knob)));
  // Perpendicular to the top edge: the stem dotted with that edge is zero.
  const ex = b.corners[1][0] - b.corners[0][0], ey = b.corners[1][1] - b.corners[0][1];
  const sx = b.knob[0] - b.topMid[0], sy = b.knob[1] - b.topMid[1];
  check("…square to it", Math.abs(ex * sx + ey * sy) < 1e-6, String(ex * sx + ey * sy));
  check("…and away from the shape, not into it",
        side(b.knob, [b.cx, b.cy]) > side(b.topMid, [b.cx, b.cy]));
}

/* B5. ⚠️ The wrap. A grid angle is modulo 90°, so without unwrapping the box flips — and the
       rotate knob teleports to another edge — as a shape turns past 45°. */
{
  const Q = Math.PI / 2;
  check("the first angle is taken as it comes", unwrapGrid(0.3, undefined) === 0.3);
  // Raw jumped from +44° to -44°; the continuous answer is +46°, not a 90° leap.
  const raw = (-44 * Math.PI) / 180, prev = (44 * Math.PI) / 180;
  const out = unwrapGrid(raw, prev);
  check("a wrap past 45° stays continuous", Math.abs(out - (46 * Math.PI) / 180) < 1e-9,
        `${((out * 180) / Math.PI).toFixed(2)}°`);
  check("…and is still the same grid", Math.abs(((out - raw) % Q)) < 1e-9);
  check("no wrap leaves it alone", Math.abs(unwrapGrid(0.1, 0.12) - 0.1) < 1e-9);
  // Several turns in, it keeps following rather than snapping back to the principal branch.
  check("it follows a shape round more than one quarter turn",
        Math.abs(unwrapGrid(0.05, 3 * Q + 0.05) - (3 * Q + 0.05)) < 1e-9);
}

/* B6. The cursor points along the handle, since the box's corners no longer have fixed compasses. */
{
  check("a handle down-right is the nwse diagonal", geomResizeCursor(10, 10) === "nwse");
  check("a handle down-left is the nesw diagonal", geomResizeCursor(-10, 10) === "nesw");
  check("a handle straight out to the side is ew", geomResizeCursor(10, 0) === "ew");
  check("a handle straight up is ns", geomResizeCursor(0, -10) === "ns");
  // Double-headed: opposite corners of a box must offer the same arrow.
  check("opposite corners agree", geomResizeCursor(10, 10) === geomResizeCursor(-10, -10));
  check("…on the other diagonal too", geomResizeCursor(-10, 10) === geomResizeCursor(10, -10));
}

/* ══ GJRENDER — the floor drawn from GeoJSON instead of the vector tiles ══════
   The style processing behind Olcay's *"render the map features from geojson source and disable
   vector tile source"*. Everything map-bound (adding sources, hiding the SDK's layers, the verdict
   pass) needs a live map and is not here; what IS here is the whole of the derivation — which
   source layer a feature belongs to, and what a cloned layer looks like. Get either wrong and the
   floor renders empty, which is why they are the parts worth pinning down. */
console.log("\ngeojson render");

/* G1. A source layer is its `mainType` with the hyphens stripped. Observed, not assumed:
       `fill_industrial-space_ptr` selects source layer `industrialspace`. */
{
  check("hyphens come out", flatType("industrial-space") === "industrialspace");
  check("case is levelled", flatType("Retail-Space") === "retailspace");
  check("a name with no hyphen is itself", flatType("wall") === "wall");
  // Null-safe because a draft bag with no mainType is a real thing and must MISS, not throw.
  check("nothing is the empty string", flatType(null) === "" && flatType(undefined) === "");

  const ix = sourceLayerIndex(["industrialspace", "accommodationspace", "wall"]);
  check("a mainType finds its source layer",
        ix.get(flatType("industrial-space")) === "industrialspace");
  check("…and keeps the STYLE's spelling, not the taxonomy's",
        ix.get(flatType("accommodation-space")) === "accommodationspace");
  check("a mainType nobody draws finds nothing", ix.get(flatType("beacon")) === undefined);
}

/* G2. The split into one collection per source layer — and the two stamps that make it render. */
{
  const names = ["wall", "retailspace", "room"];
  const feats = [
    { fid: "a", geometry: { type: "Polygon", coordinates: [[]] }, properties: { mainType: "wall" } },
    { fid: "b", geometry: { type: "Polygon", coordinates: [[]] }, properties: { mainType: "retail-space", fid: "b" } },
    { fid: "c", geometry: { type: "Point", coordinates: [0, 0] }, properties: { mainType: "beacon" } },
    { fid: "d", geometry: null, properties: { mainType: "wall" } },
  ];
  const { groups, unmatched, kept } = groupBySourceLayer(names, feats, -2);
  check("each source layer gets a collection of its own", groups.size === 3);
  check("a wall lands in `wall`", groups.get("wall").length === 1);
  check("a retail-space lands in `retailspace`", groups.get("retailspace").length === 1);
  check("a source layer with nothing on this floor is still there, empty",
        groups.get("room").length === 0);
  check("two features made it in", kept === 2);
  check("a feature with no geometry is not one of them",
        groups.get("wall")[0].properties.fid === "a");

  /* ⚠️ The stamp that decides whether ANYTHING renders. The endpoint is per level and the
     features come back without one, while the SDK's own cloned filters select on `lvl`. */
  check("the level is stamped on", groups.get("wall")[0].properties.lvl === -2);
  check("…and so is the source layer, which a GeoJSON feature has no other way to carry",
        groups.get("retailspace")[0].properties.__sl === "retailspace");
  check("the fid is filled in from the envelope when the bag has none",
        groups.get("wall")[0].properties.fid === "a");

  check("a mainType this style does not draw is counted, not silently dropped",
        unmatched.get("beacon") === 1, JSON.stringify([...unmatched]));
}

/* G3. Whatever the bag already says wins — the stamps fill gaps, they do not overwrite. */
{
  const { groups } = groupBySourceLayer(["wall"], [
    { fid: "a", geometry: { type: "Polygon", coordinates: [[]] },
      properties: { mainType: "wall", lvl: 3, fid: "real-fid" } },
  ], -2);
  const p = groups.get("wall")[0].properties;
  check("a level already on the feature is left alone", p.lvl === 3);
  check("…and so is a fid", p.fid === "real-fid");
}

/* G4. The clone: the SAME layer, reading somewhere else. Derivation, not authorship. */
{
  const layer = {
    id: "fill_retail-space_ptr",
    type: "fill",
    source: "source_ptr",
    "source-layer": "retailspace",
    minzoom: 17,
    maxzoom: 24,
    filter: ["==", "lvl", -2],
    layout: { visibility: "visible" },
    paint: { "fill-color": "#E9D5FF", "fill-outline-color": "#A855F7" },
  };
  const c = cloneLayerDef(layer, "__gjl_fill_retail-space_ptr", "__gj_retailspace");

  check("it reads the GeoJSON source", c.source === "__gj_retailspace");
  check("…under its own id", c.id === "__gjl_fill_retail-space_ptr");
  check("…and the source-layer, which means nothing here, is gone",
        !("source-layer" in c));
  check("the paint is the product's, untouched",
        JSON.stringify(c.paint) === JSON.stringify(layer.paint));
  check("…and so are the layout and the zoom range",
        JSON.stringify(c.layout) === JSON.stringify(layer.layout) &&
        c.minzoom === 17 && c.maxzoom === 24);

  /**
   * ⚠️ **The filter comes across VERBATIM** — this is why the features are split into one source
   * per source-layer rather than selected with an added clause. The SDK writes some of these in
   * legacy syntax, and `["all", <expression>, ["==", "lvl", -2]]` is not a valid mixture: read as
   * an expression, the legacy clause compares the string "lvl" with a number and is false for
   * every feature on the floor. The layer would go quietly empty.
   */
  check("the filter is the SDK's own, unwrapped and uncomposed",
        JSON.stringify(c.filter) === JSON.stringify(layer.filter));

  // A deep copy: the original layer object belongs to the style, and the clone must not share it.
  c.paint["fill-color"] = "#000000";
  c.filter[2] = 0;
  check("mutating the clone cannot reach back into the style",
        layer.paint["fill-color"] === "#E9D5FF" && layer.filter[2] === -2);
}

/* G5. A layer with no filter at all clones to one with no filter at all. */
{
  const c = cloneLayerDef({ id: "l", type: "line", source: "source_ptr", "source-layer": "wall" },
                          "__gjl_l", "__gj_wall");
  check("nothing is invented for a layer that filters on nothing", c.filter === undefined);
  check("…and the type is carried over", c.type === "line");
}

/* ══ GJSWAP — three frames, and a floor that is never blank ═══════════════════
   The swap is the one thing here that CANNOT be checked by looking: it runs across three `idle`
   frames inside a signed-in map nobody can drive from a terminal, and every way it can go wrong
   ends in an empty floor. So it is driven here against a fake map that records what was asked of
   it. See the note on the PRELUDE for what this does and does not prove. */
console.log("\ngeojson swap");

/** A style with two fills, a symbol, the building outline the shell hides, and a satellite raster. */
function fakeMap(o) {
  const opts = o || {};
  const clonesPaint = opts.clonesPaint !== false;
  const tilesPaint = opts.tilesPaint === undefined ? 7 : opts.tilesPaint;
  const layers = [
    { id: "__sat", type: "raster", source: "__sat" },
    { id: "fill_wall_ptr", type: "fill", source: "source_ptr", "source-layer": "wall",
      filter: ["==", "lvl", -2], minzoom: 17, paint: { "fill-color": "#111" } },
    { id: "fill_retail-space_ptr", type: "fill", source: "source_ptr", "source-layer": "retailspace",
      filter: ["==", "lvl", -2], paint: { "fill-color": "#222" } },
    { id: "symbol_poi_ptr", type: "symbol", source: "source_ptr", "source-layer": "retailspace",
      layout: { visibility: "visible" } },
    { id: "fill_building-outline_ptr", type: "fill", source: "source_ptr",
      "source-layer": "buildingoutline" },
    /* The three `system` types, with the layer ids and source-layers the taxonomy service names.
       Each belongs to its own section of the left rail and none of them is map content. */
    { id: "symbol_wayfinding-network_ptr", type: "symbol", source: "source_ptr",
      "source-layer": "wayfindingnetwork" },
    { id: "fill_geofence_ptr", type: "fill", source: "source_ptr", "source-layer": "geofence" },
    { id: "fill_geofence_hatch_ptr", type: "fill", source: "source_ptr", "source-layer": "geofence" },
    { id: "symbol_geofence_ptr", type: "symbol", source: "source_ptr", "source-layer": "geofence" },
    { id: "symbol_positioning-device_ptr", type: "symbol", source: "source_ptr",
      "source-layer": "positioningdevice" },
  ];
  const sources = new Map();
  const at = id => layers.find((l) => l.id === id);
  const visible = id => ((at(id) || {}).layout || {}).visibility !== "none";
  return {
    layers, sources,
    getStyle: () => ({ layers: JSON.parse(JSON.stringify(layers)) }),
    getLayer: (id) => at(id),
    getSource: (id) => sources.get(id),
    addSource: (id, def) => sources.set(id, {
      ...def, setData(d) { this.data = d; },
    }),
    // No canvas in node, so the runtime-generated arrowhead cannot be made here. That is the
    // point of one of the checks below: a map that cannot hold the image must still draw the LINES.
    hasImage: () => false,
    /**
     * ⚠️ A projection, because without one every helper that measures on screen fails into its own
     * try/catch and returns its fallback — which reads as "the answer is always the first one" and
     * is indistinguishable from working. Flat and scaled: enough for "which of these is nearer".
     */
    project: (c) => ({ x: c[0] * 100, y: -c[1] * 100 }),
    unproject: (p) => ({ lng: p[0] / 100, lat: -p[1] / 100 }),
    addLayer: (def, before) => {
      const i = before ? layers.findIndex((l) => l.id === before) : -1;
      if (i < 0) layers.push(def); else layers.splice(i, 0, def);
    },
    removeLayer: (id) => { const i = layers.findIndex((l) => l.id === id); if (i >= 0) layers.splice(i, 1); },
    removeSource: (id) => sources.delete(id),
    getLayoutProperty: (id, k) => ((at(id) || {}).layout || {})[k],
    setLayoutProperty: (id, k, v) => { const l = at(id); if (l) { l.layout = { ...(l.layout || {}) }; l.layout[k] = v; } },
    getFilter: (id) => (at(id) || {}).filter,
    getPaintProperty: (id, k) => ((at(id) || {}).paint || {})[k],
    setPaintProperty: (id, k, v) => { const l = at(id); if (l) { l.paint = { ...(l.paint || {}) }; l.paint[k] = v; } },
    setFilter: (id, f) => { const l = at(id); if (l) l.filter = f; },
    queryRenderedFeatures: (q) => {
      // The clone query names its layers; anything else is "what is on screen", which is the tiles.
      if (q && q.layers) {
        if (!clonesPaint) return [];
        const out = [];
        for (const id of q.layers) {
          if (!visible(id)) continue;
          const src = sources.get((at(id) || {}).source);
          for (const f of (src && src.data && src.data.features) || []) out.push(f);
        }
        return out;
      }
      const on = layers.some((l) => l.source === "source_ptr" && visible(l.id));
      return on ? Array.from({ length: tilesPaint }, () => ({ source: "source_ptr", properties: {} })) : [];
    },
  };
}

const FEATS = [
  { fid: "w1", geometry: { type: "Polygon", coordinates: [[]] }, properties: { mainType: "wall" } },
  { fid: "w2", geometry: { type: "Polygon", coordinates: [[]] }, properties: { mainType: "wall" } },
  { fid: "r1", geometry: { type: "Polygon", coordinates: [[]] }, properties: { mainType: "retail-space", name: "Costa" } },
];

/** Run the swap from a clean state; returns the fake map. Console silenced — it reports loudly. */
function swap(mapOpts, feats, lvl, frames) {
  gjTeardown(null);
  const m = fakeMap(mapOpts);
  __setMap(m);
  __setLevelFeats(feats === undefined ? FEATS : feats, lvl === undefined ? -2 : lvl);
  TARGET.level = -2;
  prefs.geojsonFloor = true;
  POSTED.length = 0;
  const info = console.info;
  console.info = () => {};
  try { for (let i = 0; i < (frames || 2); i++) gjTick(); } finally { console.info = info; }
  return m;
}

/* S1. The happy path, one frame at a time. */
{
  gjTeardown(null);
  const m = fakeMap();
  __setMap(m);
  __setLevelFeats(FEATS, -2);
  TARGET.level = -2;
  prefs.geojsonFloor = true;
  const info = console.info;
  console.info = () => {};

  gjTick();
  console.info = info;
  check("frame 1 builds, and does NOT go live", mod.GJ.phase === "built", mod.GJ.phase);
  check("…the tiles are still on", m.getLayoutProperty("fill_wall_ptr", "visibility") !== "none");
  check("…a source per source-layer exists", m.sources.has("__gj_wall") && m.sources.has("__gj_retailspace"));
  check("…the walls went into the wall source", m.sources.get("__gj_wall").data.features.length === 2);
  check("…and the building outline was not cloned", !m.getLayer("__gjl_fill_building-outline_ptr"));

  // ⚠️ Draw order: each clone sits directly before its original, so the clones' order among
  // themselves is the SDK's. Get this wrong and circulation space paints over the rooms in it.
  const ids = m.layers.map((l) => l.id);
  check("a clone sits directly before its original",
        ids.indexOf("__gjl_fill_wall_ptr") === ids.indexOf("fill_wall_ptr") - 1);
  check("…and the clones keep the SDK's order between them",
        ids.indexOf("__gjl_fill_wall_ptr") < ids.indexOf("__gjl_fill_retail-space_ptr"));
  check("…all of them above the satellite raster",
        ids.indexOf("__sat") < ids.indexOf("__gjl_fill_wall_ptr"));

  console.info = () => {};
  gjTick();
  console.info = info;
  check("frame 2 goes live", mod.GJ.phase === "live", mod.GJ.phase);
  check("…and NOW the tiles go off", m.getLayoutProperty("fill_wall_ptr", "visibility") === "none");
  check("…including the SDK's symbol layer", m.getLayoutProperty("symbol_poi_ptr", "visibility") === "none");
  check("…but not a layer nobody cloned",
        m.getLayoutProperty("fill_building-outline_ptr", "visibility") !== "none");
  check("the label preference and the outline are re-applied onto the clones",
        __env().applyPrefsCalls > 0 && __env().addFloorplanCalls > 0);
  // Rows painted, not features: the retail unit is drawn by a fill AND a symbol layer, so three
  // features make four rows. That is the honest comparison — the tile side is counted the same way
  // — and it is why the verdict is "did anything paint", never "do the two numbers match".
  check("it counted both sides", mod.GJ.tileRows === 7 && mod.GJ.gjRows === 4,
        `${mod.GJ.tileRows} → ${mod.GJ.gjRows}`);
  check("nothing was reported as a failure", !POSTED.some((p) => p.type === "error"));

  console.info = () => {};
  gjTick(); gjTick();
  console.info = info;
  check("further frames leave it alone", mod.GJ.phase === "live");
  check("…and the tiles stay off", m.getLayoutProperty("fill_wall_ptr", "visibility") === "none");
}

/* S2. ⚠️ The one that matters: the clones paint NOTHING. The floor must not go blank. */
{
  POSTED.length = 0;
  const m = swap({ clonesPaint: false });
  check("it does not go live", mod.GJ.phase === "failed", mod.GJ.phase);
  check("the tiles were never switched off",
        m.getLayoutProperty("fill_wall_ptr", "visibility") !== "none");
  check("the clones are gone again", !m.getLayer("__gjl_fill_wall_ptr"));
  check("…and so are their sources", m.sources.size === 0);
  check("it said so, to the app and not just the console",
        POSTED.some((p) => p.type === "error" && /painted nothing/.test(p.message)));

  // Never on a loop: a level's verdict is taken once. Re-ticking must not rebuild.
  const before = m.layers.length;
  const info = console.info; console.info = () => {};
  gjTick(); gjTick();
  console.info = info;
  check("and it does not try again on every idle", m.layers.length === before && mod.GJ.phase === "failed");
}

/* S3. The camera is nowhere near the building: no baseline, so no swap — and no verdict either.
      Told apart from a real failure, which is the whole reason the baseline exists. */
{
  const m = swap({ tilesPaint: 0 });
  check("nothing is built from a frame with nothing on it", mod.GJ.phase === "off", mod.GJ.phase);
  check("…and it is NOT recorded as a failure", mod.GJ.phase !== "failed");
  check("…nothing was added to the style", !m.getLayer("__gjl_fill_wall_ptr"));
}

/* S4. The floor moves out from under the data. The clones describe a level nobody is looking at. */
{
  const m = swap();
  check("live first", gjLive());
  TARGET.level = 0;
  const info = console.info; console.info = () => {};
  gjTick();
  console.info = info;
  check("a level change tears it down", !gjLive() && mod.GJ.phase === "off");
  check("…and the tiles come back on",
        m.getLayoutProperty("fill_wall_ptr", "visibility") !== "none");
  check("…and the symbol layer with them",
        m.getLayoutProperty("symbol_poi_ptr", "visibility") !== "none");
  TARGET.level = -2;
}

/* S5. The switch in Map Settings, and a screen that fetches no GeoJSON at all. */
{
  const m = swap();
  check("live to begin with", gjLive());
  prefs.geojsonFloor = false;
  const info = console.info; console.info = () => {};
  gjTick();
  console.info = info;
  check("switching it off puts the tiles back", !gjLive() &&
        m.getLayoutProperty("fill_wall_ptr", "visibility") !== "none");

  const m2 = swap({}, [], null);
  check("a screen with no GeoJSON never swaps", mod.GJ.phase === "off" && !m2.getLayer("__gjl_fill_wall_ptr"));
}

/* S6. The SDK rewrites its own filters on a level switch; the clones follow — except where a
       Combine is holding one. */
{
  const m = swap();
  m.setFilter("fill_wall_ptr", ["==", "lvl", 3]);          // as updateLayersForCurrentLevel would
  const hide = ["all", ["==", "lvl", -2], ["!", ["any", ["==", ["get", "fid"], "w1"]]]];
  m.setFilter("__gjl_fill_retail-space_ptr", hide);
  __env().HIDDEN_FILTERS.set("__gjl_fill_retail-space_ptr", ["==", "lvl", -2]);
  const info = console.info; console.info = () => {};
  gjTick();
  console.info = info;
  check("a clone follows its original's filter",
        JSON.stringify(m.getFilter("__gjl_fill_wall_ptr")) === JSON.stringify(["==", "lvl", 3]));
  check("⚠️ but never over a Combine's hidden wall",
        JSON.stringify(m.getFilter("__gjl_fill_retail-space_ptr")) === JSON.stringify(hide));
  __env().HIDDEN_FILTERS.clear();
}

/* S7. What the rest of the shell asks about a feature still answers once the tiles are off. */
{
  swap();
  const pairs = indoorPairs();
  check("the tiles are still enumerated — a source answers whether or not it is drawn",
        pairs.some((p) => p.source === "source_ptr" && p.sourceLayer === "wall"));
  check("…and so are the GeoJSON sources, with no source-layer",
        pairs.some((p) => p.source === "__gj_wall" && !p.sourceLayer));

  check("a tile feature says which source layer it came from",
        srcLayerOf({ sourceLayer: "wall", properties: {} }) === "wall");
  check("…and a GeoJSON one, which has no such field, says it from `__sl`",
        srcLayerOf({ properties: { __sl: "wall" } }) === "wall");
  gjTeardown(null);
}

/* ══ HIDDEN TYPES — each thing shows in its own section ═════════════════════
   Olcay, 2026-08-16: "Wayfinding Network should show in when wayfinding network is selected.
   Geofences when geofence selected and beacons when beacon selected." The tree had always dropped
   these (groupByClass: `system` is plumbing, not content); the map drew them anyway. */
console.log("\nhidden types");

const SYSTEM = ["wayfinding-network", "geofence", "positioning-device"];

/* H1. Which type a LAYER draws — the one lookup everything else here rests on. */
{
  // ⚠️ Both spellings: getStyle() gives the spec (`source-layer`), getLayer() the live StyleLayer
  // (`sourceLayer`). Reading one made every layer look like it belonged to no type at all.
  check("the spec's hyphenated key is read",
        layerTypeGroup({ "source-layer": "geofence" }) === "geofence");
  check("…and the live layer's camelCase one",
        layerTypeGroup({ sourceLayer: "geofence" }) === "geofence");
  check("a GeoJSON clone says it with its source", layerTypeGroup({ source: "__gj_wall" }) === "wall");
  check("a layer belonging to no type says so", layerTypeGroup({ source: "__sat" }) === null);
  check("…and so does nothing at all", layerTypeGroup(null) === null);

  __setHidden(SYSTEM);
  // The de-hyphenation is the whole join: `wayfinding-network` is drawn by source-layer
  // `wayfindingnetwork`, and comparing them raw would hide nothing while looking correct.
  check("a hyphenated mainType matches its de-hyphenated source-layer",
        typeHidden({ "source-layer": "wayfindingnetwork" }));
  check("…and a clone of the same type", typeHidden({ source: "__gj_wayfindingnetwork" }));
  check("content is not hidden", !typeHidden({ "source-layer": "retailspace" }));
  __setHidden(null);
  check("told nothing, nothing is hidden — the cautious answer for 'may I draw?' is yes",
        !typeHidden({ "source-layer": "wayfindingnetwork" }));
}

/* H2. The screenshot's actual complaint: a floor buried under path-nodes and geofence zones. */
{
  gjTeardown(null);
  HIDDEN_BY_TYPE.clear();
  __setHidden(null);
  const m = fakeMap();
  __setMap(m);
  const vis = (id) => m.getLayoutProperty(id, "visibility") !== "none";

  __setHidden(SYSTEM);
  applyHiddenTypes();
  check("the wayfinding network goes", !vis("symbol_wayfinding-network_ptr"));
  check("the geofence fill goes", !vis("fill_geofence_ptr"));
  check("…its hatch overlay too — a fill no other branch in applyPrefs touches",
        !vis("fill_geofence_hatch_ptr"));
  check("…and its pin", !vis("symbol_geofence_ptr"));
  check("beacons go", !vis("symbol_positioning-device_ptr"));

  check("the rooms stay", vis("fill_retail-space_ptr"));
  check("the walls stay", vis("fill_wall_ptr"));
  check("the POI labels stay", vis("symbol_poi_ptr"));
  check("and the basemap is none of its business", vis("__sat"));
}

/* H3. ⚠️ It restores only what it hid. A rail section showing its own type has to un-hide, and
       three other things in the shell hide layers for reasons of their own. */
{
  const m = fakeMap();
  __setMap(m);
  HIDDEN_BY_TYPE.clear();
  // Something else got there first — the POI-label preference, say.
  m.setLayoutProperty("symbol_poi_ptr", "visibility", "none");

  __setHidden(SYSTEM);
  applyHiddenTypes();
  check("it took a note of what it hid", HIDDEN_BY_TYPE.has("fill_geofence_ptr"));
  check("…and none of what it did not", !HIDDEN_BY_TYPE.has("symbol_poi_ptr"));

  // Geofences selected: the section shows its own type by passing the list without it.
  __setHidden(["wayfinding-network", "positioning-device"]);
  applyHiddenTypes();
  check("the geofence comes back", m.getLayoutProperty("fill_geofence_ptr", "visibility") === "visible");
  check("…all three of its layers", m.getLayoutProperty("symbol_geofence_ptr", "visibility") === "visible" &&
        m.getLayoutProperty("fill_geofence_hatch_ptr", "visibility") === "visible");
  check("the wayfinding network stays hidden",
        m.getLayoutProperty("symbol_wayfinding-network_ptr", "visibility") === "none");
  check("⚠️ and a layer somebody ELSE hid is still hidden",
        m.getLayoutProperty("symbol_poi_ptr", "visibility") === "none");
  check("the note is cleared as it goes", !HIDDEN_BY_TYPE.has("fill_geofence_ptr"));
  __setHidden(null);
  applyHiddenTypes();
  HIDDEN_BY_TYPE.clear();
}

/* H4. It reaches the GeoJSON clones as well — the swap must not put back what a section hid. */
{
  __setHidden(SYSTEM);
  const m = swap();
  check("live", gjLive());
  applyHiddenTypes();
  check("a clone of a hidden type is hidden too",
        m.getLayoutProperty("__gjl_symbol_wayfinding-network_ptr", "visibility") === "none");
  check("…and a clone of content is not",
        m.getLayoutProperty("__gjl_fill_retail-space_ptr", "visibility") !== "none");
  gjTeardown(null);
  __setHidden(null);
  HIDDEN_BY_TYPE.clear();
}

/* ══ WAYFINDING — network nodes and transition nodes ════════════════════════
   Olcay, 2026-08-16: "Wayfinding Network is a complicated structure with network nodes and
   transition nodes." The product draws all six subTypes with one symbol layer and no sprite for
   any of them, so its own answer is several hundred identical pins — which is the picture that
   started this. These two layers are the one piece of authorship in the render, and they exist
   because there is nothing here to derive. */
console.log("\nwayfinding");

const SHOW_WF = ["geofence", "positioning-device"];   // the list a section passes: all but its own

/* W1. It draws only where its section is the one on screen. */
{
  gjTeardown(null);
  HIDDEN_BY_TYPE.clear();
  const m = fakeMap();
  __setMap(m);

  // ⚠️ Not told anything — every other screen in the app. Those must look exactly as they did.
  __setHidden(null);
  applyWayfinding();
  check("silence adds nothing", !m.getLayer(WF_NODE) && !m.getLayer(WF_TRANSITION));
  check("…and leaves the SDK's own layer alone",
        m.getLayoutProperty(WF_HIDE, "visibility") !== "none");

  __setHidden(SYSTEM);                                  // Map Content: this type is hidden
  applyWayfinding();
  check("Map Content draws no network", !m.getLayer(WF_NODE));

  __setHidden(SHOW_WF);                                 // Wayfinding Network selected
  applyWayfinding();
  check("its own section draws it", !!m.getLayer(WF_NODE) && !!m.getLayer(WF_TRANSITION));
  check("…as circles, not as markers", m.getLayer(WF_NODE).type === "circle");
  check("…off the tiles' own source layer",
        m.getLayer(WF_NODE)["source-layer"] === "wayfindingnetwork");
  check("⚠️ and the product's pin storm goes — 500 identical default-poi markers",
        m.getLayoutProperty(WF_HIDE, "visibility") === "none");

  __setHidden(SYSTEM);
  applyWayfinding();
  check("leaving the section takes them away again",
        !m.getLayer(WF_NODE) && !m.getLayer(WF_TRANSITION));
}

/* W2. The split: one subType is the network, the other five are ways off the floor. */
{
  const net = JSON.stringify(wfFilter(true));
  const trans = JSON.stringify(wfFilter(false));
  check("the network layer takes path-nodes", /"==".*"subType".*"path-node"/.test(net), net);
  check("…and the transition layer takes everything else", /"!=".*"subType".*"path-node"/.test(trans),
        trans);
  /**
   * ⚠️ Phrased as "is / is not the network subType", never as a list of the five transitions. A
   * transition subType added to the taxonomy tomorrow then draws as a transition by itself; the
   * other phrasing would quietly file it as network, on a map where that is the difference between
   * "a step along this floor" and "a way off it".
   */
  check("neither names the five transitions", !/elevator|escalator|stairs/.test(net + trans));
  check("both are scoped to the level, like every other layer here",
        net.indexOf('"lvl"') > 0 && trans.indexOf('"lvl"') > 0);
}

/* W3. A level switch re-sets the filters — they are baked in when the layer is made. */
{
  const m = fakeMap();
  __setMap(m);
  TARGET.level = -2;
  __setHidden(SHOW_WF);
  applyWayfinding();
  check("built for the level on screen",
        JSON.stringify(m.getFilter(WF_NODE)).indexOf("-2") > 0);
  TARGET.level = 3;
  applyWayfinding();
  check("and re-filtered when the floor moves — or the last floor's network draws under this one",
        JSON.stringify(m.getFilter(WF_NODE)).indexOf("3") > 0 &&
        JSON.stringify(m.getFilter(WF_NODE)).indexOf("-2") < 0);
  TARGET.level = -2;
  wfRemove();
  __setHidden(null);
}

/* W4. ⚠️ It follows the render swap only where the swap has something to show it.
       Olcay: "wayfinding network path should be always visible when wayfinding network section is
       selected." The floor's GeoJSON and the network's come from DIFFERENT endpoints — /features
       and /paths — so the floor render can succeed on a collection with no nodes in it. Repointing
       at that would make the whole network vanish at the exact moment the floor render worked. */
{
  __setHidden(SHOW_WF);
  const m = swap();                                   // FEATS has walls and a room, no nodes
  check("the floor is on the GeoJSON", gjLive());
  applyWayfinding();
  check("⚠️ the nodes stay on the TILES, because the GeoJSON has none of them",
        m.getLayer(WF_NODE).source === "source_ptr");
  check("…so the section still draws its network", !!m.getLayer(WF_NODE) && !!m.getLayer(WF_EDGE));
  check("and the CLONE of the pin layer is hidden as well as the original",
        m.getLayoutProperty("__gjl_symbol_wayfinding-network_ptr", "visibility") === "none");
  gjTeardown(null);
  wfRemove();

  // …and where the GeoJSON DOES hold nodes, that is what it reads: one source for the whole floor.
  const withNodes = FEATS.concat([
    { fid: "n1", geometry: { type: "Point", coordinates: [0, 0] },
      properties: { mainType: "wayfinding-network", subType: "path-node" } },
  ]);
  const m2 = swap({}, withNodes, -2);
  applyWayfinding();
  check("with nodes in the collection, the layers read it",
        m2.getLayer(WF_NODE).source === "__gj_wayfindingnetwork");
  check("…with no source-layer, which a GeoJSON source has none of",
        !m2.getLayer(WF_NODE)["source-layer"]);
  gjTeardown(null);
  __setHidden(null);
  HIDDEN_BY_TYPE.clear();
  wfRemove();
}

/* W5. The promise is re-asserted, not assumed: on this section the network is drawn. */
{
  const m = fakeMap();
  __setMap(m);
  __setHidden(SHOW_WF);
  applyWayfinding();
  for (const id of [WF_NODE, WF_TRANSITION, WF_EDGE]) m.setLayoutProperty(id, "visibility", "none");
  applyWayfinding();
  check("anything that hides the network gets it back on the next pass",
        [WF_NODE, WF_TRANSITION, WF_EDGE].every(
          (id) => m.getLayoutProperty(id, "visibility") === "visible"));
  __setHidden(null);
  applyWayfinding();
  wfRemove();
}

/* ══ EDGES — select an edge, push it out, move it in ════════════════════════
   Olcay, 2026-08-16: "I also like edge edit, meaning I can select edges to push out or move in —
   two nodes move accordingly. Multi edge select would be nice."

   An edge IS its two ends. That one decision is why this needed almost no new machinery: selecting
   an edge selects two corners, dragging it is the multi-corner drag that already existed, and
   multi-edge selection is the same set with more in it. */
console.log("\nedge select");

{
  // A square: four real corners, closed by a repeat of the first.
  const ring = [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]];
  const rings = [ring];

  check("edge 0 runs between corners 0 and 1",
        JSON.stringify(edgeKeys(0, 0, ring.length)) === JSON.stringify(["0:0", "0:1"]));
  /**
   * ⚠️ **The wrap is the whole subtlety.** The last edge runs to `ring[4]`, which IS `ring[0]` —
   * and only the four REAL corners get a handle. Naming the closing index gives a key nothing
   * draws and nothing drags: the edge would look selected at one end and move at one end.
   */
  check("the last edge wraps to corner 0, not to the closing point",
        JSON.stringify(edgeKeys(0, 3, ring.length)) === JSON.stringify(["0:3", "0:0"]));

  const sel = new Set();
  check("nothing selected is no edges", selectedEdgeCount(rings, sel) === 0);
  sel.add("0:0");
  check("one end of an edge is not an edge", selectedEdgeCount(rings, sel) === 0);
  sel.add("0:1");
  check("both ends are", selectedEdgeCount(rings, sel) === 1);
  // Two adjacent edges share a corner: three corners, two edges. This is also what a MARQUEE that
  // happens to catch three corners in a row reports — correctly, and nobody wrote it.
  sel.add("0:2");
  check("three corners in a row are two edges", selectedEdgeCount(rings, sel) === 2);
  sel.add("0:3");
  check("the whole ring selected is four edges — the wrap included",
        selectedEdgeCount(rings, sel) === 4);

  // Opposite corners of a square are not an edge, however many of them you pick.
  const across = new Set(["0:0", "0:2"]);
  check("two corners with no edge between them are no edges",
        selectedEdgeCount(rings, across) === 0);

  // A second ring's corners cannot form an edge with the first's.
  const two = [ring, [[20, 20], [30, 20], [30, 30], [20, 20]]];
  check("keys are per ring", selectedEdgeCount(two, new Set(["0:1", "1:0"])) === 0);
  check("…and the second ring's own edges count",
        selectedEdgeCount(two, new Set(["1:0", "1:1"])) === 1);
}

/* G6. ⚠️ A drag moves what you grabbed by how far the POINTER moved. Olcay, 2026-08-17: "dragging
       edge has a bug. it jumps to an offset location right at the start."

       Every drag here used to put the led point AT the pointer. That is invisible while the target
       is small enough that you cannot grab it far from its centre — a corner handle is — and it is
       a teleport on an EDGE, where you press wherever the corridor happens to run. */
{
  // The lead node is at (100,100) on screen; you press on the edge 40px to the right of it.
  const grab = grabOffset({ x: 140, y: 100 }, { x: 100, y: 100 });
  check("the offset is where you took hold, not where the thing is",
        grab.dx === 40 && grab.dy === 0);

  // Pointer has not moved yet: the node must not move either. This is the reported bug.
  const still = aimPoint({ x: 140, y: 100 }, grab);
  check("⚠️ pressing without moving moves nothing", still.x === 100 && still.y === 100);

  // Pointer moves by (10, 5): the node moves by (10, 5), keeping the grab offset.
  const moved = aimPoint({ x: 150, y: 105 }, grab);
  check("…and the node follows the pointer's delta, not its position",
        moved.x === 110 && moved.y === 105);

  // Grabbing a handle dead centre is the degenerate case the old code got right by luck.
  const centre = grabOffset({ x: 100, y: 100 }, { x: 100, y: 100 });
  check("a dead-centre grab is no offset at all", centre.dx === 0 && centre.dy === 0);
  check("…and then aiming IS the pointer", aimPoint({ x: 7, y: 9 }, centre).x === 7);
}

/* ══ PATHS — the network's lines, and where the direction comes from ════════
   Olcay: "there should be lines with direction on the wayfinding network."

   ⚠️ Direction is not a property of anything. An adjacency list is directed by construction — A
   naming B does not oblige B to name A — so a two-way edge is one both ends declare and a one-way
   edge is one only its origin does. The arrows are the shape of the data, drawn. */
console.log("\nnetwork paths");

const node = (fid, at, nb, tr) => ({
  fid, at,
  neighbors: (nb || []).map((f) => (typeof f === "string" ? { fid: f } : f)),
  transitionNeighbors: (tr || []).map((f) => ({ fid: f })),
});

/* P1. Reciprocated is two-way; one-sided is one-way. */
{
  const { edges, oneway } = networkEdges([
    node("a", [0, 0], ["b"]),
    node("b", [1, 0], ["a", "c"]),        // b↔a reciprocated, b→c is not
    node("c", [2, 0], []),
  ]);
  check("two nodes that name each other make ONE line, not two", edges.length === 2);
  check("…and it is two-way", edges.find((e) => e.properties.from === "a").properties.oneway === false);
  check("a link only its origin declares is one-way",
        edges.find((e) => e.properties.to === "c").properties.oneway === true);
  check("counted", oneway === 1);
  check("the line runs between the two nodes' coordinates",
        JSON.stringify(edges[0].geometry.coordinates) === JSON.stringify([[0, 0], [1, 0]]));
  check("…as a LineString", edges[0].geometry.type === "LineString");
}

/* P2. What must NOT be drawn, and must be counted instead. */
{
  const { edges, dangling, transitions } = networkEdges([
    node("a", [0, 0], ["b", "ghost", "a"], ["upstairs"]),
    node("b", [1, 0], ["a"]),
  ]);
  check("a neighbour that is not on this floor draws no line to nowhere", edges.length === 1);
  check("…it is counted, so a partial collection cannot pass as a sparse network", dangling === 1);
  check("a node linked to itself draws nothing", !edges.some((e) => e.properties.from === e.properties.to));
  // transitionNeighbors point at another LEVEL, so they have no line on this one — the node itself
  // already draws distinctly (the network's two tiers).
  check("a transition off the floor is counted, not drawn", transitions === 1 && edges.length === 1);
}

/* P3. The same neighbour listed twice is one line. */
{
  const { edges } = networkEdges([node("a", [0, 0], ["b", "b"]), node("b", [1, 0], [])]);
  check("a duplicated neighbour reference is still one line", edges.length === 1);
}

/* P4. `speed` rides the edge — it is per-neighbour in the API, not per-node. */
{
  const { edges } = networkEdges([
    node("a", [0, 0], [{ fid: "b", speed: 0.5 }]),
    node("b", [1, 0], []),
  ]);
  check("the edge carries its own speed", edges[0].properties.speed === 0.5);
  const { edges: e2 } = networkEdges([node("a", [0, 0], ["b"]), node("b", [1, 0], [])]);
  check("…and null where the API gave none", e2[0].properties.speed === null);
}

/* P5. Dragging a node takes its corridors with it — the half that makes it feel edited. */
{
  const { edges } = networkEdges([
    node("a", [0, 0], ["b"]),
    node("b", [1, 0], ["a", "c"]),
    node("c", [2, 0], []),
  ]);
  const moved = moveNetworkNode(edges, "b", [1, 5]);
  check("both lines touching the node move", moved === 2);
  check("…at the end that names it",
        JSON.stringify(edges[0].geometry.coordinates) === JSON.stringify([[0, 0], [1, 5]]));
  check("…and at the other end where it is the origin",
        JSON.stringify(edges[1].geometry.coordinates[0]) === JSON.stringify([1, 5]));
  check("a node nothing links to moves nothing", moveNetworkNode(edges, "nobody", [9, 9]) === 0);
  // ⚠️ A copy, not the array it was handed: the caller's node table must not be aliased into the
  // geometry, or the next drag would mutate history.
  const at = [7, 7];
  moveNetworkNode(edges, "a", at);
  at[0] = 99;
  check("the coordinate is copied in, not aliased", edges[0].geometry.coordinates[0][0] === 7);
}

/* P6. Nothing in, nothing out — a level with no network is not an error. */
{
  const empty = networkEdges([]);
  check("no nodes, no edges", empty.edges.length === 0 && empty.dangling === 0);
  check("…and it does not throw on nothing at all", networkEdges(null).edges.length === 0);
}

/* P7. ⚠️ A NETWORK is a connected component, and a transition is its boundary — not a member.
       Olcay: "we should have entity per network. networks are connected to other levels' networks
       and this level's other networks through transitions." */
{
  //  a—b—c   is one network;   x—y   is another on the same floor, reached only by a transition
  const nodes = [
    node("a", [0, 0], ["b"]),
    node("b", [1, 0], ["a", "c"]),
    node("c", [2, 0], ["b"], ["upstairs"]),      // c also leaves the floor
    node("x", [9, 9], ["y"], ["c"]),             // …and x reaches c only as a TRANSITION
    node("y", [9, 8], ["x"]),
    node("lonely", [5, 5], []),
  ];
  const { edges } = networkEdges(nodes);
  const { of, list } = networkComponents(nodes, edges);

  check("three networks on this floor", list.length === 3, String(list.length));
  check("…biggest first, so 0 is the concourse and not a stub",
        list[0].size === 3 && list[1].size === 2 && list[2].size === 1);
  /**
   * ⚠️ The whole point. `x` names `c` as a TRANSITION, not as a neighbour — walking that as an
   * ordinary edge would fuse every network in the building into one and the entity would mean
   * nothing.
   */
  check("a transition does NOT join two networks", of.get("a") !== of.get("x"));
  check("…and both ends still belong to their own", of.get("a") === of.get("c") && of.get("x") === of.get("y"));
  check("a node with nothing attached is a network of one — real, not filtered away",
        list[2].fids.join() === "lonely");
  check("the links off a network are counted", list[0].transitions === 1 && list[0].gateways === 1);
  check("…and a network with none says so", list[2].transitions === 0);
  check("nothing at all is no networks", networkComponents([], []).list.length === 0);
}

/* P9. Hovering lights the whole network — not one hop, and not the run between junctions.
       Olcay: "the whole network should highlight when hovered." */
{
  //  a — b — c — d — e   with a spur off c: one network, one highlight, fork or no fork
  const { edges } = networkEdges([
    node("a", [0, 0], ["b"]),
    node("b", [1, 0], ["a", "c"]),
    node("c", [2, 0], ["b", "d", "f"]),
    node("d", [3, 0], ["c", "e"]),
    node("e", [4, 0], ["d"]),
    node("f", [2, 1], ["c"]),
  ]);
  const run = networkRun(edges, "b");
  check("the whole network lights, junctions and all",
        run.fids.slice().sort().join() === "a,b,c,d,e,f");
  check("…with every edge in it", run.pairs.length === 5);
  /**
   * ⚠️ This replaced a walk that stopped at junctions, within the hour. That walk answered "what
   * corridor is this?" — right for "highlight the whole path", wrong the moment the network became
   * an entity. You do not highlight part of an entity because there is a fork in it.
   */
  check("hovering the far end lights the same network",
        networkRun(edges, "e").fids.length === run.fids.length);
  check("a node nobody has heard of is still itself", networkRun(edges, "zz").fids.join() === "zz");
}

/* P10. The buffer, and the node source it needs. Olcay: "we need a bit of buffer so it's easy to
        click and edit." A path node draws 2–3px across: enough to read as texture, nowhere near
        enough to hit. */
{
  gjTeardown(null);
  HIDDEN_BY_TYPE.clear();
  const m = fakeMap();
  __setMap(m);
  __setNodes([node("a", [0, 0], ["b"]), node("b", [1, 0], ["a"]), node("z", [5, 5], [])]);
  __setHidden(SHOW_WF);
  const info = console.info; console.info = () => {};
  wfBuildEdges();
  applyWayfinding();
  console.info = info;

  check("the nodes are drawn from our own source, which is the only one that can carry a network id",
        m.getLayer(WF_NODE).source === "__wf_nodes");
  check("…and the hit target is one layer, the ink another",
        !!m.getLayer("__wf_node_hit") && !!m.getLayer("__wf_edge_hit"));
  // ⚠️ Under the ink, so a buffer never changes what the floor looks like.
  const ids = m.layers.map((l) => l.id);
  check("the buffer sits UNDER the marks it is for",
        ids.indexOf("__wf_node_hit") < ids.indexOf(WF_NODE) &&
        ids.indexOf("__wf_edge_hit") < ids.indexOf(WF_NODE));
  const hit = m.getLayer("__wf_node_hit");
  check("…and is far bigger than what you can see", hit.paint["circle-radius"] >= 8);
  // Invisible, but NOT at zero opacity: a layer at zero is not hit-tested at all.
  check("invisible without being absent", hit.paint["circle-opacity"] > 0 && hit.paint["circle-opacity"] < 0.01);

  const fc = m.sources.get("__wf_nodes").data;
  check("every node carries the network it belongs to", fc.features.every((f) => f.properties.net >= 0));
  check("…and the two connected ones share it",
        fc.features[0].properties.net === fc.features[1].properties.net);
  check("…while the lone one does not", fc.features[2].properties.net !== fc.features[0].properties.net);
  check("the edges carry it too, so one comparison lights a whole network",
        m.sources.get("__wf_edges").data.features.every((f) => f.properties.net >= 0));
  check("and the map reported the networks up for the tree",
        POSTED.some((p) => p.type === "networks" && p.networks.length === 2));

  __setHidden(null);
  applyWayfinding();
  wfRemove();
  __setNodes([]);
}

/* P8. ⚠️ The regression that made the lines vanish. Olcay: "edges (lines) disappear after a while."

   `wfRemove` runs whenever the layers must be rebuilt — most often because the render swap went
   live and the nodes moved from the tiles to the GeoJSON source, a few frames after load. "After a
   while" is exactly that. It used to throw the computed edges away with the layers, and only a
   fresh `levelpaths` message ever rebuilt them — which does not come again for a level already
   fetched. So the layers came back, the nodes with them, and the lines came back EMPTY. */
{
  gjTeardown(null);
  HIDDEN_BY_TYPE.clear();
  const m = fakeMap();
  __setMap(m);
  __setNodes([node("a", [0, 0], ["b"]), node("b", [1, 0], ["a"])]);
  __setHidden(SHOW_WF);
  applyWayfinding();
  const info = console.info; console.info = () => {};
  wfBuildEdges();
  console.info = info;
  check("the edges are built", __edges().length === 1);
  check("…and the source has them",
        m.sources.get("__wf_edges").data.features.length === 1);

  wfRemove();                                   // exactly what a source flip does
  check("⚠️ removing the layers does NOT forget what they were drawing", __edges().length === 1);
  applyWayfinding();                            // …and the rebuild has them again
  check("the lines come back with the layers",
        m.sources.get("__wf_edges").data.features.length === 1);

  // Even from nothing: the nodes are the source of truth and the edges derive from them.
  __setNodes([node("x", [0, 0], ["y"]), node("y", [1, 1], [])]);
  check("edges rebuild themselves from the nodes on demand", wfEnsureEdges().length === 1);

  __setHidden(null);
  applyWayfinding();
  wfRemove();
  __setNodes([]);
}

/* P11. The three states, and the ONE mechanism that draws them. Olcay: "onHover the dots should not
        get larger… nodes should get larger in edit mode… there should be a color change…" and then,
        twice over: "hover and selected states not working on the nodes."

        ⚠️ They were three circle layers stacked over the nodes, each filtered to the right features.
        Every filter was provably correct — this harness set them and read them back — and on screen
        nothing changed. Stacking depends on draw order, on both layers surviving every rebuild, and
        on nothing else touching either: three things to be right, none visible when wrong. A paint
        expression on the layer you can already SEE has none of that. */
{
  gjTeardown(null);
  HIDDEN_BY_TYPE.clear();
  const m = fakeMap();
  __setMap(m);
  __setNodes([node("a", [0, 0], ["b"]), node("b", [1, 0], ["a"]), node("z", [5, 5], [])]);
  __setHidden(SHOW_WF);
  const info = console.info; console.info = () => {};
  wfBuildEdges();
  applyWayfinding();
  console.info = info;

  const R = (id) => JSON.stringify(m.getPaintProperty(id, "circle-radius"));
  const C = (id) => JSON.stringify(m.getPaintProperty(id, "circle-color"));
  const rest = R(WF_NODE);
  const plain = C(WF_NODE);

  // ⚠️ Only one layer draws a node, so a colour change lands where you are looking.
  check("nothing is stacked over the nodes",
        !m.getLayer("__wf_node_hl") && !m.getLayer("__wf_selected") && !m.getLayer("__wf_current"));

  wfHighlight("a");
  check("hovering changes the node's own colour", C(WF_NODE) !== plain);
  check("…and does NOT change its size", R(WF_NODE) === rest);
  check("…lighting the whole network by its id, not by naming every node",
        C(WF_NODE).indexOf('"net"') > 0);
  check("…and the corridors with it",
        JSON.stringify(m.getPaintProperty(WF_EDGE, "line-color")).indexOf('"net"') > 0);
  wfHighlight(null);
  /**
   * Not "the colour is the literal again" — it is a `case` that now falls THROUGH to the base,
   * which is the same pixel and a different expression. What must be true is that nothing is
   * singled out any more.
   */
  check("leaving stops singling anything out",
        C(WF_NODE).indexOf('"net"') < 0 && C(WF_NODE).indexOf('"fid"') < 0);
  check("…and the base colour is still what it falls back to", C(WF_NODE).indexOf(plain.slice(1, -1)) > 0);

  // Editing is a state, not a question — and only the state changes what you can DO with a node.
  wfSetEditing(0, "a");
  check("every node of the network grows into a handle", R(WF_NODE) !== rest);
  check("…and so do the transitions",
        JSON.stringify(m.getPaintProperty(WF_TRANSITION, "circle-radius"))
          === JSON.stringify(WF_R.transitionEdit));
  check("the network stays lit by its corridors",
        JSON.stringify(m.getPaintProperty(WF_EDGE, "line-color")).indexOf('"net"') > 0);
  check("the node you are on is marked apart", C(WF_NODE).indexOf('"a"') > 0);

  // Selection is a colour on the node itself, so it cannot be hidden behind anything.
  __sel(["a", "b"]);
  check("selected nodes change colour", C(WF_NODE).indexOf('"b"') > 0);
  check("…without changing size", R(WF_NODE) === JSON.stringify(WF_R.nodeEdit));
  __sel([]);

  wfSetEditing(null);
  check("leaving edit mode puts the dots back", R(WF_NODE) === rest);
  check("…and stops singling anything out",
        C(WF_NODE).indexOf('"net"') < 0 && C(WF_NODE).indexOf('"fid"') < 0);

  // The editor is handed the whole network, not the node that was clicked.
  const netNodes = wfNetworkNodes(0);
  check("the editor gets every node of the network", netNodes.length === 2);
  check("…each with somewhere to be dragged to", netNodes.every((n) => n.fid && n.at.length === 2));
  check("…and its adjacency, so undo can put a deleted one back",
        netNodes.every((n) => Array.isArray(n.neighbors)));

  __setHidden(null);
  applyWayfinding();
  wfRemove();
  __setNodes([]);
}

/* P11b. An edge is grabbable, and it is the SAME sentence that did the job for a room's edges:
         an edge IS its two ends. Olcay: "I should be able to click an edge and it should be
         highlighted as selected — I should then be able to move it which moves all the connected
         nodes to it too." */
{
  gjTeardown(null);
  HIDDEN_BY_TYPE.clear();
  const m = fakeMap();
  __setMap(m);
  __setNodes([node("a", [0, 0], ["b"]), node("b", [1, 0], ["a"]), node("z", [5, 5], [])]);
  __setHidden(SHOW_WF);
  const info = console.info; console.info = () => {};
  wfBuildEdges();
  applyWayfinding();
  console.info = info;

  // Selecting an edge is selecting its two nodes — so the edge draws selected for free.
  __sel(["a", "b"]);
  const C = JSON.stringify(m.getPaintProperty(WF_EDGE, "line-color"));
  check("an edge whose both ends are selected draws selected", C.indexOf('"from"') > 0);
  check("…on the same expression that lights the network, not a second layer",
        C.indexOf('"case"') === 1, C.slice(0, 40));
  __sel([]);
  check("nothing selected singles out no edge",
        JSON.stringify(m.getPaintProperty(WF_EDGE, "line-color")).indexOf('"from"') < 0);

  /**
   * The end you grabbed nearer leads the drag — the same rule a room's edges follow, and not
   * cosmetic: the leading node is the one Snap and the guides are computed for.
   */
  check("the near end leads", wfNearerEnd(["a", "b"], [2, 0]) === "a");
  check("…and so does the other one, from the other side", wfNearerEnd(["a", "b"], [900, 0]) === "b");

  __setHidden(null);
  applyWayfinding();
  wfRemove();
  __setNodes([]);
}

/* P12. Deleting nodes. Olcay: "shift and lasso select should work to select multiple nodes and
        delete too."

        ⚠️ Not the same act as deleting a corner, and this is where that bites. A polygon with a
        corner removed is still one polygon; a network with a node removed can be TWO networks, and
        the corridor that ran through it now goes nowhere — routing stops working, silently, on a
        floor that still looks fine. */
{
  const chain = [
    node("a", [0, 0], [{ fid: "b", speed: 1 }]),
    node("b", [1, 0], [{ fid: "a", speed: 1 }, { fid: "c", speed: 0.5 }]),
    node("c", [2, 0], [{ fid: "b", speed: 0.5 }]),
  ];
  const out = deleteNetworkNodes(chain, ["b"]);
  check("the node goes", out.nodes.length === 2 && !out.nodes.some((n) => n.fid === "b"));
  /**
   * ⚠️ The corridor survives. A node that merely carried the path on is CONTRACTED — its two sides
   * are joined — which is the graph's version of what deleting a redundant corner does to a ring.
   */
  check("…and its two sides are joined to each other", out.bridged === 1);
  check("a → c now exists", out.nodes[0].neighbors.some((n) => n.fid === "c"));
  check("…and c → a, because both directions existed", out.nodes[1].neighbors.some((n) => n.fid === "a"));
  // A corridor is no faster than its slowest half.
  check("the joined edge keeps the slower speed",
        out.nodes[0].neighbors.find((n) => n.fid === "c").speed === 0.5);
  check("nothing dangles at a fid that has gone",
        out.nodes.every((n) => n.neighbors.every((x) => x.fid !== "b")));
}

/* P13. ⚠️ Direction is preserved per direction: a one-way pair must not quietly become two-way
        because the node between them went. */
{
  //  a → b → c   one-way throughout
  const oneway = [
    node("a", [0, 0], ["b"]),
    node("b", [1, 0], ["c"]),
    node("c", [2, 0], []),
  ];
  const out = deleteNetworkNodes(oneway, ["b"]);
  check("a → c is made", out.nodes[0].neighbors.some((n) => n.fid === "c"));
  check("⚠️ …and c → a is NOT — the walk never existed",
        !out.nodes[1].neighbors.some((n) => n.fid === "a"));
}

/* P14. A junction cannot be contracted, and is not — joining every pair of its arms would invent
        corridors nobody drew, through walls. It says so instead. */
{
  const star = [
    node("j", [1, 1], ["a", "b", "c"]),
    node("a", [0, 0], ["j"]),
    node("b", [2, 0], ["j"]),
    node("c", [1, 2], ["j"]),
  ];
  const out = deleteNetworkNodes(star, ["j"]);
  check("the junction goes", out.nodes.length === 3);
  check("…nothing is invented between its arms",
        out.nodes.every((n) => n.neighbors.length === 0));
  check("…and it is REPORTED rather than left to be discovered", out.refused === 1);
  // Which is the honest outcome: the network is now three networks, and the count says so.
  const { list } = networkComponents(out.nodes, networkEdges(out.nodes).edges);
  check("the network really is in pieces now", list.length === 3);
}

/* P15. Several at once — the lasso's whole point — and the ends of the world. */
{
  const chain = [
    node("a", [0, 0], ["b"]),
    node("b", [1, 0], ["a", "c"]),
    node("c", [2, 0], ["b", "d"]),
    node("d", [3, 0], ["c"], ["upstairs"]),
  ];
  const out = deleteNetworkNodes(chain, ["b", "c"]);
  check("both go at once", out.nodes.length === 2 && out.removed === 2);
  /**
   * ⚠️ Neither can be contracted, because each one's far side is the OTHER deleted node — a
   * contraction has to land on something that survives. Two nodes with one link between them is not
   * a corridor with a hole in it; it is two ends of a corridor that is gone.
   */
  check("…and nothing is invented across the gap they leave",
        out.nodes.every((n) => n.neighbors.length === 0));

  check("deleting nothing changes nothing", deleteNetworkNodes(chain, []).nodes.length === 4);
  check("deleting a node nobody has heard of is harmless",
        deleteNetworkNodes(chain, ["zz"]).nodes.length === 4);
  // A transition to a node that has gone is a way out of the building that no longer exists.
  const gone = deleteNetworkNodes(chain, ["d"]);
  check("the whole network can be deleted", deleteNetworkNodes(chain, ["a", "b", "c", "d"]).nodes.length === 0);
  check("…and a surviving node keeps its own way off the floor",
        gone.nodes.every((n) => (n.transitionNeighbors || []).length === 0));
}

/* P16. Unlinking. Olcay: "I should be able to hover over an edge and unlink so it removes the
        neighbour relationship between nodes." The smallest edit this graph has — both nodes stay
        exactly where they are, and the walk between them stops existing. */
{
  const pair = [
    node("a", [0, 0], [{ fid: "b", speed: 1 }, "c"]),
    node("b", [1, 0], ["a"]),
    node("c", [2, 0], ["a"]),
  ];
  const out = unlinkNetworkNodes(pair, "a", "b");
  check("both nodes are still there", out.nodes.length === 3);
  check("…exactly where they were", JSON.stringify(out.nodes[0].at) === JSON.stringify([0, 0]));
  /**
   * ⚠️ Both directions go, because the LINE was the pair. Removing one reference would leave the
   * line drawn — as a one-way, complete with arrowheads — which is not "unlink", it is a silent
   * change of meaning.
   */
  check("a no longer names b", !out.nodes[0].neighbors.some((n) => n.fid === "b"));
  check("…and b no longer names a", !out.nodes[1].neighbors.some((n) => n.fid === "a"));
  check("two references went", out.removed === 2);
  check("a's OTHER link is untouched", out.nodes[0].neighbors.some((n) => n.fid === "c"));

  // A one-way pair only ever had the one reference, so it is the same act with a smaller count.
  const oneway = [node("a", [0, 0], ["b"]), node("b", [1, 0], [])];
  check("a one-way link unlinks too", unlinkNetworkNodes(oneway, "a", "b").removed === 1);
  check("unlinking two nodes that were never linked changes nothing",
        unlinkNetworkNodes(pair, "b", "c").removed === 0);

  // It can split a network in two — a real outcome, and the editor says so rather than hiding it.
  const chain = [node("a", [0, 0], ["b"]), node("b", [1, 0], ["a", "c"]), node("c", [2, 0], ["b"])];
  const cut = unlinkNetworkNodes(chain, "b", "c");
  const { list } = networkComponents(cut.nodes, networkEdges(cut.nodes).edges);
  check("…and where it splits the network, it really is two now", list.length === 2);
}

/* ══ PERSONA — the app sees what the map draws ══════════════════════════════
   Olcay, 2026-08-17: "let's also use facilityManager map persona on the app."

   ⚠️ The SDK applies the persona to what it DRAWS. querySourceFeatures reads the SOURCE, not the
   layers, so everything the shell counts and reports has always included features the map itself
   was hiding — the tree could list a back-of-house room the floor never drew, on a screen whose
   whole point is that the list and the map agree. */
console.log("\npersona");

/**
 * ⚠️ **The rule is written TWICE and this block is the only thing holding the two together** — the
 * shell's `personaOk()` (it cannot import from `src/`) and the app's `isVisibleToPersona()`.
 *
 * That sentence used to be in the shell and was **false**: this block asked only `personaOk`, and
 * `visibleToPersona` was never named here once. It had drifted — it tested `Array.isArray` and so
 * returned "visible" for the string shape a vector tile produces, meaning the app's persona filter
 * silently did nothing on tile-shaped data while the shell's worked. Fixed 2026-08-28.
 *
 * So every case below runs through **both**, and a divergence fails on its own line. Adding a case
 * to the table is the whole cost of keeping them honest.
 */
const personaSrc = readFileSync(join(here, "..", "src", "mock", "personaVisibility.ts"), "utf8");
const personaJs = join(here, `.personaVisibility.${process.pid}.mjs`);
writeFileSync(
  personaJs,
  ts.transpileModule(personaSrc, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText,
);
let personaMod;
try {
  personaMod = await import(pathToFileURL(personaJs).href);
} finally {
  unlinkSync(personaJs);
}
const { isVisibleToPersona } = personaMod;

{
  const PERSONA = "facilityManager";

  /**
   * One table, both implementations. `props` is what the shell is handed (a property bag);
   * `isVisibleToPersona` takes the field itself, which is the only difference in their signatures.
   */
  const table = [
    ["a feature meant for this persona is visible", { mapPersonas: ["staff", "facilityManager"] }, true],
    ["…and one that is not, is not", { mapPersonas: ["customer", "visitor"] }, false],

    /* ⚠️ No `mapPersonas` at all means VISIBLE — unmarked is unclassified, not private. Reading it
       the other way would quietly empty a floor whose content predates personas. */
    ["unmarked is unclassified, not private", { name: "Costa" }, true],
    ["…and so is an empty list", { mapPersonas: [] }, true],
    ["…and so is an empty string", { mapPersonas: "" }, true],

    /* ⚠️ A vector tile flattens an array property to a string. The same feature arrives as a real
       array from our own GeoJSON and as "customer,facilityManager" from the tiles — so the rule has
       to read both, or the persona applies on one render path and not the other. THIS is the pair
       the app's copy failed. */
    ["a tile's flattened list is read too", { mapPersonas: "staff,facilityManager" }, true],
    ["…including the bracketed form", { mapPersonas: '["vip","facilityManager"]' }, true],
    ["…and the bracketed form still excludes", { mapPersonas: '["customer","visitor"]' }, false],
    ["…and the flattened form still excludes", { mapPersonas: "customer,visitor" }, false],
    ["whitespace in a flattened list is ignored", { mapPersonas: "customer, facilityManager" }, true],

    // ⚠️ Not a substring match: "facilityManagerAssistant" is a different persona.
    ["it matches whole keys, not substrings", { mapPersonas: "facilityManagerAssistant" }, false],
  ];

  for (const [name, props, expected] of table) {
    check(`${name} · shell`, personaOk(props) === expected);
    check(`${name} · app`, isVisibleToPersona(props.mapPersonas, PERSONA) === expected);
  }

  check("no properties at all does not throw · shell", personaOk(null) && personaOk(undefined));
  check("no properties at all does not throw · app",
        isVisibleToPersona(null, PERSONA) && isVisibleToPersona(undefined, PERSONA));

  /**
   * ⚠️ **No persona means no filtering.** Without this guard an empty persona matches nothing and
   * every marked feature on the floor disappears — a blank building presented as a working one.
   * The shell has always guarded it; the app's copy did not until 2026-08-28. `MAP_PERSONA` uses
   * `??`, which does NOT catch an env var set to the empty string, so this is reachable.
   */
  check("an empty persona filters nothing, it does not hide everything",
        isVisibleToPersona(["staff", "customer"], "") === true);
}

/* ══ REACH — what a section lets you touch ══════════════════════════════════
   Olcay, 2026-08-16: "Clicking would only edit the network and transitions but not POIs and other
   indoor data. Similar approach with Geofences and IoT Devices."

   Three lists meet in one function, and every hover, click, panel and editor comes through it. */
console.log("\nreach");

/** A map that returns a fixed stack of features under the pointer, topmost first. */
function reachMap(feats) {
  return { queryRenderedFeatures: () => feats };
}
const F = (fid, mainType, subType) => ({ properties: { fid, mainType, subType } });

const ROOM = F("r1", "retail-space");
const WALL = F("w1", "wall");
const NODE = F("n1", "wayfinding-network", "path-node");
const LIFT = F("n2", "wayfinding-network", "elevator-node");

/* R1. Map Content: everything answers, less the quiet types under a hover. */
{
  __setMap(reachMap([ROOM, WALL]));
  __setReach(null, [], ["wall"]);
  check("a room answers a click", editableAt([0, 0]) === ROOM);
  check("…and a hover", hoverableAt([0, 0]) === ROOM);

  __setMap(reachMap([WALL, ROOM]));
  check("a wall answers a click — structural click works", editableAt([0, 0]) === WALL);
  // ⚠️ Silence is not inertness: the wall is skipped for a HOVER and the room behind it answers.
  check("…but not a hover, so 700 walls do not bury the POI cards", hoverableAt([0, 0]) === ROOM);
}

/* R2. A section: only its own content answers, whatever is drawn underneath. */
{
  __setMap(reachMap([ROOM, NODE]));
  __setReach("wayfinding-network", [], ["wall", "wayfinding-network"]);
  check("⚠️ a room does NOT answer on the wayfinding section", editableAt([0, 0]) === NODE);
  check("a network node does", editableAt([0, 0]).properties.fid === "n1");

  __setMap(reachMap([LIFT]));
  check("…and so does a transition — both are the same mainType",
        editableAt([0, 0]) === LIFT);

  __setMap(reachMap([ROOM, WALL]));
  check("a section with none of its own content under the pointer answers nothing",
        editableAt([0, 0]) === null);

  // The floor plan is still DRAWN — this is about what answers, not about what is on screen.
  __setMap(reachMap([ROOM, NODE]));
  __setReach("geofence", [], []);
  check("the geofence section ignores the network too, not just POIs", editableAt([0, 0]) === null);
}

/* R3. The three rules compose, and the order they compose in is a decision.
      A blocked type is unreachable even inside its own section — that is what locking will mean. */
{
  __setMap(reachMap([NODE]));
  __setReach("wayfinding-network", ["wayfinding-network"], []);
  check("a locked type stays unreachable in its own section", editableAt([0, 0]) === null);

  // "Not told yet" is the safe direction: nothing is touchable until the app has said so.
  __setReach(null, null, null);
  __setMap(reachMap([ROOM]));
  check("told nothing, nothing is touchable", editableAt([0, 0]) === null);
}

/* ── P. the review preview — what a decided change does to the map ─────────── */

console.log("\nreview preview");

/* P1. The table itself, every cell. Written out rather than generated, because the point of the
      test is that somebody reading it can see the asymmetry and agree with it. */
{
  const fate = (type, decision, override) => previewFate({ type, decision, override });

  // Undecided: still a diff. This is the only state that asks anything of the reviewer.
  for (const t of ["new", "geometry", "metadata", "deleted", "preserved"])
    check(`an undecided ${t} change still paints its type colour`, fate(t, undefined) === "diff");

  // ⚠️ The asymmetry, and the reason this file exists: `reject` means opposite things depending on
  // what was proposed. Rejecting an ADDITION takes it off the floor; rejecting a REMOVAL keeps it.
  check("a rejected addition leaves the floor", fate("new", "reject") === "ghost");
  check("⚠️ a rejected REMOVAL stays — rejecting is how you keep it",
        fate("deleted", "reject") === "plain");
  check("a confirmed removal leaves the floor", fate("deleted", "confirm") === "ghost");
  check("a confirmed addition stays, and stops being a diff",
        fate("new", "confirm") === "plain");

  // An update never changes whether the feature exists — only what it looks like or is called.
  for (const d of ["confirm", "reject"])
    for (const t of ["geometry", "metadata"])
      check(`a ${d}ed ${t} update keeps the feature on the floor`, fate(t, d) === "plain");

  // An edit outranks whatever was decided before it, for every type — including a removal, where
  // "I edited it" can only mean "it stays, with my value on it".
  for (const t of ["new", "geometry", "metadata", "deleted", "preserved"])
    for (const d of [undefined, "confirm", "reject"])
      check(`an edited ${t} is mine, whatever was decided first`, fate(t, d, { name: "x" }) === "mine");
}

/* P2. The outcome, and the ink that follows from it. */
{
  check("no decision, no outcome", outcomeOf({ type: "new" }) === null);
  check("a decision is the outcome", outcomeOf({ type: "new", decision: "reject" }) === "reject");
  check("⚠️ an override outranks the decision under it",
        outcomeOf({ type: "new", decision: "confirm", override: { name: "x" } }) === "edited");

  check("a decision draws in muted ink, never green or red",
        outcomeInk("confirm") === DECISION_INK && outcomeInk("reject") === DECISION_INK);
  check("an edit draws in the override purple", outcomeInk("edited") === OVERRIDE_INK);
  check("⚠️ the override purple is `preserved`'s own colour — an edit and a carried-through "
        + "override are one fact at two ages", OVERRIDE_INK === "#6D28D9");
}

/* ── F. the floor-plan outline's source ────────────────────────────────────── */

console.log("\nfloor-plan source");

/* F1. Three sources, in priority order — and the middle one is the whole point. */
{
  check("nothing available → the outline traces the published tiles",
        fpMode(false, false) === "tiles");
  check("⚠️ draft geometry posted, render swap OFF → the outline traces the DRAFT",
        fpMode(false, true) === "draft");
  check("the render swap live → the outline follows the floor, which is already the draft",
        fpMode(true, false) === "gj");
  check("the swap outranks the draft-only mode — both are the draft, one is already on screen",
        fpMode(true, true) === "gj");
}

/* F2. Each mode owns its own layer-id prefix. This is what lets a mode change find its own layers
      and nobody else's — without it the floor gets traced twice from two datasets at once. */
{
  const ids = [FP_PREFIX.tiles, FP_PREFIX.draft, FP_PREFIX.gj];
  check("every mode has a prefix", ids.every((p) => typeof p === "string" && p.length > 0));
  check("⚠️ the three prefixes are distinct", new Set(ids).size === 3);
  // `__fp_` is a prefix OF `__fp_gj_` and `__fp_dr_`, so a teardown that matched on "starts with
  // the tiles prefix" would take all three down. Whatever matches must be exact per mode.
  check("the tiles prefix is a prefix of the other two — teardown must key on the MODE, not a "
        + "string match",
        FP_PREFIX.gj.startsWith(FP_PREFIX.tiles) && FP_PREFIX.draft.startsWith(FP_PREFIX.tiles));
}

/* P6. An OPEN edit session previews its own outcome — the rule that makes a removal editable. */
{
  const ghosted = { id: "pharmacy", type: "deleted", decision: "confirm" };
  const rejectedNew = { id: "costa", type: "new", decision: "reject" };

  check("a confirmed removal is a ghost while nothing is open",
        previewFate(ghosted) === "ghost");
  check("a rejected addition is a ghost too", previewFate(rejectedNew) === "ghost");

  setEditingChange("pharmacy");
  // ⚠️ This is the whole reason the rule exists: a ghost is a dashed outline with NO FILL, and you
  // cannot edit a shape you cannot see.
  check("opening its editor makes the removal draw as YOURS",
        previewFate(ghosted) === "mine");
  check("and it generalises — the rejected addition is untouched while a DIFFERENT change is open",
        previewFate(rejectedNew) === "ghost");

  setEditingChange("costa");
  check("the rule is not special-cased to removals",
        previewFate(rejectedNew) === "mine");
  check("and the removal goes back to being a ghost", previewFate(ghosted) === "ghost");

  setEditingChange(null);
  check("cancelling puts everything back", previewFate(ghosted) === "ghost");
  check("...both of them", previewFate(rejectedNew) === "ghost");

  // An open session must not invent an outcome for a row that has none.
  setEditingChange("nothing-open");
  check("an id that matches no change changes nothing",
        previewFate({ id: "costa", type: "new" }) === "diff");
  setEditingChange(null);
}

/* ── Q. the override's vocabulary — what an edit PRINTS ────────────────────── */

console.log("\noverride lines");

/**
 * ⚠️ `src/mock/overrideLines.ts` imports NOTHING, which is the only reason this can reach it: the
 * module is transpiled type-stripped and imported directly. Everything else under `src/` pulls a
 * graph the harness cannot resolve, which is exactly why the override's two TABLES — the sentence
 * and the order — were put in a module of their own rather than left in `diff.ts`.
 */
const ovSrc = readFileSync(join(here, "..", "src", "mock", "overrideLines.ts"), "utf8");
const ovJs = join(here, `.overrideLines.${process.pid}.mjs`);
writeFileSync(
  ovJs,
  ts.transpileModule(ovSrc, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText,
);
let ov;
try {
  ov = await import(pathToFileURL(ovJs).href);
} finally {
  unlinkSync(ovJs);
}
const { overrideLine, overrideDetails, splitOverrideLines, REMOVAL_OVERRIDDEN, SHOWN_LINES, FITS } = ov;

/* Q1. The sentence table, cell by cell. Written out rather than generated: the point is that
      somebody reading it can see the rule — print the change when it fits, name it when it does
      not — and agree with it. */
{
  const L = (a, b) => overrideLine("Name", a, b);

  check("nothing to nothing says nothing", L(undefined, undefined) === null);
  check("nothing to an empty string says nothing", L(undefined, "") === null);
  check("whitespace is nothing", L(undefined, "   ") === null);
  check("unchanged says nothing", L("Costa", "Costa") === null);

  check("a value arriving prints it", L(undefined, "Costa") === 'Name: “Costa”');
  check("a value leaving is NAMED, never printed", L("Costa", undefined) === "Name removed");
  check("a change that fits is printed",
        L("Costa", "Costa Coffee") === 'Name: “Costa” → “Costa Coffee”');

  const long = "x".repeat(FITS + 1);
  check("too long on the RIGHT is named", L("Costa", long) === "Name changed");
  check("too long on the LEFT is named", L(long, "Costa") === "Name changed");
  check("too long arriving is named", L(undefined, long) === "Name added");
  check(`exactly ${FITS} still fits`,
        L("a", "x".repeat(FITS)) === `Name: “a” → “${"x".repeat(FITS)}”`);
}

/* Q2. Quoting is for STRINGS only. `Cuisines: “3 values”` reads as though the value were that
      literal text — the cell most likely to be wrong, and invisible in a screenshot. */
{
  check("a boolean is bare, not quoted",
        overrideLine("Has Wifi", false, true) === "Has Wifi: no → yes");
  check("false is a VALUE, not an absence",
        overrideLine("Has Wifi", undefined, false) === "Has Wifi: no");
  check("a number is bare", overrideLine("Seats", 4, 12) === "Seats: 4 → 12");
  check("a list reports its COUNT, bare",
        overrideLine("Cuisines", ["a", "b"], ["a", "b", "c"]) === "Cuisines: 2 values → 3 values");
  check("one item is singular", overrideLine("Cuisines", undefined, ["a"]) === "Cuisines: 1 value");
  check("an empty list is nothing", overrideLine("Cuisines", undefined, []) === null);
  check("a same-length list still reports change only when the count moves",
        overrideLine("Cuisines", ["a", "b"], ["c", "d"]) === null);
}

/* Q3. The ORDER, which is what makes the three-line cap safe: the identity set comes first, so the
      common edit never truncates. */
{
  const label = { type: (s) => s.toUpperCase(), prop: (s) => "P:" + s };
  const change = { type: "deleted", name: "DDF Pharmacy", kind: "retail" };
  const lines = overrideDetails(
    change,
    {
      name: "DDF Pharmacy — Gate B22",
      kind: "pharmacy",
      details: ["Boundary redrawn by hand"],
      props: { openingHours: "24h" },
      removedProps: ["phone"],
    },
    { openingHours: "06:00–22:00", phone: "+971" },
    label,
  );
  check("a removal that is overridden says so FIRST", lines[0] === REMOVAL_OVERRIDDEN);
  check("then Name", lines[1].startsWith("Name: "));
  check("then Type", lines[2].startsWith("Type: "));
  check("then the boundary", lines[3] === "Boundary redrawn by hand");
  check("then the properties", lines[4] === "P:openingHours: “06:00–22:00” → “24h”");
  check("then what was binned", lines[5] === "P:phone removed");
  check("and nothing else", lines.length === 6);

  // ⚠️ The removal line must not appear on an override that settled nothing — that is the no-op
  // guard's own case, and a purple row claiming an override nobody made is what it exists to stop.
  check("an EMPTY override on a removal says nothing at all",
        overrideDetails(change, {}, undefined, label).length === 0);
  check("a non-removal never gets the removal line",
        !overrideDetails({ type: "new", name: "Costa" }, { name: "Costa Coffee" }, undefined, label)
          .includes(REMOVAL_OVERRIDDEN));
  check("binning a field that was never set says nothing",
        overrideDetails({ type: "new", name: "C" }, { removedProps: ["phone"] }, {}, label)
          .length === 0);
}

/* Q4. The cap. Three shown, the rest behind the Details cap — NOT dropped. */
{
  const many = ["a", "b", "c", "d", "e"];
  const { shown, capped } = splitOverrideLines(many);
  check(`${SHOWN_LINES} lines are shown`, shown.length === SHOWN_LINES);
  check("the remainder is CAPPED, not lost", capped.join() === "d,e");
  check("nothing is dropped", shown.length + capped.length === many.length);
  const few = splitOverrideLines(["a", "b"]);
  check("a short override caps nothing", few.capped.length === 0 && few.shown.length === 2);
}

/* ── verdict ──────────────────────────────────────────────────────────────── */

console.log(failures
  ? `\n${failures} of ${checks} checks FAILED`
  : `\n${checks} checks passed`);
process.exit(failures ? 1 : 0);
