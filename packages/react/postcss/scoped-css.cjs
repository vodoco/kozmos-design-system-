// eslint-disable-next-line @typescript-eslint/no-require-imports
const postcss = require("postcss");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const valueParser = require("postcss-value-parser");

// Run after token imports and Tailwind expansion. Do not rewrite generated
// selectors indiscriminately: roots, variants and keyframes have different semantics.
module.exports = () => ({
  postcssPlugin: "kozmos-scoped-css",
  OnceExit(root) {
    root.walkRules((rule) => {
      if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name))
        return;
      rule.selectors = rule.selectors.map((selector) => {
        if (selector === ":root" || selector === "html" || selector === ":host")
          return ":scope";
        if (/^\[data-theme=['"]dark['"]\]$/.test(selector))
          return ':scope[data-theme="dark"]';
        // @scope supplies the boundary; :scope supplies predictable precedence
        // over generic host reset/utility rules without using !important.
        return `:scope ${selector}`;
      });
    });
    const names = new Map();
    root.walkAtRules(/keyframes$/, (rule) => {
      const name = rule.params;
      names.set(name, `kozmos-${name}`);
      rule.params = names.get(name);
    });
    root.walkDecls(/^(?:-webkit-)?animation(?:-name)?$/, (decl) => {
      const value = valueParser(decl.value);
      value.walk((node) => {
        if (node.type === "word" && names.has(node.value))
          node.value = names.get(node.value);
      });
      decl.value = value.toString();
    });
    const scope = postcss.atRule({
      name: "scope",
      params: "([data-kozmos-root]) to ([data-kozmos-root])",
    });
    scope.append(root.nodes.slice());
    root.append(scope);
    scope.append(
      postcss.parse(`
      :scope { color: var(--primitives-colors-foreground-0); color-scheme: light; }
      :scope[data-theme="dark"] { color-scheme: dark; }
    `).nodes,
    );
  },
});
module.exports.postcss = true;
