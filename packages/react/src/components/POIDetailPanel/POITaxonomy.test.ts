import { describe, expect, it } from "vitest";
import { presentTaxonomyProperties } from "./POITaxonomy.fixtures";

describe("taxonomy 10.12.0 presentation adapter example", () => {
  it("uses value icons without borrowing the property icon for text-only enum values", () => {
    const { groups, issues } = presentTaxonomyProperties({
      cuisines: ["Italian"],
      dietaryOptions: ["Vegan"],
      hasWifi: true,
      paymentMethods: ["Apple Pay"],
      serviceOptions: "Takeout",
    });
    const items = groups.flatMap((group) => group.items);
    expect(
      items.find((item) => item.label === "Italian")?.iconUrl,
    ).toBeUndefined();
    expect(
      items.find((item) => item.label === "Vegan")?.iconUrl,
    ).toBeUndefined();
    expect(items.find((item) => item.label === "WiFi")?.iconUrl).toContain(
      "/properties/has-wifi.png",
    );
    expect(items.find((item) => item.label === "Apple Pay")?.iconUrl).toContain(
      "/values/payment-methods/apple-pay.png",
    );
    expect(items.find((item) => item.label === "Takeout")?.iconUrl).toContain(
      "/values/service-options/takeout.png",
    );
    expect(issues).toEqual([]);
  });
  it("preserves meaningful false and zero, omits unsupported false and empty data", () => {
    const result = presentTaxonomyProperties({
      isWheelchairAccessible: false,
      hasWifi: false,
      waitTime: 0,
      dietaryOptions: [],
      crowdLevel: null,
    });
    expect(result.summary.map((item) => item.value)).toEqual([
      "Not Wheelchair Accessible",
      "0 min wait",
    ]);
    expect(
      result.groups.flatMap((group) => group.items).map((item) => item.label),
    ).toEqual(["Not Wheelchair Accessible"]);
  });
  it("sorts highlights independently, combines crowd/wait, does not duplicate highlight-only fields", () => {
    const result = presentTaxonomyProperties({
      occupancyStatus: "occupied",
      waitTime: 0,
      crowdLevel: "busy",
      priceRange: 3,
      hasWifi: true,
    });
    expect(result.summary.map((item) => item.id)).toEqual([
      "priceRange",
      "crowdLevel",
      "occupancyStatus",
    ]);
    expect(result.summary[0].priceLevel).toBe(3);
    expect(result.summary[1]).toMatchObject({
      value: "Busy",
      detail: "0 min wait",
      tone: "warning",
    });
    expect(result.summary[2]).toMatchObject({
      value: "Occupied",
      tone: "danger",
    });
    expect(result.groups.map((group) => group.heading)).toEqual(["Amenities"]);
  });
  it("does not invent colors absent from the dictionary", () => {
    expect(
      presentTaxonomyProperties({ occupancyStatus: "closed" }).summary[0].tone,
    ).toBe("neutral");
  });
  it("rejects malformed data, prototype keys, undocumented object shapes and unsafe numeric values", () => {
    const result = presentTaxonomyProperties(
      JSON.parse(
        '{"constructor":true,"hasWifi":"true","serviceOptions":["Takeout"],"rating":{"score":4.7},"waitTime":-1,"priceRange":5,"cuisines":["constructor"]}',
      ),
    );
    expect(result.summary).toEqual([]);
    expect(result.groups).toEqual([]);
    expect(result.issues).toHaveLength(7);
    expect(
      presentTaxonomyProperties({ waitTime: Infinity, capacity: 1.5 }).groups,
    ).toEqual([]);
  });
  it("does not expose contact URLs or internal identifiers as tags", () => {
    expect(
      presentTaxonomyProperties({
        bookingUrl: "javascript:alert(1)",
        eid: "internal",
        name: "Name",
      }).groups,
    ).toEqual([]);
  });
  it("deduplicates values and uses stable property/value ids", () => {
    const result = presentTaxonomyProperties({
      cuisines: ["Italian", "Italian", "Pizza"],
    });
    expect(result.groups[0].items.map((item) => item.id)).toEqual([
      "cuisines:Italian",
      "cuisines:Pizza",
    ]);
  });
});
