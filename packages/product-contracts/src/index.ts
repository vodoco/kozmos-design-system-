/**
 * Platform-neutral, already-localized presentation models.
 *
 * API and map-SDK objects must be adapted into these contracts outside UI
 * components. Human-readable labels are included alongside machine values so
 * each platform renders the same meaning without embedding English formatters.
 */

export type POIAvailability = "open" | "closed" | "unknown";

export type POIAccessRestrictions = "none" | "present" | "unknown";

export type POIAction =
  | "navigate"
  | "favourite"
  | "bookmark"
  | "share"
  | "order";

export interface POIMediaPresentation {
  id: string;
  src: string;
  alt: string;
}

export interface POIServicePresentation {
  id: string;
  label: string;
  iconName?: string;
  /** Optional decorative asset; label remains visible. Web accepts HTTPS or root-relative URLs. */
  iconUrl?: string;
  /** Use the asset alpha as a current-color mask (monochrome assets only). */
  iconMonochrome?: boolean;
}

export interface POIPresentation {
  id: string;
  name: string;
  categoryId?: string;
  categoryLabel?: string;
  floorId: string;
  floorLabel: string;
  buildingId?: string;
  buildingLabel?: string;
  logo?: {
    src: string;
    alt: string;
  };
  media: readonly POIMediaPresentation[];
  availability?: POIAvailability;
  availabilityLabel?: string;
  description?: string;
  accessRestrictions?: POIAccessRestrictions;
  accessRestrictionsLabel?: string;
  services?: readonly POIServicePresentation[];
  actions: readonly POIAction[];
}

/** Optional, already-localized detail content. Keep category-specific API fields
 * in the product adapter, not in the shared POI identity or React props. */
export interface POIDetailAttributeGroup {
  id: string;
  heading: string;
  /** Optional iconName follows the existing service presentation contract.
   * Text remains authoritative when a platform cannot resolve an icon. */
  items: readonly POIServicePresentation[];
}

/** Kind describes meaning without coupling the contract to a platform icon. */
export interface POIDetailSummary {
  id: string;
  kind: "rating" | "price" | "accessibility" | "dietary" | "crowd" | "property";
  label: string;
  value: string;
  detail?: string;
  iconUrl?: string;
  iconMonochrome?: boolean;
  tone?: "neutral" | "success" | "warning" | "danger" | "brand";
  /** Optional visual scale. The localized value remains the accessible text. */
  priceLevel?: 1 | 2 | 3 | 4;
}

export interface POIOpeningHoursPresentation {
  label: string;
  summary: string;
  rows: readonly { id: string; day: string; hours: string }[];
  note?: string;
}

export type POISupplementaryAction = "book" | "call";

export interface POIDetailsPresentation {
  travelEstimate?: TravelEstimatePresentation;
  /** Highest-priority first. POI detail panels display at most the first three. */
  summary?: readonly POIDetailSummary[];
  groups?: readonly POIDetailAttributeGroup[];
  openingHours?: POIOpeningHoursPresentation;
  /** Plain text only. Products must adapt/sanitize rich API content separately. */
  description?: { preview: string; full?: string };
  tags?: readonly POIServicePresentation[];
  supplementaryActions?: readonly {
    action: POISupplementaryAction;
    label: string;
  }[];
}

export interface TravelEstimatePresentation {
  durationSeconds: number;
  durationLabel: string;
  distanceMetres?: number;
  distanceLabel?: string;
  mode?: string;
  modeLabel?: string;
}

export interface POIResultPresentation {
  poiId: string;
  resultIndex: number;
  selected: boolean;
  featured: boolean;
  floorId: string;
  travelEstimate?: TravelEstimatePresentation;
  available?: boolean;
  unavailableReason?: string;
}

export interface FloorPresentation {
  id: string;
  label: string;
  shortLabel: string;
  disabled?: boolean;
}

export interface CategoryPresentation {
  id: string;
  label: string;
  iconName?: string;
  selected: boolean;
  disabled?: boolean;
  resultCount?: number;
  resultCountLabel?: string;
}

export type RoutePreference = "quickest" | "step-free" | "custom";

export interface RouteOptionPresentation {
  id: string;
  label: string;
  durationSeconds: number;
  durationLabel: string;
  distanceMetres: number;
  distanceLabel: string;
  preference: RoutePreference;
  selected: boolean;
  available: boolean;
  warning?: string;
}

export type RouteReadiness =
  | "idle"
  | "calculating"
  | "ready"
  | "no-route"
  | "error";

export type MapReadiness =
  | "loading"
  | "ready"
  | "error"
  | "offline"
  | "unsupported";

export type UserLocationState =
  | "off"
  | "locating"
  | "following"
  | "heading"
  | "permission-denied"
  | "stale"
  | "unavailable";

export interface MapCollisionInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Physical rectangle in the shell's local units (CSS px, points or dp). */
export interface MapLayoutRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type MapPanelPresentation = "auto" | "bottom" | "side";

/** Presentation geometry only: selection, camera and route state belong to the host. */
export interface AdaptiveMapLayout {
  /** Renderer bounds relative to the shell, not the screen. */
  mapBounds: MapLayoutRect;
  panelBounds: MapLayoutRect | null;
  presentation: "bottom" | "side" | "separated";
}

export interface MapOcclusion {
  kind: "panel" | "top-bar" | "controls";
  /** Shell-local bounds; intersect with mapBounds before sending to a renderer. */
  bounds: MapLayoutRect;
}

export interface AdaptiveMapLayoutSnapshot extends AdaptiveMapLayout {
  occlusions: readonly MapOcclusion[];
  /** Physical edge padding relative to mapBounds, NOT relative to the shell. */
  collisionInsets: MapCollisionInsets;
}
