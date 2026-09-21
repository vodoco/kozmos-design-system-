#!/usr/bin/env node
/**
 * Holds the site to its one rule: what is on the page is Kozmos.
 *
 * TSX and TS (read with the TypeScript parser, not patterns):
 *  - imports come from React, React Router, the Kozmos packages or the site
 *    itself — no other UI library, icon set or class helper;
 *  - no raw HTML element where Kozmos has a component (div → Box, p → Text,
 *    button → Button, a → Link …); sectioning elements and <pre>/<code> are
 *    allowed, because Kozmos has no equivalent and they carry meaning;
 *  - `style` may only pass CSS custom properties, the way data reaches CSS;
 *  - no colour literal in any string.
 *
 * CSS:
 *  - no colour literal, named colour or `!important`;
 *  - typography only from Kozmos typography tokens (a size, line height,
 *    family or spacing named by a token variable), never a literal — and
 *    normally not at all: it comes from Text and Heading;
 *  - radii and shadows only from tokens; fixed spacing only from tokens;
 *  - no selector that reaches into Kozmos (.kozmos-*, [data-slot]).
 *
 * Every exception the site needs is a gap in Kozmos, recorded in GAPS.md.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const SITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ALLOWED_MODULES = [
  /^react$/,
  /^react-dom$/,
  /^react-router$/,
  /^@react-router\/dev\/(routes|config)$/,
  // A Kozmos package, a subpath of one, or its text (`?raw`) for the token pages.
  /^@kozmos\/(react|tokens|icons|product-contracts)(\/[\w./-]+)?(\?raw)?$/,
  /^\.{1,2}\//,
];

/** Node built-ins, for the unit tests only. */
const TEST_MODULES = [/^node:/];

/** Elements Kozmos has no component for, which carry meaning of their own. */
const ALLOWED_ELEMENTS = new Set([
  "html",
  "head",
  "body",
  "meta",
  "link",
  "main",
  "section",
  "article",
  "aside",
  "header",
  "footer",
  "nav",
  "form",
  "pre",
  "code",
  "kbd",
  "strong",
  "em",
  "br",
  "time",
  "abbr",
]);

const KOZMOS_FOR = {
  div: "Box, Stack or Surface",
  span: 'Text as="span"',
  p: "Text",
  h1: "Heading",
  h2: "Heading",
  h3: "Heading",
  h4: "Heading",
  h5: "Heading",
  h6: "Heading",
  a: "Link (or SiteLink / ButtonLink for this site's pages)",
  button: "Button or IconButton",
  input: "Input, Checkbox, Switch or RadioGroupItem",
  select: "Select",
  textarea: "Textarea",
  label: "Label or FieldWrapper",
  ul: "List",
  ol: "List",
  li: "ListItem",
  table: "Table",
  hr: "Separator",
  svg: "Icon",
  img: "a Kozmos component (none draws a plain image: record a gap)",
};

const COLOUR_FUNCTION = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const HEX_COLOUR = /(^|[^\w&])#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/i;

// The CSS named colours (CSS Color 4), for the colour-bearing properties.
const NAMED_COLOURS = new Set(
  (
    "aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue " +
    "blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk " +
    "crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki " +
    "darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen " +
    "darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue " +
    "dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite " +
    "gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki " +
    "lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan " +
    "lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen " +
    "lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen " +
    "magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen " +
    "mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream " +
    "mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid " +
    "palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum " +
    "powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown " +
    "seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen " +
    "steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen"
  ).split(" "),
);

const COLOUR_PROPERTY =
  /^(color|background(-color)?|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-color)?|outline(-color)?|fill|stroke|box-shadow|text-shadow|caret-color|accent-color|text-decoration(-color)?|column-rule(-color)?)$/;
const TYPOGRAPHY_PROPERTY =
  /^(font(-[a-z-]+)?|line-height|letter-spacing|word-spacing|text-transform|text-decoration(-[a-z-]+)?|text-align|text-indent)$/;
const RADIUS_PROPERTY = /^border(-[a-z-]+)?-radius$/;
const SHADOW_PROPERTY = /^(box-shadow|text-shadow)$/;
const SPACING_PROPERTY =
  /^(gap|row-gap|column-gap|margin(-[a-z-]+)?|padding(-[a-z-]+)?|inset(-[a-z-]+)?|top|right|bottom|left)$/;

/** Removes var(…) calls, however deeply nested their fallbacks are. */
function withoutVars(value) {
  let out = "";
  let index = 0;
  while (index < value.length) {
    const start = value.indexOf("var(", index);
    if (start === -1) {
      out += value.slice(index);
      break;
    }
    out += value.slice(index, start);
    let depth = 0;
    let cursor = start + 3;
    for (; cursor < value.length; cursor += 1) {
      if (value[cursor] === "(") depth += 1;
      else if (value[cursor] === ")") {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    index = cursor + 1;
  }
  return out;
}

/**
 * Whether a value is made of tokens and nothing else: every number in it
 * comes from a var(), allowing the `* 1px` that turns a unitless token into
 * a length.
 */
function tokenDriven(value) {
  if (!value.includes("var(")) return false;
  return !/\d/.test(withoutVars(value).replace(/\*\s*1(px|rem|em)\b/g, ""));
}

function lineOf(source, offset) {
  return source.slice(0, offset).split("\n").length;
}

/** Findings for one CSS file's text. */
export function checkCss(source, file = "input.css") {
  const findings = [];
  const report = (offset, rule, message) =>
    findings.push({ file, line: lineOf(source, offset), rule, message });

  // Keep offsets stable: blank comments out instead of removing them.
  const text = source.replace(/\/\*[\s\S]*?\*\//g, (comment) =>
    comment.replace(/[^\n]/g, " "),
  );

  const blocks = /([^{}]*)\{([^{}]*)\}/g;
  for (const block of text.matchAll(blocks)) {
    const selector = block[1].trim();
    const selectorOffset = block.index + block[0].indexOf(block[1].trimStart());
    if (/\.kozmos-|\[data-slot|\[data-kozmos/.test(selector)) {
      report(
        selectorOffset,
        "kozmos-internals",
        `"${selector}" reaches into a Kozmos component. Style your own elements; ask Kozmos for the rest.`,
      );
    }
    const bodyOffset = block.index + block[1].length + 1;
    let cursor = 0;
    for (const declaration of block[2].split(";")) {
      const offset = bodyOffset + cursor;
      cursor += declaration.length + 1;
      const colon = declaration.indexOf(":");
      if (colon === -1) continue;
      const property = declaration.slice(0, colon).trim().toLowerCase();
      const value = declaration.slice(colon + 1).trim();
      if (!property || !value) continue;
      const at = offset + declaration.search(/\S/);

      if (/!important/i.test(value)) {
        report(at, "important", `${property} uses !important.`);
      }
      if (HEX_COLOUR.test(value) || COLOUR_FUNCTION.test(value)) {
        report(at, "colour-literal", `${property}: ${value} — use a token.`);
      } else if (COLOUR_PROPERTY.test(property)) {
        const words = withoutVars(value).toLowerCase().match(/[a-z]+/g) ?? [];
        const named = words.find((word) => NAMED_COLOURS.has(word));
        if (named) {
          report(at, "colour-literal", `${property} names the colour "${named}" — use a token.`);
        }
      }
      if (property.startsWith("--")) continue;
      if (TYPOGRAPHY_PROPERTY.test(property) && !tokenDriven(value)) {
        report(
          at,
          "typography",
          `${property}: ${value} — typography comes from Text and Heading, or from a typography token.`,
        );
      }
      if (RADIUS_PROPERTY.test(property) && !value.includes("var(")) {
        report(at, "radius", `${property}: ${value} — use a radius token.`);
      }
      if (
        SHADOW_PROPERTY.test(property) &&
        !value.includes("var(") &&
        value !== "none"
      ) {
        report(at, "shadow", `${property}: ${value} — use an elevation token.`);
      }
      if (SPACING_PROPERTY.test(property)) {
        // Percentages are relative positions (centring, a pin on a map), which
        // a spacing scale cannot express; fixed lengths must be tokens.
        const bare = withoutVars(value).replace(/\*\s*1px/g, "");
        const length = bare.match(
          /(?<![\w-])-?(?:\d*\.)?\d+(?:px|rem|em|vh|vw|dvh|svh|lvh|ch|ex)\b/,
        );
        if (length && !/^-?0(?:\.0+)?[a-z%]*$/.test(length[0])) {
          report(at, "spacing", `${property}: ${value} — use a spacing token.`);
        }
      }
    }
  }
  return findings;
}

/** Findings for one TS or TSX file's text. */
export function checkScript(source, file = "input.tsx") {
  const findings = [];
  const isTest = /\.test\.[cm]?tsx?$/.test(file);
  const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind);
  const report = (node, rule, message) => {
    const { line } = tree.getLineAndCharacterOfPosition(node.getStart(tree));
    findings.push({ file, line: line + 1, rule, message });
  };

  function checkModule(node, specifier) {
    const allowed = [...ALLOWED_MODULES, ...(isTest ? TEST_MODULES : [])];
    if (!allowed.some((pattern) => pattern.test(specifier))) {
      report(node, "import", `"${specifier}" is not Kozmos. Use a Kozmos component, or record the gap.`);
    }
  }

  function checkElement(node, tagName) {
    const name = tagName.getText(tree);
    if (!/^[a-z]/.test(name) || name.includes(".") || name.includes("-")) return;
    if (ALLOWED_ELEMENTS.has(name)) return;
    const instead = KOZMOS_FOR[name];
    report(
      node,
      "element",
      instead ? `<${name}> — use ${instead}.` : `<${name}> is not on the list of allowed elements.`,
    );
  }

  function checkStyle(attribute) {
    const initializer = attribute.initializer;
    const expression =
      initializer && ts.isJsxExpression(initializer) ? initializer.expression : undefined;
    const onlyCustomProperties =
      expression &&
      ts.isObjectLiteralExpression(expression) &&
      expression.properties.every(
        (property) =>
          ts.isPropertyAssignment(property) &&
          ts.isStringLiteral(property.name) &&
          property.name.text.startsWith("--"),
      );
    if (!onlyCustomProperties) {
      report(attribute, "style", "style may only pass CSS custom properties; put the styling in CSS.");
    }
  }

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      checkModule(node, node.moduleSpecifier.text);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      checkModule(node, node.arguments[0].text);
    } else if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      checkElement(node, node.tagName);
    } else if (
      ts.isJsxAttribute(node) &&
      node.name.getText(tree) === "style"
    ) {
      checkStyle(node);
    } else if (
      // A unit test's sample colours are inputs to a parser, not paint on a page.
      !isTest &&
      (ts.isStringLiteral(node) ||
        ts.isNoSubstitutionTemplateLiteral(node) ||
        ts.isTemplateHead(node) ||
        ts.isTemplateMiddle(node) ||
        ts.isTemplateTail(node) ||
        ts.isJsxText(node))
    ) {
      const text = node.text ?? node.getText(tree);
      if (HEX_COLOUR.test(text) || COLOUR_FUNCTION.test(text)) {
        report(node, "colour-literal", `"${text.trim().slice(0, 40)}" holds a colour — use a token.`);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return findings;
}

function sourceFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      // Generated data is read, not written by hand, and holds no markup.
      if (entry.name === "generated") continue;
      files.push(...sourceFiles(full));
    } else if (/\.(tsx?|css)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
      files.push(full);
    }
  }
  return files;
}

/** Every finding in the site's src directory (or another root). */
export function checkSite(root = path.join(SITE_ROOT, "src")) {
  return sourceFiles(root).flatMap((file) => {
    const source = fs.readFileSync(file, "utf8");
    const relative = path.relative(SITE_ROOT, file);
    return file.endsWith(".css")
      ? checkCss(source, relative)
      : checkScript(source, relative);
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const findings = checkSite();
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line}  ${finding.rule}  ${finding.message}`);
  }
  if (findings.length > 0) {
    console.error(`\n${findings.length} finding(s). The site draws only with Kozmos; see GAPS.md.`);
    process.exit(1);
  }
  console.log("check-ds-only: every file draws with Kozmos only.");
}
