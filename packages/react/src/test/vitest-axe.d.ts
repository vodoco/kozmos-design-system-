import 'vitest';
import type { AxeMatchers } from 'vitest-axe';

declare module 'vitest' {
  export type Assertion<T = any> = AxeMatchers;
  export type AsymmetricMatchersContaining = AxeMatchers;
}
