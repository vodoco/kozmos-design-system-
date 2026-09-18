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
const group = (id: string, heading: string, labels: string[]) => ({
  id,
  heading,
  items: labels.map((label, index) => ({ id: `${id}-${index}`, label })),
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
      "WiFi",
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
      "WiFi",
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
