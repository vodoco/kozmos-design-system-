import React from "react";
import { cn } from "../../utils";

/**
 * What a surface is made of. Solid — the background colour with the subtle
 * border — is the default everywhere; glass, the glass surface role composed
 * from `Semantics.Effect.glass`, is a choice a product makes per surface.
 */
export type SurfaceVariant = "solid" | "glass";

/**
 * The class for each variant, for a component that is itself the surface's
 * element (a landmark, a list item). Both carry `kozmos-reset`: the legacy
 * preflight, scoped to the root, would otherwise keep its border reset over
 * the surface's edge.
 */
export const SURFACE_CLASSES: Record<SurfaceVariant, string> = {
  solid: "kozmos-reset kozmos-surface-solid",
  glass: "kozmos-reset kozmos-surface-glass",
};

export function surfaceClass(variant: SurfaceVariant = "solid") {
  return SURFACE_CLASSES[variant];
}

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
}

/**
 * A surface: solid by default — the background colour with the subtle border
 * — or glass, the theme's glass colour at the token's opacity with what shows
 * through blurred and saturated by the token's numbers and a light edge. The
 * shape is the caller's (`rounded-container`, `rounded-panel`); the variant
 * is the material. With transparency reduced — the design config's setting
 * or the system's — glass is the plain colour.
 */
const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ variant = "solid", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(surfaceClass(variant), className)}
      {...props}
    />
  ),
);
Surface.displayName = "Surface";

export { Surface };
