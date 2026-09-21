/**
 * A headless stand-in for the Figma Plugin API, so a painter in
 * `figma/foundations-importer/code.js` can be run from the terminal and its
 * output measured — the same way the web suites measure the DOM and the
 * Paparazzi goldens are measured with PIL.
 *
 * It models what the painters touch: frames, components, instances, text,
 * vectors, the auto-layout properties, fills and strokes, variable-bound
 * paints, shared plugin data, component properties and instance swaps. It
 * does not lay anything out: a text node's width is the sum of a fixed
 * advance per character, an auto-layout frame keeps the size it was given.
 * That is enough to assert the numbers a painter writes — a 64 square, a
 * counter placed 4 beyond its edge, a paint bound to a named variable — and
 * not enough to assert how Figma renders them. It is a unit test of the
 * painter, not a picture of the file.
 *
 * `loadPlugin` evaluates the plugin source in a fresh context whose `figma`
 * global is this mock and returns the context, so every top-level function
 * of the plugin (the painters, the helpers) is reachable by name.
 */
import fs from "node:fs";
import vm from "node:vm";

let nextId = 1;

const CHAR_ADVANCE = 0.55;

/**
 * Figma stores a paint whose colour is bound to a variable without its own
 * opacity: the paint renders at the variable's alpha, whatever the plugin
 * set. Measured on 2026-09-21 over REST — six translucent token paints read
 * back at 1. The mock does the same and records each drop, so a check can
 * fail on a painter that relies on a paint opacity Figma will not keep.
 */
export const boundPaintOpacityDrops = [];

function storePaints(node, paints) {
  if (!Array.isArray(paints)) return paints;
  return paints.map((paint) => {
    if (
      paint &&
      paint.boundVariables &&
      paint.boundVariables.color &&
      typeof paint.opacity === "number" &&
      paint.opacity < 1
    ) {
      boundPaintOpacityDrops.push({ node: node.name, opacity: paint.opacity });
      const kept = { ...paint };
      delete kept.opacity;
      return kept;
    }
    return paint;
  });
}

// Every node a findOne or findAll visits, and the pages searches start on, so
// a check can hold a painter to the pages it should read: a lookup that walks
// the Components page costs 27k nodes in the live file.
export const searchStats = { visits: 0, pageSearches: {} };

export function resetSearchStats() {
  searchStats.visits = 0;
  searchStats.pageSearches = {};
}

function countPageSearch(name) {
  searchStats.pageSearches[name] = (searchStats.pageSearches[name] || 0) + 1;
}

export class MockNode {
  constructor(type, name) {
    this.id = `${nextId++}:${nextId}`;
    this.type = type;
    this.name = name || type;
    this.parent = null;
    this.children = [];
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;
    this.visible = true;
    this.opacity = 1;
    this.fills = [];
    this.strokes = [];
    this.strokeWeight = 1;
    this.strokeAlign = "INSIDE";
    this.dashPattern = [];
    this.effects = [];
    this.cornerRadius = 0;
    this.clipsContent = false;
    this.layoutMode = "NONE";
    this.primaryAxisSizingMode = "AUTO";
    this.counterAxisSizingMode = "AUTO";
    this.primaryAxisAlignItems = "MIN";
    this.counterAxisAlignItems = "MIN";
    this.itemSpacing = 0;
    this.paddingLeft = 0;
    this.paddingRight = 0;
    this.paddingTop = 0;
    this.paddingBottom = 0;
    this.layoutPositioning = "AUTO";
    this.layoutSizingHorizontal = "FIXED";
    this.layoutSizingVertical = "FIXED";
    this.constraints = { horizontal: "MIN", vertical: "MIN" };
    this.rotation = 0;
    this.sharedPluginData = {};
    this.pluginData = {};
    this.componentPropertyReferences = null;
    this.boundVariables = {};
    if (type === "TEXT") {
      this.characters = "";
      this.fontName = { family: "Inter", style: "Regular" };
      this.fontSize = 12;
      this.lineHeight = { unit: "PIXELS", value: 16 };
      this.letterSpacing = { unit: "PERCENT", value: 0 };
      this.textAutoResize = "WIDTH_AND_HEIGHT";
      this.textAlignHorizontal = "LEFT";
      this.textAlignVertical = "TOP";
      this.textDecoration = "NONE";
      this.textTruncation = "DISABLED";
      this.maxLines = null;
      this.textStyleId = "";
    }
    if (type === "COMPONENT_SET" || type === "COMPONENT") {
      this.componentPropertyDefinitions = {};
      this.description = "";
      this.documentationLinks = [];
    }
    if (type === "COMPONENT") {
      this.variantProperties = null;
    }
    if (type === "INSTANCE") {
      this.mainComponent = null;
      this.isExposedInstance = false;
    }
  }

  get fills() {
    return this._fills;
  }

  set fills(value) {
    this._fills = storePaints(this, value);
  }

  get strokes() {
    return this._strokes;
  }

  set strokes(value) {
    this._strokes = storePaints(this, value);
  }

  get characters() {
    return this._characters || "";
  }

  set characters(value) {
    this._characters = value;
    this.remeasure();
  }

  remeasure() {
    if (this.type !== "TEXT") return;
    const size = typeof this.fontSize === "number" ? this.fontSize : 12;
    const line =
      this.lineHeight && typeof this.lineHeight.value === "number"
        ? this.lineHeight.value
        : size * 1.3;
    const measured = this.characters.length * size * CHAR_ADVANCE;
    if (this.textAutoResize === "WIDTH_AND_HEIGHT") {
      this.width = Math.max(1, measured);
      this.height = line;
    } else if (this.textAutoResize === "HEIGHT") {
      const lines = Math.max(1, Math.ceil(measured / Math.max(1, this.width)));
      const capped =
        typeof this.maxLines === "number"
          ? Math.min(lines, this.maxLines)
          : lines;
      this.height = capped * line;
    }
  }

  appendChild(child) {
    if (child.parent) child.parent.removeChild(child);
    child.parent = this;
    this.children.push(child);
  }

  insertChild(index, child) {
    if (child.parent) child.parent.removeChild(child);
    child.parent = this;
    this.children.splice(index, 0, child);
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index !== -1) this.children.splice(index, 1);
    child.parent = null;
  }

  remove() {
    if (this.parent) this.parent.removeChild(this);
    this.removed = true;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  resizeWithoutConstraints(width, height) {
    this.width = width;
    this.height = height;
  }

  rescale() {}

  findOne(predicate) {
    if (this.type === "PAGE") countPageSearch(this.name);
    for (const child of this.children) {
      searchStats.visits += 1;
      if (predicate(child)) return child;
      const nested = child.findOne(predicate);
      if (nested) return nested;
    }
    return null;
  }

  findAll(predicate) {
    if (this.type === "PAGE") countPageSearch(this.name);
    const out = [];
    for (const child of this.children) {
      searchStats.visits += 1;
      if (!predicate || predicate(child)) out.push(child);
      out.push(...child.findAll(predicate));
    }
    return out;
  }

  findChild(predicate) {
    return this.children.find(predicate) || null;
  }

  findChildren(predicate) {
    return this.children.filter(predicate);
  }

  async loadAsync() {}

  setSharedPluginData(namespace, key, value) {
    this.sharedPluginData[`${namespace}/${key}`] = value;
  }

  getSharedPluginData(namespace, key) {
    return this.sharedPluginData[`${namespace}/${key}`] || "";
  }

  setPluginData(key, value) {
    this.pluginData[key] = value;
  }

  getPluginData(key) {
    return this.pluginData[key] || "";
  }

  setBoundVariable(field, variable) {
    this.boundVariables[field] = variable
      ? { type: "VARIABLE_ALIAS", id: variable.id }
      : undefined;
  }

  async setTextStyleIdAsync(id) {
    this.textStyleId = id;
  }

  clone() {
    const copy = new MockNode(this.type, this.name);
    for (const key of Object.keys(this)) {
      if (key === "children" || key === "parent" || key === "id") continue;
      const value = this[key];
      copy[key] =
        value && typeof value === "object" ? structuredClone(value) : value;
    }
    for (const child of this.children) copy.appendChild(child.clone());
    return copy;
  }

  createInstance() {
    if (this.type !== "COMPONENT") {
      throw new Error("createInstance on a non-component");
    }
    const instance = this.clone();
    instance.type = "INSTANCE";
    instance.mainComponent = this;
    instance.isExposedInstance = false;
    instance.variantProperties = null;
    instance.componentProperties = {};
    return instance;
  }

  setProperties(properties) {
    if (this.type !== "INSTANCE")
      throw new Error("setProperties on a non-instance");
    for (const [key, value] of Object.entries(properties)) {
      const base = key.split("#")[0];
      this.componentProperties[key] = value;
      const text = this.findOne(
        (node) =>
          node.type === "TEXT" &&
          node.componentPropertyReferences &&
          node.componentPropertyReferences.characters &&
          node.componentPropertyReferences.characters.split("#")[0] === base,
      );
      if (text && typeof value === "string") text.characters = value;
    }
  }

  addComponentProperty(name, type, defaultValue, options) {
    const key = `${name}#${nextId++}:0`;
    this.componentPropertyDefinitions[key] = {
      type,
      defaultValue,
      preferredValues: options && options.preferredValues,
    };
    return key;
  }

  editComponentProperty(name, patch) {
    const definition = this.componentPropertyDefinitions[name];
    if (!definition) throw new Error(`no property ${name}`);
    Object.assign(definition, patch);
    return name;
  }

  deleteComponentProperty(name) {
    delete this.componentPropertyDefinitions[name];
  }
}

/** A component set whose variants are named `Axis=Value, …`. */
export function mockComponentSet(name, variants) {
  const set = new MockNode("COMPONENT_SET", name);
  for (const { properties, build } of variants) {
    const variant = new MockNode("COMPONENT");
    variant.name = Object.entries(properties)
      .map(([axis, value]) => `${axis}=${value}`)
      .join(", ");
    variant.variantProperties = { ...properties };
    if (build) build(variant);
    set.appendChild(variant);
  }
  return set;
}

/** A curated icon source: a 24 component holding one stroked vector. */
export function mockIconComponent(name) {
  const component = new MockNode("COMPONENT", `Icon / ${name}`);
  component.resize(24, 24);
  const vector = new MockNode("VECTOR", "Vector");
  vector.resize(24, 24);
  vector.strokes = [
    { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1, visible: true },
  ];
  vector.strokeWeight = 2;
  component.appendChild(vector);
  return component;
}

// Figma's rules for layout sizing, with its own messages, so a painter that
// asks for one Figma refuses is caught here rather than in the live file's
// run log: HUG takes an auto-layout frame, or text inside one; FILL takes a
// child of an auto-layout frame. The plugin's setters catch and record a
// refusal, as they do in Figma.
const layoutSizingValues = Symbol("layoutSizing");
function isAutoLayoutNode(node) {
  return Boolean(node && node.layoutMode && node.layoutMode !== "NONE");
}
for (const axis of ["layoutSizingHorizontal", "layoutSizingVertical"]) {
  Object.defineProperty(MockNode.prototype, axis, {
    configurable: true,
    get() {
      return (this[layoutSizingValues] && this[layoutSizingValues][axis]) || "FIXED";
    },
    set(value) {
      if (
        value === "HUG" &&
        !isAutoLayoutNode(this) &&
        !(this.type === "TEXT" && isAutoLayoutNode(this.parent))
      ) {
        throw new Error(
          `in set_${axis}: HUG can only be set on auto-layout frames or text children of auto-layout frames`,
        );
      }
      if (value === "FILL" && !isAutoLayoutNode(this.parent)) {
        throw new Error(
          `in set_${axis}: node must be an auto-layout frame or a child of an auto-layout frame`,
        );
      }
      if (!this[layoutSizingValues]) this[layoutSizingValues] = {};
      this[layoutSizingValues][axis] = value;
    },
  });
}

export function createFigmaMock({ pages }) {
  const root = new MockNode("DOCUMENT", "Document");
  for (const page of pages) root.appendChild(page);
  const figma = {
    root,
    currentPage: pages[0],
    mixed: Symbol("mixed"),
    editorType: "figma",
    apiVersion: "1.0.0",
    pluginId: "harness",
    createFrame: () => new MockNode("FRAME", "Frame"),
    createComponent: () => new MockNode("COMPONENT", "Component"),
    createText: () => new MockNode("TEXT", "Text"),
    createRectangle: () => new MockNode("RECTANGLE", "Rectangle"),
    createEllipse: () => new MockNode("ELLIPSE", "Ellipse"),
    createLine: () => new MockNode("LINE", "Line"),
    createVector: () => new MockNode("VECTOR", "Vector"),
    createPage: () => {
      const page = new MockNode("PAGE", "Page");
      root.appendChild(page);
      return page;
    },
    createNodeFromSvg: (svg) => {
      const frame = new MockNode("FRAME", "Svg");
      frame.svg = svg;
      const vector = new MockNode("VECTOR", "Vector");
      vector.strokes = [
        {
          type: "SOLID",
          color: { r: 0, g: 0, b: 0 },
          opacity: 1,
          visible: true,
        },
      ];
      frame.appendChild(vector);
      return frame;
    },
    createSlot: () => new MockNode("SLOT", "Slot"),
    combineAsVariants: (components, parent) => {
      const set = new MockNode("COMPONENT_SET", "Component Set");
      for (const component of components) set.appendChild(component);
      parent.appendChild(set);
      return set;
    },
    setCurrentPageAsync: async (page) => {
      figma.currentPage = page;
    },
    loadFontAsync: async () => {},
    listAvailableFontsAsync: async () => [],
    getLocalTextStylesAsync: async () => [],
    getLocalPaintStylesAsync: async () => [],
    getLocalEffectStylesAsync: async () => [],
    getNodeByIdAsync: async (id) => root.findOne((node) => node.id === id),
    importComponentByKeyAsync: async () => {
      throw new Error("no library in the harness");
    },
    variables: {
      setBoundVariableForPaint: (paint, field, variable) => ({
        ...paint,
        boundVariables: {
          ...(paint.boundVariables || {}),
          [field]: { type: "VARIABLE_ALIAS", id: variable.id },
        },
      }),
      setBoundVariableForEffect: (effect, field, variable) => ({
        ...effect,
        boundVariables: {
          ...(effect.boundVariables || {}),
          [field]: { type: "VARIABLE_ALIAS", id: variable.id },
        },
      }),
      getLocalVariablesAsync: async () => [],
      getLocalVariableCollectionsAsync: async () => [],
      getVariableByIdAsync: async () => null,
      createVariable: () => {
        throw new Error("the harness does not create variables");
      },
    },
    ui: { postMessage() {}, onmessage: null, on() {}, once() {}, off() {} },
    showUI() {},
    on() {},
    once() {},
    off() {},
    notify() {},
    closePlugin() {},
    viewport: { scrollAndZoomIntoView() {}, center: { x: 0, y: 0 }, zoom: 1 },
    clientStorage: { getAsync: async () => null, setAsync: async () => {} },
    util: {
      rgb: (hex) => parseHex(hex),
      solidPaint: (hex) => ({
        type: "SOLID",
        color: parseHex(hex),
        opacity: 1,
      }),
    },
  };
  return figma;
}

function parseHex(hex) {
  const clean = String(hex).replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16) / 255,
    g: parseInt(clean.slice(2, 4), 16) / 255,
    b: parseInt(clean.slice(4, 6), 16) / 255,
  };
}

/** A variable index like the plugin's `variableByName`, from a list of names. */
export function mockVariables(names) {
  const byName = new Map();
  for (const name of names)
    byName.set(name, { id: `VariableID:${name}`, name });
  return byName;
}

export const FONTS = {
  regular: { family: "Inter", style: "Regular" },
  medium: { family: "Inter", style: "Medium" },
  bold: { family: "Inter", style: "Bold" },
};

export function freshStats() {
  return { warnings: [], created: false, variants: 0 };
}

/**
 * Evaluate the plugin in a context whose `figma` is the mock. Returns the
 * context: `context.updateCategoryTileVariant`, `context.KOZMOS_RADIUS` and
 * every other top-level binding of `code.js` are properties on it.
 */
export function loadPlugin({ pluginPath, figma }) {
  const source = fs.readFileSync(pluginPath, "utf8");
  const context = vm.createContext({
    figma,
    __html__: "",
    console,
    setTimeout,
    clearTimeout,
    Promise,
    structuredClone,
  });
  // The plugin's top-level `const`/`function` declarations are script-scoped
  // in a vm context, which keeps them off the context object. Appending an
  // export of every top-level binding puts them where a test can reach them.
  const bindings = [
    ...source.matchAll(/^(?:async )?function ([A-Za-z0-9_$]+)\s*\(/gm),
    ...source.matchAll(/^(?:const|let|var) ([A-Za-z0-9_$]+)\s*=/gm),
  ].map((m) => m[1]);
  const unique = [...new Set(bindings)];
  const exporter = `\n;(() => { const __h = {}; ${unique
    .map(
      (name) => `try { __h[${JSON.stringify(name)}] = ${name}; } catch (_) {}`,
    )
    .join(" ")} globalThis.__harness = __h; })();`;
  vm.runInContext(source + exporter, context, { filename: pluginPath });
  return context.__harness;
}

/** The name of the variable a paint is bound to, or null. */
export function boundVariableName(paint) {
  const alias = paint && paint.boundVariables && paint.boundVariables.color;
  if (!alias) return null;
  return String(alias.id).replace(/^VariableID:/, "");
}

export function hexOf(paint) {
  if (!paint || paint.type !== "SOLID") return null;
  const to = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
  return `#${to(paint.color.r)}${to(paint.color.g)}${to(paint.color.b)}`;
}
