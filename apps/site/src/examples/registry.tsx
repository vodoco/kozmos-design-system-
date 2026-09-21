import { lazy, type ComponentType } from "react";

/**
 * The examples' components, loaded on demand: a miniature on the home page
 * or the index must not pull every example into that page's chunk. Keyed by
 * the manifest's slug; the manifest itself stays free of React so the route
 * table can read it in Node.
 */
export const exampleComponents: Record<string, ComponentType> = {
  "account-settings": lazy(() => import("./account-settings/AccountSettings")),
  "venue-explorer": lazy(() => import("./venue-explorer/VenueExplorer")),
};

/** The canvas an example is drawn on when shown small. */
export const miniatureSize: Record<
  "page" | "app",
  { width: number; height: number }
> = {
  page: { width: 1200, height: 800 },
  app: { width: 1200, height: 760 },
};
