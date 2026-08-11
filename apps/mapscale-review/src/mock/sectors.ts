// Pointr's sector list (Olcay, 2026-08-10) — the vocabulary behind the Level Type dropdown.
// Transcribed verbatim; this is platform taxonomy, so the words are not the mock's to edit.
//
// Irregularities carried as-received, flagged rather than fixed:
// - Aviation, Public Transportation, Industrial and Mine arrived without a sector-level
//   description row (every other sector has one).
// - Transport → "Transit Hub" and Public Transportation → "Transit Station" carry an identical
//   description — near-duplicate entries in the source list.
// - Workplace → "Industrial & Logistics" overlaps the standalone Industrial sector.
// The real list should come from platform config; this module is its seam.

export interface Subsector {
  name: string;
  description: string;
}

export interface Sector {
  name: string;
  /** The sector-level description, when the list provides one. */
  description?: string;
  /** Empty ⇒ the sector itself is selectable (only "Other" today). */
  subsectors: Subsector[];
}

export const SECTORS: Sector[] = [
  {
    name: "Retail",
    description:
      "General retail environments — stores, shops, and commercial spaces where goods are sold to consumers.",
    subsectors: [
      { name: "Big Box", description: "Large-format, warehouse-style stores specializing in hard goods (lumber, massive appliances) or bulk items." },
      { name: "Hypermarket", description: "High-traffic markets focusing on food & perishables. Includes massive hypermarkets where food is the anchor." },
      { name: "Department Store", description: "A multi-branded but single unified retailer operating multiple internal departments (beauty, fashion, home) under one management system." },
      { name: "Shopping Mall", description: "A large commercial complex housing a collection of independent retail tenants, services, and restaurants connected by shared common walkways. The map covers the building, not the products." },
      { name: "Convenience & Pharmacy", description: "Small-format retail for immediate consumables. Simple layout for quick \"in-and-out\" trips." },
      { name: "Specialty & Brand Store", description: "Standard retail units selling a specific brand or category. Covers mono-brand flagships, boutiques, and apparel." },
    ],
  },
  {
    name: "Healthcare",
    description: "Medical and care facilities providing treatment, diagnostics, and patient services.",
    subsectors: [
      { name: "Hospital / Medical Center", description: "Large institution providing acute patient treatment with specialized staff and equipment (ER, ICU, Surgery)." },
      { name: "Clinic / Outpatient", description: "Facilities for ambulatory care, doctor consultations, and minor treatments without overnight stays." },
      { name: "Specialized Care", description: "Facilities dedicated to specific long-term needs like rehabilitation, elderly care, or mental health." },
    ],
  },
  {
    name: "Workplace",
    description: "Professional and industrial environments where people perform their work duties.",
    subsectors: [
      { name: "Corporate Office", description: "Professional environments for administrative, operational, or creative work (Headquarters & Branches)." },
      { name: "Industrial & Logistics", description: "Facilities dedicated to warehousing, storage, or distribution of goods." },
    ],
  },
  {
    name: "Education",
    description: "Academic institutions and learning environments from primary schools to universities.",
    subsectors: [
      { name: "University Campus", description: "Large academic grounds including lecture halls, dorms, research labs, and student life amenities." },
      { name: "K-12 School", description: "Primary and secondary educational institutions including classrooms, gyms, and cafeterias." },
      { name: "Library", description: "Multi-level resource centers for research, quiet study, and digital access." },
    ],
  },
  {
    name: "Hospitality",
    description: "Accommodation and leisure venues providing guest services, lodging, and dining.",
    subsectors: [
      { name: "Hotel & Resort", description: "Lodging facilities providing short-term accommodation, often with dining and pools." },
      { name: "Cruise Ship", description: "Large passenger ships used for vacationing, featuring cabins, dining, and entertainment on board." },
    ],
  },
  {
    name: "Entertainment",
    description: "Venues for leisure, culture, and spectator experiences — museums, stadiums, and parks.",
    subsectors: [
      { name: "Museum & Cultural", description: "Institutions caring for (and displaying) a collection of artifacts, art, or historical objects." },
      { name: "Stadium & Arena", description: "Large venues designed for spectator sports, concerts, and major public events." },
      { name: "Theme Park / Attraction", description: "Amusement parks, zoos, and aquariums featuring rides, animal exhibits, and large crowds." },
    ],
  },
  {
    name: "Events",
    description: "Venues hosting exhibitions, conferences, trade shows, and large-scale gatherings.",
    subsectors: [
      { name: "Convention Center", description: "Large halls designed to hold exhibitions, conferences, and trade shows." },
    ],
  },
  {
    name: "Transport",
    description: "Transportation infrastructure including terminals, stations, and parking facilities.",
    subsectors: [
      { name: "Transit Hub", description: "Major stations for trains, subways, or buses, often including retail and ticketing zones." },
      { name: "Parking Structure", description: "Dedicated (multi-level) facilities for vehicle storage." },
    ],
  },
  {
    name: "Aviation",
    subsectors: [
      { name: "Commercial Airport", description: "Complex terminals for commercial aviation, including security, gates, and baggage claim." },
    ],
  },
  {
    name: "Public Transportation",
    subsectors: [
      { name: "Transit Station", description: "Major stations for trains, subways, or buses, often including retail and ticketing zones." },
    ],
  },
  {
    name: "Industrial",
    subsectors: [
      { name: "Manufacturing & Production", description: "Facilities dedicated to manufacturing, assembly, or processing of goods with heavy machinery and strict safety zones." },
    ],
  },
  {
    name: "Other",
    description:
      "Venues that don't fit a specific vertical — mixed-use complexes, government buildings, or unique facilities.",
    subsectors: [],
  },
  {
    name: "Mine",
    subsectors: [
      { name: "Mine Site", description: "Underground or open-pit extraction operations with controlled access zones, heavy machinery, and strict safety protocols." },
    ],
  },
];

/**
 * Picker order: alphabetical by sector, then by sub-sector. `SECTORS` above keeps the pasted
 * order verbatim as data, but that order carries no ranking a customer would recognise, and a
 * 27-option list is scanned by name. **"Other" is pinned last**: it is the fallback, and burying
 * it mid-alphabet hides exactly the option people reach for when nothing else fits.
 */
export const PICKER_SECTORS: Sector[] = [
  ...SECTORS.filter((s) => s.name !== "Other")
    .map((s) => ({ ...s, subsectors: [...s.subsectors].sort((a, b) => a.name.localeCompare(b.name)) }))
    .sort((a, b) => a.name.localeCompare(b.name)),
  ...SECTORS.filter((s) => s.name === "Other"),
];

/**
 * Stable option key — "aviation/commercial-airport". The display name is unique across the list
 * today, but the qualified slug is what a real config would store, so the mock stores it too.
 */
export function sectorKey(sector: string, sub?: string): string {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return sub ? `${slug(sector)}/${slug(sub)}` : slug(sector);
}

/** The demo site is Dubai International Airport. */
export const DEFAULT_SECTOR_KEY = sectorKey("Aviation", "Commercial Airport");
