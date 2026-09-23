import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { emitFormatDeclarations } from "./emit-format-declarations.mjs";

function fixture(source, run) {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "kozmos-declarations-"),
  );
  try {
    fs.writeFileSync(path.join(directory, "index.d.ts"), source);
    run(directory);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

test("emits two independent format identities from a bundled public API", () => {
  fixture(
    'import type { ReactNode } from "react";\nexport declare function render(): ReactNode;\n//# sourceMappingURL=index.d.ts.map\n',
    (directory) => {
      emitFormatDeclarations(directory);
      for (const extension of ["mts", "cts"]) {
        const result = fs.readFileSync(
          path.join(directory, `index.d.${extension}`),
          "utf8",
        );
        assert.match(result, /export declare function render/);
        assert.doesNotMatch(result, /sourceMappingURL/);
      }
      assert.match(
        fs.readFileSync(path.join(directory, "index.d.ts"), "utf8"),
        /sourceMappingURL/,
      );
    },
  );
});

for (const statement of [
  'export * from "./internal";',
  'import { X } from "./internal.js"; export { X };',
  'export type X = import("./internal").X;',
  'import X = require("./internal"); export { X };',
  '/// <reference path="./internal.d.ts" />\nexport {};',
]) {
  test(`rejects an unbundled graph: ${statement}`, () => {
    fixture(statement, (directory) =>
      assert.throws(
        () => emitFormatDeclarations(directory),
        /declaration dependency|file references/,
      ),
    );
  });
}
