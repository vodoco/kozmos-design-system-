import { describe, expect, it } from "vitest";
import { KozmosPOICard } from "../../index";

describe("KozmosPOICard", () => {
  it("exports a Vue adapter component for the React POICard", () => {
    expect(KozmosPOICard).toMatchObject({
      name: "POICard",
      setup: expect.any(Function),
    });
  });
});
