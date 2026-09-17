import type { ThemeTokens } from "../components/ThemeProvider/ThemeProvider";

export interface GlassConfig {
  enabled: boolean;
  refraction: number;
  dispersion: number;
  depth: number;
  frost: number;
  /** @deprecated Reserved experimental control; no rendered effect. */
  splay: number;
  specular: number;
  surfaceScale: number;
}

export interface DesignConfig {
  /** @deprecated Legacy radius aliases only. Customize semantic radius tokens instead. */
  roundness: number;
  glass: GlassConfig;
  noise: boolean;
  spotlight: boolean;
  /** @deprecated Legacy shadow aliases only. Customize semantic elevation tokens instead. */
  shadow: "soft" | "hard" | "none";
  motion: "fluid" | "snappy" | "reduced";
  /** @deprecated Metadata only; does not apply a preset. */
  preset?: "apple" | "geometric" | "corporate";
  accessibility: { reduceMotion: boolean; reduceTransparency: boolean };
}

export type DesignConfigInput = Omit<
  Partial<DesignConfig>,
  "glass" | "accessibility"
> & {
  glass?: Partial<GlassConfig>;
  accessibility?: Partial<DesignConfig["accessibility"]>;
};

export const DEFAULT_CONFIG: DesignConfig = {
  roundness: 1,
  glass: {
    enabled: true,
    refraction: 40,
    dispersion: 20,
    depth: 10,
    frost: 10,
    splay: 15,
    specular: 30,
    surfaceScale: 5,
  },
  noise: true,
  spotlight: true,
  shadow: "soft",
  motion: "fluid",
  preset: "apple",
  accessibility: { reduceMotion: false, reduceTransparency: false },
};

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
const bool = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;
const number = (value: unknown, fallback: number, maximum: number) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(maximum, value))
    : fallback;
function choice<T extends string>(
  value: unknown,
  choices: readonly T[],
  fallback: T,
): T {
  return choices.includes(value as T) ? (value as T) : fallback;
}

/** Whitelist and deep-merge both caller inputs and untrusted stored JSON. */
export function normalizeDesignConfig(
  value: unknown,
  base = DEFAULT_CONFIG,
): DesignConfig {
  const input = record(value);
  const glass = record(input.glass);
  const accessibility = record(input.accessibility);
  return {
    roundness: number(input.roundness, base.roundness, 2),
    glass: {
      enabled: bool(glass.enabled, base.glass.enabled),
      refraction: number(glass.refraction, base.glass.refraction, 100),
      dispersion: number(glass.dispersion, base.glass.dispersion, 100),
      depth: number(glass.depth, base.glass.depth, 100),
      frost: number(glass.frost, base.glass.frost, 100),
      splay: number(glass.splay, base.glass.splay, 100),
      specular: number(glass.specular, base.glass.specular, 100),
      surfaceScale: number(glass.surfaceScale, base.glass.surfaceScale, 100),
    },
    noise: bool(input.noise, base.noise),
    spotlight: bool(input.spotlight, base.spotlight),
    shadow: choice(input.shadow, ["soft", "hard", "none"], base.shadow),
    motion: choice(input.motion, ["fluid", "snappy", "reduced"], base.motion),
    preset: choice(
      input.preset,
      ["apple", "geometric", "corporate"] as const,
      base.preset ?? "apple",
    ),
    accessibility: {
      reduceMotion: bool(
        accessibility.reduceMotion,
        base.accessibility.reduceMotion,
      ),
      reduceTransparency: bool(
        accessibility.reduceTransparency,
        base.accessibility.reduceTransparency,
      ),
    },
  };
}

/** Backwards-compatible primitive shorthand; declarative tokens are preferred. */
export function normalizeRuntimeTokens(
  tokens: Record<string, string> = {},
): ThemeTokens {
  return Object.fromEntries(
    Object.entries(tokens)
      .filter(([, value]) => typeof value === "string" && value !== "")
      .map(([key, value]) => [
        key.startsWith("--") ? key : `--primitives-${key}`,
        value,
      ]),
  );
}

// Local, deterministic texture. Its alpha is encoded into the image so noise
// does not depend on the unrelated surface-filter opacity. No canvas/DOM work.
const noiseImage = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" seed="1"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.015"/></feComponentTransfer></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}")`;

export function designConfigTokens(
  config: DesignConfig,
  id: string,
): ThemeTokens {
  const enabled =
    config.glass.enabled && !config.accessibility.reduceTransparency;
  const motionReduced =
    config.accessibility.reduceMotion || config.motion === "reduced";
  const saturation = enabled ? 1.8 : 1;
  const motionScale = motionReduced
    ? 0.001
    : config.motion === "snappy"
      ? 0.5
      : 1;
  const innerShadow = enabled
    ? `inset 0 1px 1px 0 rgba(255, 255, 255, ${(config.glass.depth / 100) * 0.8}), inset 0 -10px 20px -10px rgba(0, 0, 0, ${(config.glass.depth / 100) * 0.6})`
    : "none";
  const bevelShadow =
    "inset 1px 1px 0 0 rgba(255,255,255,0.3), inset -1px -1px 0 0 rgba(0,0,0,0.1), inset 2px 0 4px rgba(255,0,0,var(--glass-dispersion-opacity, 0)), inset -2px 0 4px rgba(0,255,255,var(--glass-dispersion-opacity, 0))";
  const shadow =
    config.shadow === "none"
      ? ["none", "none", "none"]
      : config.shadow === "hard"
        ? [
            "2px 2px 0px rgba(0,0,0,0.15)",
            "4px 4px 0px rgba(0,0,0,0.15)",
            "8px 8px 0px rgba(0,0,0,0.15)",
          ]
        : [
            "0 1px 2px 0 rgba(0,0,0,0.05)",
            "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
            "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
          ];
  return {
    "--kozmos-design-id": id,
    "--roundness": config.roundness,
    "--radius-sm": "calc(var(--primitives-radius-sm) * var(--roundness))",
    "--radius-md": "calc(var(--primitives-radius-default) * var(--roundness))",
    "--radius-lg": "calc(var(--primitives-radius-md) * var(--roundness))",
    "--radius-xl": "calc(var(--primitives-radius-xl) * var(--roundness))",
    "--radius-2xl": "calc(var(--primitives-radius-2xl) * var(--roundness))",
    "--radius-full": "calc(var(--primitives-radius-full) * var(--roundness))",
    "--glass-opacity": enabled && !motionReduced ? 0.7 : 1,
    "--glass-blur": `${enabled ? config.glass.refraction / 2 + config.glass.frost / 5 : 0}px`,
    "--glass-scale":
      enabled && !motionReduced
        ? 1 + (config.glass.refraction / 100) * 0.05
        : 1,
    "--glass-saturation": saturation,
    "--glass-filter": `blur(var(--glass-blur)) saturate(${saturation})`,
    "--glass-bevel-opacity": enabled ? config.glass.specular / 100 : 0,
    "--glass-inner-shadow": innerShadow,
    "--glass-bevel-shadow": enabled ? bevelShadow : "none",
    "--glass-composite-shadow": enabled
      ? "var(--glass-inner-shadow), var(--glass-bevel-shadow)"
      : "none",
    "--glass-dispersion-opacity": enabled ? config.glass.dispersion / 100 : 0,
    "--glass-surface-opacity": enabled
      ? Math.min(1, (config.glass.surfaceScale / 10) * 0.3)
      : 0,
    "--glass-surface-filter":
      enabled && config.glass.surfaceScale > 0
        ? `url("#${id}-surface")`
        : "none",
    "--glass-noise-opacity": enabled && config.noise ? 0.015 : 0,
    "--glass-noise-image": enabled && config.noise ? noiseImage : "none",
    "--glass-spotlight-opacity":
      enabled && config.spotlight && !motionReduced ? 1 : 0,
    "--spotlight-x": "50%",
    "--spotlight-y": "50%",
    "--shadow-sm": shadow[0],
    "--shadow-md": shadow[1],
    "--shadow-lg": shadow[2],
    "--motion-scale": motionScale,
    "--motion-duration-scale": motionScale,
    "--semantics-motion-duration-scale": motionScale,
  };
}
