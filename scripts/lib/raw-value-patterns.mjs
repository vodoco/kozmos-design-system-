const palette =
  "slate|gray|grey|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black";

// A utility starts after whitespace, a quote or a variant colon, not in the
// middle of a design-system class such as `kozmos-text-white`.
export const rawValuePatterns = {
  colour: new RegExp(
    `(?<![\\w-])(?:bg|text|ring|border|fill|stroke|from|via|to|decoration|outline|shadow|accent|caret|divide)-(?:${palette})(?:-\\d{2,3})?(?:/\\d{1,3})?(?![\\w/-])`,
    "g",
  ),
  radius:
    /(?<![\w-])rounded-(?:sm|md|lg|xl|2xl|3xl|full)(?![\w-])|(?<![\w-])rounded-\[(?!inherit|calc\([^\]]*--semantics-)[^\]]*\]/g,
};
