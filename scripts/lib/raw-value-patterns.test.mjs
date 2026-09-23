import test from "node:test";
import assert from "node:assert/strict";
import { rawValuePatterns } from "./raw-value-patterns.mjs";

test("counts actual palette utilities including variants and opacity", () => {
  assert.deepEqual(
    '"text-white hover:bg-red-500 dark:ring-black/5"'.match(
      rawValuePatterns.colour,
    ),
    ["text-white", "bg-red-500", "ring-black/5"],
  );
});
test("does not count a utility substring inside an owned class", () => {
  assert.equal(
    '"kozmos-text-white app-bg-red-500 kozmos-rounded-full"'.match(
      rawValuePatterns.colour,
    ),
    null,
  );
  assert.equal('"kozmos-rounded-full"'.match(rawValuePatterns.radius), null);
});
test("still counts the actual @apply declaration behind an owned class", () => {
  assert.deepEqual("text-white".match(rawValuePatterns.colour), ["text-white"]);
});
test("keeps raw radius detection and semantic exceptions", () => {
  assert.deepEqual(
    "rounded-lg sm:rounded-[12px] rounded-control rounded-[inherit] rounded-[calc(var(--semantics-radius-control)+1px)]".match(
      rawValuePatterns.radius,
    ),
    ["rounded-lg", "rounded-[12px]"],
  );
});
test("does not partially match non-utility names", () => {
  assert.equal(
    "text-white-custom bg-red-500-accent".match(rawValuePatterns.colour),
    null,
  );
});
