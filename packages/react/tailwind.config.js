/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Primitive / Brand Colors
        brand: {
          500: "var(--primitives-colors-theme-500)",
          600: "var(--primitives-colors-theme-600)",
          700: "var(--primitives-colors-theme-700)",
        },
        surface: {
          0: "var(--semantics-surface-0)",
          100: "var(--semantics-surface-100)",
          200: "var(--semantics-surface-200)",
          300: "var(--semantics-surface-300)",
        },
        data: {
          blue: "var(--semantics-data-blue)",
          purple: "var(--semantics-data-purple)",
          teal: "var(--semantics-data-teal)",
          orange: "var(--semantics-data-orange)",
          red: "var(--semantics-data-red)",
          yellow: "var(--semantics-data-yellow)",
        },
        overlay: {
          scrim: "var(--semantics-overlay-scrim)",
          dim: "var(--semantics-overlay-dim)",
        },
        // Semantic: Base
        background: "var(--primitives-colors-background-0)",
        foreground: "var(--primitives-colors-foreground-0)",

        // Semantic: UI Elements
        card: {
          DEFAULT: "var(--primitives-colors-background-0)",
          foreground: "var(--primitives-colors-foreground-0)",
        },
        popover: {
          DEFAULT: "var(--primitives-colors-background-0)",
          foreground: "var(--primitives-colors-foreground-0)",
        },
        primary: {
          DEFAULT: "var(--primitives-colors-theme-600)",
          foreground: "var(--primitives-colors-foreground-1000)",
        },
        secondary: {
          DEFAULT: "var(--primitives-colors-background-200)",
          foreground: "var(--primitives-colors-foreground-0)",
        },
        muted: {
          DEFAULT: "var(--primitives-colors-background-100)",
          foreground: "var(--primitives-colors-foreground-400)",
        },
        accent: {
          DEFAULT: "var(--primitives-colors-theme-600)",
          foreground: "var(--primitives-colors-foreground-1000)",
        },
        destructive: {
          DEFAULT: "var(--primitives-colors-emotional-danger-600)",
          foreground: "var(--primitives-colors-foreground-1000)",
        },
        success: {
          DEFAULT: "var(--primitives-colors-emotional-success-600)",
          foreground: "var(--primitives-colors-foreground-1000)",
        },
        warning: {
          DEFAULT: "var(--primitives-colors-emotional-alert-600)",
          foreground: "var(--primitives-colors-foreground-1000)",
        },
        info: {
          DEFAULT: "var(--primitives-colors-emotional-info-600)",
          foreground: "var(--primitives-colors-foreground-1000)",
        },
        border: "var(--primitives-colors-background-200)",
        input: "var(--primitives-colors-background-200)",
        ring: "var(--primitives-colors-theme-600)",
      },
      borderRadius: {
        none: "var(--primitives-radius-none)",
        sm: "var(--primitives-radius-sm)",
        md: "var(--primitives-radius-md)", // Alias for Base in new system, or strictly md
        lg: "var(--primitives-radius-lg)",
        xl: "var(--primitives-radius-xl)",
        "2xl": "var(--primitives-radius-2xl)",
        full: "var(--primitives-radius-full)",
        // Semantic Aliases
        card: "var(--primitives-radius-card)",
        input: "var(--primitives-radius-input)",
        button: "var(--primitives-radius-button)",
      },
      opacity: {
        0: "var(--primitives-opacity-0)",
        5: "var(--primitives-opacity-5)",
        10: "var(--primitives-opacity-10)",
        25: "var(--primitives-opacity-25)",
        50: "var(--primitives-opacity-50)",
        75: "var(--primitives-opacity-75)",
        100: "var(--primitives-opacity-100)",
      },
      zIndex: {
        0: "var(--primitives-layer-0)",
        10: "var(--primitives-layer-10)",
        20: "var(--primitives-layer-20)",
        30: "var(--primitives-layer-30)",
        40: "var(--primitives-layer-40)",
        50: "var(--primitives-layer-50)",
        auto: "var(--primitives-layer-auto)",
        toast: "100", // Standardize toast layer
      },
      borderWidth: {
        DEFAULT: "1px",
        0: "var(--primitives-border-width-none)",
        sm: "var(--primitives-border-width-sm)",
        md: "var(--primitives-border-width-md)",
        lg: "var(--primitives-border-width-lg)",
      },
      fontFamily: {
        sans: [
          "var(--primitives-typography-font-family-primary)",
          "sans-serif",
        ],
        mono: ["var(--primitives-typography-font-family-mono)", "monospace"],
      },
      screens: {
        mobile: "375px",
        tablet: "768px",
        laptop: "1024px",
        desktop: "1440px",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      transitionDuration: {
        DEFAULT: "calc(150ms * var(--semantics-motion-duration-scale, 1))", // Updated to semantics
        75: "calc(75ms * var(--semantics-motion-duration-scale, 1))",
        100: "calc(100ms * var(--semantics-motion-duration-scale, 1))",
        150: "calc(150ms * var(--semantics-motion-duration-scale, 1))",
        200: "calc(200ms * var(--semantics-motion-duration-scale, 1))",
        300: "calc(300ms * var(--semantics-motion-duration-scale, 1))",
        500: "calc(500ms * var(--semantics-motion-duration-scale, 1))",
        700: "calc(700ms * var(--semantics-motion-duration-scale, 1))",
        1000: "calc(1000ms * var(--semantics-motion-duration-scale, 1))",
      },
      width: {
        "touch-min": "var(--primitives-touch-min)",
        "touch-comfortable": "var(--primitives-touch-comfortable)",
        mobile: "375px",
        tablet: "768px",
        laptop: "1024px",
        desktop: "1440px",
      },
      height: {
        "touch-min": "var(--primitives-touch-min)",
        "touch-comfortable": "var(--primitives-touch-comfortable)",
        "grid-gutter": "var(--primitives-grid-gutter)", // 24px
        mobile: "375px",
        tablet: "768px",
        laptop: "1024px",
        desktop: "1440px",
      },
      minWidth: {
        "touch-min": "var(--primitives-touch-min)",
        "touch-comfortable": "var(--primitives-touch-comfortable)",
      },
      minHeight: {
        "touch-min": "var(--primitives-touch-min)",
        "touch-comfortable": "var(--primitives-touch-comfortable)",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      addUtilities({
        ".glass": {
          position: "relative", // Ensure pseudo-elements align
          "backdrop-filter": "var(--glass-filter)",
          "-webkit-backdrop-filter": "var(--glass-filter)",
          "background-color": "rgba(255, 255, 255, var(--glass-opacity))", // Fallback/Light
          border: "1px solid rgba(255, 255, 255, var(--glass-bevel-opacity))",
          "will-change": "backdrop-filter, transform",
          overflow: "hidden", // Contain the surface texture
          // THICK GLASS ENHANCEMENTS:
          "box-shadow": "var(--glass-inner-shadow)",
          transform: "scale(var(--glass-scale, 1))",
          transition:
            "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease",
        },
        ".glass::before": {
          content: '""',
          position: "absolute",
          inset: "0",
          "pointer-events": "none",
          "z-index": "1", // On top of background color
          opacity: "var(--glass-surface-opacity)",
          filter: "var(--glass-surface-filter)",
          "mix-blend-mode": "overlay",
        },
        ".glass > *": {
          position: "relative",
          "z-index": "2", // Ensure content is above surface texture
        },
        ".dark .glass": {
          "background-color": "rgba(0, 0, 0, var(--glass-opacity))",
          border: "1px solid rgba(255, 255, 255, var(--glass-bevel-opacity))",
        },
        ".glass-spotlight": {
          position: "relative",
          overflow: "hidden",
        },
        ".glass-spotlight::after": {
          content: '""',
          position: "absolute",
          inset: "0",
          background:
            "radial-gradient(800px circle at var(--spotlight-x) var(--spotlight-y), rgba(255, 255, 255, 0.06), transparent 40%)",
          "z-index": "10",
          "pointer-events": "none",
        },
        ".glass-bevel": {
          // Bevel with optional Dispersion (Chromatic Aberration) simulation
          // Mixes standard bevel shadows with Red/Blue color shifts based on dispersion opacity
          "box-shadow": `
                        inset 1px 1px 0 0 rgba(255, 255, 255, 0.3), 
                        inset -1px -1px 0 0 rgba(0, 0, 0, 0.1),
                        inset 2px 0 4px rgba(255, 0, 0, var(--glass-dispersion-opacity, 0)), 
                        inset -2px 0 4px rgba(0, 255, 255, var(--glass-dispersion-opacity, 0))
                    `,
        },
        ".glass-edge-spotlight": {
          position: "relative",
        },
        ".glass-edge-spotlight::after": {
          content: '""',
          position: "absolute",
          inset: "-1px", // Hug the border
          "z-index": "10", // Topmost
          "pointer-events": "none",
          "border-radius": "inherit",
          background: "transparent",
          border: "1.5px solid rgba(255, 255, 255, 0.4)",
          "mask-image":
            "radial-gradient(200px circle at var(--spotlight-x) var(--spotlight-y), black, transparent)",
          "-webkit-mask-image":
            "radial-gradient(200px circle at var(--spotlight-x) var(--spotlight-y), black, transparent)",
          opacity: "1",
        },
      });
    }),
  ],
};
