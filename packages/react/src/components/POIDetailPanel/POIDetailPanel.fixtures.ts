import type {
  POIAction,
  POIDetailsPresentation,
  POIPresentation,
} from "@kozmos/product-contracts";

export const poiActionLabels: Record<POIAction, string> = {
  navigate: "Go",
  favourite: "Favourite",
  bookmark: "Bookmark",
  share: "Share",
  order: "Order",
};
const group = (
  id: string,
  heading: string,
  labels: (string | { label: string; iconName: string })[],
) => ({
  id,
  heading,
  items: labels.map((value, index) => ({
    id: `${id}-${index}`,
    ...(typeof value === "string" ? { label: value } : value),
  })),
});
const accessibility = group("accessibility", "Accessibility", [
  "Wheelchair accessible",
  "Hearing loop",
  "Visual aids",
  "Autism friendly",
  "Assistance available",
]);
const openingHours = {
  label: "Opening hours",
  summary: "Open · Closes 12:30 pm",
  rows: [
    { id: "weekdays", day: "Monday–Friday", hours: "8:00 am–12:30 pm" },
    { id: "saturday", day: "Saturday", hours: "9:00 am–12:30 pm" },
    { id: "sunday", day: "Sunday", hours: "Closed" },
  ],
  note: "Illustrative venue-local hours; not a live opening-status calculation.",
};

export const restaurantPOI: POIPresentation = {
  id: "il-forno",
  name: "Il Forno",
  floorId: "1",
  floorLabel: "Current floor",
  buildingLabel: "Building A",
  availability: "open",
  availabilityLabel: "Open",
  description:
    "Wood-fired Neapolitan pizza & handmade pasta in a lively open kitchen.",
  // No logos or photography were supplied. Empty media deliberately renders no placeholders.
  media: [],
  actions: ["navigate", "share", "favourite", "bookmark"],
};
export const restaurantDetails: POIDetailsPresentation = {
  travelEstimate: {
    durationSeconds: 120,
    durationLabel: "2 min",
    distanceMetres: 120,
    distanceLabel: "120 m",
  },
  supplementaryActions: [{ action: "book", label: "Book" }],
  summary: [
    {
      id: "rating",
      kind: "rating",
      label: "Rating",
      value: "4.7 / 5",
      detail: "32 reviews",
    },
    { id: "price", kind: "price", label: "Price level", value: "3 of 4" },
    {
      id: "dietary",
      kind: "dietary",
      label: "Dietary options",
      value: "Dietary options",
    },
  ],
  groups: [
    group("cuisines", "Cuisines", ["Italian", "Pizza", "Mediterranean"]),
    group("dietary", "Dietary options", ["Vegetarian", "Vegan", "Gluten-free"]),
    group("services", "Service options", ["Dine-in", "Takeout", "Delivery"]),
    accessibility,
    group("amenities", "Amenities", [
      { label: "WiFi", iconName: "wifi" },
      "Play area",
      "Restrooms",
      "Alcohol service",
      "Outdoor seating",
    ]),
    group("good-to-know", "Good to know", ["Family friendly", "Pet friendly"]),
    group("payment", "Payment methods", [
      "Cash",
      "Credit/debit",
      "Google Pay",
      "Apple Pay",
      "Contactless",
    ]),
    group("dress", "Dress code", ["Smart casual"]),
    group("age", "Age restriction", ["18+"]),
  ],
  openingHours,
  description: {
    preview:
      "Family-run since 1998, Il Forno serves Naples-style pizza from a wood-fired oven and pasta made fresh daily.",
    full: "Family-run since 1998, Il Forno serves Naples-style pizza from a wood-fired oven and pasta made fresh daily. The terrace seats overlook the atrium, and the open kitchen is the heart of the room. Weekend evenings are lively — booking recommended.",
  },
  tags: [
    { id: "pizza", label: "#pizza" },
    { id: "italian", label: "#italian" },
    { id: "patio", label: "#patio" },
  ],
};
export const entrancePOI: POIPresentation = {
  id: "terminal-1",
  name: "Terminal 1 Main Entrance",
  floorId: "1",
  floorLabel: "Current floor",
  buildingLabel: "Building A",
  availability: "open",
  availabilityLabel: "Open",
  media: [],
  actions: ["navigate", "share", "favourite", "bookmark"],
};
export const entranceDetails: POIDetailsPresentation = {
  travelEstimate: restaurantDetails.travelEstimate,
  summary: [
    {
      id: "accessible",
      kind: "accessibility",
      label: "Accessibility",
      value: "Wheelchair accessible",
    },
  ],
  groups: [
    accessibility,
    group("amenities", "Amenities", [
      { label: "WiFi", iconName: "wifi" },
      "Chargers",
      "Restrooms",
      "Luggage storage",
      "Security staff",
    ]),
    group("languages", "Language support", ["English", "Spanish", "French"]),
    group("programs", "Access programs", [
      "TSA PreCheck",
      "CLEAR",
      "Global Entry",
    ]),
  ],
  openingHours,
};

export const retailPOI: POIPresentation = {
  ...restaurantPOI,
  id: "aria-and-co",
  name: "Aria & Co.",
  description:
    "Flagship fashion & lifestyle department store across three floors.",
};
export const retailDetails: POIDetailsPresentation = {
  travelEstimate: restaurantDetails.travelEstimate,
  supplementaryActions: [{ action: "call", label: "Call" }],
  summary: [
    restaurantDetails.summary![0],
    entranceDetails.summary![0],
    {
      id: "crowd",
      kind: "crowd",
      label: "Crowd and wait",
      value: "Packed",
      detail: "25 min wait",
    },
  ],
  groups: [
    group("products", "Product types", [
      "Womenswear",
      "Menswear",
      "Accessories",
      "Beauty & cosmetics",
      "Footwear",
      "Homeware",
    ]),
    group("accessibility", "Accessibility", [
      "Wheelchair accessible",
      "Assistance available",
    ]),
    group("amenities", "Amenities", ["Changing facilities", "Restrooms"]),
    group("payment", "Payment methods", [
      "Cash",
      "Credit/debit",
      "Mobile",
      "Contactless",
      "Apple Pay",
      "Google Pay",
      "Samsung Pay",
      "Store card",
      "Gift card",
    ]),
  ],
  openingHours,
  description: {
    preview:
      "Three floors of curated fashion, beauty and homeware, with a rooftop café and a dedicated personal-shopping suite on Level 3.",
    full: "Three floors of curated fashion, beauty and homeware, with a rooftop café and a dedicated personal-shopping suite on Level 3. Seasonal collections rotate monthly and members get early access to sale previews.",
  },
  tags: [
    { id: "fashion", label: "#fashion" },
    { id: "lifestyle", label: "#lifestyle" },
  ],
};
export const fitnessPOI: POIPresentation = {
  ...restaurantPOI,
  id: "peak-performance",
  name: "Peak Performance",
  description:
    "A high-intensity fitness studio offering group classes and open gym access.",
};
export const fitnessDetails: POIDetailsPresentation = {
  travelEstimate: restaurantDetails.travelEstimate,
  supplementaryActions: [{ action: "book", label: "Book" }],
  summary: restaurantDetails.summary!.filter((item) => item.kind !== "dietary"),
  groups: [
    group("sports", "Sport types", ["Aerobics", "Athletics"]),
    group("accessibility", "Accessibility", [
      "Wheelchair accessible",
      "Assistance available",
    ]),
    group("amenities", "Amenities", [
      { label: "WiFi", iconName: "wifi" },
      "Chargers",
      "Restrooms",
      "Locker room",
      "Changing facilities",
    ]),
    group("good-to-know", "Good to know", ["Family friendly"]),
    group("payment", "Payment methods", [
      "Cash",
      "Credit/debit",
      "Mobile",
      "Contactless",
      "Apple Pay",
      "Google Pay",
      "Samsung Pay",
    ]),
    group("dress", "Dress code", ["Smart casual"]),
    group("age", "Age restriction", ["18+"]),
    group("languages", "Language support", ["English", "Spanish", "French"]),
    group("gender", "Gender designation", ["Male", "Female", "All-gender"]),
    group("restriction", "Access restriction", ["Booking required"]),
  ],
  openingHours,
  description: {
    preview:
      "Peak Performance Studio provides cardio and weightlifting equipment alongside daily instructor-led aerobics and athletics classes.",
    full: "Peak Performance Studio provides cardio and weightlifting equipment alongside daily instructor-led aerobics and athletics classes. Lockers and showers are available on-site for all members.",
  },
  tags: [
    { id: "fitness", label: "#fitness" },
    { id: "gym", label: "#gym" },
  ],
};
export const parkingPOI: POIPresentation = {
  ...entrancePOI,
  id: "north-deck",
  name: "North Deck Parking",
};
export const parkingDetails: POIDetailsPresentation = {
  travelEstimate: restaurantDetails.travelEstimate,
  summary: [entranceDetails.summary![0], retailDetails.summary![2]],
  groups: [
    group("accessibility", "Accessibility", ["Wheelchair accessible"]),
    group("payment", "Payment methods", [
      "Credit/debit",
      "Contactless",
      "Apple Pay",
      "Google Pay",
      "Samsung Pay",
    ]),
    group("parking", "Parking types", ["Self-park", "Valet", "EV charging"]),
  ],
  openingHours,
};

/** A synthetic field catalogue, never a claim that one venue offers everything. */
export const fullFieldDetails: POIDetailsPresentation = {
  ...restaurantDetails,
  groups: [
    ...new Map(
      [
        ...restaurantDetails.groups!,
        ...retailDetails.groups!,
        ...fitnessDetails.groups!,
        ...entranceDetails.groups!,
        ...parkingDetails.groups!,
        group("clinical", "Clinical specialty", [
          "Acupuncture",
          "Allergy and immunology",
          "Audiology",
        ]),
        group("service-types", "Service types", [
          "Barber and hair salon",
          "Beauty and spa services",
        ]),
        group("capacity", "Capacity", ["80"]),
        group("crowd", "Crowd level", ["Busy"]),
        group("wait", "Wait time", ["10 min"]),
        group("occupancy", "Occupancy status", ["Occupied"]),
      ].map((item) => [item.id, item]),
    ).values(),
  ],
};
