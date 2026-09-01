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
