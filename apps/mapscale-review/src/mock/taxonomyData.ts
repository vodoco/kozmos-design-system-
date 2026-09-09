/**
 * **The published Pointr taxonomy, as this prototype carries it.** GENERATED — do not hand-edit.
 *
 *     pnpm taxonomy:gen
 *
 * Source: https://pointrmapstorage.blob.core.windows.net/taxonomy/10.11.0/taxonomy.json
 * Generated from that file's own metadata: 362 types, 60 properties,
 * 6 personas, 43 main types, 31 segments.
 *
 * ⚠️ **Pinned, not fetched.** A prototype whose type list can change underneath it cannot be
 * reviewed — the screenshot somebody shares stops matching what they see. See scripts/gen-taxonomy.mjs.
 *
 * ⚠️ **Data only.** Every judgement this app makes ON this data lives in `taxonomy.ts` and
 * `properties.ts`, where it can be read and argued with.
 */

export const TAXONOMY_VERSION = "10.11.0";
export const TAXONOMY_SOURCE =
  "https://pointrmapstorage.blob.core.windows.net/taxonomy/10.11.0/taxonomy.json";

/** One row per (mainType, subType). `subType: null` is the main type itself. */
export interface TaxonomyType {
  mainType: string;
  subType: string | null;
  displayName: string;
  class: string;
  category: string | null;
  description: string;
  suggested: string[];
  alsoKnownAs: string[];
  isPoi: boolean;
}

export interface TaxonomyProperty {
  key: string;
  displayName: string;
  description: string;
  valueType: string;
  inputType: string;
  segment: string;
  order: number;
  values: string[] | null;
  valueLabels: Record<string, string> | null;
  actionName: string | null;
  isSystem: boolean;
  maxCount: number | null;
}

export interface TaxonomyPersona {
  key: string;
  displayName: string;
  color: string;
  isDefault: boolean;
  description: string;
}

export const TYPES: TaxonomyType[] = [
  {
    "mainType": "furniture",
    "subType": null,
    "displayName": "Furniture",
    "class": "interior-asset",
    "category": "ACCESS",
    "description": "Movable interior asset - chairs, tables, seating, storage. Not architectural infrastructure.",
    "suggested": [],
    "alsoKnownAs": [
      "furniture",
      "interior furniture",
      "movable furniture",
      "fittings"
    ],
    "isPoi": false
  },
  {
    "mainType": "furniture",
    "subType": "bench",
    "displayName": "Bench",
    "class": "interior-asset",
    "category": "ACCESS",
    "description": "Long seat for multiple people. Used in waiting areas, lobbies, terminals, public spaces.",
    "suggested": [],
    "alsoKnownAs": [
      "bench",
      "long bench",
      "wooden bench",
      "public bench",
      "waiting bench",
      "indoor bench"
    ],
    "isPoi": false
  },
  {
    "mainType": "furniture",
    "subType": "chair",
    "displayName": "Chair",
    "class": "interior-asset",
    "category": "ACCESS",
    "description": "Single-occupancy chair. Used in waiting areas, offices, dining, lounges.",
    "suggested": [],
    "alsoKnownAs": [
      "chair",
      "seat",
      "single chair",
      "single seat",
      "office chair",
      "dining chair",
      "waiting chair"
    ],
    "isPoi": false
  },
  {
    "mainType": "furniture",
    "subType": "couch",
    "displayName": "Couch",
    "class": "interior-asset",
    "category": "ACCESS",
    "description": "Upholstered multi-seat sofa. Used in lounges, lobbies, waiting areas.",
    "suggested": [],
    "alsoKnownAs": [
      "couch",
      "sofa",
      "lounge couch",
      "settee",
      "divan",
      "multi-seat sofa"
    ],
    "isPoi": false
  },
  {
    "mainType": "furniture",
    "subType": "desk",
    "displayName": "Desk",
    "class": "interior-asset",
    "category": "ACCESS",
    "description": "Flat-surface furniture for working, writing, or computer use.",
    "suggested": [],
    "alsoKnownAs": [
      "desk",
      "work desk",
      "office desk",
      "writing desk",
      "computer desk"
    ],
    "isPoi": false
  },
  {
    "mainType": "furniture",
    "subType": "game-table",
    "displayName": "Game Table",
    "class": "interior-asset",
    "category": "WORK",
    "description": "Table designed for games - billiards, poker, foosball, board games.",
    "suggested": [],
    "alsoKnownAs": [
      "game table",
      "gaming table",
      "pool table",
      "billiards table",
      "poker table",
      "foosball table",
      "board game table"
    ],
    "isPoi": false
  },
  {
    "mainType": "furniture",
    "subType": "meeting-table",
    "displayName": "Meeting Table",
    "class": "interior-asset",
    "category": "ACCESS",
    "description": "Conference table for group meetings. Multi-person gathering surface.",
    "suggested": [],
    "alsoKnownAs": [
      "meeting table",
      "conference table",
      "boardroom table",
      "group desk",
      "meeting desk"
    ],
    "isPoi": false
  },
  {
    "mainType": "furniture",
    "subType": "raised-platform",
    "displayName": "Raised Platform",
    "class": "interior-asset",
    "category": "ACCESS",
    "description": "Slightly elevated flat surface for display, seating, or functional use.",
    "suggested": [],
    "alsoKnownAs": [
      "raised platform",
      "platform",
      "dais",
      "riser",
      "elevated surface",
      "display platform",
      "stage platform (small)"
    ],
    "isPoi": false
  },
  {
    "mainType": "furniture",
    "subType": "seating",
    "displayName": "Seating",
    "class": "interior-asset",
    "category": "ACCESS",
    "description": "General seating zone - polygon covering clustered seats (auditorium banks, waiting hall seating).",
    "suggested": [],
    "alsoKnownAs": [
      "seating",
      "seating area",
      "seats",
      "sitting area",
      "public seating",
      "seating zone",
      "mass seating"
    ],
    "isPoi": false
  },
  {
    "mainType": "furniture",
    "subType": "storage-cabinet",
    "displayName": "Storage Cabinet",
    "class": "interior-asset",
    "category": "ACCESS",
    "description": "Cabinet for storing files, documents, or office supplies.",
    "suggested": [],
    "alsoKnownAs": [
      "storage cabinet",
      "file cabinet",
      "filing cabinet",
      "office cabinet",
      "supply cabinet",
      "storage unit"
    ],
    "isPoi": false
  },
  {
    "mainType": "furniture",
    "subType": "tiered-seating",
    "displayName": "Tiered Seating",
    "class": "interior-asset",
    "category": "ACCESS",
    "description": "Stepped multi-row seating in stadiums, lecture halls, theatres, auditoriums.",
    "suggested": [],
    "alsoKnownAs": [
      "tiered seating",
      "stadium seating",
      "raked seating",
      "theater seating",
      "stepped seating",
      "bleachers",
      "grandstand"
    ],
    "isPoi": false
  },
  {
    "mainType": "accommodation-space",
    "subType": null,
    "displayName": "Accommodation Space",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Indoor facilities or accommodations, such as hotels, motels, or lodges, that provide temporary lodging and accommodations for travelers or guests. They offer rooms or living spaces equipped with amenities and services for overnight stays or extended stays.",
    "suggested": [
      "description",
      "isPetFriendly",
      "ageRestriction",
      "openingHours",
      "hasWifi",
      "accessRestrictions"
    ],
    "alsoKnownAs": [
      "on-site accommodation",
      "staff quarters",
      "overnight accommodation",
      "temporary housing",
      "short-term accommodation"
    ],
    "isPoi": true
  },
  {
    "mainType": "accommodation-space",
    "subType": "apartment",
    "displayName": "Apartment",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Self-contained accommodation unit with separate living, sleeping, and full kitchen facilities. Used for extended-stay hotels, serviced apartments, and residential lodging. Distinct from a suite by having complete cooking facilities and longer-stay design.",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasWifi",
      "isPetFriendly",
      "openingHours"
    ],
    "alsoKnownAs": [
      "apartment",
      "aparthotel",
      "flat",
      "condo",
      "condominium",
      "residential unit",
      "serviced apartment",
      "extended-stay unit",
      "studio apartment",
      "pied-à-terre",
      "holiday let",
      "vacation rental",
      "self-catering unit"
    ],
    "isPoi": true
  },
  {
    "mainType": "accommodation-space",
    "subType": "cabin",
    "displayName": "Cabin",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Standalone accommodation unit, typically located outside the main building. Spans architectural variants from rustic cabins and cottages to modern glamping pods, treehouses, and beach villas. Used in resorts, retreats, campgrounds, and holiday parks.",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasWifi",
      "isPetFriendly",
      "openingHours"
    ],
    "alsoKnownAs": [
      "cabin",
      "cottage",
      "bungalow",
      "lodge",
      "chalet",
      "glamping pod",
      "treehouse",
      "villa",
      "yurt",
      "hut",
      "casita",
      "cabana",
      "tiny home",
      "beach hut",
      "ski chalet",
      "holiday cabin",
      "log cabin"
    ],
    "isPoi": true
  },
  {
    "mainType": "accommodation-space",
    "subType": "dormitory",
    "displayName": "Dormitory",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Shared sleeping space containing multiple beds with typically shared bathroom facilities. Common in hostels, boarding schools, military barracks, and university residences. Designed for cost-effective overnight stays with communal living.",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasWifi",
      "isPetFriendly",
      "openingHours"
    ],
    "alsoKnownAs": [
      "dormitory",
      "dorm",
      "dorm room",
      "hostel room",
      "hostel dorm",
      "shared room",
      "bunk room",
      "barracks",
      "mixed dorm",
      "female dorm",
      "male dorm",
      "student dormitory",
      "military quarters",
      "shared sleeping room"
    ],
    "isPoi": true
  },
  {
    "mainType": "accommodation-space",
    "subType": "guest-room",
    "displayName": "Guest Room",
    "class": "poi",
    "category": "FACILITIES",
    "description": "A room for visitor(s) accommodation. E.g. Hotel room",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasWifi",
      "isPetFriendly",
      "openingHours"
    ],
    "alsoKnownAs": [
      "guest room",
      "private room",
      "en-suite room",
      "single room",
      "visitor room",
      "sleeping chamber"
    ],
    "isPoi": true
  },
  {
    "mainType": "accommodation-space",
    "subType": "pod",
    "displayName": "Pod",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Compact single-occupant sleeping unit with shared bathroom facilities, often stacked vertically. Common in capsule hotels, airport rest-pod chains (Yotel, sleep'n fly), and micro-hotels. Provides private overnight accommodation in a minimal footprint.",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasWifi",
      "isPetFriendly",
      "openingHours"
    ],
    "alsoKnownAs": [
      "pod",
      "capsule",
      "capsule hotel",
      "sleep pod",
      "micro-room",
      "sleeping cabin",
      "capsule room",
      "airport rest pod",
      "micro-hotel unit",
      "rest cabin",
      "sleeping pod",
      "capsule bed"
    ],
    "isPoi": true
  },
  {
    "mainType": "accommodation-space",
    "subType": "suite",
    "displayName": "Suite",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Luxury accommodation unit with multiple rooms including bedroom, living area, and enhanced amenities",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasWifi",
      "isPetFriendly",
      "openingHours"
    ],
    "alsoKnownAs": [
      "suite",
      "multi-room unit",
      "apartment-style unit",
      "private suite",
      "executive suite"
    ],
    "isPoi": true
  },
  {
    "mainType": "activity-space",
    "subType": null,
    "displayName": "Activity Space",
    "class": "poi",
    "category": "RECREATION",
    "description": "Indoor area or facility dedicated to sporting activities, physical fitness, and recreational pursuits. It offers spaces and amenities for various sports, exercise equipment, fitness classes, and leisure activities to promote health, wellness, and enjoyment.",
    "suggested": [
      "sportTypes",
      "description",
      "hasChangingFacilities",
      "crowdLevel",
      "occupancyStatus",
      "openingHours",
      "accessRestrictions"
    ],
    "alsoKnownAs": [
      "activity-zone",
      "recreation center",
      "physical activity",
      "sporting activity",
      "sports facilities",
      "recreational facilities",
      "leisure center",
      "sports"
    ],
    "isPoi": true
  },
  {
    "mainType": "activity-space",
    "subType": "bowling-alley",
    "displayName": "Bowling Alley",
    "class": "poi",
    "category": "RECREATION",
    "description": "A long narrow lane (typically 18m × 1m) used for bowling. Multiple lanes are usually grouped together in a bowling center.",
    "suggested": [
      "accessRestrictions",
      "crowdLevel",
      "description",
      "hasChangingFacilities",
      "occupancyStatus",
      "openingHours",
      "sportTypes"
    ],
    "alsoKnownAs": [
      "bowling alley",
      "bowling lane",
      "ten-pin alley",
      "bowling center",
      "bowling",
      "lawn bowls (indoor)"
    ],
    "isPoi": true
  },
  {
    "mainType": "activity-space",
    "subType": "climbing-wall",
    "displayName": "Climbing Wall",
    "class": "poi",
    "category": "RECREATION",
    "description": "A vertical face fitted with handholds and footholds for indoor climbing or bouldering. Often a wall section within a fitness facility or a dedicated climbing gym.",
    "suggested": [
      "accessRestrictions",
      "crowdLevel",
      "description",
      "hasChangingFacilities",
      "occupancyStatus",
      "openingHours",
      "sportTypes"
    ],
    "alsoKnownAs": [
      "climbing wall",
      "rock climbing wall",
      "bouldering wall",
      "climbing gym",
      "climb area",
      "indoor climbing"
    ],
    "isPoi": true
  },
  {
    "mainType": "activity-space",
    "subType": "craft-room",
    "displayName": "Craft Room",
    "class": "poi",
    "category": "RECREATION",
    "description": "Hands-on craft, maker, or hobby workshop space. Used for arts and crafts, woodworking, electronics tinkering (maker spaces), pottery, jewelry making, knitting, and similar creative activities. Common in libraries, schools, community centers, and senior centers",
    "suggested": [
      "accessRestrictions",
      "crowdLevel",
      "description",
      "hasChangingFacilities",
      "occupancyStatus",
      "openingHours",
      "sportTypes"
    ],
    "alsoKnownAs": [
      "craft room",
      "maker space",
      "makerspace",
      "hobby room",
      "art room",
      "hobbies and leisure",
      "craft workshop",
      "arts and crafts room"
    ],
    "isPoi": true
  },
  {
    "mainType": "activity-space",
    "subType": "fitness-studio",
    "displayName": "Fitness Studio",
    "class": "poi",
    "category": "RECREATION",
    "description": "An open-floor space equipped for exercise activities. Covers gyms, fitness studios, yoga and dance studios, spin rooms, and dedicated workout areas. Specific activity is set via the sportType property.",
    "suggested": [
      "accessRestrictions",
      "crowdLevel",
      "description",
      "hasChangingFacilities",
      "occupancyStatus",
      "openingHours",
      "sportTypes"
    ],
    "alsoKnownAs": [
      "gym",
      "fitness center",
      "fitness room",
      "gymnasium",
      "fitness area",
      "yoga studio",
      "dance studio",
      "exercise room",
      "workout area",
      "training room",
      "weight room",
      "spin room",
      "aerobics room"
    ],
    "isPoi": true
  },
  {
    "mainType": "activity-space",
    "subType": "gymnasium",
    "displayName": "Gymnasium",
    "class": "poi",
    "category": "RECREATION",
    "description": "A room or building equipped for gymnastics, games, and other physical exercise",
    "suggested": [
      "accessRestrictions",
      "crowdLevel",
      "description",
      "hasChangingFacilities",
      "occupancyStatus",
      "openingHours",
      "sportTypes"
    ],
    "alsoKnownAs": [
      "gymnasium",
      "gymnasiums",
      "fitness center",
      "athletic club",
      "gym"
    ],
    "isPoi": true
  },
  {
    "mainType": "activity-space",
    "subType": "ice-rink",
    "displayName": "Ice Rink",
    "class": "poi",
    "category": "RECREATION",
    "description": "A flat frozen ice surface for ice skating, ice hockey, curling, or recreational skating. Architecturally requires refrigeration infrastructure beneath the playing surface.",
    "suggested": [
      "accessRestrictions",
      "crowdLevel",
      "description",
      "hasChangingFacilities",
      "occupancyStatus",
      "openingHours",
      "sportTypes"
    ],
    "alsoKnownAs": [
      "ice rink",
      "skating rink",
      "ice skating rink",
      "hockey rink",
      "curling sheet",
      "ice surface",
      "indoor ice"
    ],
    "isPoi": true
  },
  {
    "mainType": "activity-space",
    "subType": "play-area",
    "displayName": "Play Area",
    "class": "poi",
    "category": "RECREATION",
    "description": "Indoor supervised play area specifically designed for children within a retail store, offering a safe and engaging space for kids to play while their parents or guardians shop.",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "crowdLevel",
      "description",
      "hasChangingFacilities",
      "occupancyStatus",
      "openingHours",
      "sportTypes"
    ],
    "alsoKnownAs": [
      "play area",
      "play areas",
      "playground",
      "kids area",
      "children's park"
    ],
    "isPoi": true
  },
  {
    "mainType": "activity-space",
    "subType": "sports-court",
    "displayName": "Sports Court",
    "class": "poi",
    "category": "RECREATION",
    "description": "A rectangular surface marked with painted lines for indoor or outdoor court sports. Specific sport is set via the sportType property; the polygon's proportions capture the sport's required dimensions.",
    "suggested": [
      "accessRestrictions",
      "crowdLevel",
      "description",
      "hasChangingFacilities",
      "occupancyStatus",
      "openingHours",
      "sportTypes"
    ],
    "alsoKnownAs": [
      "sports court",
      "indoor court",
      "outdoor court",
      "marked court",
      "multi-purpose court",
      "multi-sport court"
    ],
    "isPoi": true
  },
  {
    "mainType": "activity-space",
    "subType": "sports-field",
    "displayName": "Sports Field",
    "class": "poi",
    "category": "RECREATION",
    "description": "A large grass or turf surface for outdoor field sports. Used for football, soccer, rugby, baseball, cricket, lacrosse, golf and similar games. The mapper traces the field perimeter.",
    "suggested": [
      "accessRestrictions",
      "crowdLevel",
      "description",
      "hasChangingFacilities",
      "occupancyStatus",
      "openingHours",
      "sportTypes"
    ],
    "alsoKnownAs": [
      "sports field",
      "playing field",
      "pitch",
      "athletic field",
      "grass field",
      "turf field",
      "sports pitch",
      "soccer pitch"
    ],
    "isPoi": true
  },
  {
    "mainType": "activity-space",
    "subType": "swimming-pool",
    "displayName": "Swimming Pool",
    "class": "poi",
    "category": "RECREATION",
    "description": "A swimming pool is a water-filled basin used for recreation or exercise. It can vary in size and often includes features like filtration systems for water cleanliness.",
    "suggested": [
      "accessRestrictions",
      "crowdLevel",
      "description",
      "hasChangingFacilities",
      "occupancyStatus",
      "openingHours",
      "sportTypes"
    ],
    "alsoKnownAs": [
      "swimming pool",
      "indoor pool",
      "lap pool",
      "aquatic centre"
    ],
    "isPoi": true
  },
  {
    "mainType": "activity-space",
    "subType": "track",
    "displayName": "Track",
    "class": "poi",
    "category": "RECREATION",
    "description": "An oval or loop running, cycling, or athletics surface, typically with lane markings. Used for athletics, running, and indoor cycling tracks (velodromes).",
    "suggested": [
      "accessRestrictions",
      "crowdLevel",
      "description",
      "hasChangingFacilities",
      "occupancyStatus",
      "openingHours",
      "sportTypes"
    ],
    "alsoKnownAs": [
      "track",
      "running track",
      "athletics track",
      "cycling track",
      "jogging track",
      "athletics oval",
      "velodrome"
    ],
    "isPoi": true
  },
  {
    "mainType": "amenity-space",
    "subType": null,
    "displayName": "Amenity Space",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Free, facility-provided services and amenities available to all personas using the building. Includes manned service desks (info, lost & found, reception), enclosed service offices (childcare, accessibility, passport), virtual coverage zones (WiFi), and amenity zones (pet relief). Distinct from service-space (paid commercial tenants) by being building-provided and rendering with generic utility icons rather than brand logos.",
    "suggested": [
      "serviceTypes",
      "hasAssistance",
      "openingHours"
    ],
    "alsoKnownAs": [
      "building services",
      "building services",
      "amenities",
      "facilities",
      "building amenities",
      "public services",
      "guest services",
      "building facilities"
    ],
    "isPoi": true
  },
  {
    "mainType": "amenity-space",
    "subType": "branch",
    "displayName": "Branch",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Walled facility-provided customer service unit. Larger than a desk, often a dedicated room with multiple staff. Used for guest services centers, lost-and-found offices, and customer assistance branches.",
    "suggested": [
      "hasAssistance",
      "openingHours",
      "serviceTypes"
    ],
    "alsoKnownAs": [
      "facility branch",
      "customer service center",
      "guest services office",
      "customer center"
    ],
    "isPoi": true
  },
  {
    "mainType": "amenity-space",
    "subType": "desk",
    "displayName": "Desk",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Open manned counter providing facility services to visitors. Most common amenity-space shape. Identity (info, reception, lost & found, claim, registration, etc.) is set via the serviceTypes property.",
    "suggested": [
      "hasAssistance",
      "openingHours",
      "serviceTypes"
    ],
    "alsoKnownAs": [
      "info desk",
      "help desk",
      "reception desk",
      "lost-and-found counter",
      "registration desk",
      "claim desk",
      "service desk",
      "facility desk"
    ],
    "isPoi": true
  },
  {
    "mainType": "amenity-space",
    "subType": "kiosk",
    "displayName": "Kiosk",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Freestanding manned booth providing facility services. Architecturally distinct from a desk by being island-positioned (not against a wall). For unmanned automated kiosks, use equipment.kiosk instead.",
    "suggested": [
      "hasAssistance",
      "openingHours",
      "serviceTypes"
    ],
    "alsoKnownAs": [
      "manned kiosk",
      "info booth",
      "badge pickup kiosk",
      "manned ticket booth",
      "service kiosk"
    ],
    "isPoi": true
  },
  {
    "mainType": "amenity-space",
    "subType": "office",
    "displayName": "Office",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Private enclosed room for facility services requiring privacy. Used for passport-visa offices, accessibility services, childcare admin, first aid, and similar staff-attended services.",
    "suggested": [
      "hasAssistance",
      "openingHours",
      "serviceTypes"
    ],
    "alsoKnownAs": [
      "passport office",
      "accessibility office",
      "daycare office",
      "first aid office",
      "private service room",
      "facility office"
    ],
    "isPoi": true
  },
  {
    "mainType": "amenity-space",
    "subType": "pet-relief",
    "displayName": "Pet Relief",
    "class": "poi",
    "category": "WORK",
    "description": "Indoor designated space or facility within a building or establishment where pets can be taken for toileting or waste disposal, providing a convenient and controlled environment for pet owners to attend to their pets' sanitary needs.",
    "suggested": [
      "hasAssistance",
      "openingHours",
      "serviceTypes"
    ],
    "alsoKnownAs": [],
    "isPoi": true
  },
  {
    "mainType": "amenity-space",
    "subType": "pop-up",
    "displayName": "Pop-up",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Temporary visitor service stand drawn as a polygon on open floor. Used for voter registration drives, seasonal vaccine clinics, brief promotional services, and similar temporary services.",
    "suggested": [
      "hasAssistance",
      "openingHours",
      "serviceTypes"
    ],
    "alsoKnownAs": [
      "popup service",
      "voter registration drive",
      "vaccine popup",
      "seasonal info booth",
      "temporary service stand"
    ],
    "isPoi": true
  },
  {
    "mainType": "amenity-space",
    "subType": "wifi-zone",
    "displayName": "WiFi Zone",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Designated indoor area or location where wireless internet access is available to individuals, allowing them to connect their devices to the internet using WiFi technology.",
    "suggested": [
      "hasAssistance",
      "openingHours",
      "serviceTypes"
    ],
    "alsoKnownAs": [
      "wifi hotspot",
      "wifi hotspots",
      "wifi",
      "wi-fi",
      "internet access",
      "hotspot area"
    ],
    "isPoi": true
  },
  {
    "mainType": "circulation-space",
    "subType": "elevator-lobby",
    "displayName": "Elevator Lobby",
    "class": "poi",
    "category": "ACCESS",
    "description": "Designated waiting/circulation area in front of elevators. Common on each floor of multi-story buildings. Distinct from foyer (entrance hall) and corridor (passageway).",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "elevator lobby",
      "lift lobby",
      "elevator hall",
      "elevator vestibule",
      "elevator landing"
    ],
    "isPoi": true
  },
  {
    "mainType": "decorative-environmental-feature",
    "subType": null,
    "displayName": "Decorative & Environmental Feature",
    "class": "poi",
    "category": "STRUCTURAL",
    "description": "An indoor element or installation that enhances the aesthetic or environmental quality of a space, such as artwork, plants, water features, lighting installations, or sculptural and architectural ornaments.",
    "suggested": [
      "crowdLevel",
      "hasAssistance",
      "isFamilyFriendly",
      "description"
    ],
    "alsoKnownAs": [
      "monuments & memorials",
      "monuments & memorials",
      "landmarks",
      "historical sites",
      "historical markers"
    ],
    "isPoi": true
  },
  {
    "mainType": "decorative-environmental-feature",
    "subType": "art-installation",
    "displayName": "Art Installation",
    "class": "poi",
    "category": "STRUCTURAL",
    "description": "Public art piece installed permanently or semi-permanently. Includes sculptures, murals, monuments, statues, kinetic art, and similar visual art features. Common in plazas, lobbies, parks, museums.",
    "suggested": [
      "crowdLevel",
      "description",
      "hasAssistance",
      "isFamilyFriendly"
    ],
    "alsoKnownAs": [
      "art installation",
      "sculpture",
      "monument",
      "mural",
      "statue",
      "public art",
      "art piece",
      "landmark feature",
      "iconic feature",
      "art display"
    ],
    "isPoi": true
  },
  {
    "mainType": "decorative-environmental-feature",
    "subType": "beach",
    "displayName": "Beach",
    "class": "poi",
    "category": "STRUCTURAL",
    "description": "Sandy or pebbled coastal area used for recreation, relaxation, or events. Mostly applies to resort venues, coastal hotels, and beachfront facilities. Architecturally a designated zone (rather than a structure).",
    "suggested": [
      "crowdLevel",
      "description",
      "hasAssistance",
      "isFamilyFriendly"
    ],
    "alsoKnownAs": [
      "beach",
      "beach area",
      "sandy beach",
      "beachfront",
      "shoreline",
      "coastal area",
      "sand area"
    ],
    "isPoi": true
  },
  {
    "mainType": "decorative-environmental-feature",
    "subType": "courtyard",
    "displayName": "Courtyard",
    "class": "poi",
    "category": "STRUCTURAL",
    "description": "Enclosed outdoor area surrounded by building walls or structures. Often features greenery, seating, or fountains. Architecturally distinct from plaza (open public square) and patio (paved dining/seating, in circulation-space).",
    "suggested": [
      "crowdLevel",
      "description",
      "hasAssistance",
      "isFamilyFriendly"
    ],
    "alsoKnownAs": [
      "courtyard",
      "internal courtyard",
      "garden courtyard",
      "atrium courtyard",
      "enclosed garden",
      "central courtyard"
    ],
    "isPoi": true
  },
  {
    "mainType": "decorative-environmental-feature",
    "subType": "landmark-attraction",
    "displayName": "Landmark / Attraction",
    "class": "poi",
    "category": "GATHERINGS",
    "description": "A distinctive indoor or outdoor feature or location within a venue that holds cultural, historical, or architectural significance and draws visitor interest.",
    "suggested": [
      "crowdLevel",
      "description",
      "hasAssistance",
      "isFamilyFriendly"
    ],
    "alsoKnownAs": [
      "landmark / attraction",
      "landmark / attractions",
      "historic site"
    ],
    "isPoi": true
  },
  {
    "mainType": "decorative-environmental-feature",
    "subType": "park",
    "displayName": "Park",
    "class": "poi",
    "category": "STRUCTURAL",
    "description": "Large green outdoor space, often with paths, lawns, trees, and recreational features. Scales from venue-internal parks (mall outdoor parks, hospital healing parks, campus parks) to large urban parks. For whole-park venues, the park itself may be the venue rather than a feature within.",
    "suggested": [
      "crowdLevel",
      "description",
      "hasAssistance",
      "isFamilyFriendly"
    ],
    "alsoKnownAs": [
      "park",
      "urban park",
      "public park",
      "green space",
      "recreational park",
      "healing park",
      "campus park",
      "mall park",
      "lawn area"
    ],
    "isPoi": true
  },
  {
    "mainType": "decorative-environmental-feature",
    "subType": "plaza",
    "displayName": "Plaza",
    "class": "poi",
    "category": "STRUCTURAL",
    "description": "Open public square or paved gathering area. Common between buildings, at venue entrances, and in city centers. Distinct from courtyard (enclosed by building walls) and patio (in circulation-space, paved seating).",
    "suggested": [
      "crowdLevel",
      "description",
      "hasAssistance",
      "isFamilyFriendly"
    ],
    "alsoKnownAs": [
      "plaza",
      "public square",
      "civic plaza",
      "gathering plaza",
      "paved square",
      "town square",
      "piazza",
      "place (urban)"
    ],
    "isPoi": true
  },
  {
    "mainType": "diagnostic-space",
    "subType": null,
    "displayName": "Diagnostic Space",
    "class": "poi",
    "category": "CARE",
    "description": "Facility equipped for medical testing, analysis, and research to support disease diagnosis and treatment.",
    "suggested": [
      "openingHours",
      "ageRestriction",
      "description",
      "isQuietZone:true",
      "hasAssistance:true",
      "accessRestrictions"
    ],
    "alsoKnownAs": [
      "diagnostic space",
      "diagnostic spaces"
    ],
    "isPoi": true
  },
  {
    "mainType": "diagnostic-space",
    "subType": "blood-bank",
    "displayName": "Blood Bank",
    "class": "poi",
    "category": "CARE",
    "description": "A place where supplies of blood or plasma for transfusion are stored.",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasAssistance:true",
      "isQuietZone:true",
      "openingHours"
    ],
    "alsoKnownAs": [
      "blood bank",
      "blood donation center",
      "blood center",
      "transfusion services"
    ],
    "isPoi": true
  },
  {
    "mainType": "diagnostic-space",
    "subType": "ct-room",
    "displayName": "CT Room",
    "class": "poi",
    "category": "CARE",
    "description": "A room equipped with a computed tomography scanner to perform detailed imaging of internal body structures for diagnostic purposes.",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasAssistance:true",
      "isQuietZone:true",
      "openingHours"
    ],
    "alsoKnownAs": [
      "CT",
      "CT scanner",
      "computed tomography",
      "CAT scan"
    ],
    "isPoi": true
  },
  {
    "mainType": "diagnostic-space",
    "subType": "imaging-unit",
    "displayName": "Imaging Unit",
    "class": "poi",
    "category": "CARE",
    "description": "Generic imaging suite when the venue doesn't split rooms by modality (e.g., small clinics with one combined imaging room covering CT, X-ray, and ultrasound). For modality-specific rooms, use ct-room, mri-room, x-ray-room, ultrasound-room, or nuclear-medicine-room.",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasAssistance:true",
      "isQuietZone:true",
      "openingHours"
    ],
    "alsoKnownAs": [
      "imaging",
      "imaging suite",
      "radiology suite",
      "diagnostic imaging center"
    ],
    "isPoi": true
  },
  {
    "mainType": "diagnostic-space",
    "subType": "laboratory",
    "displayName": "Laboratory",
    "class": "poi",
    "category": "CARE",
    "description": "Generic clinical laboratory space with benches, sinks, fume hoods, and analytical instruments. Specific specialty (clinical chemistry, microbiology, hematology, pathology, etc.) set via the clinicalSpecialty property. For non-clinical research labs, use research-facility instead.",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasAssistance:true",
      "isQuietZone:true",
      "openingHours"
    ],
    "alsoKnownAs": [
      "lab",
      "clinical lab",
      "biochemistry lab",
      "microbiology lab",
      "hematology lab",
      "chemistry lab",
      "pathology lab"
    ],
    "isPoi": true
  },
  {
    "mainType": "diagnostic-space",
    "subType": "mri-room",
    "displayName": "MRI Room",
    "class": "poi",
    "category": "CARE",
    "description": "A shielded room containing a magnetic resonance imaging machine used to create detailed images of organs and tissues for medical evaluation.",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasAssistance:true",
      "isQuietZone:true",
      "openingHours"
    ],
    "alsoKnownAs": [
      "MRI",
      "magnetic resonance imaging",
      "MRI scanner"
    ],
    "isPoi": true
  },
  {
    "mainType": "diagnostic-space",
    "subType": "nuclear-medicine-room",
    "displayName": "Nuclear Medicine Room",
    "class": "poi",
    "category": "CARE",
    "description": "Imaging and treatment room using radiopharmaceuticals. Includes PET, SPECT, gamma camera procedures, and radioisotope therapy. Architecturally distinct due to lead shielding and adjacent hot-lab requirements.",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasAssistance:true",
      "isQuietZone:true",
      "openingHours"
    ],
    "alsoKnownAs": [
      "nuclear medicine",
      "PET scan",
      "SPECT",
      "gamma camera",
      "radiopharmacy"
    ],
    "isPoi": true
  },
  {
    "mainType": "diagnostic-space",
    "subType": "research-facility",
    "displayName": "Research Facility",
    "class": "poi",
    "category": "CARE",
    "description": "Non-clinical research space (R&D, academic research, pharmaceutical development, biotech). Distinct from laboratory (clinical diagnostic). Often part of a research building rather than a clinical hospital.",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasAssistance:true",
      "isQuietZone:true",
      "openingHours"
    ],
    "alsoKnownAs": [
      "research lab",
      "R&D lab",
      "research center",
      "academic lab",
      "drug development lab"
    ],
    "isPoi": true
  },
  {
    "mainType": "diagnostic-space",
    "subType": "ultrasound-room",
    "displayName": "Ultrasound Room",
    "class": "poi",
    "category": "CARE",
    "description": "A room with ultrasound equipment used to visualize internal organs or a fetus using high-frequency sound waves. ",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasAssistance:true",
      "isQuietZone:true",
      "openingHours"
    ],
    "alsoKnownAs": [
      "ultrasound room",
      "ultrasound rooms"
    ],
    "isPoi": true
  },
  {
    "mainType": "diagnostic-space",
    "subType": "x-ray-room",
    "displayName": "X-Ray Room",
    "class": "poi",
    "category": "CARE",
    "description": "A shielded room containing X-ray equipment to capture images of bones and internal structures for diagnostic purposes. ",
    "suggested": [
      "accessRestrictions",
      "ageRestriction",
      "description",
      "hasAssistance:true",
      "isQuietZone:true",
      "openingHours"
    ],
    "alsoKnownAs": [
      "X-ray",
      "radiography",
      "X-ray imaging"
    ],
    "isPoi": true
  },
  {
    "mainType": "education-space",
    "subType": null,
    "displayName": "Education Space",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": " A designated area for reading, studying, or working, often found in libraries, coworking spaces, or educational institutions",
    "suggested": [
      "hasAssistance",
      "hasLockers",
      "capacity",
      "name",
      "description"
    ],
    "alsoKnownAs": [
      "study space",
      "study spaces",
      "study area",
      "study hall",
      "academic space"
    ],
    "isPoi": true
  },
  {
    "mainType": "education-space",
    "subType": "classroom",
    "displayName": "Classroom",
    "class": "poi",
    "category": null,
    "description": "Standard teaching room for 20-30 students. Equipped with student desks, instructor area, and instructional equipment (board, projector). Architecturally distinct from tutoring-room (smaller, private) and lecture-hall (tiered, large-format).",
    "suggested": [
      "capacity",
      "description",
      "hasAssistance",
      "hasLockers",
      "name"
    ],
    "alsoKnownAs": [
      "classroom",
      "school room",
      "lecture room",
      "teaching room",
      "instruction room"
    ],
    "isPoi": true
  },
  {
    "mainType": "education-space",
    "subType": "computer-lab",
    "displayName": "Computer Lab",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Rows of computers for instructional or open-access use. Common in K-12 schools, university labs, public libraries. Architecturally distinct from laboratory (wet/science lab) — no benches, sinks, or fume hoods. May include language-lab, design-lab, or media-lab variants.",
    "suggested": [
      "capacity",
      "description",
      "hasAssistance",
      "hasLockers",
      "name"
    ],
    "alsoKnownAs": [
      "computer lab",
      "computer room",
      "IT lab",
      "language lab",
      "media lab",
      "technology lab",
      "design lab",
      "computer center",
      "mac lab",
      "PC lab"
    ],
    "isPoi": true
  },
  {
    "mainType": "education-space",
    "subType": "laboratory",
    "displayName": "Laboratory",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Wet laboratory for hands-on science instruction. Equipped with lab benches, sinks, fume hoods, gas/water lines. Used for chemistry, biology, physics, and similar instructional labs. For computer-only labs, see computer-lab. For clinical diagnostic labs, see diagnostic-space.laboratory.",
    "suggested": [
      "capacity",
      "description",
      "hasAssistance",
      "hasLockers",
      "name"
    ],
    "alsoKnownAs": [
      "laboratory",
      "science lab",
      "chemistry lab",
      "biology lab",
      "physics lab",
      "school lab",
      "teaching lab"
    ],
    "isPoi": true
  },
  {
    "mainType": "education-space",
    "subType": "lecture-hall",
    "displayName": "Lecture Hall",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Large tiered-seating teaching hall. Equipped with podium, projection, microphones. Designed for 50-500+ student lectures. Architecturally distinct from classroom (flat-floor, smaller) and auditorium (entertainment use).",
    "suggested": [
      "capacity",
      "description",
      "hasAssistance",
      "hasLockers",
      "name"
    ],
    "alsoKnownAs": [
      "lecture hall",
      "lecture theater",
      "lecture theatre",
      "auditorium (instructional)",
      "tiered classroom",
      "theater-style classroom"
    ],
    "isPoi": true
  },
  {
    "mainType": "education-space",
    "subType": "library",
    "displayName": "Library",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Book / media collection space within a venue. Includes shelving, reading areas, study desks, and often AV equipment. For whole-building libraries, the building itself is the venue. Distinct from study-room (small private bookable rooms).",
    "suggested": [
      "capacity",
      "description",
      "hasAssistance",
      "hasAssistance:true",
      "hasLockers",
      "hasRestrooms:true",
      "name"
    ],
    "alsoKnownAs": [
      "library",
      "school library",
      "university library",
      "library section",
      "reading room",
      "book collection"
    ],
    "isPoi": true
  },
  {
    "mainType": "education-space",
    "subType": "study-room",
    "displayName": "Study Room",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Small private room for self-directed study. Often bookable by students/users in libraries and universities. Used for individual study, group study, or quiet collaborative work. Distinct from tutoring-room (instructor-led) and classroom (formal teaching).",
    "suggested": [
      "capacity",
      "description",
      "hasAssistance",
      "hasLockers",
      "name"
    ],
    "alsoKnownAs": [
      "study room",
      "group study room",
      "private study room",
      "bookable study room",
      "library study room",
      "focus room (academic)",
      "quiet study room"
    ],
    "isPoi": true
  },
  {
    "mainType": "education-space",
    "subType": "tutoring-room",
    "displayName": "Tutoring Room",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Small private teaching space for 1-5 students. Used for one-on-one or small-group instruction. Bookable by students or pre-assigned. Smaller than classroom; instructor-led (distinct from study-room which is self-directed).",
    "suggested": [
      "capacity",
      "description",
      "hasAssistance",
      "hasLockers",
      "name"
    ],
    "alsoKnownAs": [
      "tutoring room",
      "tutorial room",
      "private tutoring",
      "small group room",
      "study tutorial room"
    ],
    "isPoi": true
  },
  {
    "mainType": "emergency-safety-space",
    "subType": null,
    "displayName": "Emergency & Safety Space",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Indoor emergency response infrastructure and safety equipment providing protection, medical aid, and refuge capabilities during emergencies and critical situations.",
    "suggested": [
      "description",
      "phoneNumber",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "emergency and safety",
      "emergency and safeties",
      "emergency services",
      "safety equipment",
      "first aid"
    ],
    "isPoi": true
  },
  {
    "mainType": "emergency-safety-space",
    "subType": "emergency-safety-shelter",
    "displayName": "Emergency Safety Shelter",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Emergency Safety Shelter refers to a designated area in a mine or underground facility where miners can seek refuge during emergencies.",
    "suggested": [
      "description",
      "phoneNumber",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "emergency safety shelter",
      "emergency safety shelters",
      "bunker",
      "emergency shelter",
      "safe house"
    ],
    "isPoi": true
  },
  {
    "mainType": "emergency-safety-space",
    "subType": "fire-door",
    "displayName": "Fire Door",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Special door designed to prevent the spread of fire and smoke.",
    "suggested": [
      "description",
      "phoneNumber",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "fire-rated door",
      "fire exit door",
      "smoke door",
      "emergency exit door",
      "fireproof door",
      "fire shutters",
      "heat-resistant door",
      "fire barrier"
    ],
    "isPoi": true
  },
  {
    "mainType": "emergency-safety-space",
    "subType": "fire-escape",
    "displayName": "Fire Escape",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Emergency exit route used to leave the building during a fire.",
    "suggested": [
      "description",
      "phoneNumber",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "fire stairs",
      "emergency exit",
      "emergency stairs",
      "external stairs",
      "fire ladder",
      "egress route",
      "evacuation path",
      "fire exit stairwell"
    ],
    "isPoi": true
  },
  {
    "mainType": "emergency-safety-space",
    "subType": "muster-point",
    "displayName": "Muster Point",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Designated safe area where people gather after evacuation.",
    "suggested": [
      "description",
      "phoneNumber",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "assembly point",
      "evacuation point",
      "gathering area",
      "muster station",
      "emergency meeting point",
      "roll-call area",
      "safe assembly zone"
    ],
    "isPoi": true
  },
  {
    "mainType": "emergency-safety-space",
    "subType": "refuge-station",
    "displayName": "Refuge Station",
    "class": "poi",
    "category": "FACILITIES",
    "description": "A refuge station is a designated safe area in a mine for miners to seek shelter during emergencies.",
    "suggested": [
      "description",
      "phoneNumber",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "refuge station",
      "refuge stations",
      "safe room",
      "evacuation point",
      "emergency assembly point"
    ],
    "isPoi": true
  },
  {
    "mainType": "emergency-safety-space",
    "subType": "safety-bay",
    "displayName": "Safety Bay",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Designated emergency shelter area for refuge during emergencies.",
    "suggested": [
      "description",
      "phoneNumber",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "safety bay",
      "safety bays",
      "emergency bay",
      "breakdown bay",
      "SOS station",
      "emergency pull-off",
      "refuge chamber",
      "safe pocket",
      "tunnel safety niche",
      "lay-by area"
    ],
    "isPoi": true
  },
  {
    "mainType": "entertainment-space",
    "subType": null,
    "displayName": "Entertainment Space",
    "class": "poi",
    "category": "RECREATION",
    "description": "A space, the primary purpose of which is for the display, presentation or performance of musicals, concerts or other live stage entertainment.",
    "suggested": [
      "description",
      "accessRestrictions"
    ],
    "alsoKnownAs": [
      "entertainment venue",
      "entertainment venues",
      "attractions"
    ],
    "isPoi": true
  },
  {
    "mainType": "entertainment-space",
    "subType": "amusement-park",
    "displayName": "Amusement Park",
    "class": "poi",
    "category": "RECREATION",
    "description": "Recreational facility with rides, attractions, and entertainment activities. Scales from large outdoor amusement parks (Disney World, Universal) to small indoor mall amusement zones (Chuck E. Cheese, Dave & Buster's, indoor ferris wheels, mini-golf attractions). For mall-scale game-machine-only sections, FMs may also use arcade.",
    "suggested": [
      "accessRestrictions",
      "description",
      "isFamilyFriendly"
    ],
    "alsoKnownAs": [
      "amusement park",
      "theme park",
      "indoor amusement",
      "family entertainment center",
      "mall amusement zone",
      "FEC"
    ],
    "isPoi": true
  },
  {
    "mainType": "entertainment-space",
    "subType": "arcade",
    "displayName": "Arcade",
    "class": "poi",
    "category": "RECREATION",
    "description": "Open room or zone with arcade machines, video games, or similar coin-operated entertainment. Common in malls, family entertainment centers, gaming venues.",
    "suggested": [
      "accessRestrictions",
      "description"
    ],
    "alsoKnownAs": [
      "arcade",
      "game room",
      "video arcade",
      "gaming room",
      "arcade game room",
      "family entertainment center",
      "FEC"
    ],
    "isPoi": true
  },
  {
    "mainType": "entertainment-space",
    "subType": "casino",
    "displayName": "Casino",
    "class": "poi",
    "category": "RECREATION",
    "description": "Indoor entertainment venue offering gambling games of chance and skill. Architecturally distinct due to gaming floor layout, security, and surveillance requirements.",
    "suggested": [
      "accessRestrictions",
      "description"
    ],
    "alsoKnownAs": [
      "casino",
      "gaming floor",
      "casino floor",
      "gambling hall"
    ],
    "isPoi": true
  },
  {
    "mainType": "entertainment-space",
    "subType": "concert-hall",
    "displayName": "Concert Hall",
    "class": "poi",
    "category": "RECREATION",
    "description": "Acoustic-optimized hall designed for music performance. Often shoebox-shaped with reverberation tuned for orchestral or amplified music. May include orchestra pit. Distinct from theater (drama-focused) and live-house (small intimate music).",
    "suggested": [
      "accessRestrictions",
      "description"
    ],
    "alsoKnownAs": [
      "concert hall",
      "performance hall",
      "philharmonic hall",
      "symphony hall",
      "music hall",
      "recital hall",
      "performance venue"
    ],
    "isPoi": true
  },
  {
    "mainType": "entertainment-space",
    "subType": "gallery",
    "displayName": "Gallery",
    "class": "poi",
    "category": "GATHERINGS",
    "description": "Indoor exhibition space for displaying art (paintings, sculpture, photography, mixed media). Often features rotating exhibitions. May be public, private, commercial, or non-commercial. Distinct from museum (educational/cultural institution with permanent collections) and retail-space.store with productTypes=Fine Art (commercial art dealer).",
    "suggested": [
      "accessRestrictions",
      "description"
    ],
    "alsoKnownAs": [
      "gallery",
      "art gallery",
      "exhibition gallery",
      "contemporary gallery",
      "fine art gallery",
      "exhibition hall",
      "art exhibition space"
    ],
    "isPoi": true
  },
  {
    "mainType": "entertainment-space",
    "subType": "live-house",
    "displayName": "Live House",
    "class": "poi",
    "category": "RECREATION",
    "description": "Small intimate live music venue. Term originated in Japan but globally used for small/medium-capacity live music spaces. Often standing room or limited seating, with stage and bar.",
    "suggested": [
      "accessRestrictions",
      "description"
    ],
    "alsoKnownAs": [
      "live house",
      "live music venue",
      "live music club",
      "music club",
      "small concert venue",
      "gig venue"
    ],
    "isPoi": true
  },
  {
    "mainType": "entertainment-space",
    "subType": "movie-theater",
    "displayName": "Movie Theater",
    "class": "poi",
    "category": "RECREATION",
    "description": "Cinema with one or more screens for movie projection. Architecturally distinct due to projection booth, raked seating, and screen wall.",
    "suggested": [
      "accessRestrictions",
      "description"
    ],
    "alsoKnownAs": [
      "movie theater",
      "cinema",
      "multiplex",
      "movie theatre",
      "picture house",
      "screen",
      "movie cinema"
    ],
    "isPoi": true
  },
  {
    "mainType": "entertainment-space",
    "subType": "museum",
    "displayName": "Museum",
    "class": "poi",
    "category": "RECREATION",
    "description": "Indoor space or building exhibiting artifacts, art, science, or history. Architectural shape varies (galleries, halls, atriums) but the core is exhibition spaces.",
    "suggested": [
      "accessRestrictions",
      "description"
    ],
    "alsoKnownAs": [
      "museum",
      "gallery",
      "exhibition hall",
      "art museum",
      "history museum",
      "science museum",
      "art gallery"
    ],
    "isPoi": true
  },
  {
    "mainType": "entertainment-space",
    "subType": "theater",
    "displayName": "Theater",
    "class": "poi",
    "category": "RECREATION",
    "description": "Indoor venue or space designed for live performances including drama, comedy, opera, ballet. Features a stage (often proscenium), raked seating, and dedicated backstage - fly tower areas.",
    "suggested": [
      "accessRestrictions",
      "description"
    ],
    "alsoKnownAs": [
      "theater",
      "theatre",
      "playhouse",
      "drama theater",
      "opera house",
      "performance theater",
      "stage theater"
    ],
    "isPoi": true
  },
  {
    "mainType": "entertainment-space",
    "subType": "wildlife-exhibit",
    "displayName": "Wildlife Exhibit",
    "class": "poi",
    "category": "RECREATION",
    "description": "Indoor or outdoor exhibition of animals or aquatic life. Covers aquariums (mall-scale and standalone), zoos (large outdoor and small petting zoos), and wildlife sanctuaries. Architecturally diverse (tanks, enclosures, pens) but consistent in purpose: animal exhibition for public viewing.",
    "suggested": [
      "accessRestrictions",
      "description"
    ],
    "alsoKnownAs": [
      "aquarium",
      "zoo",
      "wildlife exhibit",
      "animal exhibit",
      "petting zoo",
      "marine exhibit",
      "wildlife sanctuary",
      "fish house",
      "reptile exhibit"
    ],
    "isPoi": true
  },
  {
    "mainType": "entrance-exit",
    "subType": null,
    "displayName": "Entrance - Exit",
    "class": "poi",
    "category": "ACCESS",
    "description": "A way out or in of an enclosed place or space",
    "suggested": [
      "isWheelchairAccessible",
      "hasAssistance",
      "waitTime",
      "description"
    ],
    "alsoKnownAs": [
      "entrance - exit",
      "entrance - exits",
      "entry and exit"
    ],
    "isPoi": true
  },
  {
    "mainType": "entrance-exit",
    "subType": "entrance",
    "displayName": "Entrance",
    "class": "poi",
    "category": "ACCESS",
    "description": "Labeled access point used for entry to a building, zone, or section. Common examples: Main Entrance, Side Entrance, Employee Entrance, VIP Entrance, Loading Dock Entrance. Distinct from circulation-space.door (individual physical door fixtures) — entrance is the wayfinding access point at building/zone level.",
    "suggested": [
      "description",
      "hasAssistance",
      "isWheelchairAccessible",
      "waitTime"
    ],
    "alsoKnownAs": [
      "entrance",
      "main entrance",
      "side entrance",
      "employee entrance",
      "VIP entrance",
      "public entrance",
      "lobby entrance",
      "building entrance",
      "access point (entry)"
    ],
    "isPoi": true
  },
  {
    "mainType": "entrance-exit",
    "subType": "exit",
    "displayName": "Exit",
    "class": "poi",
    "category": "ACCESS",
    "description": "Labeled access point used for exiting a building, zone, or section. Common examples: Main Exit, Side Exit, Loading Dock Exit, Garage Exit. Distinct from emergency-exit (code-mandated egress with specific signage) and circulation-space.door (individual door fixtures).",
    "suggested": [
      "description",
      "hasAssistance",
      "isWheelchairAccessible",
      "waitTime"
    ],
    "alsoKnownAs": [
      "exit",
      "main exit",
      "side exit",
      "building exit",
      "public exit",
      "employee exit",
      "garage exit",
      "exit door (labeled)"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": null,
    "displayName": "Equipment",
    "class": "poi",
    "category": "STRUCTURAL",
    "description": "An indoor item or installation used to support the operation, maintenance, or function of a building or facility.",
    "suggested": [
      "languageSupport",
      "description"
    ],
    "alsoKnownAs": [],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "access-control-gate",
    "displayName": "Access Control Gate",
    "class": "poi",
    "category": "ACCESS",
    "description": "Authorized-entry gate for restricted areas. Card-access, biometric, or escort-controlled.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "access control gate",
      "access control gates",
      "security gate",
      "entry gate"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "atm",
    "displayName": "ATM",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Self-service banking machine for cash withdrawals, deposits, and transfers.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "atm",
      "cash machine",
      "cash point",
      "cashpoint",
      "automated teller",
      "money machine",
      "bank machine"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "baggage-reclaim-carousel",
    "displayName": "Baggage Reclaim Carousel",
    "class": "poi",
    "category": "ACCESS",
    "description": "Rotating conveyor at airport arrivals delivering checked luggage. Polygon obstacle, labeled by carousel number.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "baggage carousel",
      "luggage carousel",
      "baggage belt",
      "reclaim carousel",
      "baggage claim belt",
      "baggage claim",
      "carousel",
      "luggage reclaim"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "barricade",
    "displayName": "Barricade",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Physical safety barrier blocking access to hazardous areas during incidents, construction, or events.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "barricade",
      "barricades",
      "barrier",
      "blockade",
      "obstruction",
      "safety barrier",
      "fence"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "cart-rack",
    "displayName": "Cart Rack",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Designated rack or corral for shopping carts, trolleys, or luggage carts.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "cart rack",
      "cart corral",
      "shopping cart station",
      "trolley point",
      "cart station",
      "trolley rack",
      "luggage cart rack"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "cctv",
    "displayName": "CCTV",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "Closed-circuit television (CCTV) camera for surveillance. Wall- or ceiling-mounted.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "cctv",
      "surveillance camera",
      "security camera",
      "video surveillance",
      "closed-circuit camera",
      "security cam",
      "IP camera",
      "dome camera",
      "PTZ camera"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "charging-station",
    "displayName": "Charging Station",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Powered station for charging phones, tablets, laptops. Wall-mounted, table-mounted, or freestanding.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "charging station",
      "phone charging",
      "charging point",
      "charging dock",
      "device charger",
      "power station",
      "USB station"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "defibrillator",
    "displayName": "Defibrillator",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Automated External Defibrillator (AED) for cardiac emergency response. Wall-mounted, life-saving.",
    "suggested": [
      "description",
      "languageSupport",
      "serviceTypes"
    ],
    "alsoKnownAs": [
      "AED",
      "defibrillator",
      "automated external defibrillator",
      "cardiac defibrillator",
      "public access defibrillator",
      "heart defibrillator"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "display",
    "displayName": "Display",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Wall-mounted TV or screen in meeting rooms for presentations and video conferencing. Distinct from information-display (public signage).",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "display",
      "meeting room display",
      "conference display",
      "presentation screen",
      "conference TV",
      "video conference display",
      "AV display",
      "smart screen",
      "conference room screen",
      "wall display",
      "presentation TV",
      "huddle room display"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "e-passport-gate",
    "displayName": "E-Passport Gate",
    "class": "poi",
    "category": "ACCESS",
    "description": "Automated immigration gate using biometric e-passport reading. Self-service border control.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "e-passport gate",
      "ePassport gate",
      "automated border control",
      "ABC gate",
      "biometric immigration gate",
      "eGates",
      "automatic border gate"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "fire-alarm",
    "displayName": "Fire Alarm",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Manual fire alarm pull station. Wall-mounted, code-mandated along egress routes.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "fire alarm",
      "pull station",
      "manual fire alarm",
      "alarm pull",
      "fire alarm box",
      "fire bell",
      "alarm pull station",
      "manual call point",
      "MCP"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "fire-control-panel",
    "displayName": "Fire Control Panel",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Central fire alarm control panel (FACP). Monitors system status across the venue.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "fire control panel",
      "FACP",
      "fire alarm control panel",
      "fire panel",
      "fire alarm system panel",
      "fire annunciator",
      "addressable panel",
      "fire control unit"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "fire-extinguisher",
    "displayName": "Fire Extinguisher",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Portable fire extinguisher cylinder. Wall-mounted, code-distributed every ~75 ft.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "fire extinguisher",
      "extinguisher",
      "portable extinguisher",
      "fire ext",
      "ABC extinguisher",
      "dry chemical extinguisher",
      "CO2 extinguisher",
      "foam extinguisher",
      "water extinguisher"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "information-display",
    "displayName": "Information Display",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Public digital signage for visitor info — departures, arrivals, wayfinding, announcements. Distinct from display (meeting room screens).",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "information display",
      "info screen",
      "departure board",
      "arrivals board",
      "wayfinding screen",
      "digital signage",
      "info display",
      "public display",
      "announcement screen",
      "real-time display",
      "info board",
      "FIDS",
      "flight information display"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "kiosk",
    "displayName": "Kiosk",
    "class": "poi",
    "category": null,
    "description": "Self-service unmanned interactive kiosk. Specific function (info, ticketing, wayfinding, check-in) carried in the row name. For manned kiosks, see service-space.kiosk or amenity-space.kiosk.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "kiosk",
      "info kiosk",
      "ticketing kiosk",
      "internet kiosk",
      "self-service kiosk",
      "terminal",
      "interactive terminal",
      "touch screen kiosk",
      "digital kiosk",
      "check-in kiosk",
      "self check-in kiosk",
      "automated kiosk"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "pay-phone",
    "displayName": "Pay Phone",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Coin- or card-operated public telephone. Wall-mounted or in phone booth.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "pay phone",
      "payphone",
      "public phone",
      "public telephone",
      "phone booth",
      "call box",
      "coin phone"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "sanitizer-dispenser",
    "displayName": "Sanitizer Dispenser",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Wall-mounted hand sanitizer dispenser.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "sanitizer",
      "hand sanitizer",
      "sanitizer dispenser",
      "sanitiser dispenser",
      "hand sanitiser",
      "sanitization station",
      "sanitiser station"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "smoke-detector",
    "displayName": "Smoke Detector",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Ceiling-mounted smoke or heat detector. Passive sensor in the fire alarm system.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "smoke detector",
      "smoke alarm",
      "heat detector",
      "fire detector",
      "smoke sensor",
      "ionization detector",
      "photoelectric detector"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "sports-equipment-accessories",
    "displayName": "Sports Equipment & Accessories",
    "class": "poi",
    "category": "WORK",
    "description": "Gym, fitness, or sport equipment occupying floor space — treadmills, ellipticals, weight machines, free weights, racks, benches, sport-specific gear. Drawn as polygon obstacle covering the equipment footprint. Common in gyms, fitness centers, health clubs, hotel gyms.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "gym equipment",
      "fitness equipment",
      "exercise equipment",
      "workout equipment",
      "sports equipment",
      "treadmill",
      "elliptical",
      "stationary bike",
      "weight machine",
      "free weights",
      "dumbbell rack",
      "weight rack",
      "weight bench",
      "cardio equipment",
      "strength equipment",
      "gym machine"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "sprinkler",
    "displayName": "Sprinkler",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Ceiling-mounted automatic fire sprinkler head. Releases water when heat-triggered.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "sprinkler",
      "sprinkler head",
      "fire sprinkler",
      "automatic sprinkler",
      "water sprinkler",
      "NFPA sprinkler",
      "suppression head"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "trauma-kit",
    "displayName": "Trauma Kit",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Wall-mounted emergency medical supplies cabinet (bandages, tourniquets, splints). Often co-located with defibrillator.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "trauma kit",
      "trauma kits",
      "first aid kit",
      "medical kit",
      "emergency kit"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "vending-machine",
    "displayName": "Vending Machine",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Indoor automated machine that dispenses a variety of products, such as snacks, beverages, or other items, upon the insertion of payment, providing convenient access to goods without the need for human assistance.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "vending machine",
      "vending kiosk",
      "snack machine",
      "soda machine"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "water-refill-station",
    "displayName": "Water Refill Station",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Drinking water refill station for water bottles. Wall-mounted or freestanding.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "water refill",
      "water station",
      "water fountain",
      "drinking water",
      "water dispenser",
      "hydration station",
      "bottle refill",
      "drinking fountain"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "x-ray-conveyor-belt",
    "displayName": "X-ray Conveyor Belt",
    "class": "poi",
    "category": "ACCESS",
    "description": "Conveyor belt that transports items through the x-ray scanner. Drawn as polygon obstacle.",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "x-ray conveyor",
      "x-ray belt",
      "security conveyor",
      "screening conveyor",
      "scanning belt"
    ],
    "isPoi": true
  },
  {
    "mainType": "equipment",
    "subType": "x-ray-scanner",
    "displayName": "X-ray Scanner",
    "class": "poi",
    "category": "ACCESS",
    "description": "X-ray scanning device for bag inspection at security checkpoints. Distinct from walk-through metal detector (people-scanning).",
    "suggested": [
      "description",
      "languageSupport"
    ],
    "alsoKnownAs": [
      "x-ray scanner",
      "x-ray",
      "baggage scanner",
      "security scanner",
      "luggage scanner",
      "x-ray machine",
      "bag x-ray"
    ],
    "isPoi": true
  },
  {
    "mainType": "event-space",
    "subType": null,
    "displayName": "Event Space",
    "class": "poi",
    "category": "GATHERINGS",
    "description": "A designated area within a building or facility specifically designed and equipped to host various events, functions, and gatherings. This space is often flexible and adaptable to accommodate different types of events, such as conferences, meetings, weddings, parties, exhibitions, and performances.",
    "suggested": [
      "occupancyStatus",
      "hasAssistance",
      "hasWifi",
      "description",
      "accessRestrictions"
    ],
    "alsoKnownAs": [
      "event space",
      "event spaces",
      "event venue"
    ],
    "isPoi": true
  },
  {
    "mainType": "event-space",
    "subType": "booth",
    "displayName": "Booth",
    "class": "poi",
    "category": "GATHERINGS",
    "description": "Small individual exhibition stall (typically 10×10 ft) for trade shows, conferences, fairs, exhibitions. Partial walls, table or counter, branding signage. Sponsor-tier booths use the same shape — set isFeatured=true for promoted/sponsor emphasis.",
    "suggested": [
      "accessRestrictions",
      "description",
      "hasAssistance",
      "hasWifi",
      "isFeatured",
      "occupancyStatus"
    ],
    "alsoKnownAs": [
      "booth",
      "exhibition booth",
      "trade show booth",
      "exhibitor booth",
      "vendor booth",
      "stall (event)",
      "fair booth",
      "sponsor booth",
      "sponsor stall",
      "premium booth",
      "branded booth"
    ],
    "isPoi": true
  },
  {
    "mainType": "event-space",
    "subType": "pavilion",
    "displayName": "Pavilion",
    "class": "poi",
    "category": "GATHERINGS",
    "description": "A pavilion is a temporary or permanent structure within a building designed for various purposes such as exhibitions, events, and meetings.",
    "suggested": [
      "accessRestrictions",
      "description",
      "hasAssistance",
      "hasWifi",
      "occupancyStatus"
    ],
    "alsoKnownAs": [
      "pavilion",
      "pavilions"
    ],
    "isPoi": true
  },
  {
    "mainType": "event-space",
    "subType": "stage",
    "displayName": "Stage",
    "class": "poi",
    "category": "RECREATION",
    "description": "Area used for performances, presentations, or events. Typically found in malls, theatres, exhibition halls, or large public indoor spaces.",
    "suggested": [
      "accessRestrictions",
      "description",
      "hasAssistance",
      "hasWifi",
      "occupancyStatus"
    ],
    "alsoKnownAs": [
      "stage",
      "stages",
      "podium"
    ],
    "isPoi": true
  },
  {
    "mainType": "faith-worship-space",
    "subType": null,
    "displayName": "Faith & Worship Space",
    "class": "poi",
    "category": "WORK",
    "description": "Designated area or space within a building for religious or spiritual activities, such as prayer, worship, and ceremonies.",
    "suggested": [
      "genderDesignation",
      "hasAssistance",
      "description"
    ],
    "alsoKnownAs": [
      "faith & worship",
      "faith & worships",
      "place of worship",
      "religious site"
    ],
    "isPoi": true
  },
  {
    "mainType": "faith-worship-space",
    "subType": "ablution-room",
    "displayName": "Ablution Room",
    "class": "poi",
    "category": "WORK",
    "description": "Islamic ritual washing facility (wudu) for pre-prayer cleansing. Architecturally distinct from regular restroom — tiled walls, multiple low foot-washing stations with seats, drainage. Often paired with adjacent musalla. Gender-segregated typically.",
    "suggested": [
      "description",
      "genderDesignation",
      "hasAssistance"
    ],
    "alsoKnownAs": [
      "ablution room",
      "wudu room",
      "wudu area",
      "washing room (Islamic)",
      "wuzu",
      "ablution facility"
    ],
    "isPoi": true
  },
  {
    "mainType": "faith-worship-space",
    "subType": "chapel",
    "displayName": "Chapel",
    "class": "poi",
    "category": "WORK",
    "description": "Christian small worship space, typically with pews/seating, altar, and often religious iconography. Architecturally narrow with a central aisle. Used in hospitals, airports, schools, military bases, and standalone chapel buildings.",
    "suggested": [
      "description",
      "genderDesignation",
      "hasAssistance"
    ],
    "alsoKnownAs": [
      "chapel",
      "prayer chapel",
      "hospital chapel",
      "airport chapel",
      "christian chapel",
      "oratory"
    ],
    "isPoi": true
  },
  {
    "mainType": "faith-worship-space",
    "subType": "multi-faith-room",
    "displayName": "Multi-Faith Room",
    "class": "poi",
    "category": "WORK",
    "description": "Deliberately neutral worship space designed for use by people of any faith. Movable seating, no fixed religious symbols, often shoe-removal area, sometimes washing station nearby. Common in airports, hospitals, universities.",
    "suggested": [
      "description",
      "genderDesignation",
      "hasAssistance"
    ],
    "alsoKnownAs": [
      "multi-faith room",
      "multifaith room",
      "prayer room",
      "interfaith room",
      "quiet room (faith)",
      "faith room",
      "contemplation room"
    ],
    "isPoi": true
  },
  {
    "mainType": "faith-worship-space",
    "subType": "musalla",
    "displayName": "Musalla",
    "class": "poi",
    "category": "WORK",
    "description": "Islamic prayer space with carpeted floor, qibla wall facing Mecca, no seating (prayer mats used). Often paired with adjacent ablution-room for pre-prayer washing. Common in airports, hospitals, malls.",
    "suggested": [
      "description",
      "genderDesignation",
      "hasAssistance"
    ],
    "alsoKnownAs": [
      "musalla",
      "mosque (small)",
      "prayer room (Islamic)",
      "Muslim prayer room",
      "salah room",
      "masjid (small)"
    ],
    "isPoi": true
  },
  {
    "mainType": "faith-worship-space",
    "subType": "shrine",
    "displayName": "Shrine",
    "class": "poi",
    "category": "WORK",
    "description": "Small dedicated worship spot for Buddhist, Hindu, Shinto, and similar traditions. Smaller than musalla or chapel; often a niche, alcove, or small dedicated room with religious imagery, offerings, and incense. Common in Asian-market airports, malls, and hospitals.",
    "suggested": [
      "description",
      "genderDesignation",
      "hasAssistance"
    ],
    "alsoKnownAs": [
      "shrine",
      "prayer shrine",
      "Buddhist shrine",
      "Hindu shrine",
      "Shinto shrine",
      "religious niche",
      "devotional space",
      "prayer alcove"
    ],
    "isPoi": true
  },
  {
    "mainType": "food-beverage-space",
    "subType": null,
    "displayName": "Food & Beverage Space",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Indoor areas designated for the preparation, service, and consumption of food and beverages, encompassing various types of dining and refreshment spaces.",
    "suggested": [
      "isPetFriendly",
      "hasWifi",
      "cuisines",
      "dietaryOptions",
      "hasAlcoholService",
      "serviceOptions",
      "priceRange",
      "description",
      "phoneNumber",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "food & beverage",
      "food & beverages"
    ],
    "isPoi": true
  },
  {
    "mainType": "food-beverage-space",
    "subType": "bakery",
    "displayName": "Bakery",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "A bakery is a place where bread, pastries, and other baked goods are made and sold.",
    "suggested": [
      "cuisines",
      "description",
      "dietaryOptions",
      "hasAlcoholService",
      "hasWifi",
      "isPetFriendly",
      "phoneNumber",
      "priceRange",
      "serviceOptions",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "bakery",
      "bakeries",
      "patisserie"
    ],
    "isPoi": true
  },
  {
    "mainType": "food-beverage-space",
    "subType": "bar",
    "displayName": "Bar",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "An establishment serving alcoholic beverages and often offering a social setting for patrons to gather, socialize, and enjoy drinks in a leisurely atmosphere.",
    "suggested": [
      "cuisines",
      "description",
      "dietaryOptions",
      "hasAlcoholService",
      "hasAlcoholService:true",
      "hasWifi",
      "isPetFriendly",
      "phoneNumber",
      "priceRange",
      "serviceOptions",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "bar",
      "pub",
      "lounge",
      "tavern"
    ],
    "isPoi": true
  },
  {
    "mainType": "food-beverage-space",
    "subType": "cafes-coffee-tea-houses",
    "displayName": "Cafes, Coffee & Tea Houses",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Indoor establishments offering coffee, tea, and related beverages, typically accompanied by light snacks or pastries, in a relaxed and social setting.\n",
    "suggested": [
      "cuisines",
      "description",
      "dietaryOptions",
      "hasAlcoholService",
      "hasWifi",
      "isPetFriendly",
      "phoneNumber",
      "priceRange",
      "serviceOptions",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "cafes",
      "coffee & tea houses",
      "cafes",
      "coffee & tea houses"
    ],
    "isPoi": true
  },
  {
    "mainType": "food-beverage-space",
    "subType": "cafeteria",
    "displayName": "Cafeteria",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "A cafeteria is a self-service dining area where customers select and pay for their food at a counter or buffet, often found in institutions like schools, hospitals, and offices.",
    "suggested": [
      "cuisines",
      "description",
      "dietaryOptions",
      "hasAlcoholService",
      "hasWifi",
      "isPetFriendly",
      "phoneNumber",
      "priceRange",
      "serviceOptions",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "cafeteria",
      "cafeterias"
    ],
    "isPoi": true
  },
  {
    "mainType": "food-beverage-space",
    "subType": "deli-buffet",
    "displayName": "Deli / Buffet",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "A designated area within a building, often in places like hotels, restaurants, or cafeterias, where a variety of prepared foods are offered for self-service. Deli and buffet areas allow customers to select from a range of dishes, often including salads, hot entrees, sandwiches, and desserts.",
    "suggested": [
      "cuisines",
      "description",
      "dietaryOptions",
      "hasAlcoholService",
      "hasWifi",
      "isPetFriendly",
      "phoneNumber",
      "priceRange",
      "serviceOptions",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "deli / buffet",
      "deli / buffets"
    ],
    "isPoi": true
  },
  {
    "mainType": "food-beverage-space",
    "subType": "drink-stall",
    "displayName": "Drink Stall",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "A small setup where various beverages are sold",
    "suggested": [
      "cuisines",
      "description",
      "dietaryOptions",
      "hasAlcoholService",
      "hasWifi",
      "isPetFriendly",
      "phoneNumber",
      "priceRange",
      "serviceOptions",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "drink stall",
      "drink stalls",
      "drink stand",
      "refreshment stand"
    ],
    "isPoi": true
  },
  {
    "mainType": "food-beverage-space",
    "subType": "fast-food",
    "displayName": "Fast Food",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "A place where easily prepared processed food served as a quick meal or to be taken away.",
    "suggested": [
      "cuisines",
      "description",
      "dietaryOptions",
      "hasAlcoholService",
      "hasWifi",
      "isPetFriendly",
      "phoneNumber",
      "priceRange",
      "serviceOptions",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "fast food",
      "fast foods",
      "takeout"
    ],
    "isPoi": true
  },
  {
    "mainType": "food-beverage-space",
    "subType": "food-drink-stall",
    "displayName": "Food & Drink Stall",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "A small indoor stand or counter selling food and beverages to customers.",
    "suggested": [
      "cuisines",
      "description",
      "dietaryOptions",
      "hasAlcoholService",
      "hasWifi",
      "isPetFriendly",
      "phoneNumber",
      "priceRange",
      "serviceOptions",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "food & drink stall",
      "food & drink stalls",
      "food stand",
      "drink stand",
      "food cart"
    ],
    "isPoi": true
  },
  {
    "mainType": "food-beverage-space",
    "subType": "food-stall",
    "displayName": "Food Stall",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Open-zone food or drink stall in a food court, market hall, or festival. No walls; drawn as polygon over the operating footprint. Specific cuisine set via cuisines property.",
    "suggested": [
      "cuisines",
      "description",
      "dietaryOptions",
      "hasAlcoholService",
      "hasWifi",
      "isPetFriendly",
      "phoneNumber",
      "priceRange",
      "serviceOptions",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "food stall",
      "drink stall",
      "food and drink stall",
      "food court stall",
      "market stall",
      "hawker stall",
      "vendor stall",
      "food vendor",
      "festival stall"
    ],
    "isPoi": true
  },
  {
    "mainType": "food-beverage-space",
    "subType": "juice-smoothie-bar",
    "displayName": "Juice & Smoothie Bar",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "A small venue or counter specializing in freshly prepared fruit and vegetable juices, smoothies, and other health-oriented beverages. Often found in gyms, malls, and wellness-focused areas, offering quick, nutritious drink options in a casual setting.",
    "suggested": [
      "cuisines",
      "description",
      "dietaryOptions",
      "hasAlcoholService",
      "hasWifi",
      "isPetFriendly",
      "phoneNumber",
      "priceRange",
      "serviceOptions",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "juice & smoothie bar",
      "juice & smoothie bars",
      "juice stand"
    ],
    "isPoi": true
  },
  {
    "mainType": "food-beverage-space",
    "subType": "restaurant",
    "displayName": "Restaurant",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Indoor establishment offering prepared meals, beverages, and dining services to customers, providing a space for individuals or groups to enjoy a variety of culinary experiences and socialize in a food-oriented environment.",
    "suggested": [
      "cuisines",
      "description",
      "dietaryOptions",
      "hasAlcoholService",
      "hasWifi",
      "isPetFriendly",
      "phoneNumber",
      "priceRange",
      "serviceOptions",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "restaurant",
      "diner",
      "eatery",
      "bistro",
      "dining",
      "full-service restaurant"
    ],
    "isPoi": true
  },
  {
    "mainType": "industrial-space",
    "subType": null,
    "displayName": "Industrial Space",
    "class": "poi",
    "category": "PRODUCTION",
    "description": "Indoor area within an industrial facility dedicated to the production and assembly of goods or products. It includes the necessary infrastructure, machinery, and equipment for manufacturing processes, such as fabrication, assembly, and quality control, to meet production targets and standards.",
    "suggested": [
      "dressCodes",
      "openingHours",
      "description"
    ],
    "alsoKnownAs": [
      "manufacturing space",
      "manufacturing spaces",
      "production area",
      "factory",
      "industrial space",
      "production facility"
    ],
    "isPoi": true
  },
  {
    "mainType": "industrial-space",
    "subType": "assembly-space",
    "displayName": "Assembly Space",
    "class": "poi",
    "category": "PRODUCTION",
    "description": "Indoor area within a factory or manufacturing facility where various components, parts, or products are brought together and assembled to create a final product.",
    "suggested": [
      "description",
      "dressCodes",
      "openingHours"
    ],
    "alsoKnownAs": [
      "assembly space",
      "assembly spaces",
      "assembly area"
    ],
    "isPoi": true
  },
  {
    "mainType": "industrial-space",
    "subType": "development-lab",
    "displayName": "Development Lab",
    "class": "poi",
    "category": "PRODUCTION",
    "description": "A specialized area within a building, often found in research institutions, educational facilities, or technology companies, where experiments, testing, and research activities are conducted to develop and refine new products, technologies, or solutions. Development labs typically contain specialized equipment and tools relevant to the field of research.",
    "suggested": [
      "description",
      "dressCodes",
      "openingHours"
    ],
    "alsoKnownAs": [
      "development lab",
      "development labs",
      "R&D lab",
      "innovation lab"
    ],
    "isPoi": true
  },
  {
    "mainType": "industrial-space",
    "subType": "paint-workshop",
    "displayName": "Paint Workshop",
    "class": "poi",
    "category": "PRODUCTION",
    "description": "Indoor area within an industrial facility dedicated to painting processes, where items, components, or products undergo painting or coating operations. It is equipped with tools, booths, and equipment necessary for painting, finishing, and surface treatment applications.",
    "suggested": [
      "description",
      "dressCodes",
      "openingHours"
    ],
    "alsoKnownAs": [
      "paint workshop",
      "paint workshops",
      "paint shop",
      "spray booth",
      "coating facility"
    ],
    "isPoi": true
  },
  {
    "mainType": "industrial-space",
    "subType": "preparation-and-finishing-workshop",
    "displayName": "Preparation and Finishing Workshop",
    "class": "poi",
    "category": "PRODUCTION",
    "description": "Indoor area within an industrial facility dedicated to preparing and finishing products or components before they are ready for assembly or final production. It involves tasks such as cleaning, painting, polishing, or applying surface treatments to achieve the desired appearance and quality.",
    "suggested": [
      "description",
      "dressCodes",
      "openingHours"
    ],
    "alsoKnownAs": [
      "preparation and finishing workshop",
      "preparation and finishing workshops",
      "prep area",
      "finishing station",
      "pre-production area",
      "post-production area"
    ],
    "isPoi": true
  },
  {
    "mainType": "industrial-space",
    "subType": "quality-assurance-space",
    "displayName": "Quality Assurance Space",
    "class": "poi",
    "category": "PRODUCTION",
    "description": "Indoor area within an industrial setting dedicated to quality control and assurance activities. It is equipped with resources, tools, and equipment for inspecting, testing, and ensuring that products or processes meet the required quality standards and specifications.",
    "suggested": [
      "description",
      "dressCodes",
      "openingHours"
    ],
    "alsoKnownAs": [
      "quality assurance space",
      "quality assurance spaces",
      "QA lab",
      "quality control area",
      "inspection station"
    ],
    "isPoi": true
  },
  {
    "mainType": "industrial-space",
    "subType": "refurbishment",
    "displayName": "Refurbishment",
    "class": "poi",
    "category": "PRODUCTION",
    "description": "Indoor process or area within an industrial facility where equipment, machinery, or structures undergo renovation, repair, or improvement to restore or upgrade their functionality, performance, or appearance.",
    "suggested": [
      "description",
      "dressCodes",
      "openingHours"
    ],
    "alsoKnownAs": [
      "refurbishment",
      "refurbishments",
      "restoration shop",
      "renovation shop",
      "repair facility"
    ],
    "isPoi": true
  },
  {
    "mainType": "industrial-space",
    "subType": "specialized-workshop",
    "displayName": "Specialized Workshop",
    "class": "poi",
    "category": "PRODUCTION",
    "description": "Indoor area within a factory or manufacturing facility equipped with specific tools, machinery, and equipment dedicated to a particular type of production or specialized tasks, allowing for focused and efficient operations in that specific area.",
    "suggested": [
      "description",
      "dressCodes",
      "openingHours"
    ],
    "alsoKnownAs": [
      "specialized workshop",
      "specialized workshops",
      "custom shop"
    ],
    "isPoi": true
  },
  {
    "mainType": "industrial-space",
    "subType": "testing-space",
    "displayName": "Testing Space",
    "class": "poi",
    "category": "PRODUCTION",
    "description": "Indoor area within a factory or manufacturing facility dedicated to conducting tests and evaluations on products, components, or materials to ensure quality, performance, and compliance with standards or specifications.",
    "suggested": [
      "description",
      "dressCodes",
      "openingHours"
    ],
    "alsoKnownAs": [
      "testing space",
      "testing spaces",
      "test area",
      "test lab",
      "evaluation center",
      "quality control lab"
    ],
    "isPoi": true
  },
  {
    "mainType": "industrial-space",
    "subType": "workshop",
    "displayName": "Workshop",
    "class": "poi",
    "category": "PRODUCTION",
    "description": "Indoor area within a factory or manufacturing facility equipped with tools, machinery, and equipment for hands-on production, assembly, repairs, or other technical activities related to the manufacturing process.",
    "suggested": [
      "description",
      "dressCodes",
      "openingHours"
    ],
    "alsoKnownAs": [
      "workshop",
      "workshops",
      "studio",
      "shop",
      "atelier"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": null,
    "displayName": "Medical Space",
    "class": "poi",
    "category": "CARE",
    "description": "A medical room is a designated space in a building, such as a mall, airport, or office, equipped to provide first aid and medical assistance to individuals in need. It typically contains basic medical supplies and is staffed by trained personnel.",
    "suggested": [],
    "alsoKnownAs": [
      "medical room",
      "medical rooms",
      "medical facility",
      "clinical space"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "autopsy-room",
    "displayName": "Autopsy Room",
    "class": "poi",
    "category": "CARE",
    "description": "Specialized room for conducting post-mortem examinations",
    "suggested": [],
    "alsoKnownAs": [
      "autopsy",
      "autopsy suite",
      "postmortem"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "bereavement-room",
    "displayName": "Bereavement Room",
    "class": "poi",
    "category": "CARE",
    "description": "A bereavement room in a hospital is a private space for family members to grieve and say goodbye after a patient's death. It provides a peaceful and comfortable environment with access to spiritual and emotional support, as well as resources to help families cope with their loss.",
    "suggested": [],
    "alsoKnownAs": [
      "bereavement",
      "family room",
      "grief support"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "blood-draw",
    "displayName": "Blood Draw",
    "class": "poi",
    "category": "CARE",
    "description": "Designated area equipped for collecting blood samples from patients for laboratory testing and medical procedures.",
    "suggested": [],
    "alsoKnownAs": [
      "blood draw",
      "phlebotomy",
      "phlebotomy room",
      "lab draw",
      "blood test room"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "cath-lab",
    "displayName": "Cath Lab",
    "class": "poi",
    "category": "CARE",
    "description": "Cardiac catheterization lab. Specialized procedure room equipped with fluoroscopy, vascular access setup, and continuous patient monitoring. Used for diagnostic angiography, stent placement, and other cardiac interventions.",
    "suggested": [
      "clinicalSpecialty"
    ],
    "alsoKnownAs": [
      "cath lab",
      "catheterization lab",
      "cardiac catheterization",
      "cardiac cath",
      "cath suite",
      "angiography lab"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "consultation",
    "displayName": "Consultation",
    "class": "poi",
    "category": "CARE",
    "description": "Private indoor spaces designed for confidential one-on-one meetings, consultations, and professional discussions across various service sectors.",
    "suggested": [],
    "alsoKnownAs": [
      "consultation room",
      "consultation rooms",
      "doctor's office",
      "consulting room"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "decontamination-unit",
    "displayName": "Decontamination Unit",
    "class": "poi",
    "category": "CARE",
    "description": "A decontamination unit (DCU) is an area equipped with tools and systems that are used to remove hazardous and non-hazardous contaminants from persons, clothing, and equipment. They may be mobile units, modular units, or permanent facilities.",
    "suggested": [],
    "alsoKnownAs": [
      "decon",
      "decontamination"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "delivery-room",
    "displayName": "Delivery Room",
    "class": "poi",
    "category": "CARE",
    "description": "Clinical room specifically equipped for childbirth procedures",
    "suggested": [],
    "alsoKnownAs": [
      "delivery",
      "L&D",
      "labor and delivery",
      "birthing room"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "dialysis-room",
    "displayName": "Dialysis Room",
    "class": "poi",
    "category": "CARE",
    "description": "Clinical treatment area where patients with kidney failure undergo hemodialysis or peritoneal dialysis procedures. Used to remove waste products and excess fluid from the blood when kidneys can no longer function adequately. Equipped with dialysis machines, water treatment systems, patient recliners or beds, and continuous monitoring equipment. Typically operated under nephrology supervision with specialized nursing staff.",
    "suggested": [],
    "alsoKnownAs": [
      "dialysis",
      "hemodialysis"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "emergency-room",
    "displayName": "Emergency Room",
    "class": "poi",
    "category": "CARE",
    "description": "A department concerned with the provision of immediate treatment to people who are seriously injured in an accident or who are suddenly taken seriously ill.",
    "suggested": [],
    "alsoKnownAs": [
      "ER",
      "A&E",
      "emergency department",
      "ED"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "examination-room",
    "displayName": "Examination Room",
    "class": "poi",
    "category": "CARE",
    "description": "An examination room in a hospital is a private space for medical exams and consultations, equipped with medical equipment and supplies.",
    "suggested": [],
    "alsoKnownAs": [
      "exam room",
      "exam",
      "checkup room",
      "examination"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "hyperbaric-chamber",
    "displayName": "Hyperbaric Chamber",
    "class": "poi",
    "category": "CARE",
    "description": "Pressurized chamber for hyperbaric oxygen therapy (HBOT). Used in wound care, decompression sickness treatment, carbon monoxide poisoning, and certain infections. Architecturally distinct due to pressure-rated walls and dedicated gas/oxygen infrastructure.",
    "suggested": [
      "clinicalSpecialty"
    ],
    "alsoKnownAs": [
      "hyperbaric chamber",
      "hyperbaric",
      "HBOT",
      "hyperbaric oxygen therapy",
      "decompression chamber",
      "pressure chamber"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "intensive-care-unit",
    "displayName": "Intensive Care Unit",
    "class": "poi",
    "category": "CARE",
    "description": "Hospital department providing continuous monitoring and treatment for critically ill patients requiring intensive medical attention.",
    "suggested": [],
    "alsoKnownAs": [
      "ICU",
      "CCU",
      "critical care",
      "intensive care"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "isolation-room",
    "displayName": "Isolation Room",
    "class": "poi",
    "category": "CARE",
    "description": "Special hospital rooms that keep patients with certain medical conditions separate from other people while they receive medical care",
    "suggested": [],
    "alsoKnownAs": [
      "isolation",
      "negative pressure room"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "mortuary",
    "displayName": "Mortuary",
    "class": "poi",
    "category": "CARE",
    "description": "An area within a hospital where deceased individuals are respectfully stored and prepared for final arrangements, such as autopsies, preservation, or release to funeral homes. It serves as a facility for handling deceased patients with dignity and providing necessary mortuary services.",
    "suggested": [],
    "alsoKnownAs": [
      "morgue",
      "body storage"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "observation-room",
    "displayName": "Observation Room",
    "class": "poi",
    "category": "CARE",
    "description": "Area for continuous patient monitoring to assess medical condition and treatment response.",
    "suggested": [],
    "alsoKnownAs": [
      "observation room",
      "observation rooms",
      "observation unit",
      "monitoring room"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "operating-room",
    "displayName": "Operating Room",
    "class": "poi",
    "category": "CARE",
    "description": "A room in a hospital where surgical operations are performed.",
    "suggested": [],
    "alsoKnownAs": [
      "OR",
      "OT",
      "operating theater",
      "operating theatre",
      "surgical suite"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "patient-room",
    "displayName": "Patient Room",
    "class": "poi",
    "category": "CARE",
    "description": "Indoor area within a hospital where patients receive medical care, rest, and recover during their hospital stay. It typically includes a bed, basic amenities, and medical equipment necessary for patient care.",
    "suggested": [],
    "alsoKnownAs": [
      "hospital room",
      "inpatient room",
      "bed room"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "pharmacy",
    "displayName": "Pharmacy",
    "class": "poi",
    "category": "CARE",
    "description": "A designated area within a hospital where medications, prescriptions, and medical supplies are prepared, stored, and distributed to patients. Pharmacies ensure proper management and distribution of medicines under the supervision of trained medical professionals.",
    "suggested": [],
    "alsoKnownAs": [
      "hospital pharmacy",
      "dispensary"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "pre-op-room",
    "displayName": "Pre-Op Room",
    "class": "poi",
    "category": "CARE",
    "description": "Preparation area where patients are assessed and readied before surgery",
    "suggested": [],
    "alsoKnownAs": [
      "pre-op",
      "preoperative room"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "preparation-room",
    "displayName": "Preparation Room",
    "class": "poi",
    "category": "CARE",
    "description": "Space where medical staff organize equipment, supplies, and medications before procedures.",
    "suggested": [],
    "alsoKnownAs": [
      "prep room",
      "patient prep",
      "preparation"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "procedure-room",
    "displayName": "Procedure Room",
    "class": "poi",
    "category": "CARE",
    "description": "A sterile space designed for minor surgical or medical procedures that don’t require a full operating theater. ",
    "suggested": [],
    "alsoKnownAs": [
      "procedure",
      "minor procedure room"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "psychiatric-room",
    "displayName": "Psychiatric Room",
    "class": "poi",
    "category": "CARE",
    "description": "Inpatient room designed for mental health patients with safety-focused features",
    "suggested": [],
    "alsoKnownAs": [
      "psych room",
      "psychiatric",
      "behavioral health room"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "quarantine",
    "displayName": "Quarantine",
    "class": "poi",
    "category": "CARE",
    "description": "Indoor area or designated space where individuals or groups are isolated or separated to prevent the spread of contagious diseases or ensure compliance with specific health protocols.",
    "suggested": [],
    "alsoKnownAs": [
      "quarantine",
      "quarantines",
      "isolation ward",
      "containment unit"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "recovery-room",
    "displayName": "Recovery Room",
    "class": "poi",
    "category": "CARE",
    "description": "Post-anesthesia care unit (PACU) where patients regain consciousness under close monitoring",
    "suggested": [],
    "alsoKnownAs": [
      "recovery",
      "PACU",
      "post-op recovery"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "sleep-lab",
    "displayName": "Sleep Lab",
    "class": "poi",
    "category": "CARE",
    "description": "Specialized room for diagnosing sleep disorders with monitoring equipment",
    "suggested": [],
    "alsoKnownAs": [
      "sleep study",
      "polysomnography lab"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "step-down-unit",
    "displayName": "Step Down Unit",
    "class": "poi",
    "category": "CARE",
    "description": "A step-down unit in a hospital provides specialized care for patients who no longer require intensive care but still need a higher level of care than a general hospital floor.",
    "suggested": [],
    "alsoKnownAs": [
      "step-down",
      "intermediate care unit",
      "IMU"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "sterile-compounding",
    "displayName": "Sterile Compounding",
    "class": "poi",
    "category": "CARE",
    "description": "USP 797/800 compliant pharmacy compounding room for sterile drug preparation (IV admixtures, hazardous drugs, total parenteral nutrition). Includes anteroom, primary engineering controls (laminar flow hood), and pressure differentials. Architecturally distinct from the dispensing pharmacy.",
    "suggested": [
      "clinicalSpecialty"
    ],
    "alsoKnownAs": [
      "sterile compounding",
      "IV room",
      "hood room",
      "USP 797 room",
      "sterile pharmacy",
      "IV admixture room",
      "clean room"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "sterilization-room",
    "displayName": "Sterilization Room",
    "class": "poi",
    "category": "CARE",
    "description": "Area where medical instruments are cleaned and sterilized for reuse",
    "suggested": [],
    "alsoKnownAs": [
      "sterilization",
      "sterile processing",
      "SPD"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "therapy-rehabilitation-room",
    "displayName": "Therapy & Rehabilitation Room",
    "class": "poi",
    "category": "CARE",
    "description": "A rehabilitation room in a hospital is a dedicated space with specialized equipment where patients receive physical, occupational, or speech therapy to aid in their recovery from an injury, illness, or surgery.",
    "suggested": [],
    "alsoKnownAs": [
      "rehab",
      "therapy room",
      "PT room",
      "OT room"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "treatment-room",
    "displayName": "Treatment Room",
    "class": "poi",
    "category": "CARE",
    "description": "Indoor area for treatment procedures, processing operations, and specialized transformations",
    "suggested": [],
    "alsoKnownAs": [
      "treatment",
      "infusion room"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "triage",
    "displayName": "Triage",
    "class": "poi",
    "category": "CARE",
    "description": "Initial patient assessment area in emergency departments where medical urgency is evaluated and prioritized.",
    "suggested": [],
    "alsoKnownAs": [
      "triage",
      "triage station",
      "patient assessment station"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "veterinary-clinic",
    "displayName": "Veterinary Clinic",
    "class": "poi",
    "category": "CARE",
    "description": "Healthcare facility that provides medical treatment and care for animals. It is typically smaller than a full animal hospital and often focuses on routine care such as health check-ups, vaccinations, minor surgeries, and general medical treatments. Veterinary clinics are often operated by a single veterinarian or a group of veterinarians and may offer services like diagnostics, dental care, parasite control, and preventive health care.",
    "suggested": [
      "isPetFriendly:true"
    ],
    "alsoKnownAs": [
      "veterinary clinic",
      "veterinary clinics",
      "animal clinic"
    ],
    "isPoi": true
  },
  {
    "mainType": "medical-space",
    "subType": "ward",
    "displayName": "Ward",
    "class": "poi",
    "category": "CARE",
    "description": "Indoor section within a hospital that accommodates multiple patient beds for medical care, treatment, and monitoring during the course of their stay.",
    "suggested": [],
    "alsoKnownAs": [
      "general ward",
      "inpatient ward"
    ],
    "isPoi": true
  },
  {
    "mainType": "meeting-space",
    "subType": null,
    "displayName": "Meeting Space",
    "class": "poi",
    "category": "WORK",
    "description": "Indoor area or room within a facility specifically designated for hosting meetings, conferences, or group discussions. It provides a suitable environment with seating arrangements, audiovisual equipment, and necessary amenities to facilitate productive and collaborative gatherings.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "meeting space",
      "meeting spaces"
    ],
    "isPoi": true
  },
  {
    "mainType": "meeting-space",
    "subType": "auditorium",
    "displayName": "Auditorium",
    "class": "poi",
    "category": "WORK",
    "description": "Tiered fixed-seating space with stage and AV. Designed for lectures, presentations, performances. 100-1000+ capacity. Distinct from conference-hall (flat-floor, modular) - auditorium has permanent raked seats and elevated stage.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "auditorium",
      "lecture hall",
      "theater (presentation)",
      "assembly hall",
      "presentation hall"
    ],
    "isPoi": true
  },
  {
    "mainType": "meeting-space",
    "subType": "breakout-room",
    "displayName": "Breakout Room",
    "class": "poi",
    "category": "WORK",
    "description": "Smaller, separate physical space within a larger meeting area, used for group discussions, workshops, or private conversations during events.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "breakout room",
      "breakout rooms"
    ],
    "isPoi": true
  },
  {
    "mainType": "meeting-space",
    "subType": "conference-hall",
    "displayName": "Conference Hall",
    "class": "poi",
    "category": "WORK",
    "description": "Large flat-floor event/meeting space, often divisible via movable walls. Modular seating arrangement (banquet, classroom-style, theater-style). Designed for 50-500+ attendees. Architecturally distinct from auditorium (tiered/fixed) and meeting-room (smaller).",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "onference hall",
      "ballroom",
      "event hall",
      "banquet hall",
      "function hall",
      "divisible meeting space"
    ],
    "isPoi": true
  },
  {
    "mainType": "meeting-space",
    "subType": "huddle-room",
    "displayName": "Huddle Room",
    "class": "poi",
    "category": "WORK",
    "description": "Small, informal meeting space for 2-8 people, equipped with video conferencing and collaboration tools for quick brainstorming and problem-solving sessions.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "huddle room",
      "huddle rooms"
    ],
    "isPoi": true
  },
  {
    "mainType": "meeting-space",
    "subType": "meeting-room",
    "displayName": "Meeting Room",
    "class": "poi",
    "category": "WORK",
    "description": "Standard meeting room for 6-15 people, equipped with table, chairs, and basic audio-visual equipment for regular business meetings and presentations.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "meeting room",
      "meeting rooms"
    ],
    "isPoi": true
  },
  {
    "mainType": "meeting-space",
    "subType": "phone-booth",
    "displayName": "Phone Booth",
    "class": "poi",
    "category": "WORK",
    "description": "Single-occupant soundproof pod for private phone/video calls. Sealed acoustic walls, ventilation, small fold-down desk. Distinct architectural shape (4-6 sqft enclosed pod) - not a small meeting room.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "phone booth",
      "phone pod",
      "call booth",
      "focus booth",
      "privacy pod",
      "phone room (solo)",
      "call pod"
    ],
    "isPoi": true
  },
  {
    "mainType": "meeting-space",
    "subType": "war-room",
    "displayName": "War Room",
    "class": "poi",
    "category": "WORK",
    "description": "Dedicated project space for intensive collaborative work on specific initiatives",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "war room",
      "war rooms"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": null,
    "displayName": "Operational Space",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "Indoor areas housing mechanical equipment, HVAC systems, electrical panels, and building infrastructure necessary for facility operations.",
    "suggested": [],
    "alsoKnownAs": [
      "operational space",
      "operational spaces"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": "boiler-room",
    "displayName": "Boiler Room",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "A room containing boilers, water heating systems, and related heating equipment.",
    "suggested": [],
    "alsoKnownAs": [
      "boiler room",
      "boiler plant",
      "heating plant",
      "hot water plant"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": "control-room",
    "displayName": "Control Room",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "A centralized space for monitoring and controlling building management systems, environmental controls, and operations.",
    "suggested": [],
    "alsoKnownAs": [
      "control room",
      "BMS room",
      "building management",
      "operations center",
      "ops center"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": "data-center",
    "displayName": "Data Center",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "A facility for housing computer systems, data storage, and critical IT infrastructure with specialized environmental controls.",
    "suggested": [],
    "alsoKnownAs": [
      "data center",
      "data centre",
      "server farm",
      "computing facility"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": "electrical-room",
    "displayName": "Electrical Room",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "A room containing electrical panels, circuit breakers, transformers, and other electrical distribution equipment",
    "suggested": [],
    "alsoKnownAs": [
      "electrical room",
      "electric room",
      "switchgear room",
      "electrical panel room",
      "power room",
      "transformer room"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": "environmental-services-unit",
    "displayName": "Environmental Services Unit",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "The Environmental Services Unit (EVS) in a hospital is responsible for cleaning and maintaining the hospital environment to prevent the spread of infections and ensure a safe environment for patients, staff, and visitors.",
    "suggested": [],
    "alsoKnownAs": [
      "environmental services",
      "ESU",
      "housekeeping",
      "custodial",
      "EVS unit",
      "maintenance housekeeping",
      "sanitation"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": "fire-safety-room",
    "displayName": "Fire Safety Room",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "A room containing fire suppression equipment, emergency controls, and safety systems.",
    "suggested": [],
    "alsoKnownAs": [
      "fire safety",
      "fire pump room",
      "fire control room",
      "fire protection",
      "sprinkler control"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": "generator-room",
    "displayName": "Generator Room",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "A space housing backup power generators and emergency electrical systems.",
    "suggested": [],
    "alsoKnownAs": [
      "generator",
      "genset room",
      "backup power",
      "emergency power"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": "janitorial-closet",
    "displayName": "Janitorial Closet",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "A storage space for cleaning supplies, equipment, and maintenance materials used by custodial staff.",
    "suggested": [],
    "alsoKnownAs": [
      "janitorial",
      "janitor closet",
      "cleaning closet",
      "custodial closet",
      "supply closet (cleaning)"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": "loading-dock",
    "displayName": "Loading Dock",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "An area where goods and materials are received, stored temporarily, and distributed within the facility.",
    "suggested": [],
    "alsoKnownAs": [
      "loading dock",
      "loading bay",
      "freight dock",
      "delivery bay",
      "shipping receiving"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": "mechanical-room",
    "displayName": "Mechanical Room",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "Back-of-house room housing HVAC, plumbing, and mechanical infrastructure (chillers, pumps, water heaters, air handlers, valve sets, control panels). Includes generic equipment rooms and utility rooms. For dedicated electrical infrastructure, use electrical-room. For boilers specifically, use boiler-room.",
    "suggested": [],
    "alsoKnownAs": [
      "mechanical room",
      "mech room",
      "M&E room",
      "plant room",
      "equipment room",
      "utility room",
      "building services room",
      "MEP room"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": "security-room",
    "displayName": "Security Room",
    "class": "poi",
    "category": "OPERATIONS",
    "description": " A control center for monitoring building security systems, surveillance equipment, and safety protocols.",
    "suggested": [],
    "alsoKnownAs": [
      "security room",
      "CCTV room",
      "surveillance room",
      "security operations",
      "SOC"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": "server-room",
    "displayName": "Server Room",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "A dedicated space for housing computer servers, network equipment, and IT infrastructure with specialized cooling and security.",
    "suggested": [],
    "alsoKnownAs": [
      "server room",
      "IT room (back of house)",
      "networking room",
      "computer room"
    ],
    "isPoi": true
  },
  {
    "mainType": "operational-space",
    "subType": "telecom-room",
    "displayName": "Telecom Room",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "A space housing telecommunications equipment, phone systems, and communication infrastructure.",
    "suggested": [],
    "alsoKnownAs": [
      "telecom room",
      "MDF",
      "IDF",
      "telecom closet",
      "network closet",
      "TR room"
    ],
    "isPoi": true
  },
  {
    "mainType": "parking-space",
    "subType": null,
    "displayName": "Parking Space",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Indoor facility or area within a building or establishment that offers parking spaces and related services, such as valet parking, security monitoring, and assistance with vehicle parking and retrieval.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "parking service",
      "parking services"
    ],
    "isPoi": true
  },
  {
    "mainType": "parking-space",
    "subType": "bike-rack",
    "displayName": "Bike Rack",
    "class": "poi",
    "category": "SERVICES",
    "description": "A designated area where users can rent or park bicycles, often part of a public or shared bike system.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "bike station",
      "bike stations",
      "bike share",
      "bicycle rental",
      "bike rack"
    ],
    "isPoi": true
  },
  {
    "mainType": "parking-space",
    "subType": "car-repair-services",
    "displayName": "Car Services",
    "class": "poi",
    "category": "SERVICES",
    "description": "Indoor area offering various automotive services, such as car maintenance, repairs, detailing, and other related services for vehicles.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "car services",
      "car services",
      "auto repair",
      "car maintenance",
      "mechanic",
      "auto shop"
    ],
    "isPoi": true
  },
  {
    "mainType": "parking-space",
    "subType": "car-wash",
    "displayName": "Car Wash",
    "class": "poi",
    "category": "SERVICES",
    "description": "A facility where vehicles are cleaned manually or automatically",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "car wash",
      "car washes",
      "auto wash",
      "vehicle wash",
      "auto spa"
    ],
    "isPoi": true
  },
  {
    "mainType": "parking-space",
    "subType": "electric-vehicle-station",
    "displayName": "Electric Vehicle Station",
    "class": "poi",
    "category": "SERVICES",
    "description": "An indoor electric vehicle (EV) station is a designated area within a building that provides charging facilities for electric vehicles. It allows EV owners to connect their vehicles to a power source for recharging while indoors.",
    "suggested": [
      "description",
      "hasChangingFacilities"
    ],
    "alsoKnownAs": [
      "ev charging station",
      "ev charging stations",
      "EV charger"
    ],
    "isPoi": true
  },
  {
    "mainType": "parking-space",
    "subType": "parking-row",
    "displayName": "Parking Row",
    "class": "poi",
    "category": "FACILITIES",
    "description": "A virtual feature that represents a set or a row of parking spots.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "parking row",
      "parking rows",
      "parking aisle",
      "parking lane"
    ],
    "isPoi": true
  },
  {
    "mainType": "parking-space",
    "subType": "parking-spot",
    "displayName": "Parking Spot",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Designated indoor area or space within a facility where vehicles can be parked and temporarily stored. It provides a convenient and organized location for individuals to leave their vehicles while visiting or accessing the premises.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "parking spot",
      "parking spots",
      "parking space",
      "vehicle space",
      "parking bay"
    ],
    "isPoi": true
  },
  {
    "mainType": "restroom-space",
    "subType": null,
    "displayName": "Restroom Space",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Indoor facilities or designated areas within a building or establishment providing restroom facilities for personal hygiene and sanitation purposes, typically equipped with toilets, sinks, and other necessary amenities.",
    "suggested": [
      "genderDesignation",
      "isWheelchairAccessible",
      "hasChangingFacilities",
      "hasLockers",
      "hasRestrooms",
      "isFamilyFriendly"
    ],
    "alsoKnownAs": [
      "restroom facilities",
      "sanitary facilities"
    ],
    "isPoi": true
  },
  {
    "mainType": "restroom-space",
    "subType": "baby-care-hygiene",
    "displayName": "Baby Care & Hygiene",
    "class": "poi",
    "category": "CARE",
    "description": "Indoor area dedicated to providing facilities, products, and services for the care, cleanliness, and well-being of infants and young children. This may include diaper changing stations, nursing rooms, baby supplies, hygiene products, and related amenities.",
    "suggested": [
      "genderDesignation",
      "hasChangingFacilities",
      "hasLockers",
      "hasRestrooms",
      "isFamilyFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "baby care & hygiene",
      "baby care room",
      "baby changing station",
      "diaper changing table",
      "nappy change",
      "nursery",
      "parent's room"
    ],
    "isPoi": true
  },
  {
    "mainType": "restroom-space",
    "subType": "changing-room",
    "displayName": "Changing Room",
    "class": "poi",
    "category": "FACILITIES",
    "description": "A private area within a hotel where guests can change clothes, either in suites or near amenities like pools or spas.",
    "suggested": [
      "genderDesignation",
      "hasChangingFacilities",
      "hasLockers",
      "hasRestrooms",
      "isFamilyFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "changing room",
      "changing rooms",
      "fitting room",
      "dressing room"
    ],
    "isPoi": true
  },
  {
    "mainType": "restroom-space",
    "subType": "locker-room",
    "displayName": "Locker Room",
    "class": "poi",
    "category": "FACILITIES",
    "description": "An all-gender locker room is a facility that accommodates individuals of any gender identity or expression, providing an inclusive space where people can change, shower, and store personal belongings without being restricted by traditional gender divisions.",
    "suggested": [
      "genderDesignation",
      "hasChangingFacilities",
      "hasLockers",
      "hasRestrooms",
      "isFamilyFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "locker room",
      "locker rooms"
    ],
    "isPoi": true
  },
  {
    "mainType": "restroom-space",
    "subType": "mothers-room",
    "displayName": "Mothers' Room",
    "class": "poi",
    "category": "CARE",
    "description": "Indoor space or facility within a building or establishment designed for nursing mothers to breastfeed or express milk in privacy and comfort. It provides amenities such as comfortable seating, breastfeeding equipment, and a calm environment to support the needs of breastfeeding mothers.",
    "suggested": [
      "genderDesignation",
      "hasChangingFacilities",
      "hasLockers",
      "hasRestrooms",
      "isFamilyFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "mothers' room",
      "mothers' rooms",
      "nursing room",
      "lactation room",
      "breastfeeding room",
      "feeding room"
    ],
    "isPoi": true
  },
  {
    "mainType": "restroom-space",
    "subType": "restroom",
    "displayName": "Restroom",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Indoor facilities or designated areas within a building or establishment providing restroom facilities for personal hygiene and sanitation purposes, typically equipped with toilets, sinks, and other necessary amenities.",
    "suggested": [
      "genderDesignation",
      "hasChangingFacilities",
      "hasLockers",
      "hasRestrooms",
      "isFamilyFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "restroom",
      "toilet",
      "washroom",
      "bathroom",
      "lavatory",
      "loo",
      "WC",
      "powder room"
    ],
    "isPoi": true
  },
  {
    "mainType": "restroom-space",
    "subType": "shower",
    "displayName": "Shower",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Indoor space or enclosed area equipped with facilities for individuals to cleanse and refresh themselves by using water for bathing or showering.",
    "suggested": [
      "genderDesignation",
      "hasChangingFacilities",
      "hasLockers",
      "hasRestrooms",
      "isFamilyFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "shower",
      "showers",
      "shower room",
      "shower facilities"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": null,
    "displayName": "Retail Space",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Indoor shopping infrastructure and services including display areas, checkout zones, fitting rooms, customer service counters, and retail support facilities.",
    "suggested": [
      "hasAssistance",
      "isAnchor",
      "productTypes",
      "description",
      "websiteUrl",
      "isFeatured"
    ],
    "alsoKnownAs": [
      "retail space",
      "retail spaces",
      "retail store",
      "shopping area"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "checkout",
    "displayName": "Checkout",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Indoor area in a retail store or establishment where customers complete their purchases, make payment, and finalize their transactions before leaving the premises.",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "checkout",
      "checkouts",
      "cashier",
      "checkout counter",
      "point of sale",
      "POS",
      "payment desk",
      "self checkout area"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "display-area",
    "displayName": "Display Area",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "A display area in indoor places is a designated space where items or information are showcased to attract attention or promote products/services. It can include signage, posters, digital screens, or product showcases.",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "display area",
      "display areas",
      "exhibition area",
      "showcase",
      "feature area",
      "product display"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "end-cap-display",
    "displayName": "End Cap Display",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Promotional display at the end of store aisles featuring seasonal items, special offers, or highlighted products.",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "end cap display",
      "end cap displays"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "experience-zone",
    "displayName": "Experience Zone",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Experiential retail space dedicated to brand experience, product demos, interactive engagement, or activations rather than traditional sales. Customers come to engage with the brand or try products (test stations, brand storytelling, immersive displays). Distinct from store (transactional retail) and pop-up-shop (temporary).",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "experience zone",
      "experience",
      "brand experience",
      "demo area",
      "product demo",
      "interactive zone",
      "engagement zone",
      "brand activation",
      "flagship experience",
      "brand showroom"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "fitting-room",
    "displayName": "Fitting Room",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "\nA fitting room is a private space in a retail store where customers can try on clothes before making a purchase.",
    "suggested": [
      "description",
      "hasAssistance",
      "hasAssistance:true",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "fitting room",
      "fitting rooms",
      "changing room",
      "dressing room"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "gift-wrap-station",
    "displayName": "Gift Wrap Station",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "A designated area or counter where purchased items can be gift-wrapped.",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "gift wrap station",
      "gift wrap stations",
      "gift wrapping service",
      "gift wrap desk",
      "wrapping service"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "island-display",
    "displayName": "Island Display",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "A stand or platform that is designated to represent the same type of products or items",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "island display",
      "island displays"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "laydown",
    "displayName": "Laydown",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Laydown in a store typically refers to the strategic placement of products on a flat surface, like tables or shelves, to attract customer attention and encourage sales.",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "laydown",
      "laydowns",
      "display table",
      "merchandise table"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "order-collect",
    "displayName": "Order & Collect",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Indoor area or counter within a retail store where customers can place orders for products or services and collect them at a designated pick-up point within the store. It offers a convenient option for customers to order items in advance and retrieve them without browsing the store.",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "order & collect",
      "order pickup",
      "pickup point",
      "collection desk",
      "in-store pickup"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "personal-shopper-assist",
    "displayName": "Personal Shopper Assist",
    "class": "poi",
    "category": "SERVICES",
    "description": "A Personal Shopper is a service that provides individualized shopping assistance, helping clients select and purchase clothing, accessories, or other items based on their preferences and needs.",
    "suggested": [
      "description",
      "hasAssistance",
      "hasAssistance:true",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "personal shopper assistance",
      "style advisor",
      "shopping assistant",
      "stylist service",
      "fashion consultant"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "pim",
    "displayName": "PIM",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "A reserved feature for integrating Product Information Management system to organize product info within indoor environments.",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "product content management",
      "PCM",
      "product data management",
      "PDM"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "pop-up",
    "displayName": "Pop-up",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Temporary retail unit drawn as a polygon on open floor (no permanent walls). Used for brand pop-ups, seasonal stores, holiday markets, and short-term retail activations. Active for days to months. For permanent walled retail units, use store instead.",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "pop-up shop",
      "popup",
      "pop up store",
      "popup shop",
      "temporary retail",
      "brand popup",
      "seasonal shop",
      "market stall",
      "holiday popup",
      "brand pop-up",
      "pop-up activation",
      "pop-up retail"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "rack-unit",
    "displayName": "Rack Unit",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Indoor fixture or display unit within a retail store designed to hold and showcase merchandise, typically consisting of shelves or hanging bars for organizing and presenting items for sale.",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "rack",
      "racks",
      "clothing rack",
      "display rack"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "returns-desk",
    "displayName": "Returns Desk",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "Indoor area or counter within a retail store where customers can return or exchange purchased items, receive refunds or store credits, and seek assistance related to product returns.",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "return services",
      "customer service",
      "returns counter",
      "exchange desk",
      "guest services",
      "help desk"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "sample-station",
    "displayName": "Sample Station",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Area where customers can test, taste, or try products before purchase.",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "sample station",
      "sample stations",
      "tasting station",
      "demo station",
      "product tasting"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "showroom",
    "displayName": "Showroom",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "Indoor space within a retail setting designed to display products, merchandise, or samples to potential customers, allowing them to see, evaluate, and experience the items before making a purchase decision.",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "showroom",
      "showrooms",
      "display room"
    ],
    "isPoi": true
  },
  {
    "mainType": "retail-space",
    "subType": "store",
    "displayName": "Store",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "A store is a place where products are sold.",
    "suggested": [
      "description",
      "hasAssistance",
      "isAnchor",
      "isFeatured",
      "productTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "shop",
      "store",
      "boutique",
      "outlet"
    ],
    "isPoi": true
  },
  {
    "mainType": "section",
    "subType": null,
    "displayName": "Section",
    "class": "poi",
    "category": null,
    "description": "Indoor division or designated area within a larger space or facility, often categorized or demarcated for specific purposes.",
    "suggested": [
      "hasRestrooms",
      "description"
    ],
    "alsoKnownAs": [
      "section",
      "sections"
    ],
    "isPoi": true
  },
  {
    "mainType": "section",
    "subType": "aisle",
    "displayName": "Aisle",
    "class": "poi",
    "category": "ACCESS",
    "description": "Narrow passage between rows of shelves, seats, or desks used for walking.",
    "suggested": [
      "description",
      "hasRestrooms"
    ],
    "alsoKnownAs": [
      "aisle",
      "aisles",
      "passageway",
      "corridor",
      "lane",
      "row"
    ],
    "isPoi": true
  },
  {
    "mainType": "section",
    "subType": "customs-immigration",
    "displayName": "Customs & Immigration",
    "class": "poi",
    "category": "ACCESS",
    "description": "A designated area within a building, typically found in airports or border crossings, where customs and immigration processes are carried out. This area involves procedures for inspecting and regulating the movement of people, goods, and vehicles across international borders.",
    "suggested": [
      "description",
      "hasRestrooms"
    ],
    "alsoKnownAs": [
      "customs & immigration",
      "border control",
      "passport control",
      "customs and border protection"
    ],
    "isPoi": true
  },
  {
    "mainType": "section",
    "subType": "exhibit-hall",
    "displayName": "Exhibit Hall",
    "class": "poi",
    "category": "GATHERINGS",
    "description": "Indoor area designed for displaying products, artwork, or information in trade shows, museums, or promotional events.",
    "suggested": [
      "description",
      "hasRestrooms"
    ],
    "alsoKnownAs": [
      "exhibition hall",
      "exhibit hall",
      "convention center",
      "exposition center",
      "trade show center",
      "display hall"
    ],
    "isPoi": true
  },
  {
    "mainType": "section",
    "subType": "food-court",
    "displayName": "Food Court",
    "class": "poi",
    "category": "COMMERCIAL",
    "description": "A cafeteria is a self-service dining area where customers select and pay for their food at a counter or buffet, often found in institutions like schools, hospitals, and offices.",
    "suggested": [
      "description",
      "hasRestrooms"
    ],
    "alsoKnownAs": [
      "food court",
      "food hall",
      "dining area"
    ],
    "isPoi": true
  },
  {
    "mainType": "section",
    "subType": "terminal",
    "displayName": "Terminal",
    "class": "poi",
    "category": "SERVICES",
    "description": "Indoor facility or building within an airport or transportation hub where passengers check-in, go through security, access departure gates, and board their flights. It serves as a central hub for passenger processing and facilitates the movement of travelers within the airport.",
    "suggested": [
      "description",
      "hasRestrooms"
    ],
    "alsoKnownAs": [
      "terminal",
      "terminals",
      "concourse",
      "hall",
      "station",
      "departure hall",
      "arrival hall",
      "passenger terminal",
      "domestic terminal",
      "international terminal"
    ],
    "isPoi": true
  },
  {
    "mainType": "security-space",
    "subType": null,
    "displayName": "Security Space",
    "class": "poi",
    "category": "ACCESS",
    "description": "Indoor area or department focused on maintaining and ensuring the safety and security of individuals and property within a facility. It encompasses measures and protocols for emergency response, surveillance, access control, and other security-related functions.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "security & safety"
    ],
    "isPoi": true
  },
  {
    "mainType": "security-space",
    "subType": "holding-cell",
    "displayName": "Holding Cell",
    "class": "poi",
    "category": "ACCESS",
    "description": "It is a room that prisoners beeing kept in a court building.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "holding cell",
      "holding cells",
      "detention cell",
      "holding room"
    ],
    "isPoi": true
  },
  {
    "mainType": "security-space",
    "subType": "passport-control",
    "displayName": "Passport Control",
    "class": "poi",
    "category": "ACCESS",
    "description": "Indoor area within an airport where immigration officers verify the identity and travel documents of passengers entering or leaving a country. It is a checkpoint where passports and visas are inspected to ensure compliance with immigration regulations and maintain border security.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "passport control",
      "passport check",
      "immigration",
      "border control",
      "customs"
    ],
    "isPoi": true
  },
  {
    "mainType": "security-space",
    "subType": "security-desk",
    "displayName": "Security Desk",
    "class": "poi",
    "category": "ACCESS",
    "description": "Central control point staffed by security personnel for monitoring access, visitor management, and security operations.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "security desk",
      "security desks",
      "security office",
      "guard desk",
      "information desk",
      "security station"
    ],
    "isPoi": true
  },
  {
    "mainType": "security-space",
    "subType": "security-screening",
    "displayName": "Security Screening",
    "class": "poi",
    "category": "ACCESS",
    "description": "Comprehensive security area with equipment for baggage scanning, metal detection, and passenger screening procedures.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "security screening",
      "screening area",
      "x-ray screening",
      "baggage check",
      "passenger screening",
      "body scan"
    ],
    "isPoi": true
  },
  {
    "mainType": "service-space",
    "subType": null,
    "displayName": "Service Space",
    "class": "poi",
    "category": "SERVICES",
    "description": "Professional Services refer to specialized services provided by experts in a specific field, such as consulting, legal, accounting, or engineering, to address complex needs and solve problems for clients.",
    "suggested": [
      "serviceTypes",
      "openingHours",
      "description",
      "phoneNumber",
      "websiteUrl",
      "hasAssistance"
    ],
    "alsoKnownAs": [
      "professional services",
      "professional services"
    ],
    "isPoi": true
  },
  {
    "mainType": "service-space",
    "subType": "branch",
    "displayName": "Branch",
    "class": "poi",
    "category": "SERVICES",
    "description": "Walled commercial unit, customer-facing + back-of-house",
    "suggested": [
      "description",
      "hasAssistance",
      "openingHours",
      "phoneNumber",
      "serviceTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "branch",
      "bank branch",
      "post office",
      "walled service unit",
      "walk-in unit"
    ],
    "isPoi": true
  },
  {
    "mainType": "service-space",
    "subType": "desk",
    "displayName": "Desk",
    "class": "poi",
    "category": "SERVICES",
    "description": "Open counter in concourse/hallway",
    "suggested": [
      "description",
      "hasAssistance",
      "openingHours",
      "phoneNumber",
      "serviceTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "desk",
      "counter",
      "concierge desk",
      "currency exchange counter",
      "courier counter",
      "service counter"
    ],
    "isPoi": true
  },
  {
    "mainType": "service-space",
    "subType": "kiosk",
    "displayName": "Kiosk",
    "class": "poi",
    "category": "SERVICES",
    "description": "Freestanding manned island",
    "suggested": [
      "description",
      "hasAssistance",
      "openingHours",
      "phoneNumber",
      "serviceTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "kiosk",
      "manned kiosk",
      "service kiosk",
      "manned info kiosk",
      "service island"
    ],
    "isPoi": true
  },
  {
    "mainType": "service-space",
    "subType": "lounge",
    "displayName": "Lounge",
    "class": "poi",
    "category": "SERVICES",
    "description": "Premium amenity space requiring paid access, membership, or special status (boarding pass tier, credit card tier, frequent-flyer status, club membership). Common in airports (airline lounges, lounge access cards), corporate buildings (executive lounges), members clubs, casinos, and hotels (high-roller suites). Distinct from social-space.lounge (free public seating area) — service-space.lounge is gated commercial access.",
    "suggested": [
      "accessRestrictions",
      "description",
      "hasAssistance",
      "openingHours",
      "phoneNumber",
      "serviceTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "lounge",
      "airline lounge",
      "executive lounge",
      "premium lounge",
      "member lounge",
      "club lounge",
      "business lounge",
      "VIP lounge",
      "frequent flyer lounge",
      "paid lounge",
      "lounge access"
    ],
    "isPoi": true
  },
  {
    "mainType": "service-space",
    "subType": "office",
    "displayName": "Office",
    "class": "poi",
    "category": "SERVICES",
    "description": "Private enclosed room for B2B/B2C consultations",
    "suggested": [
      "description",
      "hasAssistance",
      "openingHours",
      "phoneNumber",
      "serviceTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "office",
      "law firm",
      "accountant office",
      "lawyer office",
      "consulting office",
      "professional office"
    ],
    "isPoi": true
  },
  {
    "mainType": "service-space",
    "subType": "pop-up",
    "displayName": "Pop-up",
    "class": "poi",
    "category": "SERVICES",
    "description": "Temporary transactional setup",
    "suggested": [
      "description",
      "hasAssistance",
      "openingHours",
      "phoneNumber",
      "serviceTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "popup",
      "popup service",
      "seasonal stand",
      "pop-up clinic",
      "temporary service stand"
    ],
    "isPoi": true
  },
  {
    "mainType": "service-space",
    "subType": "salon",
    "displayName": "Salon",
    "class": "poi",
    "category": "SERVICES",
    "description": "Chair-based personal care (plumbing/special seating)",
    "suggested": [
      "description",
      "hasAssistance",
      "openingHours",
      "phoneNumber",
      "serviceTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "salon",
      "barbershop",
      "hair salon",
      "nail salon",
      "spa",
      "beauty salon",
      "massage parlor"
    ],
    "isPoi": true
  },
  {
    "mainType": "service-space",
    "subType": "studio",
    "displayName": "Studio",
    "class": "poi",
    "category": "SERVICES",
    "description": "Dedicated production space",
    "suggested": [
      "description",
      "hasAssistance",
      "openingHours",
      "phoneNumber",
      "serviceTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "studio",
      "photo studio",
      "recording studio",
      "dance studio",
      "production studio"
    ],
    "isPoi": true
  },
  {
    "mainType": "service-space",
    "subType": "workshop",
    "displayName": "Workshop",
    "class": "poi",
    "category": "SERVICES",
    "description": "Back-of-house production room",
    "suggested": [
      "description",
      "hasAssistance",
      "openingHours",
      "phoneNumber",
      "serviceTypes",
      "websiteUrl"
    ],
    "alsoKnownAs": [
      "workshop",
      "tailor",
      "repair shop",
      "alterations",
      "cobbler",
      "key cutter",
      "watch repair",
      "phone repair"
    ],
    "isPoi": true
  },
  {
    "mainType": "social-space",
    "subType": null,
    "displayName": "Social Space",
    "class": "poi",
    "category": "RECREATION",
    "description": "Indoor area within a facility designed for relaxation, comfort, and socialization. It provides a comfortable and inviting environment with seating, amenities, and services for individuals to unwind, socialize, or wait in a relaxed setting.",
    "suggested": [
      "hasWifi",
      "description"
    ],
    "alsoKnownAs": [
      "social space",
      "social spaces",
      "communal area",
      "common area",
      "shared space"
    ],
    "isPoi": true
  },
  {
    "mainType": "social-space",
    "subType": "breakroom",
    "displayName": "Breakroom",
    "class": "poi",
    "category": "RECREATION",
    "description": "A designated space in a workplace for employees to take breaks, have meals, and relax.",
    "suggested": [
      "description",
      "hasWifi"
    ],
    "alsoKnownAs": [
      "breakroom",
      "breakrooms",
      "staff room",
      "lunchroom",
      "common room"
    ],
    "isPoi": true
  },
  {
    "mainType": "social-space",
    "subType": "day-room",
    "displayName": "Day Room",
    "class": "poi",
    "category": "CARE",
    "description": "A day room is a shared lounge or common area where patients and visitors can relax. Including day rooms in the map helps people easily find these spaces for rest and recreation within the hospital.",
    "suggested": [
      "description",
      "hasWifi"
    ],
    "alsoKnownAs": [
      "day room",
      "day rooms",
      "lounge",
      "common room",
      "recreation room",
      "day lounge"
    ],
    "isPoi": true
  },
  {
    "mainType": "social-space",
    "subType": "lobby",
    "displayName": "Lobby",
    "class": "poi",
    "category": "ACCESS",
    "description": "Indoor area or entrance space within a building or establishment, often located near the main entrance, where visitors or guests are welcomed, check-in, and directed to different areas or services. It serves as a central gathering and waiting area, typically featuring seating, reception desks, and information boards.",
    "suggested": [
      "description",
      "hasWifi"
    ],
    "alsoKnownAs": [
      "lobby",
      "lobbies",
      "foyer",
      "entrance hall",
      "reception area",
      "vestibule"
    ],
    "isPoi": true
  },
  {
    "mainType": "social-space",
    "subType": "lounge",
    "displayName": "Lounge",
    "class": "poi",
    "category": "RECREATION",
    "description": "Indoor area within a facility designed for relaxation, comfort, and socialization. It provides a comfortable and inviting environment with seating, amenities, and services for individuals to unwind, socialize, or wait in a relaxed setting.",
    "suggested": [
      "description",
      "hasWifi"
    ],
    "alsoKnownAs": [
      "lounge",
      "waiting area",
      "sitting area",
      "lounge area",
      "sitting room",
      "common room",
      "lobby"
    ],
    "isPoi": true
  },
  {
    "mainType": "social-space",
    "subType": "meeting-point",
    "displayName": "Meeting Point",
    "class": "poi",
    "category": "ACCESS",
    "description": "Indoor designated location within a facility where individuals arrange to meet or gather for various purposes, such as meeting up with friends, colleagues, or tour groups. It serves as a convenient and easily recognizable spot for people to rendezvous or assemble before proceeding together.",
    "suggested": [
      "description",
      "hasWifi"
    ],
    "alsoKnownAs": [
      "meeting point",
      "meeting points",
      "meeting spot",
      "rendezvous point",
      "designated meeting area",
      "assembly point"
    ],
    "isPoi": true
  },
  {
    "mainType": "social-space",
    "subType": "refreshment-room",
    "displayName": "Refreshment Room",
    "class": "poi",
    "category": "RECREATION",
    "description": "Small public-facing refreshment service area. Includes hotel lobby coffee/tea stations, hospital family refreshment areas, convention center break stations, faith-venue post-service refreshment areas, and similar free refreshment counters. Distinct from breakroom (staff-only) and lounge (seating-focused) and food-beverage-space.cafe (commercial sale).",
    "suggested": [
      "description",
      "hasWifi"
    ],
    "alsoKnownAs": [
      "refreshment room",
      "refreshment area",
      "coffee station",
      "tea station",
      "refreshment counter",
      "refreshment break area",
      "hospitality station"
    ],
    "isPoi": true
  },
  {
    "mainType": "social-space",
    "subType": "smoking-room",
    "displayName": "Smoking Room",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Designated indoor area where smoking is permitted, providing ventilation to contain smoke.",
    "suggested": [
      "description",
      "hasWifi"
    ],
    "alsoKnownAs": [
      "smoking room",
      "smoking rooms",
      "smoking area",
      "smoking lounge",
      "designated smoking area"
    ],
    "isPoi": true
  },
  {
    "mainType": "social-space",
    "subType": "waiting-area",
    "displayName": "Waiting Area",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Indoor space designated for individuals to wait, typically equipped with seating and amenities, where people can wait for appointments, transportation, or other services.",
    "suggested": [
      "description",
      "hasWifi"
    ],
    "alsoKnownAs": [
      "waiting area",
      "waiting room",
      "seating area",
      "lounge",
      "lobby"
    ],
    "isPoi": true
  },
  {
    "mainType": "support-space",
    "subType": null,
    "displayName": "Support Space",
    "class": "poi",
    "category": "WORK",
    "description": "Indoor area providing auxiliary services and amenities to support the primary functions of a facility.",
    "suggested": [
      "hasAssistance",
      "isQuietZone",
      "openingHours",
      "description"
    ],
    "alsoKnownAs": [
      "support space",
      "support spaces",
      "support area",
      "functional space"
    ],
    "isPoi": true
  },
  {
    "mainType": "support-space",
    "subType": "av-room",
    "displayName": "AV Room",
    "class": "poi",
    "category": "SERVICES",
    "description": "A Media Room is a designated space equipped with technology and resources for media-related activities, such as press conferences, interviews, or broadcasting. It often includes audio-visual equipment, seating, and facilities for media personnel.",
    "suggested": [
      "description",
      "hasAssistance",
      "isQuietZone",
      "openingHours"
    ],
    "alsoKnownAs": [
      "media center",
      "media centers"
    ],
    "isPoi": true
  },
  {
    "mainType": "support-space",
    "subType": "it-workroom",
    "displayName": "IT Workroom",
    "class": "poi",
    "category": "SERVICES",
    "description": "Back-of-house workspace for IT staff. Distinct from operational-space.server-room (the actual server hardware) and amenity-space.desk + serviceTypes=IT and Tech Support (the customer-facing help desk).",
    "suggested": [
      "description",
      "hasAssistance",
      "isQuietZone",
      "openingHours"
    ],
    "alsoKnownAs": [
      "IT room",
      "IT staff room",
      "IT workroom",
      "technology room",
      "IT office (back of house)"
    ],
    "isPoi": true
  },
  {
    "mainType": "support-space",
    "subType": "kitchenette",
    "displayName": "Kitchenette",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Small kitchen or pantry area for staff/visitor use. Includes employee break-area pantries, hospital nourishment stations (where nurses prepare patient food), hostel communal kitchens, and small in-room kitchenettes. For full commercial kitchens, use food-beverage-space or operational-space.",
    "suggested": [
      "description",
      "hasAssistance",
      "isQuietZone",
      "openingHours"
    ],
    "alsoKnownAs": [
      "kitchenette",
      "pantry",
      "nourishment",
      "nourishment station",
      "nurse pantry",
      "staff pantry",
      "break room kitchen"
    ],
    "isPoi": true
  },
  {
    "mainType": "support-space",
    "subType": "laundry-room",
    "displayName": "Laundry Room",
    "class": "poi",
    "category": "SERVICES",
    "description": "Back-of-house laundry processing room. Used by hotel housekeeping, hospital linen, and similar facility-internal laundry operations. For commercial dry cleaners (customer-facing), use service-space.workshop + serviceTypes=Dry Cleaning and Laundry instead.",
    "suggested": [
      "description",
      "hasAssistance",
      "isQuietZone",
      "openingHours"
    ],
    "alsoKnownAs": [
      "laundry",
      "laundry room",
      "linen room",
      "linen processing",
      "housekeeping laundry",
      "hospital linen"
    ],
    "isPoi": true
  },
  {
    "mainType": "support-space",
    "subType": "mail-room",
    "displayName": "Mail Room",
    "class": "poi",
    "category": "WORK",
    "description": "Space for receiving, sorting, and distributing mail and packages within a facility.",
    "suggested": [
      "description",
      "hasAssistance",
      "isQuietZone",
      "openingHours"
    ],
    "alsoKnownAs": [
      "mail room",
      "mailroom",
      "post room",
      "mail sorting",
      "mail processing"
    ],
    "isPoi": true
  },
  {
    "mainType": "support-space",
    "subType": "nurse-station",
    "displayName": "Nurse Station",
    "class": "poi",
    "category": "WORK",
    "description": "Central workspace where nurses coordinate patient care, equipped with communication tools, documentation systems, and monitoring equipment.",
    "suggested": [
      "description",
      "hasAssistance",
      "isQuietZone",
      "openingHours"
    ],
    "alsoKnownAs": [
      "nurse station",
      "nursing station",
      "nursing post",
      "nurses' station",
      "nurse desk"
    ],
    "isPoi": true
  },
  {
    "mainType": "support-space",
    "subType": "office-supply-room",
    "displayName": "Office Supply Room",
    "class": "poi",
    "category": "FACILITIES",
    "description": " A designated room for storing office supplies, materials, and consumables used in daily operations",
    "suggested": [
      "description",
      "hasAssistance",
      "isQuietZone",
      "openingHours"
    ],
    "alsoKnownAs": [
      "supply room",
      "office supplies",
      "supply closet",
      "stationery room",
      "supplies storage"
    ],
    "isPoi": true
  },
  {
    "mainType": "support-space",
    "subType": "on-call-room",
    "displayName": "On-call Room",
    "class": "poi",
    "category": "CARE",
    "description": "Rest area for medical staff during on-call periods, equipped with sleeping facilities.",
    "suggested": [
      "description",
      "hasAssistance",
      "isQuietZone",
      "openingHours"
    ],
    "alsoKnownAs": [
      "on-call",
      "on-call room",
      "call room",
      "doctor's on-call",
      "sleep room (medical)"
    ],
    "isPoi": true
  },
  {
    "mainType": "support-space",
    "subType": "print-copy",
    "displayName": "Print / Copy",
    "class": "poi",
    "category": "WORK",
    "description": "Room equipped with copying, scanning, and printing equipment for document processing.",
    "suggested": [
      "description",
      "hasAssistance",
      "isQuietZone",
      "openingHours"
    ],
    "alsoKnownAs": [
      "print room",
      "copy room",
      "printer room",
      "copy center",
      "print station",
      "copy station"
    ],
    "isPoi": true
  },
  {
    "mainType": "support-space",
    "subType": "records-room",
    "displayName": "Records Room",
    "class": "poi",
    "category": "OPERATIONS",
    "description": "A secure storage area for important documents, files, and archival materials.",
    "suggested": [
      "description",
      "hasAssistance",
      "isQuietZone",
      "openingHours"
    ],
    "alsoKnownAs": [
      "records",
      "records room",
      "file room",
      "archive",
      "file storage",
      "records storage",
      "document room"
    ],
    "isPoi": true
  },
  {
    "mainType": "support-space",
    "subType": "storage-space",
    "displayName": "Storage Space",
    "class": "poi",
    "category": "FACILITIES",
    "description": "Indoor area or designated space within a facility for the organized and secure storage of items, goods, or materials. It provides a location to keep belongings or inventory in a structured manner for easy retrieval and efficient use of space.",
    "suggested": [
      "description",
      "hasAssistance",
      "isQuietZone",
      "openingHours"
    ],
    "alsoKnownAs": [
      "storage",
      "storage room",
      "storage closet",
      "supply storage",
      "general storage"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": null,
    "displayName": "Transportation Space",
    "class": "poi",
    "category": "SERVICES",
    "description": " Indoor location or area within a transportation hub where shuttle services, such as buses or vans, arrive and depart, providing convenient transportation between different destinations or terminals.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "transportation service",
      "transportation services"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "arrival-lounge",
    "displayName": "Arrival Lounge",
    "class": "poi",
    "category": "SERVICES",
    "description": "A designated lounge area located in the arrivals section of a transportation hub (typically an airport), where passengers can relax after landing. It may offer amenities such as seating, refreshments, restrooms, showers, and sometimes business facilities. Access is usually limited to arriving passengers, depending on the venue’s policy.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "arrival lounge",
      "arrival lounges",
      "arrivals hall",
      "arrivals area"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "arrivals-greeting-area",
    "displayName": "Arrivals Greeting Area",
    "class": "poi",
    "category": "SERVICES",
    "description": "An area where people wait to meet arriving passengers. Usually located near the arrivals exit.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "arrival lounge",
      "arrival lounges",
      "arrivals hall",
      "arrivals area"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "bag-drop-checkin",
    "displayName": "Bag Drop / Check-in",
    "class": "poi",
    "category": "SERVICES",
    "description": "An indoor area or space within an airport, hotel, or other facility where individuals register their arrival, receive necessary documentation or identification, and complete the necessary procedures before accessing the desired services or accommodations.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "bag drop / check-in",
      "bag drop / check-ins",
      "check-in counter",
      "bag drop",
      "airline check-in",
      "check-in desk"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "bag-drop-off",
    "displayName": "Bag Drop Off",
    "class": "poi",
    "category": "SERVICES",
    "description": "Indoor area within an airport or transportation facility where passengers can securely and conveniently deposit their checked-in luggage or bags before boarding a flight or proceeding to their designated destination.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "bag drop",
      "baggage drop",
      "luggage drop-off"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "baggage-reclaim",
    "displayName": "Baggage Reclaim",
    "class": "poi",
    "category": "SERVICES",
    "description": "An area within an airport or transportation facility where passengers retrieve their checked-in luggage or bags upon arrival at their destination. This is where passengers collect their belongings after disembarking from a flight or completing their journey.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "baggage reclaim",
      "baggage reclaims",
      "baggage claim",
      "luggage carousel",
      "baggage hall",
      "baggage pickup"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "boarding-gate",
    "displayName": "Boarding Gate",
    "class": "poi",
    "category": "SERVICES",
    "description": "A designated waiting and boarding area in an airport terminal where passengers board their aircraft.A designated waiting and boarding area in an airport terminal where passengers board their aircraft.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "gate",
      "gates",
      "flight gate"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "boarding-lounge",
    "displayName": "Boarding Lounge",
    "class": "poi",
    "category": "SERVICES",
    "description": "Indoor area within an airport where passengers wait for their flight, complete the boarding process, and access the departure gates.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "bus-station",
    "displayName": "Bus Station",
    "class": "poi",
    "category": "SERVICES",
    "description": "Indoor area serving as a terminal for buses, where passengers board, disembark, and wait for their bus arrivals and departures. It typically includes ticket counters, seating areas, and information boards for bus schedules and routes.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "bus stop",
      "bus station",
      "transit stop",
      "bus terminal"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "drop-off-area",
    "displayName": "Drop Off Area",
    "class": "poi",
    "category": "SERVICES",
    "description": "A drop-off area is a designated, short-term location where drivers stop to let passengers out, leave rented vehicles, or deposit items (like mail, recycling, or dry cleaning) without parking permanently.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "drop-off point",
      "drop-off zone",
      "passenger drop-off",
      "car drop-off",
      "drop-off location",
      "passenger set-down",
      "set-down point",
      "curbside drop-off",
      "pudo-point"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "helipad",
    "displayName": "Helipad",
    "class": "poi",
    "category": "SERVICES",
    "description": "an airport or landing place for helicopters",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "heliport",
      "heliports",
      "helipad"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "oversize-baggage",
    "displayName": "Oversize Baggage",
    "class": "poi",
    "category": "SERVICES",
    "description": "A designated area for dropping off oversized or overweight luggage that cannot be handled at regular check-in counters.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "bag drop",
      "baggage drop",
      "luggage drop-off"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "pickup-area",
    "displayName": "Pickup Area",
    "class": "poi",
    "category": "SERVICES",
    "description": "Indoor location within an airport where passengers can be collected or picked up by individuals or transportation services, typically designated for convenient and organized pick-up of arriving travelers.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "pick-up",
      "passenger pickup",
      "drop-off point",
      "meeting point",
      "arrivals pickup",
      "passenger loading zone"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "rideshare-pickup",
    "displayName": "Rideshare Pickup",
    "class": "poi",
    "category": "SERVICES",
    "description": "A designated area for pick-up and drop-off of passengers using ride-sharing services like Uber or Lyft.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "rideshare pickup"
    ],
    "isPoi": true
  },
  {
    "mainType": "transportation-space",
    "subType": "shuttle-station",
    "displayName": "Shuttle Station",
    "class": "poi",
    "category": "SERVICES",
    "description": " Indoor location or area within a transportation hub where shuttle services, such as buses or vans, arrive and depart, providing convenient transportation between different destinations or terminals.",
    "suggested": [
      "hasAssistance:true"
    ],
    "alsoKnownAs": [
      "shuttle station",
      "shuttle stations",
      "shuttle bus stop",
      "shuttle pickup"
    ],
    "isPoi": true
  },
  {
    "mainType": "unspecified",
    "subType": null,
    "displayName": "Unspecified",
    "class": "poi",
    "category": null,
    "description": "Pertaining to a mapped space or area whose function, purpose, or categorical type remains undetermined or undesignated within the system, despite its physical identification and inclusion in the map.",
    "suggested": [],
    "alsoKnownAs": [
      "unspecified"
    ],
    "isPoi": true
  },
  {
    "mainType": "wellness-space",
    "subType": null,
    "displayName": "Wellness Space",
    "class": "poi",
    "category": "CARE",
    "description": "A space for relaxation, rest, or activities related to well-being",
    "suggested": [
      "genderDesignation"
    ],
    "alsoKnownAs": [
      "wellness",
      "health and wellness"
    ],
    "isPoi": true
  },
  {
    "mainType": "wellness-space",
    "subType": "bath-house",
    "displayName": "Bath House",
    "class": "poi",
    "category": "CARE",
    "description": "Bathing/sweat-bath facility with multiple temperature zones (hot, warm, cold pools). Covers Japanese onsen, Turkish hamam, Roman thermae, Russian banya, and Korean jjimjilbang. Architecturally distinct (water pools, steam, temperature zones) and culture-specific. Often gender-segregated",
    "suggested": [
      "genderDesignation"
    ],
    "alsoKnownAs": [
      "bath house",
      "bathhouse",
      "onsen",
      "hamam",
      "hammam",
      "banya",
      "sento",
      "thermae",
      "public baths",
      "jjimjilbang",
      "bathhouse facility"
    ],
    "isPoi": true
  },
  {
    "mainType": "wellness-space",
    "subType": "massage-room",
    "displayName": "Massage Room",
    "class": "poi",
    "category": "CARE",
    "description": "Single private room for massage therapy. Architecturally features a massage table, dim adjustable lighting, sound treatment, oil/lotion storage. Distinct from spa-treatment-room (which covers facials and body treatments).",
    "suggested": [
      "genderDesignation"
    ],
    "alsoKnownAs": [
      "massage room",
      "massage therapy room",
      "massage suite",
      "bodywork room",
      "deep tissue room",
      "Swedish massage room"
    ],
    "isPoi": true
  },
  {
    "mainType": "wellness-space",
    "subType": "mindfulness-room",
    "displayName": "Mindfulness Room",
    "class": "poi",
    "category": "CARE",
    "description": "Small quiet space for meditation, mindfulness practice, or contemplation (secular). Often features cushions, dim lighting, sound treatment. Distinct from faith-worship-space.multi-faith-room (religious neutral) - mindfulness-room is secular/wellness-oriented.",
    "suggested": [
      "genderDesignation"
    ],
    "alsoKnownAs": [
      "mindfulness room",
      "meditation room",
      "contemplation room",
      "quiet room (wellness)",
      "zen room",
      "calming room"
    ],
    "isPoi": true
  },
  {
    "mainType": "wellness-space",
    "subType": "sauna",
    "displayName": "Sauna",
    "class": "poi",
    "category": "CARE",
    "description": "Heated wood-paneled room with bench seating. Typically 70-100°C dry heat, with ventilation. Distinct from steam-room (which uses humid steam). Common in gyms, hotels, spas.",
    "suggested": [
      "genderDesignation"
    ],
    "alsoKnownAs": [
      "sauna",
      "dry sauna",
      "Finnish sauna",
      "wood sauna",
      "heat room",
      "sauna room",
      "infrared sauna"
    ],
    "isPoi": true
  },
  {
    "mainType": "wellness-space",
    "subType": "spa-treatment-room",
    "displayName": "Spa Treatment Room",
    "class": "poi",
    "category": "CARE",
    "description": "Individual spa treatment room for facials, body wraps, body scrubs, and similar single-occupant wellness treatments. Architecturally features a treatment bed/table, often water/sink access, dim adjustable lighting, and product storage. For massage specifically, see massage-room. For bath/sweat facilities (onsen, hamam), see bath-house.Individual spa treatment room for facials, body wraps, body scrubs, and similar single-occupant wellness treatments. Architecturally features a treatment bed/table, often water/sink access, dim adjustable lighting, and product storage. For massage specifically, see massage-room. For bath/sweat facilities (onsen, hamam), see bath-house.",
    "suggested": [
      "genderDesignation"
    ],
    "alsoKnownAs": [
      "spa room",
      "treatment room",
      "spa treatment room",
      "facial room",
      "body treatment room",
      "esthetician room",
      "beauty treatment room"
    ],
    "isPoi": true
  },
  {
    "mainType": "wellness-space",
    "subType": "steam-room",
    "displayName": "Steam Room",
    "class": "poi",
    "category": "CARE",
    "description": "Tiled room with steam generation for wet-heat therapy. Typically 40-50°C high humidity (saturated steam). Distinct from sauna (dry heat, wood-paneled). Common in spas, gyms, hotels.",
    "suggested": [
      "genderDesignation"
    ],
    "alsoKnownAs": [
      "steam room",
      "steam bath",
      "vapor room",
      "hammam (steam variant)",
      "Turkish bath",
      "Roman bath (steam)",
      "wet sauna"
    ],
    "isPoi": true
  },
  {
    "mainType": "wellness-space",
    "subType": "yoga-studio",
    "displayName": "Yoga Studio",
    "class": "poi",
    "category": "CARE",
    "description": "Dedicated yoga practice space (boutique studios, yoga retreats, wellness clinics). Mirrored walls, sprung wood floor, sometimes barre. *For multi-purpose fitness center studios that host varied class types (yoga, pilates, spin, dance), use activity-space.fitness-studio + sportType=[Yoga, Pilates, etc.] instead.* Use this only for yoga-dedicated wellness contexts.",
    "suggested": [
      "genderDesignation"
    ],
    "alsoKnownAs": [
      "yoga studio",
      "yoga room",
      "dedicated yoga",
      "boutique yoga",
      "yoga retreat space",
      "wellness yoga"
    ],
    "isPoi": true
  },
  {
    "mainType": "work-space",
    "subType": null,
    "displayName": "Work Space",
    "class": "poi",
    "category": "WORK",
    "description": "Indoor area within an office setting designed for individuals or teams to carry out work-related tasks, typically equipped with desks, chairs, computers, and other necessary amenities to facilitate productivity and collaboration.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "work space",
      "work spaces"
    ],
    "isPoi": true
  },
  {
    "mainType": "work-space",
    "subType": "focus-room",
    "displayName": "Focus Room",
    "class": "poi",
    "category": "WORK",
    "description": "Private space for individual concentrated work requiring minimal distractions",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "focus room",
      "focus rooms",
      "quiet room",
      "concentration room",
      "privacy booth"
    ],
    "isPoi": true
  },
  {
    "mainType": "work-space",
    "subType": "office",
    "displayName": "Office",
    "class": "poi",
    "category": "WORK",
    "description": "A private, enclosed workspace with walls surrounding it, designed for individual or small-group professional, administrative, or business activities, distinct from open-plan workstations or collaborative areas.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "office",
      "offices"
    ],
    "isPoi": true
  },
  {
    "mainType": "work-space",
    "subType": "office-cubicle",
    "displayName": "Office Cubicle",
    "class": "poi",
    "category": "WORK",
    "description": "An office cubicle is a small partitioned workspace within a larger office area, typically enclosed by partitions on three sides and an open front. It provides a semi-private working environment for an individual employee.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "office cubicle",
      "office cubicles"
    ],
    "isPoi": true
  },
  {
    "mainType": "work-space",
    "subType": "open-plan-office",
    "displayName": "Open Plan Office",
    "class": "poi",
    "category": "WORK",
    "description": "An open plan office is a workspace layout where desks and workstations are arranged in a large, open area without partitioned walls, promoting collaboration and flexibility among employees.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "open plan office",
      "open plan offices"
    ],
    "isPoi": true
  },
  {
    "mainType": "work-space",
    "subType": "shared-office",
    "displayName": "Shared Office",
    "class": "poi",
    "category": "WORK",
    "description": "A collaborative workspace within a facility shared by multiple individuals or teams, featuring common amenities and flexible seating arrangements.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "shared office",
      "shared offices",
      "co-working space",
      "shared workspace"
    ],
    "isPoi": true
  },
  {
    "mainType": "work-space",
    "subType": "team-space",
    "displayName": "Team Space",
    "class": "poi",
    "category": "WORK",
    "description": "Designated area where teams collaborate on projects and share resources, providing a dedicated environment for teamwork and collective goal achievement.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "team space",
      "team spaces",
      "team office",
      "project room",
      "collaboration area",
      "team suite"
    ],
    "isPoi": true
  },
  {
    "mainType": "work-space",
    "subType": "touchdown",
    "displayName": "Touchdown",
    "class": "poi",
    "category": "WORK",
    "description": "A temporary or shared workspace for brief periods, typically lacking assigned storage, designed for quick tasks and flexible work arrangements.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "touchdown",
      "touchdowns"
    ],
    "isPoi": true
  },
  {
    "mainType": "work-space",
    "subType": "workstation",
    "displayName": "Workstation",
    "class": "poi",
    "category": "WORK",
    "description": "A single person's work area within an office typically includes a desk, chair, computer, phone, and necessary office supplies.",
    "suggested": [
      "description"
    ],
    "alsoKnownAs": [
      "workstation",
      "workstations",
      "desk"
    ],
    "isPoi": true
  },
  {
    "mainType": "circulation-space",
    "subType": null,
    "displayName": "Circulation Space",
    "class": "structural",
    "category": "ACCESS",
    "description": "Indoor spaces primarily used for movement and access, including entrances, foyers, lobbies, corridors, and stairs.",
    "suggested": [
      "isWheelchairAccessible",
      "isPetFriendly",
      "hasWifi"
    ],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "atrium",
    "displayName": "Atrium",
    "class": "structural",
    "category": "ACCESS",
    "description": "Large open multi-story central space, often with skylight or glass roof. Common in malls, office buildings, hotels. Architecturally distinct from foyer (smaller, single-story) and lobby (less verticality).",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "atrium",
      "skylight atrium",
      "central atrium",
      "multi-story atrium",
      "glass atrium",
      "internal courtyard atrium"
    ],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "bridge",
    "displayName": "Bridge",
    "class": "structural",
    "category": "ACCESS",
    "description": "Interior pedestrian bridge connecting two parts of a building, between buildings, or over an open space. Architecturally distinct from corridor (which is rooms-on-both-sides) and walkway (which is at-grade).",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "bridge",
      "sky bridge",
      "skybridge",
      "pedestrian bridge",
      "internal bridge",
      "walkway bridge",
      "link bridge"
    ],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "bus-gate",
    "displayName": "Bus Gate",
    "class": "structural",
    "category": "ACCESS",
    "description": "A designated indoor or covered area within a transport hub where passengers board or alight from buses.",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "canopy",
    "displayName": "Canopy",
    "class": "structural",
    "category": "ACCESS",
    "description": "Overhead cover or roofing structure providing weather protection without enclosing walls. Common at building entrances, drop-off areas, outdoor seating, transit stops. Distinct from pavilion (event-space, more substantial).",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "canopy",
      "overhead canopy",
      "awning",
      "porte-cochère",
      "drop-off canopy",
      "entrance canopy",
      "weather canopy"
    ],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "corridor",
    "displayName": "Corridor",
    "class": "structural",
    "category": "ACCESS",
    "description": "Long narrow indoor passageway connecting rooms or sections. Common in offices, hospitals, schools, hotels. Receives hallway and passage collapses. For shorter entry-room transitions, see foyer or vestibule.",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "corridor",
      "hallway",
      "passage",
      "hall",
      "hallway passage",
      "internal corridor",
      "walking corridor",
      "gallery passage"
    ],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "door",
    "displayName": "Door",
    "class": "structural",
    "category": "ACCESS",
    "description": "Individual door fixture (hinged, sliding, revolving, automatic). Distinct from entrance-exit subTypes (which are labeled wayfinding access POINTS at building/zone level) and emergency-safety.fire-door (specifically fire-rated).",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "door",
      "doorway",
      "internal door",
      "automatic door",
      "sliding door",
      "revolving door",
      "glass door"
    ],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "floor-outline",
    "displayName": "Floor Outline",
    "class": "structural",
    "category": "ACCESS",
    "description": "The boundary or perimeter line defining the shape and extent of a building floor level.",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "foyer",
    "displayName": "Foyer",
    "class": "structural",
    "category": "ACCESS",
    "description": "Entrance hall or open transitional area between an entrance/vestibule and the main building space. Larger than vestibule, more decorative. Distinct from social-space.lobby (which is the main lobby/reception area).",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "foyer",
      "entrance hall",
      "entrance foyer",
      "reception foyer",
      "lobby foyer",
      "hotel foyer"
    ],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "patio",
    "displayName": "Patio",
    "class": "structural",
    "category": "ACCESS",
    "description": "Outdoor paved area adjoining a building, typically ground-level. Often used for dining or seating. Distinct from terrace (raised) and decorative-environmental-feature.courtyard (enclosed by walls).",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "patio",
      "outdoor patio",
      "garden patio",
      "dining patio",
      "paved outdoor area",
      "ground-level patio"
    ],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "pavement",
    "displayName": "Pavement",
    "class": "structural",
    "category": "ACCESS",
    "description": "Paved pedestrian surface (sidewalk-style). Distinct from walkway (broader; includes unpaved paths) and road (vehicular).",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "pavement",
      "sidewalk",
      "paved walk",
      "paved path",
      "footpath (paved)",
      "pedestrian pavement"
    ],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "road",
    "displayName": "Road",
    "class": "structural",
    "category": "ACCESS",
    "description": "Paved vehicular route within a venue (parking garage roads, indoor service drives, covered loading routes). For pedestrian-paved surfaces, see pavement. For specific vehicle markings, see road-marking.",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "road",
      "internal road",
      "service drive",
      "covered road",
      "garage road",
      "vehicular path"
    ],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "road-marking",
    "displayName": "Road Marking",
    "class": "structural",
    "category": "ACCESS",
    "description": "Painted markings on roads or paved surfaces. Used for no-parking zones, taxi/rideshare pickup lines, lane dividers, directional arrows, accessibility indicators. Niche per-feature mapping; usually drawn as polygon line.",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "road marking",
      "lane marking",
      "road paint",
      "traffic marking",
      "pavement marking",
      "road line",
      "painted line"
    ],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "terrace",
    "displayName": "Terrace",
    "class": "structural",
    "category": "ACCESS",
    "description": "External raised flat area. Distinct from patio (ground-level) and rooftop area. Common as roof terrace, balcony-style, or upper-level outdoor space.",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "vestibule",
    "displayName": "Vestibule",
    "class": "structural",
    "category": "ACCESS",
    "description": "Small entry chamber between exterior and interior doors, primarily for climate control (airlock/buffer zone). Smaller than foyer; functional rather than decorative.",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "vestibule",
      "airlock",
      "entrance vestibule",
      "climate vestibule",
      "double-door entry",
      "mantrap (security)"
    ],
    "isPoi": false
  },
  {
    "mainType": "circulation-space",
    "subType": "walkway",
    "displayName": "Walkway",
    "class": "structural",
    "category": "ACCESS",
    "description": "Walking path for pedestrians. Includes paved, decked, gravel, or other surface walkways. Broader than pavement (paved-only) and distinct from corridor (indoor between-rooms passageway).",
    "suggested": [
      "hasWifi",
      "isPetFriendly",
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [
      "walkway",
      "walking path",
      "footpath",
      "pedestrian path",
      "walking route",
      "garden walkway",
      "decked walkway"
    ],
    "isPoi": false
  },
  {
    "mainType": "decorative-environmental-feature",
    "subType": "garden-feature",
    "displayName": "Garden Feature",
    "class": "structural",
    "category": "STRUCTURAL",
    "description": "Small landscape feature with plantings. Includes herb gardens, flower beds, ornamental gardens, sensory gardens, healing gardens (hospitals), pocket gardens. Smaller than park; more curated than tree-lined zones.",
    "suggested": [
      "crowdLevel",
      "description",
      "hasAssistance",
      "isFamilyFriendly"
    ],
    "alsoKnownAs": [
      "garden",
      "garden feature",
      "ornamental garden",
      "herb garden",
      "flower bed",
      "flower garden",
      "sensory garden",
      "healing garden",
      "pocket garden",
      "planted area"
    ],
    "isPoi": false
  },
  {
    "mainType": "decorative-environmental-feature",
    "subType": "tree",
    "displayName": "Tree",
    "class": "structural",
    "category": "STRUCTURAL",
    "description": "Individual tree of significance for mapping. Used for landmark trees (named/historic), specimen plantings, key wayfinding trees. Mapping every tree is rare; map only when individual trees serve as landmarks.",
    "suggested": [
      "crowdLevel",
      "description",
      "hasAssistance",
      "isFamilyFriendly"
    ],
    "alsoKnownAs": [
      "tree",
      "landmark tree",
      "specimen tree",
      "named tree",
      "historic tree",
      "signature tree"
    ],
    "isPoi": false
  },
  {
    "mainType": "decorative-environmental-feature",
    "subType": "water-feature",
    "displayName": "Water Feature",
    "class": "structural",
    "category": "STRUCTURAL",
    "description": "Decorative water installation. Includes fountains, reflecting pools, ponds, waterfalls, water walls, and similar architectural water features. For pools used for swimming/recreation, see activity-space.swimming-pool.",
    "suggested": [
      "crowdLevel",
      "description",
      "hasAssistance",
      "isFamilyFriendly"
    ],
    "alsoKnownAs": [
      "water feature",
      "fountain",
      "reflecting pool",
      "pond",
      "waterfall",
      "water wall",
      "decorative pool",
      "koi pond",
      "fountain feature"
    ],
    "isPoi": false
  },
  {
    "mainType": "section",
    "subType": "construction",
    "displayName": "Construction",
    "class": "structural",
    "category": "ACCESS",
    "description": "An area or zone within a building undergoing building, renovation, or structural work.",
    "suggested": [
      "description",
      "hasRestrooms"
    ],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "section",
    "subType": "no-access",
    "displayName": "No-Access",
    "class": "structural",
    "category": "ACCESS",
    "description": "An area or zone within a building undergoing building, renovation, or structural work.",
    "suggested": [
      "description",
      "hasRestrooms"
    ],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "transition",
    "subType": null,
    "displayName": "Transition",
    "class": "structural",
    "category": "ACCESS",
    "description": "A lift with non-overlapping stations",
    "suggested": [
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "transition",
    "subType": "elevator",
    "displayName": "Elevator",
    "class": "structural",
    "category": "ACCESS",
    "description": "A platform or compartment housed in a shaft for raising and lowering people or things to different levels",
    "suggested": [
      "isWheelchairAccessible",
      "isWheelchairAccessible:true"
    ],
    "alsoKnownAs": [
      "elevator",
      "lift",
      "elevator car",
      "lift car",
      "vertical transport"
    ],
    "isPoi": false
  },
  {
    "mainType": "transition",
    "subType": "escalator",
    "displayName": "Escalator",
    "class": "structural",
    "category": "ACCESS",
    "description": "An escalator is a moving staircase which carries people between floors of a building or structure",
    "suggested": [
      "isWheelchairAccessible",
      "isWheelchairAccessible:false"
    ],
    "alsoKnownAs": [
      "escalator",
      "moving stairs",
      "moving staircase"
    ],
    "isPoi": false
  },
  {
    "mainType": "transition",
    "subType": "interior-step",
    "displayName": "Interior Step",
    "class": "structural",
    "category": "ACCESS",
    "description": "Small staircases used due to height differences within the floor",
    "suggested": [
      "isWheelchairAccessible",
      "isWheelchairAccessible:false"
    ],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "transition",
    "subType": "moving-walkway",
    "displayName": "Moving Walkway",
    "class": "structural",
    "category": "ACCESS",
    "description": "A moving walkway is a conveyor belt system in indoor spaces, marked in maps for aiding quick and easy movement, essential for navigation and wayfinding.",
    "suggested": [
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "transition",
    "subType": "raise-above",
    "displayName": "Raise Above",
    "class": "structural",
    "category": "ACCESS",
    "description": "A raise in mining is a vertical or inclined passage connecting different levels underground.",
    "suggested": [
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "transition",
    "subType": "raise-below",
    "displayName": "Raise Below",
    "class": "structural",
    "category": "ACCESS",
    "description": "A raise below is a vertical or inclined passage connecting different levels underground, but specifically descending downward.",
    "suggested": [
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "transition",
    "subType": "raise-through",
    "displayName": "Raise Through",
    "class": "structural",
    "category": "ACCESS",
    "description": "A raise trough is a channel inside a mine's vertical passage, used for moving materials or utilities between different levels.",
    "suggested": [
      "isWheelchairAccessible"
    ],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "transition",
    "subType": "ramp",
    "displayName": "Ramp",
    "class": "structural",
    "category": "ACCESS",
    "description": "A sloping surface joining two different levels, as at the entrance or between floors of a building",
    "suggested": [
      "isWheelchairAccessible",
      "isWheelchairAccessible:true"
    ],
    "alsoKnownAs": [
      "escalator",
      "moving stairs",
      "moving staircase"
    ],
    "isPoi": false
  },
  {
    "mainType": "transition",
    "subType": "staircase",
    "displayName": "Staircase",
    "class": "structural",
    "category": "ACCESS",
    "description": "A set of stairs and its surrounding walls or structure",
    "suggested": [
      "isWheelchairAccessible",
      "isWheelchairAccessible:false"
    ],
    "alsoKnownAs": [
      "stairs",
      "staircase",
      "steps",
      "flight of stairs",
      "stairway"
    ],
    "isPoi": false
  },
  {
    "mainType": "transition",
    "subType": "stairs",
    "displayName": "Stairs",
    "class": "structural",
    "category": "ACCESS",
    "description": "A set of steps leading from one floor of a building to another, typically inside the building",
    "suggested": [
      "isWheelchairAccessible",
      "isWheelchairAccessible:false"
    ],
    "alsoKnownAs": [
      "stairs",
      "staircase",
      "steps",
      "flight of stairs",
      "stairway"
    ],
    "isPoi": false
  },
  {
    "mainType": "transition",
    "subType": "wheelchair-lift",
    "displayName": "Wheelchair Lift",
    "class": "structural",
    "category": "ACCESS",
    "description": "A wheelchair lift is a mechanical device designed to transport individuals in wheelchairs or with limited mobility between different levels of a building or vehicle. It provides accessibility by lifting the wheelchair and its occupant vertically or horizontally, allowing them to overcome architectural barriers such as stairs or curbs.",
    "suggested": [
      "isWheelchairAccessible",
      "isWheelchairAccessible:true"
    ],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "wall",
    "subType": null,
    "displayName": "Wall",
    "class": "structural",
    "category": "ACCESS",
    "description": "Walls constructed as a single solid layer with no cavity section within the wall",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "wall",
    "subType": "bulkhead",
    "displayName": "Bulkhead",
    "class": "structural",
    "category": "ACCESS",
    "description": "A bulkhead is a partition that divides spaces for safety and structural integrity.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "wall",
    "subType": "external-wall",
    "displayName": "External Wall",
    "class": "structural",
    "category": "ACCESS",
    "description": "The outer wall forming the exterior enclosure of a building, separating interior spaces from the outside.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "wall",
    "subType": "glass-wall",
    "displayName": "Glass Wall",
    "class": "structural",
    "category": "ACCESS",
    "description": "A transparent wall made of glass that allows visibility between spaces while maintaining physical separation.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "wall",
    "subType": "unit-separator",
    "displayName": "Unit Separator",
    "class": "structural",
    "category": "ACCESS",
    "description": "An indoor wall or partition element that divides and separates individual units or spaces within a building.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "wall",
    "subType": "void",
    "displayName": "Void",
    "class": "structural",
    "category": "ACCESS",
    "description": "An area that is fully enclosed or trapped between other services, rooms or walls within a building and occupy floor area",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "annotation",
    "subType": "internal-information",
    "displayName": "Internal Information",
    "class": "system",
    "category": null,
    "description": "Internal/backend information attached to a feature or zone. Not rendered on the map; carries metadata for publishing pipeline, QA tooling, or operational reference.",
    "suggested": [],
    "alsoKnownAs": [
      "internal info",
      "internal information",
      "backend metadata",
      "system note",
      "internal annotation"
    ],
    "isPoi": false
  },
  {
    "mainType": "blueprint",
    "subType": null,
    "displayName": "Blueprint",
    "class": "system",
    "category": null,
    "description": "Blueprint is a designated map layer to represent floor-plan on Pointr Cloud Dashboard.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "building-outline",
    "subType": null,
    "displayName": "Building Outline",
    "class": "system",
    "category": null,
    "description": "The boundary shape defining the footprint of a building within a site.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "geofence",
    "subType": "beacon-geofence",
    "displayName": "Beacon Geofence",
    "class": "system",
    "category": null,
    "description": "A Bluetooth beacon-based virtual boundary used to detect and trigger actions when a device is within proximity of a defined area.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "geofence",
    "subType": "gps-geofence",
    "displayName": "GPS Geofence",
    "class": "system",
    "category": null,
    "description": "A GPS-based virtual boundary used to trigger location-aware actions when a device enters or exits a defined area.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "georeferencing-anchor",
    "subType": null,
    "displayName": "Georeferencing Anchor",
    "class": "system",
    "category": null,
    "description": "Anchors to be used during georeferencing",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "level-outline",
    "subType": null,
    "displayName": "Level Outline",
    "class": "system",
    "category": null,
    "description": "The boundary shape defining the footprint of a single floor level within a building.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "positioning-device",
    "subType": "beacon",
    "displayName": "Beacon",
    "class": "system",
    "category": null,
    "description": "Beacon is a small-scale network device that uses Bluetooth Low Energy (BLE) and acts as a transmitter to detect and track smartphones",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "site-outline",
    "subType": null,
    "displayName": "Site Outline",
    "class": "system",
    "category": null,
    "description": "The boundary shape defining the overall perimeter of a site or campus.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "wayfinding-network",
    "subType": "building-entrance-exit",
    "displayName": "Building Entrance-Exit",
    "class": "system",
    "category": "ACCESS",
    "description": "A building-entrance-exit transition node in indoor wayfinding taxonomy is a critical point where the indoor navigation system aligns with the outdoor environment, marking entry and exit points for effective guidance and route transitions.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "wayfinding-network",
    "subType": "custom-transition",
    "displayName": "Custom Transition",
    "class": "system",
    "category": "ACCESS",
    "description": "A custom transition is a personalized transition that guides occupants from one space to another. It incorporates customisable properties to be tailored for the needs. It could be used for moving walkways, inter-building transitions and more.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "wayfinding-network",
    "subType": "elevator-node",
    "displayName": "Elevator Node",
    "class": "system",
    "category": "ACCESS",
    "description": "A platform or compartment housed in a shaft for raising and lowering people or things to different levels",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "wayfinding-network",
    "subType": "escalator-node",
    "displayName": "Escalator Node",
    "class": "system",
    "category": "ACCESS",
    "description": "An escalator is a moving staircase which carries people between floors of a building or structure",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "wayfinding-network",
    "subType": "path-node",
    "displayName": "Path Node",
    "class": "system",
    "category": "ACCESS",
    "description": "A navigation point within the wayfinding network used to define routes between spaces.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "wayfinding-network",
    "subType": "stairs-node",
    "displayName": "Stairs Node",
    "class": "system",
    "category": "ACCESS",
    "description": "A set of steps leading from one floor of a building to another, typically inside the building",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  },
  {
    "mainType": "annotation",
    "subType": "map-annotation",
    "displayName": "Map Annotation",
    "class": "virtual",
    "category": null,
    "description": "Visible non-clickable text label rendered on the map. Used for area/zone names (\"Departures\", \"Concourse A\", \"Food Court\"), generic room labels (multi-purpose rooms or rooms without specific function), landmark labels, and similar wayfinding decorations. Distinct from POIs (clickable, full metadata) — annotations are pure visual aids.",
    "suggested": [],
    "alsoKnownAs": [
      "map annotation",
      "label",
      "area label",
      "room label",
      "multi-purpose room label",
      "area name",
      "zone label",
      "text label",
      "wayfinding label",
      "cartographic label"
    ],
    "isPoi": false
  },
  {
    "mainType": "virtual-obstacle",
    "subType": null,
    "displayName": "Virtual Obstacle",
    "class": "virtual",
    "category": "SYSTEM",
    "description": "A virtual shape to prevent the blue-dot to access spaces.",
    "suggested": [],
    "alsoKnownAs": [],
    "isPoi": false
  }
];

export const PROPERTIES: TaxonomyProperty[] = [
  {
    "key": "bookingUrl",
    "displayName": "Booking URL",
    "description": "Direct link to book or reserve the place.",
    "valueType": "hyperlink",
    "inputType": "textField",
    "segment": "Contact",
    "order": 100,
    "values": null,
    "valueLabels": null,
    "actionName": "Book",
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "orderUrl",
    "displayName": "Order URL",
    "description": "Direct link to place an order.\t",
    "valueType": "hyperlink",
    "inputType": "textField",
    "segment": "Contact",
    "order": 110,
    "values": null,
    "valueLabels": null,
    "actionName": "Order",
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "email",
    "displayName": "Email",
    "description": "Direct contact email address.",
    "valueType": "email",
    "inputType": "textField",
    "segment": "Contact",
    "order": 120,
    "values": null,
    "valueLabels": null,
    "actionName": "E-mail",
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "phoneNumber",
    "displayName": "Phone Number",
    "description": "Contact number for the space or service.",
    "valueType": "hyperlink",
    "inputType": "textField",
    "segment": "Contact",
    "order": 130,
    "values": null,
    "valueLabels": null,
    "actionName": "Call",
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "websiteUrl",
    "displayName": "Website URL",
    "description": "Official website URL.",
    "valueType": "hyperlink",
    "inputType": "textField",
    "segment": "Contact",
    "order": 140,
    "values": null,
    "valueLabels": null,
    "actionName": "Website",
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "menuUrl",
    "displayName": "Menu URL",
    "description": "Direct link to the food or drink menu.",
    "valueType": "hyperlink",
    "inputType": "textField",
    "segment": "Contact",
    "order": 150,
    "values": null,
    "valueLabels": null,
    "actionName": "Menu",
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "cuisines",
    "displayName": "Cuisines",
    "description": "Type of food served",
    "valueType": "array",
    "inputType": "autoComplete",
    "segment": "Cuisines",
    "order": 200,
    "values": [
      "Afghan",
      "African",
      "American",
      "Argentinian",
      "Armenian",
      "Asian Fusion",
      "Austrian",
      "Bangladeshi",
      "Belgian",
      "Brazilian",
      "British",
      "Bulgarian",
      "Cajun",
      "Cantonese",
      "Caribbean",
      "Chinese",
      "Colombian",
      "Cuban",
      "Ethiopian",
      "Filipino",
      "French",
      "Georgian",
      "German",
      "Greek",
      "Hawaiian",
      "Hungarian",
      "Indian",
      "Indonesian",
      "Iranian",
      "Irish",
      "Israeli",
      "Italian",
      "Jamaican",
      "Japanese",
      "Korean",
      "Latin American",
      "Lebanese",
      "Malaysian",
      "Mediterranean",
      "Mexican",
      "Middle Eastern",
      "Mongolian",
      "Moroccan",
      "Nepalese",
      "Pakistani",
      "Peruvian",
      "Pizza",
      "Polish",
      "Portuguese",
      "Romanian",
      "Russian",
      "Scandinavian",
      "Scottish",
      "Seafood",
      "Singaporean",
      "Slovak",
      "South African",
      "Southeast Asian",
      "Spanish",
      "Sri Lankan",
      "Sushi",
      "Swedish",
      "Swiss",
      "Syrian",
      "Taiwanese",
      "Tex-Mex",
      "Thai",
      "Tibetan",
      "Turkish",
      "Ukrainian",
      "Uzbek",
      "Vietnamese",
      "West African"
    ],
    "valueLabels": {
      "Afghan": "Afghan",
      "African": "African",
      "American": "American",
      "Argentinian": "Argentinian",
      "Armenian": "Armenian",
      "Asian Fusion": "Asian Fusion",
      "Austrian": "Austrian",
      "Bangladeshi": "Bangladeshi",
      "Belgian": "Belgian",
      "Brazilian": "Brazilian",
      "British": "British",
      "Bulgarian": "Bulgarian",
      "Cajun": "Cajun",
      "Cantonese": "Cantonese",
      "Caribbean": "Caribbean",
      "Chinese": "Chinese",
      "Colombian": "Colombian",
      "Cuban": "Cuban",
      "Ethiopian": "Ethiopian",
      "Filipino": "Filipino",
      "French": "French",
      "Georgian": "Georgian",
      "German": "German",
      "Greek": "Greek",
      "Hawaiian": "Hawaiian",
      "Hungarian": "Hungarian",
      "Indian": "Indian",
      "Indonesian": "Indonesian",
      "Iranian": "Iranian",
      "Irish": "Irish",
      "Israeli": "Israeli",
      "Italian": "Italian",
      "Jamaican": "Jamaican",
      "Japanese": "Japanese",
      "Korean": "Korean",
      "Latin American": "Latin American",
      "Lebanese": "Lebanese",
      "Malaysian": "Malaysian",
      "Mediterranean": "Mediterranean",
      "Mexican": "Mexican",
      "Middle Eastern": "Middle Eastern",
      "Mongolian": "Mongolian",
      "Moroccan": "Moroccan",
      "Nepalese": "Nepalese",
      "Pakistani": "Pakistani",
      "Peruvian": "Peruvian",
      "Pizza": "Pizza",
      "Polish": "Polish",
      "Portuguese": "Portuguese",
      "Romanian": "Romanian",
      "Russian": "Russian",
      "Scandinavian": "Scandinavian",
      "Scottish": "Scottish",
      "Seafood": "Seafood",
      "Singaporean": "Singaporean",
      "Slovak": "Slovak",
      "South African": "South African",
      "Southeast Asian": "Southeast Asian",
      "Spanish": "Spanish",
      "Sri Lankan": "Sri Lankan",
      "Sushi": "Sushi",
      "Swedish": "Swedish",
      "Swiss": "Swiss",
      "Syrian": "Syrian",
      "Taiwanese": "Taiwanese",
      "Tex-Mex": "Tex-Mex",
      "Thai": "Thai",
      "Tibetan": "Tibetan",
      "Turkish": "Turkish",
      "Ukrainian": "Ukrainian",
      "Uzbek": "Uzbek",
      "Vietnamese": "Vietnamese",
      "West African": "West African"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "dietaryOptions",
    "displayName": "Dietary Options",
    "description": "Special diets accommodated",
    "valueType": "array",
    "inputType": "autoComplete",
    "segment": "Dietary Options",
    "order": 210,
    "values": [
      "Allergen-Friendly",
      "Dairy-Free",
      "Egg-Free",
      "Gluten-Free",
      "Halal",
      "Keto",
      "Kosher",
      "Locally Sourced",
      "Low Carb",
      "Low Sodium",
      "No MSG",
      "Nut-Free",
      "Organic",
      "Paleo",
      "Peanut-Free",
      "Pescatarian",
      "Shellfish-Free",
      "Soy-Free",
      "Sugar-Free",
      "Vegan",
      "Vegetarian"
    ],
    "valueLabels": {
      "Allergen-Friendly": "Allergen-Friendly",
      "Dairy-Free": "Dairy-Free",
      "Egg-Free": "Egg-Free",
      "Gluten-Free": "Gluten-Free",
      "Halal": "Halal",
      "Keto": "Keto",
      "Kosher": "Kosher",
      "Locally Sourced": "Locally Sourced",
      "Low Carb": "Low Carb",
      "Low Sodium": "Low Sodium",
      "No MSG": "No MSG",
      "Nut-Free": "Nut-Free",
      "Organic": "Organic",
      "Paleo": "Paleo",
      "Peanut-Free": "Peanut-Free",
      "Pescatarian": "Pescatarian",
      "Shellfish-Free": "Shellfish-Free",
      "Soy-Free": "Soy-Free",
      "Sugar-Free": "Sugar-Free",
      "Vegan": "Vegan",
      "Vegetarian": "Vegetarian"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "serviceOptions",
    "displayName": "Service Options",
    "description": "Which food service options are supported (eg. in-store dining, takeout, takeaway)",
    "valueType": "enum",
    "inputType": "autoComplete",
    "segment": "Service Options",
    "order": 220,
    "values": [
      "Dine-in",
      "Takeout",
      "Delivery",
      "Curbside Pickup",
      "Drive-thru"
    ],
    "valueLabels": {
      "Dine-in": "Dine-in",
      "Takeout": "Takeout",
      "Delivery": "Delivery",
      "Curbside Pickup": "Curbside Pickup",
      "Drive-thru": "Drive-thru"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "productTypes",
    "displayName": "Product Types",
    "description": "Category of products or services offered by retail stores.",
    "valueType": "array",
    "inputType": "autoComplete",
    "segment": "Product Types",
    "order": 230,
    "values": [
      "Accessories",
      "Activewear",
      "Adaptive Clothing",
      "Alcoholic Beverages",
      "Appliances",
      "Art Supplies",
      "Automotive Parts and Accessories",
      "Baby and Toddler Products",
      "Beauty and Cosmetics",
      "Bedding and Bath",
      "Books and Media",
      "Cameras and Photography",
      "Cleaning Supplies",
      "Convenience Goods",
      "Crafts and Hobbies",
      "Department Store Goods",
      "Duty Free Goods",
      "Electronics",
      "Eyewear and Optical",
      "Fine Art",
      "Fitness Equipment",
      "Flowers Plants and Gardening",
      "Footwear",
      "Formalwear",
      "Fresh Food",
      "Furniture and Mattresses",
      "Gaming and Entertainment",
      "Gifts and Souvenirs",
      "Groceries",
      "Hardware and Tools",
      "Health and Medical",
      "Home Decor",
      "Home Improvement",
      "Jewelry and Watches",
      "Kids Clothing",
      "Kitchen and Dining",
      "Loungewear",
      "Luggage and Travel Goods",
      "Maternity Clothing",
      "Meat and Seafood",
      "Mens Clothing",
      "Mobile Phones and Telecom",
      "Musical Instruments",
      "Office Supplies",
      "Outdoor Recreation",
      "Outerwear",
      "Packaged Food",
      "Party Supplies",
      "Pet Supplies",
      "Petite Clothing",
      "Pharmacy and Wellness",
      "Plus Size Clothing",
      "Religious and Spiritual Goods",
      "Seasonal Goods",
      "Sleepwear",
      "Sporting Goods",
      "Stationery",
      "Supplements and Nutrition",
      "Swimwear",
      "Tall Clothing",
      "Teens Clothing",
      "Textiles and Fabrics",
      "Tobacco and Vaping",
      "Toys and Games",
      "Undergarments",
      "Unisex Clothing",
      "Vintage and Antiques",
      "Womens Clothing",
      "Workwear and Uniforms"
    ],
    "valueLabels": {
      "Accessories": "Accessories",
      "Activewear": "Activewear",
      "Adaptive Clothing": "Adaptive Clothing",
      "Alcoholic Beverages": "Alcoholic Beverages",
      "Appliances": "Appliances",
      "Art Supplies": "Art Supplies",
      "Automotive Parts and Accessories": "Automotive Parts and Accessories",
      "Baby and Toddler Products": "Baby and Toddler Products",
      "Beauty and Cosmetics": "Beauty and Cosmetics",
      "Bedding and Bath": "Bedding and Bath",
      "Books and Media": "Books and Media",
      "Cameras and Photography": "Cameras and Photography",
      "Cleaning Supplies": "Cleaning Supplies",
      "Convenience Goods": "Convenience Goods",
      "Crafts and Hobbies": "Crafts and Hobbies",
      "Department Store Goods": "Department Store Goods",
      "Duty Free Goods": "Duty Free Goods",
      "Electronics": "Electronics",
      "Eyewear and Optical": "Eyewear and Optical",
      "Fine Art": "Fine Art",
      "Fitness Equipment": "Fitness Equipment",
      "Flowers Plants and Gardening": "Flowers Plants and Gardening",
      "Footwear": "Footwear",
      "Formalwear": "Formalwear",
      "Fresh Food": "Fresh Food",
      "Furniture and Mattresses": "Furniture and Mattresses",
      "Gaming and Entertainment": "Gaming and Entertainment",
      "Gifts and Souvenirs": "Gifts and Souvenirs",
      "Groceries": "Groceries",
      "Hardware and Tools": "Hardware and Tools",
      "Health and Medical": "Health and Medical",
      "Home Decor": "Home Decor",
      "Home Improvement": "Home Improvement",
      "Jewelry and Watches": "Jewelry and Watches",
      "Kids Clothing": "Kids Clothing",
      "Kitchen and Dining": "Kitchen and Dining",
      "Loungewear": "Loungewear",
      "Luggage and Travel Goods": "Luggage and Travel Goods",
      "Maternity Clothing": "Maternity Clothing",
      "Meat and Seafood": "Meat and Seafood",
      "Mens Clothing": "Mens Clothing",
      "Mobile Phones and Telecom": "Mobile Phones and Telecom",
      "Musical Instruments": "Musical Instruments",
      "Office Supplies": "Office Supplies",
      "Outdoor Recreation": "Outdoor Recreation",
      "Outerwear": "Outerwear",
      "Packaged Food": "Packaged Food",
      "Party Supplies": "Party Supplies",
      "Pet Supplies": "Pet Supplies",
      "Petite Clothing": "Petite Clothing",
      "Pharmacy and Wellness": "Pharmacy and Wellness",
      "Plus Size Clothing": "Plus Size Clothing",
      "Religious and Spiritual Goods": "Religious and Spiritual Goods",
      "Seasonal Goods": "Seasonal Goods",
      "Sleepwear": "Sleepwear",
      "Sporting Goods": "Sporting Goods",
      "Stationery": "Stationery",
      "Supplements and Nutrition": "Supplements and Nutrition",
      "Swimwear": "Swimwear",
      "Tall Clothing": "Tall Clothing",
      "Teens Clothing": "Teens Clothing",
      "Textiles and Fabrics": "Textiles and Fabrics",
      "Tobacco and Vaping": "Tobacco and Vaping",
      "Toys and Games": "Toys and Games",
      "Undergarments": "Undergarments",
      "Unisex Clothing": "Unisex Clothing",
      "Vintage and Antiques": "Vintage and Antiques",
      "Womens Clothing": "Womens Clothing",
      "Workwear and Uniforms": "Workwear and Uniforms"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "clinicalSpecialty",
    "displayName": "Clinical Specialty",
    "description": "Clinical specialty, care discipline, or service line associated with a healthcare space.",
    "valueType": "array",
    "inputType": "autoComplete",
    "segment": "Clinical Specialty",
    "order": 240,
    "values": [
      "Acupuncture",
      "Addiction Medicine",
      "Allergy and Immunology",
      "Anesthesiology",
      "Audiology",
      "Bariatric Medicine",
      "Behavioral Health",
      "Cardiology",
      "Cardiothoracic Surgery",
      "Chiropractic",
      "Colon and Rectal Surgery",
      "Critical Care Medicine",
      "Dental Medicine",
      "Dermatology",
      "Diagnostic Imaging",
      "Emergency Medicine",
      "Endocrinology Diabetes and Metabolism",
      "Family Medicine",
      "Gastroenterology",
      "General Practice",
      "General Surgery",
      "Genetics",
      "Geriatric Medicine",
      "Gynecology",
      "Hematology",
      "Hepatology",
      "Hospice and Palliative Care",
      "Hyperbaric Medicine",
      "Infectious Disease",
      "Integrative Medicine",
      "Internal Medicine",
      "Laboratory Medicine",
      "Maternal Fetal Medicine",
      "Neonatology",
      "Nephrology",
      "Neurology",
      "Neurosurgery",
      "Nuclear Medicine",
      "Nutrition and Dietetics",
      "Obstetrics and Gynecology",
      "Occupational Medicine",
      "Occupational Therapy",
      "Oncology",
      "Ophthalmology",
      "Optometry",
      "Oral and Maxillofacial Surgery",
      "Orthodontics",
      "Orthopedics",
      "Otolaryngology",
      "Pain Medicine",
      "Pathology",
      "Pediatrics",
      "Physical Medicine and Rehabilitation",
      "Physical Therapy",
      "Plastic and Reconstructive Surgery",
      "Podiatry",
      "Preventive Medicine",
      "Primary Care",
      "Psychiatry",
      "Psychology",
      "Pulmonology",
      "Radiation Oncology",
      "Radiology",
      "Reproductive Endocrinology and Infertility",
      "Rheumatology",
      "Sleep Medicine",
      "Speech Language Pathology",
      "Sports Medicine",
      "Transplant Medicine",
      "Urgent Care",
      "Urology",
      "Vascular Surgery",
      "Wound Care"
    ],
    "valueLabels": {
      "Acupuncture": "Acupuncture",
      "Addiction Medicine": "Addiction Medicine",
      "Allergy and Immunology": "Allergy and Immunology",
      "Anesthesiology": "Anesthesiology",
      "Audiology": "Audiology",
      "Bariatric Medicine": "Bariatric Medicine",
      "Behavioral Health": "Behavioral Health",
      "Cardiology": "Cardiology",
      "Cardiothoracic Surgery": "Cardiothoracic Surgery",
      "Chiropractic": "Chiropractic",
      "Colon and Rectal Surgery": "Colon and Rectal Surgery",
      "Critical Care Medicine": "Critical Care Medicine",
      "Dental Medicine": "Dental Medicine",
      "Dermatology": "Dermatology",
      "Diagnostic Imaging": "Diagnostic Imaging",
      "Emergency Medicine": "Emergency Medicine",
      "Endocrinology Diabetes and Metabolism": "Endocrinology Diabetes and Metabolism",
      "Family Medicine": "Family Medicine",
      "Gastroenterology": "Gastroenterology",
      "General Practice": "General Practice",
      "General Surgery": "General Surgery",
      "Genetics": "Genetics",
      "Geriatric Medicine": "Geriatric Medicine",
      "Gynecology": "Gynecology",
      "Hematology": "Hematology",
      "Hepatology": "Hepatology",
      "Hospice and Palliative Care": "Hospice and Palliative Care",
      "Hyperbaric Medicine": "Hyperbaric Medicine",
      "Infectious Disease": "Infectious Disease",
      "Integrative Medicine": "Integrative Medicine",
      "Internal Medicine": "Internal Medicine",
      "Laboratory Medicine": "Laboratory Medicine",
      "Maternal Fetal Medicine": "Maternal Fetal Medicine",
      "Neonatology": "Neonatology",
      "Nephrology": "Nephrology",
      "Neurology": "Neurology",
      "Neurosurgery": "Neurosurgery",
      "Nuclear Medicine": "Nuclear Medicine",
      "Nutrition and Dietetics": "Nutrition and Dietetics",
      "Obstetrics and Gynecology": "Obstetrics and Gynecology",
      "Occupational Medicine": "Occupational Medicine",
      "Occupational Therapy": "Occupational Therapy",
      "Oncology": "Oncology",
      "Ophthalmology": "Ophthalmology",
      "Optometry": "Optometry",
      "Oral and Maxillofacial Surgery": "Oral and Maxillofacial Surgery",
      "Orthodontics": "Orthodontics",
      "Orthopedics": "Orthopedics",
      "Otolaryngology": "Otolaryngology",
      "Pain Medicine": "Pain Medicine",
      "Pathology": "Pathology",
      "Pediatrics": "Pediatrics",
      "Physical Medicine and Rehabilitation": "Physical Medicine and Rehabilitation",
      "Physical Therapy": "Physical Therapy",
      "Plastic and Reconstructive Surgery": "Plastic and Reconstructive Surgery",
      "Podiatry": "Podiatry",
      "Preventive Medicine": "Preventive Medicine",
      "Primary Care": "Primary Care",
      "Psychiatry": "Psychiatry",
      "Psychology": "Psychology",
      "Pulmonology": "Pulmonology",
      "Radiation Oncology": "Radiation Oncology",
      "Radiology": "Radiology",
      "Reproductive Endocrinology and Infertility": "Reproductive Endocrinology and Infertility",
      "Rheumatology": "Rheumatology",
      "Sleep Medicine": "Sleep Medicine",
      "Speech Language Pathology": "Speech Language Pathology",
      "Sports Medicine": "Sports Medicine",
      "Transplant Medicine": "Transplant Medicine",
      "Urgent Care": "Urgent Care",
      "Urology": "Urology",
      "Vascular Surgery": "Vascular Surgery",
      "Wound Care": "Wound Care"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "sportTypes",
    "displayName": "Sport Types",
    "description": "Sport or activity practiced in this space.",
    "valueType": "array",
    "inputType": "autoComplete",
    "segment": "Sport Types",
    "order": 250,
    "values": [
      "Aerobics",
      "American Football",
      "Archery",
      "Athletics",
      "Badminton",
      "Baseball",
      "Basketball",
      "Bouldering",
      "Bowling",
      "Boxing",
      "Cheerleading",
      "Cricket",
      "Curling",
      "Cycling",
      "Dance",
      "Diving",
      "Fencing",
      "Field Hockey",
      "Functional Fitness",
      "Golf",
      "Gymnastics",
      "Handball",
      "Ice Hockey",
      "Ice Skating",
      "Indoor Cycling",
      "Lacrosse",
      "Lap Swimming",
      "Martial Arts",
      "Mini Golf",
      "Pickleball",
      "Pilates",
      "Racquetball",
      "Recreational Swimming",
      "Rock Climbing",
      "Roller Skating",
      "Rowing",
      "Rugby",
      "Running",
      "Skateboarding",
      "Soccer",
      "Softball",
      "Squash",
      "Strength Training",
      "Table Tennis",
      "Tennis",
      "Track and Field",
      "Trampoline",
      "Volleyball",
      "Water Polo",
      "Wrestling",
      "Yoga"
    ],
    "valueLabels": {
      "Aerobics": "Aerobics",
      "American Football": "American Football",
      "Archery": "Archery",
      "Athletics": "Athletics",
      "Badminton": "Badminton",
      "Baseball": "Baseball",
      "Basketball": "Basketball",
      "Bouldering": "Bouldering",
      "Bowling": "Bowling",
      "Boxing": "Boxing",
      "Cheerleading": "Cheerleading",
      "Cricket": "Cricket",
      "Curling": "Curling",
      "Cycling": "Cycling",
      "Dance": "Dance",
      "Diving": "Diving",
      "Fencing": "Fencing",
      "Field Hockey": "Field Hockey",
      "Functional Fitness": "Functional Fitness",
      "Golf": "Golf",
      "Gymnastics": "Gymnastics",
      "Handball": "Handball",
      "Ice Hockey": "Ice Hockey",
      "Ice Skating": "Ice Skating",
      "Indoor Cycling": "Indoor Cycling",
      "Lacrosse": "Lacrosse",
      "Lap Swimming": "Lap Swimming",
      "Martial Arts": "Martial Arts",
      "Mini Golf": "Mini Golf",
      "Pickleball": "Pickleball",
      "Pilates": "Pilates",
      "Racquetball": "Racquetball",
      "Recreational Swimming": "Recreational Swimming",
      "Rock Climbing": "Rock Climbing",
      "Roller Skating": "Roller Skating",
      "Rowing": "Rowing",
      "Rugby": "Rugby",
      "Running": "Running",
      "Skateboarding": "Skateboarding",
      "Soccer": "Soccer",
      "Softball": "Softball",
      "Squash": "Squash",
      "Strength Training": "Strength Training",
      "Table Tennis": "Table Tennis",
      "Tennis": "Tennis",
      "Track and Field": "Track and Field",
      "Trampoline": "Trampoline",
      "Volleyball": "Volleyball",
      "Water Polo": "Water Polo",
      "Wrestling": "Wrestling",
      "Yoga": "Yoga"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "serviceTypes",
    "displayName": "Service Types",
    "description": "Category of professional or visitor services offered.",
    "valueType": "array",
    "inputType": "autoComplete",
    "segment": "Service Types",
    "order": 260,
    "values": [
      "Accessibility Services",
      "Accounting and Tax Preparation",
      "Advertising and Marketing",
      "Architecture and Engineering",
      "Automotive Repair and Detailing",
      "Badge Pickup",
      "Baggage Services",
      "Banking and Credit Union",
      "Barber and Hair Salon",
      "Beauty and Spa Services",
      "Bicycle Services",
      "Business Consulting",
      "Car Rental",
      "Catering and Event Planning",
      "Childcare and Daycare",
      "Claims Assistance",
      "Cleaning and Housekeeping",
      "Cloakroom and Coat Check",
      "Concierge and Guest Services",
      "Courier Shipping and Mailing",
      "Coworking and Workspace Rental",
      "Currency Exchange",
      "Customer Service",
      "Device Charging",
      "Dry Cleaning and Laundry",
      "Equipment and Tool Rental",
      "Event Registration",
      "Facilities Support",
      "Financial Planning and Wealth Management",
      "First Aid",
      "Florist Services",
      "Food Ordering and Pickup",
      "Government and Municipal Services",
      "Guest Assistance",
      "Health and Wellness Coaching",
      "Hydration",
      "Hygiene and Sanitation",
      "Immigration and Visa Services",
      "Information and Help Desk",
      "Insurance Services",
      "Interior Design",
      "IT and Tech Support",
      "Key Cutting and Locksmith",
      "Legal Services and Notary",
      "Locker and Storage Services",
      "Logistics and Freight",
      "Lost and Found",
      "Massage Therapy",
      "Mobile Phone and Telecom Services",
      "Package Pickup and Returns",
      "Parking Assistance",
      "Passport Services",
      "Pet Grooming and Boarding",
      "Pharmacy Services",
      "Photography Studio",
      "Postal Services",
      "Printing Copying and Signage",
      "Public Assistance",
      "Real Estate and Leasing",
      "Reception",
      "Registration",
      "Repair Services Appliance and Tech",
      "Repair Services Jewelry and Watch",
      "Reservations and Booking",
      "Returns and Exchanges",
      "Security Services",
      "Shoe Care and Shine",
      "Shuttle and Transportation Assistance",
      "Tailoring and Alterations",
      "Ticketing",
      "Ticketing and Box Office",
      "Translation and Interpretation",
      "Travel and Tourism",
      "Tutoring and Test Prep",
      "Valet Parking",
      "Visitor Check-in",
      "Wayfinding"
    ],
    "valueLabels": {
      "Accessibility Services": "Accessibility Services",
      "Accounting and Tax Preparation": "Accounting and Tax Preparation",
      "Advertising and Marketing": "Advertising and Marketing",
      "Architecture and Engineering": "Architecture and Engineering",
      "Automotive Repair and Detailing": "Automotive Repair and Detailing",
      "Badge Pickup": "Badge Pickup",
      "Baggage Services": "Baggage Services",
      "Banking and Credit Union": "Banking and Credit Union",
      "Barber and Hair Salon": "Barber and Hair Salon",
      "Beauty and Spa Services": "Beauty and Spa Services",
      "Bicycle Services": "Bicycle Services",
      "Business Consulting": "Business Consulting",
      "Car Rental": "Car Rental",
      "Catering and Event Planning": "Catering and Event Planning",
      "Childcare and Daycare": "Childcare and Daycare",
      "Claims Assistance": "Claims Assistance",
      "Cleaning and Housekeeping": "Cleaning and Housekeeping",
      "Cloakroom and Coat Check": "Cloakroom and Coat Check",
      "Concierge and Guest Services": "Concierge and Guest Services",
      "Courier Shipping and Mailing": "Courier Shipping and Mailing",
      "Coworking and Workspace Rental": "Coworking and Workspace Rental",
      "Currency Exchange": "Currency Exchange",
      "Customer Service": "Customer Service",
      "Device Charging": "Device Charging",
      "Dry Cleaning and Laundry": "Dry Cleaning and Laundry",
      "Equipment and Tool Rental": "Equipment and Tool Rental",
      "Event Registration": "Event Registration",
      "Facilities Support": "Facilities Support",
      "Financial Planning and Wealth Management": "Financial Planning and Wealth Management",
      "First Aid": "First Aid",
      "Florist Services": "Florist Services",
      "Food Ordering and Pickup": "Food Ordering and Pickup",
      "Government and Municipal Services": "Government and Municipal Services",
      "Guest Assistance": "Guest Assistance",
      "Health and Wellness Coaching": "Health and Wellness Coaching",
      "Hydration": "Hydration",
      "Hygiene and Sanitation": "Hygiene and Sanitation",
      "Immigration and Visa Services": "Immigration and Visa Services",
      "Information and Help Desk": "Information and Help Desk",
      "Insurance Services": "Insurance Services",
      "Interior Design": "Interior Design",
      "IT and Tech Support": "IT and Tech Support",
      "Key Cutting and Locksmith": "Key Cutting and Locksmith",
      "Legal Services and Notary": "Legal Services and Notary",
      "Locker and Storage Services": "Locker and Storage Services",
      "Logistics and Freight": "Logistics and Freight",
      "Lost and Found": "Lost and Found",
      "Massage Therapy": "Massage Therapy",
      "Mobile Phone and Telecom Services": "Mobile Phone and Telecom Services",
      "Package Pickup and Returns": "Package Pickup and Returns",
      "Parking Assistance": "Parking Assistance",
      "Passport Services": "Passport Services",
      "Pet Grooming and Boarding": "Pet Grooming and Boarding",
      "Pharmacy Services": "Pharmacy Services",
      "Photography Studio": "Photography Studio",
      "Postal Services": "Postal Services",
      "Printing Copying and Signage": "Printing Copying and Signage",
      "Public Assistance": "Public Assistance",
      "Real Estate and Leasing": "Real Estate and Leasing",
      "Reception": "Reception",
      "Registration": "Registration",
      "Repair Services Appliance and Tech": "Repair Services Appliance and Tech",
      "Repair Services Jewelry and Watch": "Repair Services Jewelry and Watch",
      "Reservations and Booking": "Reservations and Booking",
      "Returns and Exchanges": "Returns and Exchanges",
      "Security Services": "Security Services",
      "Shoe Care and Shine": "Shoe Care and Shine",
      "Shuttle and Transportation Assistance": "Shuttle and Transportation Assistance",
      "Tailoring and Alterations": "Tailoring and Alterations",
      "Ticketing": "Ticketing",
      "Ticketing and Box Office": "Ticketing and Box Office",
      "Translation and Interpretation": "Translation and Interpretation",
      "Travel and Tourism": "Travel and Tourism",
      "Tutoring and Test Prep": "Tutoring and Test Prep",
      "Valet Parking": "Valet Parking",
      "Visitor Check-in": "Visitor Check-in",
      "Wayfinding": "Wayfinding"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "isWheelchairAccessible",
    "displayName": "Wheelchair Accessible",
    "description": "Wheelchair friendly",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Accessibility",
    "order": 300,
    "values": null,
    "valueLabels": {
      "true": "Wheelchair Friendly",
      "false": "Not Wheelchair Accessible"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "hasHearingLoop",
    "displayName": "Hearing Loop",
    "description": "Hearing aid compatible",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Accessibility",
    "order": 310,
    "values": null,
    "valueLabels": {
      "true": "Hearing Loop"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "hasVisualAids",
    "displayName": "Visual Aids",
    "description": "Braille/tactile guides present",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Accessibility",
    "order": 320,
    "values": null,
    "valueLabels": {
      "true": "Visual Aids"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "isAutismFriendly",
    "displayName": "Autism Friendly",
    "description": "Sensory-friendly environment",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Accessibility",
    "order": 330,
    "values": null,
    "valueLabels": {
      "true": "Autism Friendly"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "hasAssistance",
    "displayName": "Assistance Available",
    "description": "Staff help available",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Accessibility",
    "order": 340,
    "values": null,
    "valueLabels": {
      "true": "Assistance Available"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "hasWifi",
    "displayName": "WiFi",
    "description": "Free WiFi access",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Amenities",
    "order": 400,
    "values": null,
    "valueLabels": {
      "true": "WiFi"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "hasChargingAvailable",
    "displayName": "Chargers",
    "description": "Device charging stations",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Amenities",
    "order": 410,
    "values": null,
    "valueLabels": {
      "true": "Chargers"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "hasRestrooms",
    "displayName": "Restrooms",
    "description": "Restroom facilities available",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Amenities",
    "order": 420,
    "values": null,
    "valueLabels": {
      "true": "Restrooms"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "hasLockers",
    "displayName": "Locker Room",
    "description": "Storage lockers present",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Amenities",
    "order": 430,
    "values": null,
    "valueLabels": {
      "true": "Locker Room"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "hasLuggageStorage",
    "displayName": "Luggage Storage",
    "description": "Baggage storage service",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Amenities",
    "order": 440,
    "values": null,
    "valueLabels": {
      "true": "Luggage Storage"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "hasChangingFacilities",
    "displayName": "Changing Facilities",
    "description": "Baby changing available",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Amenities",
    "order": 450,
    "values": null,
    "valueLabels": {
      "true": "Changing Facilities"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "hasOutdoorSeating",
    "displayName": "Outdoor Seating",
    "description": "Offers outdoor seating.",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Amenities",
    "order": 460,
    "values": null,
    "valueLabels": {
      "true": "Outdoor Seating"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "hasPlayArea",
    "displayName": "Play Area",
    "description": "Children's play space",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Amenities",
    "order": 470,
    "values": null,
    "valueLabels": {
      "true": "Play Area"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "hasSecurityStaff",
    "displayName": "Security Staff",
    "description": "Security staff present",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Amenities",
    "order": 480,
    "values": null,
    "valueLabels": {
      "true": "Security Staff"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "hasAlcoholService",
    "displayName": "Alcohol Service",
    "description": "Serves alcoholic beverages",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Amenities",
    "order": 490,
    "values": null,
    "valueLabels": {
      "true": "Alcohol Service"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "isQuietZone",
    "displayName": "Quiet Room",
    "description": "Low noise environment",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Good to Know",
    "order": 500,
    "values": null,
    "valueLabels": {
      "true": "Quiet Room"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "isFamilyFriendly",
    "displayName": "Family Friendly",
    "description": "Suitable for children",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Good to Know",
    "order": 510,
    "values": null,
    "valueLabels": {
      "true": "Family Friendly"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "isPetFriendly",
    "displayName": "Pet Friendly",
    "description": "Pets allowed",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Good to Know",
    "order": 520,
    "values": null,
    "valueLabels": {
      "true": "Pet Friendly"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "dressCodes",
    "displayName": "Dress Code",
    "description": "Attire requirements",
    "valueType": "array",
    "inputType": "autoComplete",
    "segment": "Dress Code",
    "order": 530,
    "values": [
      "none",
      "casual",
      "smart-casual",
      "business-casual",
      "business",
      "formal"
    ],
    "valueLabels": {
      "none": "No Dress Code",
      "casual": "Casual",
      "smart-casual": "Smart Casual",
      "business-casual": "Business Casual",
      "business": "Business",
      "formal": "Formal"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "ageRestriction",
    "displayName": "Age Restriction",
    "description": "Age-based access limits",
    "valueType": "enum",
    "inputType": "autoComplete",
    "segment": "Age Restriction",
    "order": 535,
    "values": [
      "None",
      "13+",
      "16+",
      "18+",
      "21+",
      "Seniors",
      "Children-Only",
      "Family-Friendly"
    ],
    "valueLabels": {
      "None": "None",
      "13+": "13+",
      "16+": "16+",
      "18+": "18+",
      "21+": "21+",
      "Seniors": "Seniors",
      "Children-Only": "Children-Only",
      "Family-Friendly": "Family-Friendly"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "genderDesignation",
    "displayName": "Gender Designation",
    "description": "Gender access designation",
    "valueType": "enum",
    "inputType": "autoComplete",
    "segment": "Gender Designation",
    "order": 540,
    "values": [
      "male",
      "female",
      "all-gender",
      "gender-neutral",
      "family"
    ],
    "valueLabels": {
      "male": "Male",
      "female": "Female",
      "all-gender": "All-Gender",
      "gender-neutral": "Gender-Neutral",
      "family": "Family"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "capacity",
    "displayName": "Capacity",
    "description": "Maximum occupancy",
    "valueType": "integer",
    "inputType": "numberField",
    "segment": "Capacity",
    "order": 545,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "languageSupport",
    "displayName": "Language Support",
    "description": "Languages spoken by staff",
    "valueType": "array",
    "inputType": "autoComplete",
    "segment": "Language Support",
    "order": 550,
    "values": [
      "English",
      "Spanish",
      "French",
      "German",
      "Italian",
      "Portuguese",
      "Dutch",
      "Russian",
      "Arabic",
      "Chinese (Simplified)",
      "Chinese (Traditional)",
      "Japanese",
      "Korean",
      "Hindi",
      "Bengali",
      "Turkish"
    ],
    "valueLabels": {
      "English": "English",
      "Spanish": "Spanish",
      "French": "French",
      "German": "German",
      "Italian": "Italian",
      "Portuguese": "Portuguese",
      "Dutch": "Dutch",
      "Russian": "Russian",
      "Arabic": "Arabic",
      "Chinese (Simplified)": "Chinese (Simplified)",
      "Chinese (Traditional)": "Chinese (Traditional)",
      "Japanese": "Japanese",
      "Korean": "Korean",
      "Hindi": "Hindi",
      "Bengali": "Bengali",
      "Turkish": "Turkish"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "parkingTypes",
    "displayName": "Parking Types",
    "description": "Parking options available",
    "valueType": "array",
    "inputType": "autoComplete",
    "segment": "Parking Types",
    "order": 555,
    "values": [
      "Self-Park",
      "Valet",
      "EV Charging",
      "Disabled",
      "Motorcycle",
      "Bicycle",
      "Covered",
      "Outdoor",
      "Street Parking",
      "Garage",
      "Reserved",
      "Paid",
      "Free"
    ],
    "valueLabels": {
      "Self-Park": "Self-Park",
      "Valet": "Valet",
      "EV Charging": "EV Charging",
      "Disabled": "Disabled",
      "Motorcycle": "Motorcycle",
      "Bicycle": "Bicycle",
      "Covered": "Covered",
      "Outdoor": "Outdoor",
      "Street Parking": "Street Parking",
      "Garage": "Garage",
      "Reserved": "Reserved",
      "Paid": "Paid",
      "Free": "Free"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "accessPrograms",
    "displayName": "Access Programs",
    "description": "Named access program accepted",
    "valueType": "array",
    "inputType": "autoComplete",
    "segment": "Access Programs",
    "order": 560,
    "values": [
      "tsa-precheck",
      "clear",
      "global-entry",
      "nexus",
      "sentri",
      "fast-track",
      "registered-traveller",
      "privium",
      "digiyatra",
      "uae-smart-gate",
      "apec-btc",
      "viajero-confiable",
      "priority-pass",
      "lounge-key",
      "dragon-pass",
      "diners-club"
    ],
    "valueLabels": {
      "tsa-precheck": "TSA PreCheck",
      "clear": "CLEAR",
      "global-entry": "Global Entry",
      "nexus": "NEXUS",
      "sentri": "SENTRI",
      "fast-track": "Fast Track",
      "registered-traveller": "Registered Traveller",
      "privium": "Privium",
      "digiyatra": "DigiYatra",
      "uae-smart-gate": "UAE Smart Gate",
      "apec-btc": "APEC Business Travel Card",
      "viajero-confiable": "Viajero Confiable",
      "priority-pass": "Priority Pass",
      "lounge-key": "LoungeKey",
      "dragon-pass": "DragonPass",
      "diners-club": "Diners Club"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "accessRestrictions",
    "displayName": "Access Restrictions",
    "description": "Entry restrictions or conditions for access",
    "valueType": "array",
    "inputType": "autoComplete",
    "segment": "Access Restrictions",
    "order": 565,
    "values": [
      "invite-only",
      "membership-required",
      "booking-required",
      "ticket-required",
      "credential-required"
    ],
    "valueLabels": {
      "invite-only": "Invite Only",
      "membership-required": "Membership Required",
      "booking-required": "Booking Required",
      "ticket-required": "Ticket Required",
      "credential-required": "Credential Required"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "openingHours",
    "displayName": "Opening Hours",
    "description": "Operating schedule type",
    "valueType": "object",
    "inputType": "custom",
    "segment": "Opening Hours",
    "order": 600,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "crowdLevel",
    "displayName": "Crowd Level",
    "description": "Current crowding level",
    "valueType": "enum",
    "inputType": "autoComplete",
    "segment": "Crowd Level",
    "order": 610,
    "values": [
      "empty",
      "light",
      "moderate",
      "busy",
      "packed"
    ],
    "valueLabels": {
      "empty": "Empty",
      "light": "Light",
      "moderate": "Moderate",
      "busy": "Busy",
      "packed": "Packed"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "waitTime",
    "displayName": "Wait Time",
    "description": "Estimated wait in minutes",
    "valueType": "integer",
    "inputType": "numberField",
    "segment": "Wait Time",
    "order": 615,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "occupancyStatus",
    "displayName": "Occupancy Status",
    "description": "Current space availability",
    "valueType": "enum",
    "inputType": "autoComplete",
    "segment": "Occupancy Status",
    "order": 620,
    "values": [
      "available",
      "occupied",
      "busy",
      "full",
      "underConstruction",
      "maintenance",
      "closed",
      "temporarilyClosed"
    ],
    "valueLabels": {
      "available": "Available",
      "occupied": "Occupied",
      "busy": "Busy",
      "full": "Full",
      "underConstruction": "Under Construction",
      "maintenance": "Maintenance",
      "closed": "Closed",
      "temporarilyClosed": "Temporarily Closed"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "paymentMethods",
    "displayName": "Payment Methods",
    "description": "Accepted payment types",
    "valueType": "array",
    "inputType": "autoComplete",
    "segment": "Payment Methods",
    "order": 700,
    "values": [
      "Cash",
      "Credit",
      "Debit",
      "Contactless",
      "Mobile",
      "Apple Pay",
      "Google Pay",
      "Samsung Pay",
      "Bank Transfer",
      "QR Code",
      "Crypto",
      "Store Card",
      "Gift Card"
    ],
    "valueLabels": {
      "Cash": "Cash",
      "Credit": "Credit/Debit",
      "Debit": "Debit",
      "Contactless": "Contactless",
      "Mobile": "Mobile",
      "Apple Pay": "Apple Pay",
      "Google Pay": "Google Pay",
      "Samsung Pay": "Samsung Pay",
      "QR Code": "QR Code",
      "Bank Transfer": "Bank Transfer",
      "Crypto": "Crypto",
      "Store Card": "Store Card",
      "Gift Card": "Gift Card"
    },
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "description",
    "displayName": "Description",
    "description": "Full detailed description of the space or service.",
    "valueType": "text",
    "inputType": "textArea",
    "segment": "Description",
    "order": 900,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "tags",
    "displayName": "Tags",
    "description": "Categorization tags for filtering or grouping.",
    "valueType": "array",
    "inputType": "comboBox",
    "segment": "Tags",
    "order": 950,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "eid",
    "displayName": "External ID",
    "description": "Unique ID to use in external integrations.",
    "valueType": "text",
    "inputType": "textField",
    "segment": "System",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "images",
    "displayName": "Images",
    "description": "A direct URL linking to images of the space.",
    "valueType": "image",
    "inputType": "custom",
    "segment": "Content",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": 7
  },
  {
    "key": "isAccessible",
    "displayName": "Accessible",
    "description": "Reachable without stairs (elevator/ramp present)",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Wayfinding Network",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": true,
    "maxCount": null
  },
  {
    "key": "isAnchor",
    "displayName": "Anchor",
    "description": "Primary anchor tenant",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Prominence",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "isFeatured",
    "displayName": "Featured",
    "description": "Featured or sponsored",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Prominence",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "isWalkable",
    "displayName": "Walkable",
    "description": "Overrides isObstacle to allow visitor access through this space.",
    "valueType": "boolean",
    "inputType": "switch",
    "segment": "Wayfinding Network",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "keywords",
    "displayName": "Keywords",
    "description": "Search abbreviations or synonyms for finder logic.",
    "valueType": "array",
    "inputType": "comboBox",
    "segment": "Search",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "logo",
    "displayName": "Logo",
    "description": "A direct URL linking to the logo of the space.",
    "valueType": "image",
    "inputType": "custom",
    "segment": "Content",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "name",
    "displayName": "Name",
    "description": "The official display name of the space or service.",
    "valueType": "text",
    "inputType": "textField",
    "segment": "Content",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "priceRange",
    "displayName": "Price Range",
    "description": "Relative pricing level",
    "valueType": "integer",
    "inputType": "custom",
    "segment": "Content",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "rating",
    "displayName": "Rating",
    "description": "User rating score (e.g., 1-5 stars).",
    "valueType": "object",
    "inputType": "custom",
    "segment": "Content",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "shortDescription",
    "displayName": "Short Description",
    "description": "Brief summary for list views/cards.",
    "valueType": "text",
    "inputType": "textField",
    "segment": "Content",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  },
  {
    "key": "travelTime",
    "displayName": "Travel Time",
    "description": "Estimated traversal time in seconds",
    "valueType": "number",
    "inputType": "numberField",
    "segment": "Wayfinding Network",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": true,
    "maxCount": null
  },
  {
    "key": "unitId",
    "displayName": "Unit ID",
    "description": "The unit identifier assigned to a space within a building, such as a floor and unit code (e.g. GF102).",
    "valueType": "text",
    "inputType": "textField",
    "segment": "System",
    "order": 9999,
    "values": null,
    "valueLabels": null,
    "actionName": null,
    "isSystem": false,
    "maxCount": null
  }
];

export const PERSONAS: TaxonomyPersona[] = [
  {
    "key": "customer",
    "displayName": "Customer",
    "color": "#FF9800",
    "isDefault": true,
    "description": "A person whose presence gives the space its purpose — they have an active relationship with the venue through booking, enrollment, ticket, membership, or tenancy, and are present to receive or use the venue's primary offering."
  },
  {
    "key": "visitor",
    "displayName": "Visitor",
    "color": "#7E57C2",
    "isDefault": false,
    "description": "A person present in the venue without an ongoing service relationship. They may be browsing, accompanying a facility user, or attending to brief personal business. They navigate public-facing areas only."
  },
  {
    "key": "staff",
    "displayName": "Staff",
    "color": "#43A047",
    "isDefault": false,
    "description": "A person who delivers the venue's services to facility users, or supports their delivery, whether employed directly, through a managed service arrangement, or as a formal volunteer. They work on-site regularly and require access to service delivery areas, staff amenities, and back-of-house routes."
  },
  {
    "key": "vip",
    "displayName": "VIP",
    "color": "#E91E63",
    "isDefault": false,
    "description": "A person with elevated access privileges at the venue — through a premium ticket, loyalty tier, club membership, or invitation. They see exclusive spaces and services not available to standard visitors."
  },
  {
    "key": "facilityManager",
    "displayName": "Facility Manager",
    "color": "#6D1B2A",
    "isDefault": false,
    "description": "A person responsible for the venue's physical infrastructure, systems, and grounds — as distinct from delivering services to facility users. They operate, maintain, and secure mechanical rooms, building systems, and operational zones; whether as owner, direct employee, or ongoing managed service."
  },
  {
    "key": "contractor",
    "displayName": "Contractor",
    "color": "#8D6E63",
    "isDefault": false,
    "description": "A person present for a defined scope of work at the venue, engaged through a contract, purchase order, or delivery instruction rather than ongoing employment or managed service. When the scope is complete, they leave."
  }
];

/** Segments in the taxonomy's own order — the order its `display.order` puts them in. */
export const SEGMENTS: string[] = [
  "Contact",
  "Cuisines",
  "Dietary Options",
  "Service Options",
  "Product Types",
  "Clinical Specialty",
  "Sport Types",
  "Service Types",
  "Accessibility",
  "Amenities",
  "Good to Know",
  "Dress Code",
  "Age Restriction",
  "Gender Designation",
  "Capacity",
  "Language Support",
  "Parking Types",
  "Access Programs",
  "Access Restrictions",
  "Opening Hours",
  "Crowd Level",
  "Wait Time",
  "Occupancy Status",
  "Payment Methods",
  "Description",
  "Tags",
  "System",
  "Content",
  "Wayfinding Network",
  "Prominence",
  "Search"
];
