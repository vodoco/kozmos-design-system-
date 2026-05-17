import fs from 'fs';
import path from 'path';

// PLACEHOLDER FOR CSS CONTENT
const CSS_CONTENT = `
  --colors-theme-0: #f1f5fe;
  --colors-theme-100: #cad9fc;
  --colors-theme-200: #a4bef9;
  --colors-theme-300: #7ea2f6;
  --colors-theme-400: #5887f3;
  --colors-theme-600: #1051e8;
  --colors-theme-700: #0d44c2;
  --colors-theme-800: #0b369c;
  --colors-theme-900: #082975;
  --colors-theme-1000: #051c4f;
  --colors-theme-500-base: #135bec;
  --colors-emotional-success-0: #f6fdf9;
  --colors-emotional-success-100: #cbf5e0;
  --colors-emotional-success-200: #a0ecc6;
  --colors-emotional-success-300: #76e4ad;
  --colors-emotional-success-400: #4bdc93;
  --colors-emotional-success-600: #23b26b;
  --colors-emotional-success-700: #1e995b;
  --colors-emotional-success-800: #197f4c;
  --colors-emotional-success-900: #14653d;
  --colors-emotional-success-1000: #0f4c2d;
  --colors-emotional-success-500-base: #28cc7a;
  --colors-emotional-danger-0: #fceaee;
  --colors-emotional-danger-100: #f8c6d0;
  --colors-emotional-danger-200: #f3a2b3;
  --colors-emotional-danger-300: #ee7e95;
  --colors-emotional-danger-400: #e95a77;
  --colors-emotional-danger-600: #d41c42;
  --colors-emotional-danger-700: #b01736;
  --colors-emotional-danger-800: #8c132b;
  --colors-emotional-danger-900: #670e20;
  --colors-emotional-danger-1000: #430915;
  --colors-emotional-danger-500-base: #e43458;
  --colors-emotional-alert-0: #fffcf8;
  --colors-emotional-alert-100: #feeed0;
  --colors-emotional-alert-200: #fde0a8;
  --colors-emotional-alert-300: #fcd281;
  --colors-emotional-alert-400: #fbc459;
  --colors-emotional-alert-600: #f9a707;
  --colors-emotional-alert-700: #cd8905;
  --colors-emotional-alert-800: #a06b04;
  --colors-emotional-alert-900: #744d03;
  --colors-emotional-alert-1000: #472f02;
  --colors-emotional-alert-500-base: #fab735;
  --colors-emotional-info-0: #ecf6fb;
  --colors-emotional-info-100: #cae6f3;
  --colors-emotional-info-200: #a9d6ec;
  --colors-emotional-info-300: #87c6e5;
  --colors-emotional-info-400: #65b6de;
  --colors-emotional-info-600: #2a92c6;
  --colors-emotional-info-700: #2379a4;
  --colors-emotional-info-800: #1c6082;
  --colors-emotional-info-900: #154761;
  --colors-emotional-info-1000: #0e2e3f;
  --colors-emotional-info-500-base: #42a5d7;
  --colors-transparent-80: rgba(23, 25, 28, 0.8);
  --colors-transparent-75: rgba(23, 25, 28, 0.75);
  --colors-transparent-50: rgba(23, 25, 28, 0.5);
  --colors-transparent-25: rgba(23, 25, 28, 0.25);
  --colors-transparent-10: rgba(23, 25, 28, 0.1);
  --colors-transparent-5: rgba(23, 25, 28, 0.05);
  --colors-transparent-3: rgba(23, 25, 28, 0.03);
  --colors-transparent-95: rgba(23, 25, 28, 0.95);
  --colors-transparent-60: rgba(23, 25, 28, 0.6);
  --colors-transparent-90: rgba(23, 25, 28, 0.9);
  --colors-transparent-inverted-90: rgba(252, 252, 253, 0.9);
  --colors-transparent-inverted-80: rgba(252, 252, 253, 0.8);
  --colors-transparent-inverted-75: rgba(252, 252, 253, 0.75);
  --colors-transparent-inverted-50: rgba(252, 252, 253, 0.5);
  --colors-transparent-inverted-25: rgba(252, 252, 253, 0.25);
  --colors-transparent-inverted-10: rgba(252, 252, 253, 0.1);
  --colors-transparent-inverted-5: rgba(252, 252, 253, 0.05);
  --colors-transparent-inverted-3: rgba(252, 252, 253, 0.03);
  --colors-transparent-inverted-95: rgba(252, 252, 253, 0.95);
  --colors-transparent-inverted-60: rgba(252, 252, 253, 0.6);
  --colors-background-0: #ffffff;
  --colors-background-100: #e3e4e8;
  --colors-background-200: #c7cad1;
  --colors-background-300: #abafba;
  --colors-background-400: #9095a2;
  --colors-background-500: #747b8b;
  --colors-background-600: #5d626f;
  --colors-background-700: #464a53;
  --colors-background-800: #2e3138;
  --colors-background-900: #17191c;
  --colors-background-1000-base: #000000;
  --colors-foreground-0: #000000;
  --colors-foreground-100: #17191c;
  --colors-foreground-200: #2e3138;
  --colors-foreground-300: #464a53;
  --colors-foreground-400: #5d626f;
  --colors-foreground-500: #747b8b;
  --colors-foreground-600: #9095a2;
  --colors-foreground-700: #abafba;
  --colors-foreground-800: #c7cad1;
  --colors-foreground-900: #e3e4e8;
  --colors-foreground-1000-base: #ffffff;
  --colors-theme-variant-1-0: #f1f1fe;
  --colors-theme-variant-1-100: #cecafc;
  --colors-theme-variant-1-200: #aaa4f9;
  --colors-theme-variant-1-300: #867ef6;
  --colors-theme-variant-1-400: #6258f3;
  --colors-theme-variant-1-600: #1e10e8;
  --colors-theme-variant-1-700: #190dc2;
  --colors-theme-variant-1-800: #140b9c;
  --colors-theme-variant-1-900: #0f0875;
  --colors-theme-variant-1-1000: #0a054f;
  --colors-theme-variant-1-500-base: #4134f1;
  --colors-theme-variant-2-0: #f6f1fe;
  --colors-theme-variant-2-100: #decafc;
  --colors-theme-variant-2-200: #c6a4f9;
  --colors-theme-variant-2-300: #ae7ef6;
  --colors-theme-variant-2-400: #9658f3;
  --colors-theme-variant-2-600: #6610e8;
  --colors-theme-variant-2-700: #550dc2;
  --colors-theme-variant-2-800: #450b9c;
  --colors-theme-variant-2-900: #340875;
  --colors-theme-variant-2-1000: #23054f;
  --colors-theme-variant-2-500-base: #8034f1;
  --typography-font-family-primary-font-family: Readex Pro;
  --typography-font-family-mono-font-family: Fira Mono;
  --typography-font-weight-main-font-regular: Regular;
  --typography-font-weight-main-font-bold: SemiBold;
  --typography-font-weight-main-font-light: Light;
  --typography-font-size-0: 0.5rem;
  --typography-font-size-50: 0.625rem;
  --typography-font-size-100: 0.688rem;
  --typography-font-size-200: 0.813rem;
  --typography-font-size-300: 1rem;
  --typography-font-size-400: 1.25rem;
  --typography-font-size-500: 1.5rem;
  --typography-font-size-600: 1.875rem;
  --typography-font-size-700: 2.375rem;
  --typography-font-size-800: 3rem;
  --typography-font-size-900: 3.75rem;
  --typography-font-size-1000: 4.625rem;
  --typography-font-size-1100: 5.5rem;
  --typography-font-size-1200: 6.5rem;
  --typography-font-size-1300: 7.5rem;
  --typography-font-size-1400: 8.375rem;
  --typography-font-size-1500: 9.625rem;
  --typography-font-size-paragraph-xsmall: 0.688rem;
  --typography-font-size-paragraph-small: 0.813rem;
  --typography-font-size-paragraph-regular: 1rem;
  --typography-font-size-paragraph-large: 1.25rem;
  --typography-font-size-paragraph-xlarge: 1.5rem;
  --typography-font-size-headings-h1: 3.75rem;
  --typography-font-size-headings-h2: 3rem;
  --typography-font-size-headings-h3: 2.375rem;
  --typography-font-size-headings-h4: 1.875rem;
  --typography-font-size-headings-h5: 1.5rem;
  --typography-font-size-headings-h6: 1.25rem;
  --typography-letter-spacing-default: -0.013rem;
  --typography-letter-spacing-compact: -0.025rem;
  --typography-letter-spacing-comfortable: 0.025rem;
  --typography-line-height-0: 0.625rem;
  --typography-line-height-50: 0.875rem;
  --typography-line-height-100: 1.094rem;
  --typography-line-height-200: 1.375rem;
  --typography-line-height-300: 1.75rem;
  --typography-line-height-400: 2.125rem;
  --typography-line-height-500: 2.625rem;
  --typography-line-height-600: 3.375rem;
  --typography-line-height-700: 4.125rem;
  --typography-line-height-800: 5rem;
  --typography-line-height-900: 6rem;
  --typography-line-height-1000: 6.5rem;
  --typography-paragraph-spacing-0: 0rem;
  --typography-paragraph-spacing-50: 0.25rem;
  --typography-paragraph-spacing-100: 0.375rem;
  --typography-paragraph-spacing-200: 0.5rem;
  --typography-paragraph-spacing-300: 0.75rem;
  --typography-paragraph-spacing-400: 1rem;
  --typography-paragraph-spacing-500: 1.375rem;
  --typography-paragraph-spacing-600: 1.75rem;
  --typography-paragraph-spacing-700: 2.25rem;
  --typography-paragraph-spacing-800: 2.813rem;
  --typography-paragraph-spacing-900: 3.375rem;
  --typography-paragraph-spacing-1000: 4rem;
  --typography-paragraph-spacing-1100: 4.75rem;
  --typography-paragraph-spacing-1200: 5.5rem;
  --typography-paragraph-spacing-1300: 6.5rem;
  --typography-paragraph-spacing-1400: 7.375rem;
  --typography-paragraph-spacing-1500: 8.375rem;
  --design-dictionary-concepts-emotions-alert: Alert;
  --design-dictionary-concepts-emotions-danger: Danger;
  --design-dictionary-concepts-emotions-neutral: Neutral;
  --design-dictionary-concepts-emotions-informative: Informative;
  --design-dictionary-concepts-emotions-success: Success;
  --design-dictionary-concepts-states-idle: idle;
  --design-dictionary-concepts-states-on-hover: onHover;
  --design-dictionary-concepts-states-on-mouse-down: onMouseDown;
  --design-dictionary-concepts-states-in-focus: inFocus;
  --design-dictionary-concepts-priorty-primary: Primary;
  --design-dictionary-concepts-priorty-secondary: Secondary;
  --design-dictionary-concepts-priorty-tertiary: Tertiary;
  --design-dictionary-concepts-sizes-small: small;
  --design-dictionary-concepts-sizes-regular: regular;
  --design-dictionary-concepts-sizes-large: large;
  --design-dictionary-concepts-sizes-x-large: x-large;
  --design-dictionary-concepts-sizes-x-small: x-small;
  --layout-spacing-0: 0rem;
  --layout-spacing-25: 0.125rem;
  --layout-spacing-50: 0.25rem;
  --layout-spacing-75: 0.375rem;
  --layout-spacing-100: 0.5rem;
  --layout-spacing-150: 0.75rem;
  --layout-spacing-200: 1rem;
  --layout-spacing-300: 1.5rem;
  --layout-spacing-400: 2rem;
  --layout-spacing-500: 2.5rem;
  --layout-spacing-600: 3rem;
  --layout-spacing-700: 4rem;
  --layout-spacing-800: 4.5rem;
  --layout-spacing-900: 6rem;
  --layout-spacing-1000: 8rem;
  --layout-sizing-0: 0rem;
  --layout-sizing-100: 0.5rem;
  --layout-sizing-200: 1rem;
  --layout-sizing-300: 1.5rem;
  --layout-sizing-400: 2rem;
  --layout-sizing-500: 2.5rem;
  --layout-sizing-600: 3rem;
  --layout-sizing-700: 3.5rem;
  --layout-sizing-800: 4rem;
  --layout-sizing-900: 4.5rem;
  --layout-sizing-1000: 5rem;
  --layout-radius-0: 0rem;
  --layout-radius-50: 0.25rem;
  --layout-radius-100: 0.5rem;
  --layout-radius-200: 1rem;
  --layout-radius-300: 1.5rem;
  --layout-radius-400: 2rem;
  --layout-radius-500: 2.5rem;
  --layout-radius-600: 3rem;
  --layout-radius-700: 4rem;
  --layout-radius-800: 4.5rem;
  --layout-radius-900: 6rem;
  --layout-radius-1000: 8rem;
  --primary-buttons-themed-button-foreground-symbol-or-text-idle: #000000;
  --primary-buttons-themed-button-foreground-symbol-or-text-on-hover: #000000;
  --primary-buttons-themed-button-foreground-symbol-or-text-on-mouse-down: #000000;
  --primary-buttons-themed-button-foreground-symbol-or-text-in-focus-selected: #000000;
  --primary-buttons-themed-button-foreground-symbol-or-text-disabled: #464a53;
  --primary-buttons-themed-foreground-dimmed-symbol-or-text-idle: #cad9fc;
  --primary-buttons-themed-foreground-dimmed-symbol-or-text-on-hover: #cad9fc;
  --primary-buttons-themed-foreground-dimmed-symbol-or-text-on-mouse-down: #cad9fc;
  --primary-buttons-themed-foreground-dimmed-symbol-or-text-in-focus-selected: #cad9fc;
  --primary-buttons-themed-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --primary-buttons-themed-button-background-idle: #0d44c2;
  --primary-buttons-themed-button-background-on-hover: #1051e8;
  --primary-buttons-themed-button-background-on-mouse-down: #0b369c;
  --primary-buttons-themed-button-background-in-focus-selected: #1051e8;
  --primary-buttons-themed-button-background-disabled: #2e3138;
  --primary-buttons-success-button-background-idle: #1e995b;
  --primary-buttons-success-button-background-on-hover: #23b26b;
  --primary-buttons-success-button-background-on-mouse-down: #197f4c;
  --primary-buttons-success-button-background-in-focus-selected: #23b26b;
  --primary-buttons-success-button-background-disabled: #2e3138;
  --primary-buttons-success-button-foreground-symbol-or-text-idle: #000000;
  --primary-buttons-success-button-foreground-symbol-or-text-on-hover: #000000;
  --primary-buttons-success-button-foreground-symbol-or-text-on-mouse-down: #000000;
  --primary-buttons-success-button-foreground-symbol-or-text-in-focus-selected: #000000;
  --primary-buttons-success-button-foreground-symbol-or-text-disabled: #464a53;
  --primary-buttons-success-foreground-dimmed-symbol-or-text-idle: #cbf5e0;
  --primary-buttons-success-foreground-dimmed-symbol-or-text-on-hover: #cbf5e0;
  --primary-buttons-success-foreground-dimmed-symbol-or-text-on-mouse-down: #cbf5e0;
  --primary-buttons-success-foreground-dimmed-symbol-or-text-in-focus-selected: #cbf5e0;
  --primary-buttons-success-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --primary-buttons-alert-button-background-idle: #cd8905;
  --primary-buttons-alert-button-background-on-hover: #f9a707;
  --primary-buttons-alert-button-background-on-mouse-down: #a06b04;
  --primary-buttons-alert-button-background-in-focus-selected: #f9a707;
  --primary-buttons-alert-button-background-disabled: #2e3138;
  --primary-buttons-alert-button-foreground-symbol-or-text-idle: #000000;
  --primary-buttons-alert-button-foreground-symbol-or-text-on-hover: #000000;
  --primary-buttons-alert-button-foreground-symbol-or-text-on-mouse-down: #000000;
  --primary-buttons-alert-button-foreground-symbol-or-text-in-focus-selected: #000000;
  --primary-buttons-alert-button-foreground-symbol-or-text-disabled: #464a53;
  --primary-buttons-alert-foreground-dimmed-symbol-or-text-idle: #feeed0;
  --primary-buttons-alert-foreground-dimmed-symbol-or-text-on-hover: #feeed0;
  --primary-buttons-alert-foreground-dimmed-symbol-or-text-on-mouse-down: #feeed0;
  --primary-buttons-alert-foreground-dimmed-symbol-or-text-in-focus-selected: #feeed0;
  --primary-buttons-alert-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --primary-buttons-danger-button-background-idle: #b01736;
  --primary-buttons-danger-button-background-on-hover: #d41c42;
  --primary-buttons-danger-button-background-on-mouse-down: #8c132b;
  --primary-buttons-danger-button-background-in-focus-selected: #d41c42;
  --primary-buttons-danger-button-background-disabled: #2e3138;
  --primary-buttons-danger-button-foreground-symbol-or-text-idle: #000000;
  --primary-buttons-danger-button-foreground-symbol-or-text-on-hover: #000000;
  --primary-buttons-danger-button-foreground-symbol-or-text-on-mouse-down: #000000;
  --primary-buttons-danger-button-foreground-symbol-or-text-in-focus-selected: #000000;
  --primary-buttons-danger-button-foreground-symbol-or-text-disabled: #464a53;
  --primary-buttons-danger-foreground-dimmed-symbol-or-text-idle: #fceaee;
  --primary-buttons-danger-foreground-dimmed-symbol-or-text-on-hover: #fceaee;
  --primary-buttons-danger-foreground-dimmed-symbol-or-text-on-mouse-down: #fceaee;
  --primary-buttons-danger-foreground-dimmed-symbol-or-text-in-focus-selected: #fceaee;
  --primary-buttons-danger-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --primary-buttons-informative-button-background-idle: #2379a4;
  --primary-buttons-informative-button-background-on-hover: #2a92c6;
  --primary-buttons-informative-button-background-on-mouse-down: #1c6082;
  --primary-buttons-informative-button-background-in-focus-selected: #2a92c6;
  --primary-buttons-informative-button-background-disabled: #2e3138;
  --primary-buttons-informative-button-foreground-symbol-or-text-idle: #000000;
  --primary-buttons-informative-button-foreground-symbol-or-text-on-hover: #000000;
  --primary-buttons-informative-button-foreground-symbol-or-text-on-mouse-down: #000000;
  --primary-buttons-informative-button-foreground-symbol-or-text-in-focus-selected: #000000;
  --primary-buttons-informative-button-foreground-symbol-or-text-disabled: #464a53;
  --primary-buttons-informative-foreground-dimmed-symbol-or-text-idle: #cae6f3;
  --primary-buttons-informative-foreground-dimmed-symbol-or-text-on-hover: #cae6f3;
  --primary-buttons-informative-foreground-dimmed-symbol-or-text-on-mouse-down: #cae6f3;
  --primary-buttons-informative-foreground-dimmed-symbol-or-text-in-focus-selected: #cae6f3;
  --primary-buttons-informative-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --primary-buttons-neutral-button-background-idle: #c7cad1;
  --primary-buttons-neutral-button-background-on-hover: #abafba;
  --primary-buttons-neutral-button-background-on-mouse-down: #e3e4e8;
  --primary-buttons-neutral-button-background-in-focus-selected: #abafba;
  --primary-buttons-neutral-button-background-disabled: #2e3138;
  --primary-buttons-neutral-button-foreground-symbol-or-text-idle: #000000;
  --primary-buttons-neutral-button-foreground-symbol-or-text-on-hover: #000000;
  --primary-buttons-neutral-button-foreground-symbol-or-text-on-mouse-down: #000000;
  --primary-buttons-neutral-button-foreground-symbol-or-text-in-focus-selected: #000000;
  --primary-buttons-neutral-button-foreground-symbol-or-text-disabled: #464a53;
  --primary-buttons-neutral-foreground-dimmed-symbol-or-text-idle: #17191c;
  --primary-buttons-neutral-foreground-dimmed-symbol-or-text-on-hover: #17191c;
  --primary-buttons-neutral-foreground-dimmed-symbol-or-text-on-mouse-down: #17191c;
  --primary-buttons-neutral-foreground-dimmed-symbol-or-text-in-focus-selected: #17191c;
  --primary-buttons-neutral-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --secondary-buttons-themed-button-background-idle: #0d44c2;
  --secondary-buttons-themed-button-background-on-hover: #1051e8;
  --secondary-buttons-themed-button-background-on-mouse-down: #0b369c;
  --secondary-buttons-themed-button-background-in-focus-selected: #1051e8;
  --secondary-buttons-themed-button-background-disabled: #2e3138;
  --secondary-buttons-themed-button-foreground-symbol-or-text-idle: #0d44c2;
  --secondary-buttons-themed-button-foreground-symbol-or-text-on-hover: #1051e8;
  --secondary-buttons-themed-button-foreground-symbol-or-text-on-mouse-down: #0b369c;
  --secondary-buttons-themed-button-foreground-symbol-or-text-in-focus-selected: #1051e8;
  --secondary-buttons-themed-button-foreground-symbol-or-text-disabled: #464a53;
  --secondary-buttons-themed-foreground-dimmed-symbol-or-text-idle: #1051e8;
  --secondary-buttons-themed-foreground-dimmed-symbol-or-text-on-hover: #135bec;
  --secondary-buttons-themed-foreground-dimmed-symbol-or-text-on-mouse-down: #0d44c2;
  --secondary-buttons-themed-foreground-dimmed-symbol-or-text-in-focus-selected: #135bec;
  --secondary-buttons-themed-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --secondary-buttons-success-button-background-idle: #1e995b;
  --secondary-buttons-success-button-background-on-hover: #23b26b;
  --secondary-buttons-success-button-background-on-mouse-down: #197f4c;
  --secondary-buttons-success-button-background-in-focus-selected: #23b26b;
  --secondary-buttons-success-button-background-disabled: #2e3138;
  --secondary-buttons-success-button-foreground-symbol-or-text-idle: #1e995b;
  --secondary-buttons-success-button-foreground-symbol-or-text-on-hover: #23b26b;
  --secondary-buttons-success-button-foreground-symbol-or-text-on-mouse-down: #197f4c;
  --secondary-buttons-success-button-foreground-symbol-or-text-in-focus-selected: #23b26b;
  --secondary-buttons-success-button-foreground-symbol-or-text-disabled: #464a53;
  --secondary-buttons-success-foreground-dimmed-symbol-or-text-idle: #23b26b;
  --secondary-buttons-success-foreground-dimmed-symbol-or-text-on-hover: #28cc7a;
  --secondary-buttons-success-foreground-dimmed-symbol-or-text-on-mouse-down: #1e995b;
  --secondary-buttons-success-foreground-dimmed-symbol-or-text-in-focus-selected: #28cc7a;
  --secondary-buttons-success-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --secondary-buttons-danger-button-background-idle: #b01736;
  --secondary-buttons-danger-button-background-on-hover: #d41c42;
  --secondary-buttons-danger-button-background-on-mouse-down: #8c132b;
  --secondary-buttons-danger-button-background-in-focus-selected: #d41c42;
  --secondary-buttons-danger-button-background-disabled: #2e3138;
  --secondary-buttons-danger-button-foreground-symbol-or-text-idle: #b01736;
  --secondary-buttons-danger-button-foreground-symbol-or-text-on-hover: #d41c42;
  --secondary-buttons-danger-button-foreground-symbol-or-text-on-mouse-down: #8c132b;
  --secondary-buttons-danger-button-foreground-symbol-or-text-in-focus-selected: #d41c42;
  --secondary-buttons-danger-button-foreground-symbol-or-text-disabled: #464a53;
  --secondary-buttons-danger-foreground-dimmed-symbol-or-text-idle: #d41c42;
  --secondary-buttons-danger-foreground-dimmed-symbol-or-text-on-hover: #e43458;
  --secondary-buttons-danger-foreground-dimmed-symbol-or-text-on-mouse-down: #b01736;
  --secondary-buttons-danger-foreground-dimmed-symbol-or-text-in-focus-selected: #e43458;
  --secondary-buttons-danger-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --secondary-buttons-alert-button-background-idle: #cd8905;
  --secondary-buttons-alert-button-background-on-hover: #f9a707;
  --secondary-buttons-alert-button-background-on-mouse-down: #a06b04;
  --secondary-buttons-alert-button-background-in-focus-selected: #f9a707;
  --secondary-buttons-alert-button-background-disabled: #2e3138;
  --secondary-buttons-alert-button-foreground-symbol-or-text-idle: #cd8905;
  --secondary-buttons-alert-button-foreground-symbol-or-text-on-hover: #f9a707;
  --secondary-buttons-alert-button-foreground-symbol-or-text-on-mouse-down: #a06b04;
  --secondary-buttons-alert-button-foreground-symbol-or-text-in-focus-selected: #f9a707;
  --secondary-buttons-alert-button-foreground-symbol-or-text-disabled: #464a53;
  --secondary-buttons-alert-foreground-dimmed-symbol-or-text-idle: #f9a707;
  --secondary-buttons-alert-foreground-dimmed-symbol-or-text-on-hover: #fab735;
  --secondary-buttons-alert-foreground-dimmed-symbol-or-text-on-mouse-down: #cd8905;
  --secondary-buttons-alert-foreground-dimmed-symbol-or-text-in-focus-selected: #fab735;
  --secondary-buttons-alert-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --secondary-buttons-informative-button-background-idle: #2379a4;
  --secondary-buttons-informative-button-background-on-hover: #2a92c6;
  --secondary-buttons-informative-button-background-on-mouse-down: #1c6082;
  --secondary-buttons-informative-button-background-in-focus-selected: #2a92c6;
  --secondary-buttons-informative-button-background-disabled: #2e3138;
  --secondary-buttons-informative-button-foreground-symbol-or-text-idle: #2379a4;
  --secondary-buttons-informative-button-foreground-symbol-or-text-on-hover: #2a92c6;
  --secondary-buttons-informative-button-foreground-symbol-or-text-on-mouse-down: #1c6082;
  --secondary-buttons-informative-button-foreground-symbol-or-text-in-focus-selected: #2a92c6;
  --secondary-buttons-informative-button-foreground-symbol-or-text-disabled: #464a53;
  --secondary-buttons-informative-foreground-dimmed-symbol-or-text-idle: #2a92c6;
  --secondary-buttons-informative-foreground-dimmed-symbol-or-text-on-hover: #42a5d7;
  --secondary-buttons-informative-foreground-dimmed-symbol-or-text-on-mouse-down: #2379a4;
  --secondary-buttons-informative-foreground-dimmed-symbol-or-text-in-focus-selected: #42a5d7;
  --secondary-buttons-informative-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --secondary-buttons-neutral-button-background-idle: #abafba;
  --secondary-buttons-neutral-button-background-on-hover: #9095a2;
  --secondary-buttons-neutral-button-background-on-mouse-down: #c7cad1;
  --secondary-buttons-neutral-button-background-in-focus-selected: #9095a2;
  --secondary-buttons-neutral-button-background-disabled: #2e3138;
  --secondary-buttons-neutral-button-foreground-symbol-or-text-idle: #abafba;
  --secondary-buttons-neutral-button-foreground-symbol-or-text-on-hover: #9095a2;
  --secondary-buttons-neutral-button-foreground-symbol-or-text-on-mouse-down: #c7cad1;
  --secondary-buttons-neutral-button-foreground-symbol-or-text-in-focus-selected: #9095a2;
  --secondary-buttons-neutral-button-foreground-symbol-or-text-disabled: #464a53;
  --secondary-buttons-neutral-foreground-dimmed-symbol-or-text-idle: #9095a2;
  --secondary-buttons-neutral-foreground-dimmed-symbol-or-text-on-hover: #747b8b;
  --secondary-buttons-neutral-foreground-dimmed-symbol-or-text-on-mouse-down: #abafba;
  --secondary-buttons-neutral-foreground-dimmed-symbol-or-text-in-focus-selected: #747b8b;
  --secondary-buttons-neutral-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --tertiary-buttons-themed-button-background-idle: #0d44c2;
  --tertiary-buttons-themed-button-background-on-hover: #1051e8;
  --tertiary-buttons-themed-button-background-on-mouse-down: #0b369c;
  --tertiary-buttons-themed-button-background-in-focus-selected: #1051e8;
  --tertiary-buttons-themed-button-background-disabled: #2e3138;
  --tertiary-buttons-themed-button-foreground-symbol-or-text-idle: #0d44c2;
  --tertiary-buttons-themed-button-foreground-symbol-or-text-on-hover: #1051e8;
  --tertiary-buttons-themed-button-foreground-symbol-or-text-on-mouse-down: #0b369c;
  --tertiary-buttons-themed-button-foreground-symbol-or-text-in-focus-selected: #1051e8;
  --tertiary-buttons-themed-button-foreground-symbol-or-text-disabled: #464a53;
  --tertiary-buttons-themed-foreground-dimmed-symbol-or-text-idle: #1051e8;
  --tertiary-buttons-themed-foreground-dimmed-symbol-or-text-on-hover: #135bec;
  --tertiary-buttons-themed-foreground-dimmed-symbol-or-text-on-mouse-down: #0d44c2;
  --tertiary-buttons-themed-foreground-dimmed-symbol-or-text-in-focus-selected: #135bec;
  --tertiary-buttons-themed-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --tertiary-buttons-success-button-background-idle: #1e995b;
  --tertiary-buttons-success-button-background-on-hover: #23b26b;
  --tertiary-buttons-success-button-background-on-mouse-down: #197f4c;
  --tertiary-buttons-success-button-background-in-focus-selected: #23b26b;
  --tertiary-buttons-success-button-background-disabled: #2e3138;
  --tertiary-buttons-success-button-foreground-symbol-or-text-idle: #1e995b;
  --tertiary-buttons-success-button-foreground-symbol-or-text-on-hover: #23b26b;
  --tertiary-buttons-success-button-foreground-symbol-or-text-on-mouse-down: #197f4c;
  --tertiary-buttons-success-button-foreground-symbol-or-text-in-focus-selected: #23b26b;
  --tertiary-buttons-success-button-foreground-symbol-or-text-disabled: #464a53;
  --tertiary-buttons-success-foreground-dimmed-symbol-or-text-idle: #23b26b;
  --tertiary-buttons-success-foreground-dimmed-symbol-or-text-on-hover: #28cc7a;
  --tertiary-buttons-success-foreground-dimmed-symbol-or-text-on-mouse-down: #1e995b;
  --tertiary-buttons-success-foreground-dimmed-symbol-or-text-in-focus-selected: #28cc7a;
  --tertiary-buttons-success-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --tertiary-buttons-danger-button-background-idle: #b01736;
  --tertiary-buttons-danger-button-background-on-hover: #d41c42;
  --tertiary-buttons-danger-button-background-on-mouse-down: #8c132b;
  --tertiary-buttons-danger-button-background-in-focus-selected: #d41c42;
  --tertiary-buttons-danger-button-background-disabled: #2e3138;
  --tertiary-buttons-danger-button-foreground-symbol-or-text-idle: #b01736;
  --tertiary-buttons-danger-button-foreground-symbol-or-text-on-hover: #d41c42;
  --tertiary-buttons-danger-button-foreground-symbol-or-text-on-mouse-down: #8c132b;
  --tertiary-buttons-danger-button-foreground-symbol-or-text-in-focus-selected: #d41c42;
  --tertiary-buttons-danger-button-foreground-symbol-or-text-disabled: #464a53;
  --tertiary-buttons-danger-foreground-dimmed-symbol-or-text-idle: #d41c42;
  --tertiary-buttons-danger-foreground-dimmed-symbol-or-text-on-hover: #e43458;
  --tertiary-buttons-danger-foreground-dimmed-symbol-or-text-on-mouse-down: #b01736;
  --tertiary-buttons-danger-foreground-dimmed-symbol-or-text-in-focus-selected: #e43458;
  --tertiary-buttons-danger-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --tertiary-buttons-alert-button-background-idle: #cd8905;
  --tertiary-buttons-alert-button-background-on-hover: #f9a707;
  --tertiary-buttons-alert-button-background-on-mouse-down: #a06b04;
  --tertiary-buttons-alert-button-background-in-focus-selected: #f9a707;
  --tertiary-buttons-alert-button-background-disabled: #2e3138;
  --tertiary-buttons-alert-button-foreground-symbol-or-text-idle: #000000;
  --tertiary-buttons-alert-button-foreground-symbol-or-text-on-hover: #000000;
  --tertiary-buttons-alert-button-foreground-symbol-or-text-on-mouse-down: #000000;
  --tertiary-buttons-alert-button-foreground-symbol-or-text-in-focus-selected: #000000;
  --tertiary-buttons-alert-button-foreground-symbol-or-text-disabled: #464a53;
  --tertiary-buttons-alert-foreground-dimmed-symbol-or-text-idle: #feeed0;
  --tertiary-buttons-alert-foreground-dimmed-symbol-or-text-on-hover: #feeed0;
  --tertiary-buttons-alert-foreground-dimmed-symbol-or-text-on-mouse-down: #feeed0;
  --tertiary-buttons-alert-foreground-dimmed-symbol-or-text-in-focus-selected: #feeed0;
  --tertiary-buttons-alert-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --tertiary-buttons-informative-button-background-idle: #2379a4;
  --tertiary-buttons-informative-button-background-on-hover: #2a92c6;
  --tertiary-buttons-informative-button-background-on-mouse-down: #1c6082;
  --tertiary-buttons-informative-button-background-in-focus-selected: #2a92c6;
  --tertiary-buttons-informative-button-background-disabled: #2e3138;
  --tertiary-buttons-informative-button-foreground-symbol-or-text-idle: #2379a4;
  --tertiary-buttons-informative-button-foreground-symbol-or-text-on-hover: #2a92c6;
  --tertiary-buttons-informative-button-foreground-symbol-or-text-on-mouse-down: #1c6082;
  --tertiary-buttons-informative-button-foreground-symbol-or-text-in-focus-selected: #2a92c6;
  --tertiary-buttons-informative-button-foreground-symbol-or-text-disabled: #464a53;
  --tertiary-buttons-informative-foreground-dimmed-symbol-or-text-idle: #2a92c6;
  --tertiary-buttons-informative-foreground-dimmed-symbol-or-text-on-hover: #42a5d7;
  --tertiary-buttons-informative-foreground-dimmed-symbol-or-text-on-mouse-down: #2379a4;
  --tertiary-buttons-informative-foreground-dimmed-symbol-or-text-in-focus-selected: #42a5d7;
  --tertiary-buttons-informative-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --tertiary-buttons-neutral-button-background-idle: #c7cad1;
  --tertiary-buttons-neutral-button-background-on-hover: #abafba;
  --tertiary-buttons-neutral-button-background-on-mouse-down: #e3e4e8;
  --tertiary-buttons-neutral-button-background-in-focus-selected: #abafba;
  --tertiary-buttons-neutral-button-background-disabled: #2e3138;
  --tertiary-buttons-neutral-button-foreground-symbol-or-text-idle: #abafba;
  --tertiary-buttons-neutral-button-foreground-symbol-or-text-on-hover: #9095a2;
  --tertiary-buttons-neutral-button-foreground-symbol-or-text-on-mouse-down: #c7cad1;
  --tertiary-buttons-neutral-button-foreground-symbol-or-text-in-focus-selected: #9095a2;
  --tertiary-buttons-neutral-button-foreground-symbol-or-text-disabled: #464a53;
  --tertiary-buttons-neutral-foreground-dimmed-symbol-or-text-idle: #9095a2;
  --tertiary-buttons-neutral-foreground-dimmed-symbol-or-text-on-hover: #747b8b;
  --tertiary-buttons-neutral-foreground-dimmed-symbol-or-text-on-mouse-down: #abafba;
  --tertiary-buttons-neutral-foreground-dimmed-symbol-or-text-in-focus-selected: #747b8b;
  --tertiary-buttons-neutral-foreground-dimmed-symbol-or-text-disabled: #464a53;
  --html-elements-headings-h1-font-family: Readex Pro;
  --html-elements-headings-h1-font-weight: Light;
  --html-elements-headings-h1-font-size: 3.75rem;
  --html-elements-headings-h1-letter-spacing: -0.025rem;
  --html-elements-headings-h1-line-height: 4.125rem;
  --html-elements-headings-h1-paragraph-spacing: 1.75rem;
  --html-elements-headings-h2-font-family: Readex Pro;
  --html-elements-headings-h2-font-weight: Light;
  --html-elements-headings-h2-font-size: 3rem;
  --html-elements-headings-h2-letter-spacing: -0.025rem;
  --html-elements-headings-h2-line-height: 3.375rem;
  --html-elements-headings-h2-paragraph-spacing: 1.375rem;
  --html-elements-headings-paragraphs-font-size: 0rem;
  --effect-glass-opacity: 0.7;
  --effect-glass-blur: 20px;
  --effect-glass-saturation: 1.8;
  --effect-glass-noise-opacity: 0.03;
  --effect-glass-border-opacity: 0.2;
  --effect-glass-refraction-opacity: 0.4;
  --motion-duration-scale: 1;
  --motion-slide-sm: 4px;
  --motion-slide-md: 8px;
  --motion-enter: 0.95;
  --motion-exit: 0.95;
  --border-bevel-top: rgba(255, 255, 255, 0.5);
  --border-bevel-bottom: rgba(0, 0, 0, 0.2);
  --radius-none: 0rem;
  --radius-sm: 0.25rem;
  --radius-base: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-2xl: 2rem;
  --radius-full: 9999px;
  --radius-card: 1rem;
  --radius-input: 1rem;
  --radius-button: 1rem;
  --border-width-none: 0px;
  --border-width-sm: 1px;
  --border-width-md: 2px;
  --border-width-lg: 4px;
  --opacity-0: 0;
  --opacity-5: 0.05;
  --opacity-10: 0.1;
  --opacity-25: 0.25;
  --opacity-50: 0.5;
  --opacity-75: 0.75;
  --opacity-100: 1;
  --layer-0: 0;
  --layer-10: 10;
  --layer-20: 20;
  --layer-30: 30;
  --layer-40: 40;
  --layer-50: 50;
  --layer-auto: auto;
  --grid-cols: 12;
  --grid-gutter: 24px;
  --grid-margin: 32px;
  --screen-mobile: 375px;
  --screen-tablet: 768px;
  --screen-laptop: 1024px;
  --screen-desktop: 1440px;
  --aspect-square: 1/1;
  --aspect-video: 16/9;
  --aspect-portrait: 3/4;
  --touch-min: 44px;
  --touch-comfortable: 48px;
  --ease-linear: 0, 0, 1, 1;
  --ease-in: 0.4, 0, 1, 1;
  --ease-out: 0, 0, 0.2, 1;
  --ease-in-out: 0.4, 0, 0.2, 1;
  --ease-elastic: 0.175, 0.885, 0.32, 1.275;
  --data-blue: #2563eb;
  --data-purple: #9333ea;
  --data-teal: #0d9488;
  --data-orange: #ea580c;
  --data-red: #dc2626;
  --data-yellow: #d97706;
  --surface-0: #ffffff;
  --surface-100: #f8f9fa;
  --surface-200: #e9ecef;
  --surface-300: #dee2e6;
  --icon-stroke-sm: 1.5px;
  --icon-stroke-md: 2px;
  --icon-stroke-lg: 2.5px;
  --inset-safe-top: 0px;
`;

// Mappings Kebab -> JSON Key
const keyMap: Record<string, string> = {
    "colors": "Colors",
    "radius": "Radius",
    "border-width": "Border Width",
    "opacity": "Opacity",
    "layer": "Layer",
    "grid": "Grid",
    "screen": "Screen",
    "aspect": "Aspect",
    "touch": "Touch",
    "ease": "Ease",
    "data": "Data",
    "surface": "Surface",
    "icon": "Icon",
    "inset": "Inset",
    "overlay": "Overlay",
    "shadow": "Shadow",
    "motion": "Motion",
    "effect": "Effect",
    "layout": "Layout",
    "primary-buttons": "Primary Buttons",
    "secondary-buttons": "Secondary Buttons",
    "tertiary-buttons": "Tertiary Buttons",
    "html-elements": "HTML elements",
    "design-dictionary": "Design Dictionary",
    "border": "Border",
    "typography": "Typography"
};

function parseCss() {
    const lines = CSS_CONTENT.split('\n');
    const tokens: any = {};

    lines.forEach(line => {
        line = line.trim();
        if (!line.startsWith('--')) return;

        // --colors-theme-0: #f1f5fe;
        const parts = line.split(':');
        const keyPart = parts[0].substring(2); // colors-theme-0
        const valPart = parts[1].replace(';', '').trim(); // #f1f5fe

        // Split keyPart into segments
        // Problem: primary-buttons -> Primary Buttons
        // We need to match the known prefixes first.
        let matchedPrefix = "";
        let effectiveKeyPart = keyPart;

        // Sort keys by length desc to match long prefixes first
        const prefixes = Object.keys(keyMap).sort((a, b) => b.length - a.length);

        for (const p of prefixes) {
            if (keyPart.startsWith(p + '-')) {
                matchedPrefix = p;
                effectiveKeyPart = keyPart.substring(p.length + 1); // theme-0
                break;
            }
        }

        if (!matchedPrefix) {
            console.warn(`Skipping unknown prefix: ${keyPart}`);
            return;
        }

        const rootKey = keyMap[matchedPrefix];

        // Construct nested object
        // theme-0 -> ["theme", "0"]
        const segments = effectiveKeyPart.split('-');

        let current = tokens[rootKey] || (tokens[rootKey] = {});

        // Last segment is key
        const leafKey = segments.pop()!;

        // Traverse/Create intermediate objects
        segments.forEach(seg => {
            // Convert numbers if needed or keep string
            current = current[seg] || (current[seg] = {});
        });

        // Determine type
        let type = "other";
        if (valPart.startsWith('#') || valPart.startsWith('rgba') || valPart.startsWith('rgb')) type = "color";
        if (valPart.endsWith('px') || valPart.endsWith('rem') || valPart.endsWith('%')) type = "dimension";
        if (!isNaN(Number(valPart))) type = "number";

        current[leafKey] = {
            "$value": valPart,
            "$type": type,
            "$extensions": { "com.figma.scopes": ["ALL_SCOPES"] }
        };
    });

    return tokens;
}

const tokens = parseCss();
const TARGET_PATH = path.join(process.cwd(), 'packages/tokens/src/tokens-light.json');
fs.writeFileSync(TARGET_PATH, JSON.stringify(tokens, null, 2));
console.log(`Recovered ${Object.keys(tokens).length} top-level token groups.`);
