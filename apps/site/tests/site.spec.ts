import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

/** The generated index: the walk over every component page needs no list of its own. */
const componentIndex = JSON.parse(
  readFileSync(
    new URL("../src/generated/components.json", import.meta.url),
    "utf8",
  ),
) as {
  lanes: Record<string, string>;
  components: { slug: string; name: string; lane: string }[];
};

const pages = [
  { path: "/", title: "The design system for the Pointr SDK" },
  { path: "/get-started", title: "Get started" },
  { path: "/examples", title: "Examples" },
  { path: "/examples/account-settings", title: "Account settings" },
  { path: "/examples/venue-explorer", title: "Venue explorer" },
  { path: "/examples/wayfinding", title: "Wayfinding" },
  { path: "/examples/phone-search", title: "Phone search sheet" },
  { path: "/examples/kiosk-directory", title: "Kiosk directory" },
  { path: "/foundations", title: "Foundations" },
  { path: "/foundations/colour", title: "Colour" },
  { path: "/foundations/typography", title: "Typography" },
  { path: "/foundations/layout", title: "Layout" },
  { path: "/foundations/elevation", title: "Elevation and effects" },
  { path: "/foundations/motion", title: "Motion" },
  { path: "/foundations/icons", title: "Icons" },
  { path: "/foundations/theming", title: "Theming" },
  { path: "/components", title: "Components" },
  // One page per lane and per kind of demo: a control, a tree, a picker, the
  // shell, a product panel. Every other page is walked in Chromium below.
  { path: "/components/button", title: "Button" },
  { path: "/components/tree", title: "Tree" },
  { path: "/components/date-range-picker", title: "DateRangePicker" },
  { path: "/components/adaptive-map-shell", title: "AdaptiveMapShell" },
  { path: "/components/poi-detail-panel", title: "POIDetailPanel" },
] as const;

/** Console errors and uncaught exceptions, which a clean page has none of. */
function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    // A failed request's message names no address; its location does.
    if (message.type() === "error")
      errors.push(`${message.text()} (${message.location().url})`);
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

/**
 * The site mirrors the provider's theme onto <html> once it has hydrated.
 * A pre-rendered page starts in the light theme (GAPS.md, GAP-03), and the
 * components' colour transitions then run into the visitor's theme, so the
 * page is only measured once no animation is still running.
 */
async function hydrated(page: Page) {
  await page.waitForFunction(() =>
    Boolean(document.documentElement.dataset.theme),
  );
  // The location marker's pulse never ends; only finite animations are waited for.
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (animation) =>
          animation.playState !== "running" ||
          animation.effect?.getTiming().iterations === Infinity,
      ),
  );
}

/** Scrolls the whole page once, so revealed sections and miniatures mount. */
async function scrolled(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    window.scrollTo(0, 0);
  });
  await hydrated(page);
}

/**
 * Violations that come from inside a Kozmos component and are recorded in
 * GAPS.md. The tests expect exactly these: a new violation fails, and so does
 * one that has gone away, so the gap gets closed when Kozmos fixes it.
 */
type KnownViolation = string | { id: string; only: RegExp };

const knownViolations: Record<string, readonly KnownViolation[]> = {
  // GAP-17: AdaptiveMapShell's panel is an <aside>, nested in the page's main.
  "/examples/venue-explorer": ["landmark-complementary-is-top-level"],
  "/examples/wayfinding": ["landmark-complementary-is-top-level"],
  "/examples/phone-search": ["landmark-complementary-is-top-level"],
  "/": ["landmark-complementary-is-top-level"],
  "/components/adaptive-map-shell": [
    "landmark-complementary-is-top-level",
    // GAP-28: SearchBar's search landmark cannot be named; three shells, three.
    { id: "landmark-unique", only: /role="search"/ },
  ],
  "/components/search-bar": [{ id: "landmark-unique", only: /role="search"/ }],
  "/components/sidebar": [
    // Not a gap: a Sidebar is a complementary landmark by nature, and a page
    // that shows one inside its own content cannot make it top-level.
    "landmark-complementary-is-top-level",
    // GAP-30: Sidebar's navigation cannot be named; the page's own has one too.
    { id: "landmark-unique", only: /sidebar-navigation/ },
  ],
  "/components/alert": [
    // GAP-31: the warning text reads 4.29:1 on the card.
    { id: "color-contrast", only: /border-warning/ },
    // GAP-12: AlertTitle is always an h5, under the demo card's h3.
    { id: "heading-order", only: /<h5/ },
  ],
  "/components/input": [{ id: "color-contrast", only: /kozmos-field-warning/ }],
  // GAP-31 again: the alert emotion as an outlined Tag's text.
  "/components/tag": [{ id: "color-contrast", only: /kz-emotion-text/ }],
  "/components/date-picker": [
    { id: "color-contrast", only: /kozmos-field-warning/ },
  ],
};

async function axeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags([
      "wcag2a",
      "wcag2aa",
      "wcag21a",
      "wcag21aa",
      "wcag22aa",
      "best-practice",
    ])
    .analyze();
  const known = (knownViolations[new URL(page.url()).pathname] ?? []).map(
    (entry) => (typeof entry === "string" ? { id: entry } : entry),
  );
  // A known violation covers a rule on the page, or only the nodes it names.
  const isKnown = (violation: (typeof results.violations)[number]) =>
    known.some(
      (entry) =>
        entry.id === violation.id &&
        (!("only" in entry) ||
          violation.nodes.every((node) =>
            entry.only.test(`${node.target.join(" ")} ${node.html}`),
          )),
    );
  const missing = known.filter(
    (entry) =>
      !results.violations.some((violation) => violation.id === entry.id),
  );
  // Contrast findings carry their numbers, so a failure names the colours.
  const measured = (
    node: (typeof results.violations)[number]["nodes"][number],
  ) => {
    const data = [...node.any, ...node.all]
      .map((check) => check.data as Record<string, unknown> | null)
      .find((entry) => entry && "contrastRatio" in entry);
    return data
      ? ` ${String(data.fgColor)} on ${String(data.bgColor)} = ${String(data.contrastRatio)}:1`
      : "";
  };
  return [
    ...results.violations
      .filter((violation) => !isKnown(violation))
      .map(
        (violation) =>
          `${violation.id} (${violation.impact}): ${violation.nodes
            .map((node) => `${node.target.join(" ")}${measured(node)}`)
            .join(" | ")}`,
      ),
    ...missing.map(
      (entry) => `${entry.id} no longer occurs: close its gap in GAPS.md`,
    ),
  ];
}

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme });

    for (const { path, title } of pages) {
      test(`${path} renders, hydrates cleanly and passes axe`, async ({
        page,
      }) => {
        const errors = collectErrors(page);
        const response = await page.goto(path);
        expect(response?.status()).toBe(200);
        await hydrated(page);
        await expect(page.locator("html")).toHaveAttribute(
          "data-theme",
          colorScheme,
        );
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
        // Pre-release: no page may be indexed (src/lib/site.ts, SITE_INDEXABLE).
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
          "content",
          "noindex",
        );
        await scrolled(page);
        expect(await axeViolations(page)).toEqual([]);
        expect(errors).toEqual([]);
      });
    }
  });
}

// 320 CSS pixels is the width WCAG's reflow criterion (1.4.10) measures at.
test.describe("on a narrow phone", () => {
  test.use({ viewport: { width: 320, height: 700 } });

  for (const { path } of pages) {
    test(`${path} has no sideways scroll`, async ({ page }) => {
      await page.goto(path);
      await scrolled(page);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("a foundations page offers its navigation in a drawer", async ({
    page,
  }) => {
    await page.goto("/foundations/colour");
    await hydrated(page);
    await page.getByRole("button", { name: "Foundations" }).click();
    const drawer = page.getByRole("dialog", { name: "Foundations" });
    await expect(drawer).toBeVisible();
    await drawer.getByRole("link", { name: "Motion" }).click();
    await expect(page).toHaveURL(/\/foundations\/motion$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Motion");
    await expect(drawer).toBeHidden();
  });

  test("a component page offers the reference in a drawer, grouped by lane", async ({
    page,
  }) => {
    await page.goto("/components/button");
    await hydrated(page);
    await page.getByRole("button", { name: "Components" }).click();
    const drawer = page.getByRole("dialog", { name: "Components" });
    await expect(drawer).toBeVisible();
    await expect(
      drawer.getByText(componentIndex.lanes["product-sdk"]),
    ).toBeVisible();
    await drawer.getByRole("link", { name: "Checkbox" }).click();
    await expect(page).toHaveURL(/\/components\/checkbox$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Checkbox",
    );
    await expect(drawer).toBeHidden();
  });
});

test("an unknown address answers 404 with the not-found page", async ({
  page,
}) => {
  const errors = collectErrors(page);
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await hydrated(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Page not found",
  );
  expect(await axeViolations(page)).toEqual([]);
  // The browser logs the 404 response itself; nothing else may fail.
  expect(errors.filter((error) => !error.includes("404"))).toEqual([]);
});

test("the theme choice is kept across a reload", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await hydrated(page);
  await page
    .getByRole("group", { name: "Colour theme" })
    .getByRole("radio", { name: "Dark" })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await hydrated(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(() => window.localStorage.getItem("kozmos-site-theme")),
  ).toBe("dark");
});

test("site navigation stays in the page and moves focus to the content", async ({
  page,
}) => {
  await page.goto("/");
  await hydrated(page);
  await page.evaluate(() => {
    (window as unknown as { sameDocument: boolean }).sameDocument = true;
  });
  await page
    .getByRole("navigation", { name: "Site" })
    .getByRole("link", { name: "Examples" })
    .click();
  await expect(page).toHaveURL(/\/examples$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Examples");
  expect(
    await page.evaluate(
      () => (window as unknown as { sameDocument?: boolean }).sameDocument,
    ),
  ).toBe(true);
  await expect(page.locator("main#main")).toBeFocused();
  await expect(
    page
      .getByRole("navigation", { name: "Site" })
      .getByRole("link", { name: "Examples" }),
  ).toHaveAttribute("aria-current", "page");

  // Into an example: same document, focus on the new content again.
  await page
    .locator("main")
    .getByRole("link", { name: "Open Account settings" })
    .click();
  await expect(page).toHaveURL(/\/examples\/account-settings$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Account settings",
  );
  expect(
    await page.evaluate(
      () => (window as unknown as { sameDocument?: boolean }).sameDocument,
    ),
  ).toBe(true);
  await expect(page.locator("main#main")).toBeFocused();

  // Into the reference, where the sidebar takes over: still the same document.
  await page
    .getByRole("navigation", { name: "Site" })
    .getByRole("link", { name: "Foundations" })
    .click();
  await expect(page).toHaveURL(/\/foundations$/);
  await page
    .getByRole("complementary", { name: "Foundations" })
    .getByRole("link", { name: "Icons" })
    .click();
  await expect(page).toHaveURL(/\/foundations\/icons$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Icons");
  expect(
    await page.evaluate(
      () => (window as unknown as { sameDocument?: boolean }).sameDocument,
    ),
  ).toBe(true);
  await expect(
    page
      .getByRole("complementary", { name: "Foundations" })
      .getByRole("link", { name: "Icons" }),
  ).toHaveAttribute("aria-current", "page");
});

test("the skip link is the first stop and moves focus to the content", async ({
  page,
  browserName,
}) => {
  // WebKit skips links on Tab unless the system's full keyboard access is on.
  test.skip(
    browserName === "webkit",
    "Tab does not reach links in WebKit by default",
  );
  await page.goto("/");
  await hydrated(page);
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test.describe("home", () => {
  test("the hero scene themes and mirrors only itself, and its controls work", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await hydrated(page);
    const scene = page
      .locator("section[aria-labelledby='home-title'] [data-kozmos-root]")
      .first();
    await expect(scene).toHaveAttribute("data-theme", "dark");
    await page
      .getByRole("group", { name: "This scene's theme" })
      .getByRole("radio", { name: "Light" })
      .click();
    await expect(scene).toHaveAttribute("data-theme", "light");
    await page
      .getByRole("group", { name: "Direction" })
      .getByRole("radio", { name: "Right to left" })
      .click();
    await expect(scene).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(
      page.locator("body > [data-kozmos-root]").first(),
    ).toHaveAttribute("dir", "ltr");

    const map = page.getByRole("region", { name: "Illustrative terminal map" });
    await expect(map.getByRole("button", { name: /Gate B12/ })).toBeVisible();
    await expect(map.getByRole("img", { name: "User location" })).toBeVisible();
    await map.getByRole("button", { name: "Show my location" }).click();
    await expect(map.getByRole("img", { name: "User location" })).toHaveCount(
      0,
    );
    await expect(map.getByText("Turn left at the pharmacy")).toBeVisible();
    await expect(map.getByText("Gate B12")).toBeVisible();
  });

  test("the live tiles respond", async ({ page }) => {
    await page.goto("/");
    await scrolled(page);
    const tile = (name: string) =>
      page.locator(".site-tile").filter({ hasText: name });

    // Tokens: the nested provider flips.
    const tokensTile = tile("One set of tokens");
    await tokensTile.getByRole("switch", { name: "Dark" }).click();
    await expect(
      tokensTile.locator("[data-kozmos-root]").first(),
    ).toHaveAttribute("data-theme", "dark");

    // Adaptive: a narrow host puts the panel below the map.
    const adaptive = tile("A map layout that fits its container");
    await expect(adaptive.getByText("side", { exact: true })).toBeVisible();
    const slider = adaptive.getByRole("slider", { name: "Host width" });
    await slider.focus();
    await page.keyboard.press("Home");
    await expect(adaptive.getByText("bottom", { exact: true })).toBeVisible();

    // Platforms: three snippets from the component's docs.
    const platforms = tile("Three platforms, one part");
    await platforms.getByRole("tab", { name: "SwiftUI" }).click();
    await expect(
      platforms.getByRole("region", { name: "Button.swift" }),
    ).toContainText("KozmosButton");

    // Contrast: four pairs, all passing.
    await expect(
      tile("Contrast, under contract").getByText("Pass"),
    ).toHaveCount(4);
  });

  test("make it yours re-points the theme ramp", async ({ page }) => {
    await page.goto("/");
    await scrolled(page);
    const section = page.getByRole("region", { name: "Make it yours" });
    await section
      .getByRole("group", { name: "Brand ramp" })
      .getByRole("radio", { name: "Variant 1" })
      .click();
    await expect(section.getByText(/variables re-pointed/)).toBeVisible();
    // The browser substitutes var() in a computed custom property, so the
    // module's theme-600 must now equal the variant's 600 and not the page's.
    const app = section.locator("[data-kozmos-root]").first();
    const read = (name: string) =>
      app.evaluate(
        (element, property) =>
          getComputedStyle(element).getPropertyValue(property).trim(),
        name,
      );
    const pageTheme = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--primitives-colors-theme-600")
        .trim(),
    );
    expect(await read("--primitives-colors-theme-600")).toBe(
      await read("--primitives-colors-theme-variant-1-600"),
    );
    expect(await read("--primitives-colors-theme-600")).not.toBe(pageTheme);
    await section.getByRole("switch", { name: "Dark theme" }).click();
    await expect(app).toHaveAttribute("data-theme", "dark");
  });

  test("example miniatures mount once in view and stay inert", async ({
    page,
  }) => {
    await page.goto("/");
    await scrolled(page);
    const miniature = page.getByRole("img", {
      name: "Venue explorer example, shown small",
    });
    await expect(miniature).toBeVisible();
    await expect(miniature.locator("[inert]")).toHaveCount(1);
    await expect(miniature.locator("input[type=search]")).toHaveCount(1);
    await expect(miniature.getByRole("searchbox")).toHaveCount(0);
  });
});

test.describe("foundations", () => {
  test("colour shows every ramp, and the contract passes in both themes", async ({
    page,
  }) => {
    await page.goto("/foundations/colour");
    await hydrated(page);
    await expect(
      page.getByRole("heading", { level: 3, name: "Theme variant 2" }),
    ).toBeVisible();
    await expect(
      page.getByText("All 22 pairs pass in both themes"),
    ).toBeVisible();
    const table = page.getByRole("table", { name: "Contrast contract" });
    await expect(table.getByRole("row")).toHaveCount(23);
    await expect(table.getByText("Fail")).toHaveCount(0);
  });

  test("icons search, filter and copy", async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Only Chromium grants clipboard permission headlessly",
    );
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/foundations/icons");
    await hydrated(page);
    await expect(
      page.getByRole("heading", { level: 2, name: /^\d+ icons$/ }),
    ).toBeVisible();
    await page.getByRole("searchbox", { name: "Search icons" }).fill("arrow");
    await expect(
      page.getByRole("button", { name: "Copy arrow-left" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy heart" })).toHaveCount(
      0,
    );
    await page.getByRole("button", { name: "Copy arrow-left" }).click();
    await expect(
      page.getByText('Copied <Icon name="arrow-left" />'),
    ).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      '<Icon name="arrow-left" />',
    );
    await page.getByRole("searchbox", { name: "Search icons" }).fill("zzzz");
    await expect(page.getByText("No icon matches")).toBeVisible();
    await page.getByRole("button", { name: "Show all" }).click();
    await expect(
      page.getByRole("button", { name: "Copy heart" }),
    ).toBeVisible();
  });

  test("typography measures the scale from the stylesheet", async ({
    page,
  }) => {
    await page.goto("/foundations/typography");
    await hydrated(page);
    await expect(page.getByText("4xl · 36px / 40px")).toBeVisible();
    await expect(page.getByText("xs · 12px / 16px")).toBeVisible();
  });

  test("the motion race runs on the tokens", async ({ page }) => {
    await page.goto("/foundations/motion");
    await hydrated(page);
    const track = page.locator(".site-track").first();
    const before = await track.locator(".site-runner").boundingBox();
    await page.getByRole("button", { name: "Run" }).click();
    await expect(track).toHaveAttribute("data-end", "true");
    await hydrated(page);
    const after = await track.locator(".site-runner").boundingBox();
    expect(before && after && after.x - before.x).toBeGreaterThan(50);
  });
});

/** The example itself, not the page around it (which also shows its source). */
function canvas(page: Page) {
  return page.getByRole("region", { name: "Account settings example" });
}

test.describe("account settings example", () => {
  test("the profile form refuses a bad email and confirms a good one", async ({
    page,
  }) => {
    await page.goto("/examples/account-settings");
    await hydrated(page);
    const example = canvas(page);
    const email = example.getByRole("textbox", { name: "Email" });
    await email.fill("not-an-email");
    await example.getByRole("button", { name: "Save profile" }).click();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(
      example.getByText("Enter an email address, like name@example.com."),
    ).toBeVisible();
    await email.fill("sam@example.com");
    await example.getByRole("button", { name: "Save profile" }).click();
    await expect(
      example.getByRole("status").filter({ hasText: "Your profile is saved." }),
    ).toBeVisible();
    await expect(email).not.toHaveAttribute("aria-invalid", "true");
  });

  test("the notification and security tabs work", async ({ page }) => {
    await page.goto("/examples/account-settings");
    await hydrated(page);
    const example = canvas(page);
    await example.getByRole("tab", { name: "Notifications" }).click();
    await example.getByRole("radio", { name: "Once a week" }).click();
    await expect(
      example.getByRole("radio", { name: "Once a week" }),
    ).toBeChecked();
    await example.getByRole("button", { name: "Save notifications" }).click();
    await expect(
      example
        .getByRole("status")
        .filter({ hasText: "notification choices are saved" }),
    ).toBeVisible();

    await example.getByRole("tab", { name: "Security" }).click();
    await example.getByLabel("Current password").fill("correct horse");
    await example.getByLabel("New password", { exact: true }).fill("short");
    await example.getByLabel("Confirm new password").fill("different");
    await example.getByRole("button", { name: "Change password" }).click();
    await expect(
      example.getByText("Use at least 12 characters."),
    ).toBeVisible();
    await expect(
      example.getByText("The two new passwords do not match."),
    ).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });
});

test.describe("venue explorer example", () => {
  function explorer(page: Page) {
    return page.getByRole("region", { name: "Venue explorer example" });
  }

  function mapPins(page: Page) {
    return explorer(page)
      .getByRole("region", { name: /Illustrative map$/ })
      .getByRole("button");
  }

  test("browse a category, open a place, act on it and come back", async ({
    page,
  }) => {
    await page.goto("/examples/venue-explorer");
    await hydrated(page);
    const app = explorer(page);
    await expect(mapPins(page)).toHaveCount(4);

    await app.getByRole("button", { name: "Transport 2 places" }).click();
    // The category takes the search field's place, with a way to clear it.
    await expect(app.getByRole("searchbox")).toHaveCount(0);
    await expect(
      app.getByRole("button", { name: "Clear Transport" }),
    ).toBeVisible();
    await expect(app.getByText("2 places").first()).toBeVisible();
    await expect(mapPins(page)).toHaveCount(2);

    await app
      .getByRole("button", { name: /Bus interchange/ })
      .first()
      .click();
    await expect(
      app.getByRole("heading", { level: 2, name: "Bus interchange" }),
    ).toBeVisible();
    await app.getByRole("button", { name: "Directions" }).click();
    await expect(
      app.getByText("Directions need a routing service"),
    ).toBeVisible();
    const favourite = app.getByRole("button", { name: "Favourite" });
    await favourite.click();
    await expect(favourite).toHaveAttribute("aria-pressed", "true");
    expect(await axeViolations(page)).toEqual([]);

    await app.getByRole("button", { name: "Back to the list" }).click();
    await expect(
      app.getByRole("heading", { level: 2, name: "Bus interchange" }),
    ).toHaveCount(0);
    await app.getByRole("button", { name: "Clear Transport" }).click();
    await expect(
      app.getByRole("searchbox", { name: "Search Riverside Centre" }),
    ).toBeVisible();
    await expect(
      app.getByRole("button", { name: "Shops 3 places" }),
    ).toBeVisible();
  });

  test("search finds a place on another floor and goes to that floor", async ({
    page,
  }) => {
    await page.goto("/examples/venue-explorer");
    await hydrated(page);
    const app = explorer(page);
    await app
      .getByRole("searchbox", { name: "Search Riverside Centre" })
      .fill("book");
    await app
      .getByRole("button", { name: /Bookshop/ })
      .first()
      .click();
    await expect(
      app.getByRole("heading", { level: 2, name: "Bookshop" }),
    ).toBeVisible();
    await expect(
      app.getByRole("button", { name: "First floor", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(mapPins(page)).toHaveCount(1);
  });

  test("the search field is drawn as Kozmos draws it", async ({
    page,
    browserName,
  }) => {
    // GAP-20: WebKit does not apply Kozmos's @scope-d utilities to <input>, and
    // SearchBar's field is one. Expected to fail there until Kozmos moves it to
    // component-owned CSS, as it did Input's; a pass then fails this test.
    test.fail(
      browserName === "webkit",
      "GAP-20: SearchBar's input is unstyled in WebKit",
    );
    await page.goto("/examples/venue-explorer");
    await hydrated(page);
    const field = explorer(page).getByRole("searchbox", {
      name: "Search Riverside Centre",
    });
    const style = await field.evaluate((element) => {
      const computed = getComputedStyle(element);
      return {
        fontSize: computed.fontSize,
        borderTopWidth: computed.borderTopWidth,
      };
    });
    expect(style).toEqual({ fontSize: "15px", borderTopWidth: "0px" });
  });

  test("floors, zoom and my location", async ({ page }) => {
    await page.goto("/examples/venue-explorer");
    await hydrated(page);
    const app = explorer(page);
    await app
      .getByRole("button", { name: "Second floor", exact: true })
      .click();
    await expect(
      app.getByRole("region", {
        name: "Riverside Centre, Second floor. Illustrative map",
      }),
    ).toBeVisible();
    await expect(mapPins(page)).toHaveCount(4);

    const pin = mapPins(page).first();
    const before = await pin.boundingBox();
    await app.getByRole("button", { name: "Zoom in" }).click();
    const after = await pin.boundingBox();
    expect(
      before &&
        after &&
        Math.abs(after.x - before.x) + Math.abs(after.y - before.y),
    ).toBeGreaterThan(1);

    await app.getByRole("button", { name: "Show my location" }).click();
    await expect(
      app.getByRole("button", { name: "Ground floor", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(app.getByLabel("You are here")).toBeVisible();
  });
});

test.describe("wayfinding example", () => {
  function app(page: Page) {
    return page.getByRole("region", { name: "Wayfinding example" });
  }

  test("choose a place, compare the routes, walk the step-free one and rate it", async ({
    page,
  }) => {
    await page.goto("/examples/wayfinding");
    await hydrated(page);
    const example = app(page);

    // Plan: every place is offered, and typing narrows the list.
    await expect(example.getByText("11 places")).toBeVisible();
    await example.getByPlaceholder("Where to?").fill("book");
    await expect(example.getByText("1 place")).toBeVisible();
    await example
      .getByRole("button", { name: /Bookshop/ })
      .first()
      .click();

    // Preview: quickest and step-free, and one route that is not available.
    await expect(example.getByText("Via the terrace")).toBeVisible();
    await expect(
      example.getByText("The terrace is closed for the season."),
    ).toBeVisible();
    await example.getByText("Step-free", { exact: true }).click();
    await expect(example.getByText("Step-free selected")).toBeAttached();
    await example.getByRole("button", { name: "Start" }).click();

    // Walking: the manoeuvre card, the summary with its rail, the announcer.
    await expect(
      example.getByText("Head towards the atrium").first(),
    ).toBeVisible();
    await expect(example.getByLabel("Step 1 of 5")).toBeAttached();
    await expect(example.getByRole("button", { name: "End" })).toBeVisible();
    const next = example.getByRole("button", { name: "Next step" });
    await next.click();
    await expect(
      example.getByText("Turn left for the lifts").first(),
    ).toBeVisible();
    await next.click();
    await expect(
      example.getByText("Take the lift to the first floor").first(),
    ).toBeVisible();
    await next.click();
    // Up the lift: the map follows the visitor to the first floor.
    await expect(
      example.getByRole("button", { name: "First floor", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(example.getByLabel("Step 4 of 5")).toBeAttached();
    expect(await axeViolations(page)).toEqual([]);
    await next.click();
    await next.click();

    // Arrived: the feedback card, then back to the start.
    await expect(example.getByText("You have arrived")).toBeVisible();
    await example.getByRole("button", { name: "Plan another route" }).click();
    await expect(example.getByPlaceholder("Where to?")).toHaveValue("");
    await expect(example.getByText("11 places")).toBeVisible();
  });
});

test.describe("phone search example", () => {
  test("browse a category, open a place in the sheet, turn its photos, and set the sheet's height", async ({
    page,
  }) => {
    await page.goto("/examples/phone-search");
    await hydrated(page);
    const example = page.getByRole("region", {
      name: "Phone search sheet example",
    });

    await example.getByRole("button", { name: "Shops 3 places" }).click();
    await expect(
      example.getByRole("button", { name: "Clear Shops" }),
    ).toBeVisible();
    await example
      .getByRole("button", { name: /Bookshop/ })
      .first()
      .click();
    await expect(
      example.getByRole("heading", { level: 2, name: "Bookshop" }),
    ).toBeVisible();
    await example.getByRole("button", { name: "Next image" }).click();
    await expect(example.getByText("Image 2 of 3")).toBeVisible();

    // The sheet grows to the full detent from the toolbar.
    const sheet = example.getByRole("complementary", { name: "Bookshop" });
    const half = await sheet.boundingBox();
    await example
      .getByRole("group", { name: "Sheet" })
      .getByRole("radio", { name: "Full" })
      .click();
    await expect
      .poll(async () => (await sheet.boundingBox())?.height ?? 0)
      .toBeGreaterThan((half?.height ?? 0) + 50);
    expect(await axeViolations(page)).toEqual([]);

    await example.getByRole("button", { name: "Back to the list" }).click();
    await example.getByRole("button", { name: "Clear Shops" }).click();
    await example
      .getByRole("searchbox", { name: "Search Riverside Centre" })
      .fill("bus");
    await expect(example.getByText("1 place")).toBeVisible();
  });
});

test.describe("kiosk directory example", () => {
  test("browse a category, read a place, take the route and send it, then rest", async ({
    page,
  }) => {
    await page.goto("/examples/kiosk-directory");
    await hydrated(page);
    const example = page.getByRole("region", {
      name: "Kiosk directory example",
    });

    await example.getByRole("button", { name: "Shops 3 places" }).click();
    await example
      .getByRole("button", { name: /Bookshop/ })
      .first()
      .click();
    await expect(
      example.getByRole("heading", { level: 2, name: "Bookshop" }),
    ).toBeVisible();
    await example.getByRole("button", { name: "Take me there" }).click();
    await expect(example.getByText("Head towards the atrium")).toBeVisible();
    await example.getByRole("button", { name: "Send to my phone" }).click();
    const dialog = page.getByRole("dialog", {
      name: "Take the route with you",
    });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("4821")).toBeVisible();
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(dialog).toBeHidden();
    expect(await axeViolations(page)).toEqual([]);

    await example.getByRole("button", { name: "Start over" }).click();
    await example.getByRole("button", { name: "Touch to start" }).click();
    await expect(
      example.getByRole("button", { name: "Shops 3 places" }),
    ).toBeVisible();
  });
});

test.describe("component reference", () => {
  const total = componentIndex.components.length;

  test("the index searches, filters by lane, and previews each component live but inert", async ({
    page,
  }) => {
    await page.goto("/components");
    await hydrated(page);
    await expect(page.getByText(`${total} of ${total} shown`)).toBeVisible();

    // A preview mounts as its card comes near, and stays out of the
    // accessibility tree: real controls inside, none reachable.
    const first = page.locator(".site-preview").first();
    await first.scrollIntoViewIfNeeded();
    await expect(first).toHaveAttribute("aria-hidden", "true");
    await expect(first).toHaveAttribute("inert", "");
    await expect(first.locator("button, input, a").first()).toBeAttached();
    await expect(first.getByRole("button")).toHaveCount(0);

    const search = page.getByRole("searchbox", { name: "Search components" });
    await search.fill("otp");
    await expect(page.getByText(`1 of ${total} shown`)).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open OTPInput" }),
    ).toBeVisible();
    await search.fill("zzzz");
    await expect(page.getByText("No component matches")).toBeVisible();
    await search.fill("");

    const platform = componentIndex.components.filter(
      (component) => component.lane === "platform-form-factor",
    );
    await page
      .getByRole("group", { name: "Lanes" })
      .getByRole("button", {
        name: componentIndex.lanes["platform-form-factor"],
      })
      .click();
    await expect(
      page.getByText(`${platform.length} of ${total} shown`),
    ).toBeVisible();
    for (const component of platform) {
      await expect(
        page.getByRole("link", { name: `Open ${component.name}` }),
      ).toBeVisible();
    }
    await page
      .getByRole("group", { name: "Lanes" })
      .getByRole("button", { name: "All" })
      .click();
    await expect(page.getByText(`${total} of ${total} shown`)).toBeVisible();
  });

  test("the sidebar and the neighbour links move between components in the page", async ({
    page,
  }) => {
    await page.goto("/components");
    await hydrated(page);
    await page.evaluate(() => {
      (window as unknown as { sameDocument: boolean }).sameDocument = true;
    });
    const sidebar = page.getByRole("complementary", { name: "Components" });
    await sidebar.getByRole("link", { name: "Tree" }).click();
    await expect(page).toHaveURL(/\/components\/tree$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tree");
    await expect(page.locator("main#main")).toBeFocused();
    await expect(sidebar.getByRole("link", { name: "Tree" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    const neighbours = page.getByRole("navigation", {
      name: "Neighbouring components",
    });
    const previous = neighbours.getByRole("link", { name: /^← / });
    const name = ((await previous.textContent()) ?? "").replace("← ", "");
    await previous.click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    expect(
      await page.evaluate(
        () => (window as unknown as { sameDocument?: boolean }).sameDocument,
      ),
    ).toBe(true);
  });

  test("a page shows the examples' source, the three platforms' code and the props", async ({
    page,
  }) => {
    await page.goto("/components/button");
    await hydrated(page);
    await expect(
      page.getByRole("region", { name: "button.tsx" }),
    ).toContainText("export const demos");
    await page.getByRole("tab", { name: "SwiftUI" }).click();
    await expect(
      page.getByRole("region", { name: "Button.swift" }),
    ).toContainText("KozmosButton");
    await page.getByRole("tab", { name: "Compose" }).click();
    await expect(page.getByRole("region", { name: "Button.kt" })).toBeVisible();

    const props = page.getByRole("table", { name: "Button props" });
    const variant = props.getByRole("row").filter({
      has: page.getByRole("cell", { name: "variant", exact: true }),
    });
    await expect(variant).toContainText("default");
    await expect(
      page.getByRole("table", { name: "AdaptiveMapShell props" }),
    ).toHaveCount(0);
  });

  test("the demos respond: the tree selects, the gallery turns, the island appears on request", async ({
    page,
  }) => {
    // The demos' source is on the page too (the "Examples" code tab), so the
    // words a demo shows are looked for among the demos only.
    const demos = () => page.locator(".site-demos");
    await page.goto("/components/tree");
    await hydrated(page);
    await demos()
      .getByRole("treeitem", { name: /Bookshop/ })
      .click();
    await expect(demos().getByText("Selected: Bookshop")).toBeVisible();

    await page.goto("/components/poi-media-gallery");
    await hydrated(page);
    await demos().getByRole("button", { name: "Next image" }).first().click();
    await expect(
      demos().getByText("Showing the counter with a stack of books."),
    ).toBeVisible();

    await page.goto("/components/dynamic-island");
    await hydrated(page);
    const island = page.getByText("3 min to the bookshop", { exact: true });
    await expect(island).toHaveCount(0);
    await demos().getByRole("button", { name: "Show the island" }).click();
    await expect(island).toBeVisible();
    await demos().getByRole("button", { name: "Hide the island" }).click();
    await expect(island).toHaveCount(0);
  });
});

// Every component page, once, in one browser: the sampled pages above run in
// all three. Each page must answer, name itself, show a live example, pass
// axe and log nothing.
test.describe("every component page", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "one browser walks all the pages",
  );

  for (const { slug, name } of componentIndex.components) {
    test(`/components/${slug} shows ${name} live and passes axe`, async ({
      page,
    }) => {
      const errors = collectErrors(page);
      const response = await page.goto(`/components/${slug}`);
      expect(response?.status()).toBe(200);
      await hydrated(page);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
      const stage = page.locator(".site-demo-stage").first();
      await expect(stage).toBeVisible();
      expect(
        await stage.evaluate((element) => element.childElementCount),
      ).toBeGreaterThan(0);
      await expect(page.getByRole("tab", { name: "SwiftUI" })).toBeVisible();
      await scrolled(page);
      expect(await axeViolations(page)).toEqual([]);
      // The gallery's second example asks for an image that does not exist,
      // on purpose; the browser logs that request and nothing else may fail.
      expect(
        errors.filter((error) => !error.includes("does-not-exist.svg")),
      ).toEqual([]);
    });
  }
});
