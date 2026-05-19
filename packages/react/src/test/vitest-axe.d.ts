/* eslint-disable @typescript-eslint/no-unused-vars */
import "vitest";
import type { AxeMatchers } from "vitest-axe";

declare module "vitest" {
  export type Assertion<_T = any> = AxeMatchers;
  export type AsymmetricMatchersContaining = AxeMatchers;
}
