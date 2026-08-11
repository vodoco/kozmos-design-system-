/**
 * The site's buildings and levels, as the SDK reports them.
 *
 * This lived in `MapContent.tsx` until the notification feed needed it too (2026-08-11). It moved
 * rather than being exported from the screen, because the direction matters: `mock/` owns the demo
 * data and screens read it. A `mock/notifications.ts` importing from `screens/MapContent` would
 * have been the first import pointing the wrong way.
 */

import type { MapBuilding } from "../map/PointrMap";

export const SITE_ID = "c1126cb8-a192-4bd3-90f5-08fb70278862";
export const T3_ID = "51dd37d1-c2bc-4d9e-8e22-2ea1a15a626c";
export const CONCOURSE_A_ID = "c782c844-c9f0-4b02-884b-4cfa8ec9dab6";
export const CONCOURSE_C_ID = "420b008e-9ac9-4d66-bbc6-c2639c1e3f6d";

export const SITE_NAME = "Dubai International Airports";

/**
 * A verbatim snapshot of the live site (captured from the SDK's own `siteBuildings()` on
 * 2026-08-10). The Map Content tree pushes it through the same mapping the live data uses, so the
 * tree doesn't visibly change when the map finishes booting (Olcay). To refresh after the site
 * changes: run `siteBuildings()` in the map iframe and paste.
 */
export const SITE_SNAPSHOT: MapBuilding[] = [
  {
    id: CONCOURSE_A_ID, name: "Concourse A",
    levels: [
      { index: 4, short: "L4", long: "EK Business Class Lounge" },
      { index: 3, short: "L3", long: "EK First Class Lounge" },
      { index: 2, short: "L2", long: "Departures" },
      { index: 1, short: "L1", long: "Arrivals" },
      { index: 0, short: "L0", long: "Connection Floor" },
      { index: -2, short: "B2", long: "Train Connections" },
    ],
  },
  {
    id: CONCOURSE_C_ID, name: "Concourse C",
    levels: [
      { index: 2, short: "L2", long: "Arrivals" },
      { index: 1, short: "L1", long: "Departures" },
      { index: 0, short: "L0", long: "Connection Floor" },
    ],
  },
  {
    id: T3_ID, name: "Terminal 3 and B Gates",
    levels: [
      { index: 3, short: "L3", long: "EK Lounges - Concourse B" },
      { index: 2, short: "L2", long: "Departures - Concourse B" },
      { index: 1, short: "L1", long: "Arrivals - Concourse B" },
      { index: 0, short: "L0", long: "Connection Floor - Concourse B" },
      { index: -2, short: "B2", long: "Departures - Terminal 3" },
      { index: -4, short: "B4", long: "Arrivals - Terminal 3" },
    ],
  },
];
