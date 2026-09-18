import { describe, expect, it } from "vitest";
import {
  restaurantDetails,
  entranceDetails,
  retailDetails,
  fitnessDetails,
  parkingDetails,
  fullFieldDetails,
} from "./POIDetailPanel.fixtures";

describe("SDK reference data", () => {
  it.each(
    Object.entries({
      restaurantDetails,
      entranceDetails,
      retailDetails,
      fitnessDetails,
      parkingDetails,
      fullFieldDetails,
    }),
  )("%s has stable unique keys for every optional collection", (_, details) => {
    for (const collection of [
      details.groups,
      details.summary,
      details.tags,
      details.openingHours?.rows,
    ]) {
      const ids = collection?.map((item) => item.id) ?? [];
      expect(new Set(ids).size).toBe(ids.length);
    }
    for (const group of details.groups ?? []) {
      expect(new Set(group.items.map((item) => item.id)).size).toBe(
        group.items.length,
      );
    }
  });
  it("does not leak restaurant sections or booking into parking or retail", () => {
    expect(parkingDetails.supplementaryActions).toBeUndefined();
    expect(retailDetails.supplementaryActions).toEqual([
      { action: "call", label: "Call" },
    ]);
    for (const details of [
      parkingDetails,
      retailDetails,
      fitnessDetails,
      entranceDetails,
    ]) {
      expect(details.groups?.some((group) => group.id === "cuisines")).toBe(
        false,
      );
    }
  });
});
