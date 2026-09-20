import React from "react";
import { cn } from "../../utils";

export type GlassSurfaceProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * The glass surface role: a surface over content it does not belong to — a
 * card over the map, a floating summary, a panel over a photo. Composed from
 * `Semantics.Effect.glass`: the theme's glass colour at the token's opacity,
 * what shows through blurred and saturated by the token's numbers, an edge at
 * the token's border opacity. The shape is the caller's (`rounded-container`,
 * `rounded-panel`); the role is the material. With transparency reduced — the
 * design config's setting or the system's — it is the plain colour. A
 * component that is a landmark or a list item applies the class
 * `kozmos-surface-glass` to its own element instead, with `kozmos-reset`: the
 * legacy preflight, scoped to the root, would otherwise keep its border reset
 * over the role's edge.
 */
const GlassSurface = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("kozmos-reset kozmos-surface-glass", className)}
      {...props}
    />
  ),
);
GlassSurface.displayName = "GlassSurface";

export { GlassSurface };
