import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { contrastRatio, formatRatio, parseColour } from "../src/lib/contrast";

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

/** The contrast contract the colour page measures, as the generator copied it. */
const contrastContract = JSON.parse(
  readFileSync(
    new URL("../src/generated/contrast-contract.json", import.meta.url),
    "utf8",
  ),
) as { pairs: unknown[] };

const pages = [
  { path: "/", title: "The design system for the Pointr SDK" },
  { path: "/get-started", title: "Get started" },
  { path: "/examples", title: "Examples" },
  { path: "/examples/account-settings", title: "Account settings" },
  { path: "/examples/venue-explorer", title: "Venue explorer" },
  { path: "/examples/wayfinding", title: "Wayfinding" },
  { path: "/examples/phone-search", title: "Phone search sheet" },
  { path: "/examples/kiosk-directory", title: "Kiosk directory" },
  { path: "/examples/sign-in", title: "Sign in" },
  { path: "/examples/dashboard", title: "Operations dashboard" },
  { path: "/examples/booking", title: "Room booking" },
  { path: "/examples/notifications", title: "Notifications inbox" },
  { path: "/examples/onboarding", title: "First-run onboarding" },
  { path: "/examples/states", title: "Loading, empty, error, offline" },
  { path: "/examples/feedback-survey", title: "Feedback survey" },
  { path: "/examples/saved-places", title: "Saved places" },
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
 * one that has gone away, so the gap gets closed when Kozmos fixes it. An
 * entry may cover only some nodes (`only`) or only one theme (`theme`).
 */
type KnownEntry = { id: string; only?: RegExp; theme?: "light" | "dark" };
type KnownViolation = string | KnownEntry;

/** GAP-17: AdaptiveMapShell's panel, an <aside> nested in the page's main. */
const SHELL_PANEL: KnownEntry = {
  id: "landmark-complementary-is-top-level",
  only: /<aside[^>]*class="[^"]*kozmos-surface-/,
};

/** Not a gap: a Sidebar is an aside by nature, shown inside a page's main. */
const SIDEBAR: KnownEntry = {
  id: "landmark-complementary-is-top-level",
  only: /data-slot="sidebar"/,
};

const knownViolations: Record<string, readonly KnownViolation[]> = {
  "/examples/venue-explorer": [SHELL_PANEL],
  "/examples/wayfinding": [SHELL_PANEL],
  "/examples/phone-search": [SHELL_PANEL],
  "/examples/dashboard": [SIDEBAR],
  // The adaptive tile's shell.
  "/": [SHELL_PANEL],
  "/components/adaptive-map-shell": [
    SHELL_PANEL,
    // GAP-28: SearchBar's search landmark cannot be named; three shells, three.
    { id: "landmark-unique", only: /role="search"/ },
  ],
  "/components/search-bar": [{ id: "landmark-unique", only: /role="search"/ }],
  "/components/sidebar": [
    SIDEBAR,
    // GAP-30: Sidebar's navigation cannot be named; the page's own has one too.
    { id: "landmark-unique", only: /sidebar-navigation/ },
  ],
  "/components/alert": [
    // GAP-31: the warning text reads 4.29:1 on the card, in the light theme.
    { id: "color-contrast", only: /border-warning/, theme: "light" },
    // GAP-12: AlertTitle is always an h5, under the demo card's h3.
    { id: "heading-order", only: /<h5/ },
  ],
  "/components/input": [
    { id: "color-contrast", only: /kozmos-field-warning/, theme: "light" },
  ],
  // GAP-31 again: the alert emotion as an outlined Tag's text.
  "/components/tag": [
    { id: "color-contrast", only: /kz-emotion-text/, theme: "light" },
  ],
  "/components/date-picker": [
    { id: "color-contrast", only: /kozmos-field-warning/, theme: "light" },
  ],
  // GAP-45: the first brand variant's 600 reads 4.21:1 on the dark page, and
  // the token-override example re-points the theme's 600 to it.
  "/components/theme-provider": [
    { id: "color-contrast", only: /kozmos-text-primary/, theme: "dark" },
  ],
};

async function axeViolations(page: Page) {
  // From the top of the page: scrolled, whatever passes under the sticky
  // header counts as covered, and axe's target-size rule then fails the
  // links there, which a visitor simply scrolls back to.
  await page.evaluate(() => window.scrollTo(0, 0));
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
  const theme = await page.evaluate(
    () => document.documentElement.dataset.theme,
  );
  const known = (knownViolations[new URL(page.url()).pathname] ?? [])
    .map(
      (entry): KnownEntry =>
        typeof entry === "string" ? { id: entry } : entry,
    )
    .filter((entry) => !entry.theme || entry.theme === theme);
  // A known violation covers a rule on the page, or only the nodes it names.
  const isKnown = (violation: (typeof results.violations)[number]) =>
    known.some(
      ({ id, only }) =>
        id === violation.id &&
        (!only ||
          violation.nodes.every((node) =>
            only.test(`${node.target.join(" ")} ${node.html}`),
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

/**
 * The site's and the examples' CSS that does not apply: a declaration a
 * Kozmos rule outranks does nothing, and nothing says so. Kozmos's utilities
 * are scoped (GAP-04), and so is its preflight, which zeroes the border of
 * every box inside the provider (GAP-52). Every site rule is added again with
 * one ID's more specificity, which puts it above any Kozmos rule and keeps
 * the site's rules in their own order among themselves; a longhand that
 * changes on an element the rule matches was losing. Declarations are read
 * as written, so a shorthand holding var() — `border: var(--w) solid
 * var(--c)` — is measured through its longhands, which the CSSOM leaves empty
 * in the rule. Rules for states (:hover, :focus…) are left out. A loss can
 * move the layout, and then a percentage size elsewhere reads differently
 * too: the first line of a failure is the cause.
 */
async function overriddenSiteCss(page: Page) {
  return page.evaluate(() => {
    const BOOST = ":not(#site-css-check)";
    const STATE =
      /:(hover|focus|focus-visible|focus-within|active|empty|checked)/;
    // Splits at a character outside brackets and strings.
    const split = (text: string, separator: string) => {
      const parts: string[] = [];
      let depth = 0;
      let quote = "";
      let start = 0;
      for (let index = 0; index < text.length; index += 1) {
        const char = text[index];
        if (quote) {
          if (char === quote) quote = "";
        } else if (char === '"' || char === "'") quote = char;
        else if (char === "(" || char === "[") depth += 1;
        else if (char === ")" || char === "]") depth -= 1;
        else if (char === separator && depth === 0) {
          parts.push(text.slice(start, index));
          start = index + 1;
        }
      }
      parts.push(text.slice(start));
      return parts.map((part) => part.trim()).filter(Boolean);
    };
    // Where a selector's pseudo-element starts, outside brackets.
    const pseudoAt = (selector: string) => {
      let depth = 0;
      for (let index = 0; index < selector.length - 1; index += 1) {
        const char = selector[index];
        if (char === "(" || char === "[") depth += 1;
        else if (char === ")" || char === "]") depth -= 1;
        else if (depth === 0 && char === ":" && selector[index + 1] === ":")
          return index;
      }
      return -1;
    };
    const longhands = (property: string, value: string) => {
      const probe = document.createElement("div").style;
      probe.setProperty(property, value);
      return Array.from(probe);
    };
    type Declared = { property: string; value: string; longhands: string[] };
    const targets: {
      selector: string;
      match: string;
      pseudo: string | null;
      declared: Declared[];
    }[] = [];
    const boosted = (list: CSSRuleList): string[] => {
      const out: string[] = [];
      for (const rule of Array.from(list)) {
        if (rule instanceof CSSStyleRule) {
          const selector = rule.selectorText;
          if (!/\.(site|ex)-/.test(selector) || STATE.test(selector)) continue;
          const declared = split(rule.style.cssText, ";")
            .map((declaration) => {
              const colon = declaration.indexOf(":");
              return {
                property: declaration.slice(0, colon).trim(),
                value: declaration
                  .slice(colon + 1)
                  .replace(/!\s*important\s*$/i, "")
                  .trim(),
              };
            })
            .filter(({ property }) => property && !property.startsWith("--"))
            .map((entry) => ({
              ...entry,
              longhands: longhands(entry.property, entry.value),
            }));
          if (declared.length === 0) continue;
          const complexes = split(selector, ",");
          const raised = complexes.map((complex) => {
            const at = pseudoAt(complex);
            return at === -1
              ? `${complex}${BOOST}`
              : `${complex.slice(0, at)}${BOOST}${complex.slice(at)}`;
          });
          out.push(`${raised.join(", ")} { ${rule.style.cssText} }`);
          for (const complex of complexes) {
            const at = pseudoAt(complex);
            targets.push({
              selector,
              match: at === -1 ? complex : complex.slice(0, at),
              pseudo: at === -1 ? null : complex.slice(at),
              declared,
            });
          }
        } else if (rule instanceof CSSKeyframesRule) {
          continue;
        } else if ("cssRules" in rule) {
          // @media, @supports, @container: kept, with their conditions.
          const inner = boosted((rule as CSSGroupingRule).cssRules);
          const header = rule.cssText.slice(0, rule.cssText.indexOf("{"));
          if (inner.length > 0) out.push(`${header} { ${inner.join("\n")} }`);
        }
      }
      return out;
    };
    const text: string[] = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        text.push(...boosted(sheet.cssRules));
      } catch {
        // A sheet from another origin cannot be read; the site has none.
      }
    }
    const measured = targets.flatMap((target) =>
      Array.from(document.querySelectorAll(target.match)).map((element) => ({
        element,
        ...target,
      })),
    );
    const read = () =>
      measured.map(({ element, pseudo, declared }) => {
        const style = getComputedStyle(element, pseudo);
        return declared.map((entry) =>
          entry.longhands.map((name) => style.getPropertyValue(name)),
        );
      });
    // A change that starts a transition reads as its first frame; finished,
    // it reads as the value the rule sets.
    const settle = () => {
      for (const animation of document.getAnimations()) {
        if (animation instanceof CSSTransition) animation.finish();
      }
    };
    const before = read();
    const raised = document.createElement("style");
    raised.textContent = text.join("\n");
    document.head.append(raised);
    settle();
    const after = read();
    raised.remove();
    settle();
    const lost = new Map<string, string>();
    measured.forEach(({ selector, declared }, index) => {
      declared.forEach(({ property, value, longhands: names }, at) => {
        names.forEach((name, position) => {
          const was = before[index]?.[at]?.[position];
          const meant = after[index]?.[at]?.[position];
          const key = `${selector} { ${property}: ${value} }`;
          if (was !== meant && !lost.has(key))
            lost.set(key, `${key} — ${name} is ${was}, not ${meant}`);
        });
      });
    });
    return [...lost.values()];
  });
}

/**
 * Edges a rounded box cuts short: a bordered element in the corner of a box
 * that clips, drawn with a smaller radius than the box clips at. The clip
 * takes its border off along the curve and leaves the corner unedged —
 * hidden by a shadow in the light theme, plain on a dark page. Content in an
 * inert miniature is a picture of a page that is checked itself.
 */
async function clippedEdges(page: Page) {
  const found = await page.evaluate(() => {
    const corners = [
      ["TopLeft", "Top", "Left", "top-left"],
      ["TopRight", "Top", "Right", "top-right"],
      ["BottomLeft", "Bottom", "Left", "bottom-left"],
      ["BottomRight", "Bottom", "Right", "bottom-right"],
    ] as const;
    type Side = "Top" | "Right" | "Bottom" | "Left";
    const width = (style: CSSStyleDeclaration, side: Side) =>
      parseFloat(style.getPropertyValue(`border-${side.toLowerCase()}-width`));
    const edged = (style: CSSStyleDeclaration, side: Side) => {
      const name = side.toLowerCase();
      const colour = style.getPropertyValue(`border-${name}-color`);
      return (
        width(style, side) > 0 &&
        !["none", "hidden"].includes(
          style.getPropertyValue(`border-${name}-style`),
        ) &&
        colour !== "transparent" &&
        !/,\s*0\)$/.test(colour)
      );
    };
    const radius = (style: CSSStyleDeclaration, corner: string) =>
      parseFloat(
        style.getPropertyValue(
          `border-${corner.replace(/([A-Z])/g, (letter) => `-${letter.toLowerCase()}`).slice(1)}-radius`,
        ),
      );
    const describe = (element: Element) => {
      const classes = Array.from(element.classList).filter((name) =>
        /^(site|ex)-/.test(name),
      );
      const role = element.getAttribute("role");
      return `${element.localName}${classes.map((name) => `.${name}`).join("")}${role ? `[role=${role}]` : ""}`;
    };
    const lines = new Set<string>();
    for (const box of Array.from(document.querySelectorAll("body *"))) {
      if (box.closest("[inert]")) continue;
      const style = getComputedStyle(box);
      if (style.overflowX === "visible" && style.overflowY === "visible")
        continue;
      const rect = box.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const inner = {
        Top: rect.top + width(style, "Top"),
        Right: rect.right - width(style, "Right"),
        Bottom: rect.bottom - width(style, "Bottom"),
        Left: rect.left + width(style, "Left"),
      };
      for (const [corner, vertical, horizontal, name] of corners) {
        const clip =
          radius(style, corner) -
          Math.max(width(style, vertical), width(style, horizontal));
        if (clip < 2) continue;
        for (const child of Array.from(box.querySelectorAll("*"))) {
          const at = child.getBoundingClientRect();
          if (at.width === 0 || at.height === 0) continue;
          const key = {
            Top: at.top,
            Right: at.right,
            Bottom: at.bottom,
            Left: at.left,
          };
          if (
            Math.abs(key[vertical] - inner[vertical]) > 1.5 ||
            Math.abs(key[horizontal] - inner[horizontal]) > 1.5
          )
            continue;
          const own = getComputedStyle(child);
          if (own.visibility === "hidden") continue;
          if (!edged(own, vertical) && !edged(own, horizontal)) continue;
          if (radius(own, corner) + 1 < clip)
            lines.add(`${describe(box)} cuts ${describe(child)} at ${name}`);
        }
      }
    }
    return [...lines];
  });
  const known = knownClippedEdges[new URL(page.url()).pathname] ?? [];
  return [
    ...found.filter((line) => !known.some((entry) => entry.test(line))),
    ...known
      .filter((entry) => !found.some((line) => entry.test(line)))
      .map((entry) => `${entry} no longer occurs: close its gap in GAPS.md`),
  ];
}

/**
 * How far the first place in a map shell's list sits inside the panel's
 * edge. POIResultList brings no padding; Kozmos's own panels pad by 16px.
 */
async function listInset(page: Page) {
  const card = page.locator("aside article").first();
  await expect(card).toBeVisible();
  return card.evaluate((article) => {
    const panel = article.closest("aside")?.getBoundingClientRect();
    const own = article.getBoundingClientRect();
    if (!panel) return 0;
    return Math.round(
      Math.min(
        own.left - panel.left,
        own.top - panel.top,
        panel.right - own.right,
      ),
    );
  });
}

/** Clipped edges that come from inside Kozmos, recorded in GAPS.md. */
const knownClippedEdges: Record<string, readonly RegExp[]> = {
  // GAP-53: the sheet keeps square, bordered bottom corners on a phone's
  // rounded screen.
  "/examples/phone-search": [
    /^div\.ex-phone cuts aside at bottom-(left|right)$/,
  ],
};

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
        // The site's own CSS all applies: none of it is outranked by Kozmos.
        expect(await overriddenSiteCss(page)).toEqual([]);
        // No rounded box cuts the edge of what sits in its corner.
        expect(await clippedEdges(page)).toEqual([]);
        expect(errors).toEqual([]);
      });
    }
  });
}

// 320 CSS pixels is the width WCAG's reflow criterion (1.4.10) measures at.
test.describe("on a narrow phone", () => {
  test.use({ viewport: { width: 320, height: 700 } });

  for (const { path } of pages) {
    test(`${path} has no sideways scroll and no clipped edges`, async ({
      page,
    }) => {
      await page.goto(path);
      await scrolled(page);
      // Narrow, a map shell turns its panel into a bottom sheet.
      expect(await clippedEdges(page)).toEqual([]);
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
    await focusStaysOnContent(page);
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
    await focusStaysOnContent(page);
  });
});

// An address that names no page, and one that names no component: the
// component pages are one route each, so the second matches the not-found
// route in the browser as it did when the 404 page was pre-rendered.
for (const address of ["/no-such-page", "/components/no-such-component"]) {
  test(`${address} answers 404 with the not-found page`, async ({ page }) => {
    const errors = collectErrors(page);
    const response = await page.goto(address);
    expect(response?.status()).toBe(404);
    await hydrated(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Page not found",
    );
    expect(await axeViolations(page)).toEqual([]);
    // The browser logs the page's own 404 response; nothing else may fail.
    expect(
      errors.filter(
        (error) => !(error.includes("404") && error.includes(address)),
      ),
    ).toEqual([]);
  });
}

test("the theme choice is kept across a reload", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await hydrated(page);
  // The header's theme is a menu behind one small button.
  await page.getByRole("button", { name: "Theme: System" }).click();
  await page.getByRole("menuitemradio", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Theme: Dark" })).toBeVisible();
  await page.reload();
  await hydrated(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(() => window.localStorage.getItem("kozmos-site-theme")),
  ).toBe("dark");
  // System follows the device again.
  await page.getByRole("button", { name: "Theme: Dark" }).click();
  await page.getByRole("menuitemradio", { name: "System" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
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
  // Across the site's two frames, the new page's content still takes focus.
  await expect(page.locator("main#main")).toBeFocused();
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
  // Painted on top, not only placed on screen: the sticky header once drew
  // over it at the same layer.
  expect(await drawnOnTop(skip)).toBe(true);
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("the skip link shows over the header on a phone too", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "Tab does not reach links in WebKit by default",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/components/button");
  await hydrated(page);
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  expect(await drawnOnTop(skip)).toBe(true);
});

/** Whether an element is what the page paints at its own centre. */
async function drawnOnTop(element: Locator) {
  return element.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const hit = document.elementFromPoint(
      box.left + box.width / 2,
      box.top + box.height / 2,
    );
    return hit !== null && (hit === node || node.contains(hit));
  });
}

/**
 * Focus on the new page's content, and still there once a closing drawer
 * or dialog has finished animating, which is when Radix gives focus back to
 * the button that opened it.
 */
async function focusStaysOnContent(page: Page) {
  await expect(page.locator("main#main")).toBeFocused();
  await page.waitForTimeout(600);
  await expect(page.locator("main#main")).toBeFocused();
}

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
    // The scene's own switches sit in a strip inside its frame.
    const settings = page.getByRole("group", { name: "Scene settings" });
    await expect(settings.getByRole("switch", { name: "Dark" })).toBeChecked();
    await settings.getByRole("switch", { name: "Dark" }).click();
    await expect(scene).toHaveAttribute("data-theme", "light");
    await settings.getByRole("switch", { name: "Right to left" }).click();
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

  test("the scene's frame keeps the map's corners, and its bar is edged round them", async ({
    page,
  }) => {
    await page.goto("/");
    await hydrated(page);
    const edges = await page
      .getByRole("group", { name: "Scene settings" })
      .evaluate((bar) => {
        const frame = bar.parentElement!;
        const map = frame.querySelector('[role="region"]')!;
        const own = getComputedStyle(bar);
        return {
          last: frame.lastElementChild === bar,
          frame: getComputedStyle(frame).borderStartStartRadius,
          map: getComputedStyle(map).borderStartStartRadius,
          border: own.borderBlockEndWidth,
          start: own.borderEndStartRadius,
          end: own.borderEndEndRadius,
        };
      });
    // The frame clips its corners round. A wider curve than the map's own
    // takes the map's edge off at the top; a square-cornered bar's border
    // stops where the curve starts at the bottom. Both leave a corner
    // unedged, plain on a dark page, where the frame's shadow does not show.
    expect(edges.frame).not.toBe("0px");
    expect(edges.frame).toBe(edges.map);
    expect(edges.last).toBe(true);
    expect(edges.border).not.toBe("0px");
    expect(edges.start).toBe(edges.frame);
    expect(edges.end).toBe(edges.frame);
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
      name: "Operations dashboard example, shown small",
    });
    await expect(miniature).toBeVisible();
    await expect(miniature.locator("[inert]")).toHaveCount(1);
    await expect(miniature.locator("input[type=search]")).toHaveCount(1);
    await expect(miniature.getByRole("searchbox")).toHaveCount(0);
  });
});

/**
 * What is painted inside the sticky header once each positioned, stacked
 * element of the page has been scrolled under it: anything that is not the
 * header's own is drawn over it.
 */
async function paintedOverHeader(page: Page) {
  return page.evaluate(async () => {
    const header = document.querySelector<HTMLElement>(
      'header[data-slot="navbar"]',
    );
    if (!header) return ["no header"];
    const stacked = [
      ...document.querySelectorAll<HTMLElement>("main *"),
    ].filter((element) => {
      const style = getComputedStyle(element);
      return style.position !== "static" && Number(style.zIndex) > 0;
    });
    const found = new Set<string>();
    for (const element of stacked) {
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, Math.max(0, top - 24));
      await new Promise((resolve) => setTimeout(resolve, 20));
      const box = header.getBoundingClientRect();
      for (let x = 4; x < window.innerWidth; x += 16) {
        for (const y of [
          box.top + 3,
          box.top + box.height / 2,
          box.bottom - 3,
        ]) {
          const hit = document.elementFromPoint(x, y);
          if (hit && !header.contains(hit)) {
            found.add(
              `${hit.tagName.toLowerCase()} "${(hit.getAttribute("aria-label") ?? hit.textContent ?? "").trim().slice(0, 30)}"`,
            );
          }
        }
      }
    }
    window.scrollTo(0, 0);
    return [...found];
  });
}

/** What the logo shows, and so its name and the home link's (src/lib/site.ts). */
const LOGO = "Kozmos UI Design Systems";

/**
 * The artwork a logo Box is painted through, decoded as the browser would
 * decode it: an SVG that is not well-formed decodes to nothing, and a mask
 * made of it paints nothing, without an error anywhere. The build inlines a
 * small SVG into the stylesheet, so the artwork is known by its proportions,
 * not by its file's name.
 */
async function drawnShape(logo: Locator) {
  return logo.evaluate(async (element) => {
    const style = getComputedStyle(element);
    const mask =
      style.maskImage || style.getPropertyValue("-webkit-mask-image");
    const url = mask.match(/url\("?([^")]+)"?\)/)?.[1];
    if (!url) return { decoded: false, artwork: 0, height: 0, ratio: 0 };
    const image = new Image();
    image.src = url;
    const decoded = await image.decode().then(
      () => true,
      () => false,
    );
    const box = element.getBoundingClientRect();
    return {
      decoded,
      artwork: image.naturalWidth / image.naturalHeight,
      height: Math.round(box.height),
      ratio: box.width / box.height,
    };
  });
}

test.describe("the header", () => {
  test("shows the logo, named by the words it shows, and it takes you home", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/components");
    await hydrated(page);
    const home = page.getByRole("banner").getByRole("link", { name: LOGO });
    const logo = home.getByRole("img", { name: LOGO });
    await expect(logo).toBeVisible();
    // The full logo, at its own proportions (src/brand/kozmos-logo.svg).
    const shape = await drawnShape(logo);
    expect(shape.decoded).toBe(true);
    expect(shape.artwork).toBeCloseTo(1605.6736 / 442.27, 1);
    expect(shape.height).toBe(40);
    expect(shape.ratio).toBeCloseTo(1605.6736 / 442.27, 1);
    await home.click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "The design system for the Pointr SDK",
    );
  });

  test("shows the logo's K alone on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await hydrated(page);
    const logo = page
      .getByRole("banner")
      .getByRole("link", { name: LOGO })
      .getByRole("img", { name: LOGO });
    const shape = await drawnShape(logo);
    expect(shape.decoded).toBe(true);
    expect(shape.artwork).toBeCloseTo(272.5726 / 293.54, 1);
    expect(shape.height).toBe(32);
    expect(shape.ratio).toBeCloseTo(272.5726 / 293.54, 1);
  });

  test("keeps the logo visible in a high-contrast mode", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Chromium is the browser that emulates forced colours",
    );
    await page.emulateMedia({ forcedColors: "active" });
    await page.goto("/");
    await hydrated(page);
    // Forced colours repaint every background with the page's own colour;
    // the logo, a painted background, must take the text colour instead.
    const colours = await page
      .getByRole("banner")
      .getByRole("img", { name: LOGO })
      .evaluate((logo) => ({
        logo: getComputedStyle(logo).backgroundColor,
        header: getComputedStyle(logo.closest("header") ?? document.body)
          .backgroundColor,
      }));
    expect(colours.logo).not.toBe(colours.header);
  });

  test("gives the browser tab the logo's K", async ({ page }) => {
    await page.goto("/");
    const icons = await page
      .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
      .evaluateAll((links) =>
        links.map(
          (link) => `${link.getAttribute("rel")} ${link.getAttribute("href")}`,
        ),
      );
    expect(icons).toEqual([
      "icon /favicon.ico",
      "icon /favicon.svg",
      "apple-touch-icon /apple-touch-icon.png",
    ]);
    for (const [href, type] of [
      ["/favicon.ico", "image/x-icon"],
      ["/favicon.svg", "image/svg+xml"],
      ["/apple-touch-icon.png", "image/png"],
    ]) {
      const response = await page.request.get(href);
      expect(response.status(), href).toBe(200);
      expect(response.headers()["content-type"], href).toBe(type);
    }
    // Each one draws: decoded by the browser, not only served.
    const decoded = await page.evaluate(
      (hrefs) =>
        Promise.all(
          hrefs.map(async (href) => {
            const image = new Image();
            image.src = href;
            return image.decode().then(
              () => image.naturalWidth > 0,
              () => false,
            );
          }),
        ),
      ["/favicon.ico", "/favicon.svg", "/apple-touch-icon.png"],
    );
    expect(decoded).toEqual([true, true, true]);
  });

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 1024, height: 768 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 360, height: 780 },
  ]) {
    test(`is one row at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await hydrated(page);
      const height = await page
        .getByRole("banner")
        .evaluate((element) => element.getBoundingClientRect().height);
      // The Navbar's own minimum is 4rem; one row of controls fits inside it.
      expect(height).toBeLessThanOrEqual(66);
    });
  }

  for (const [path, width] of [
    ["/", 1280],
    ["/", 390],
    ["/components/map-overlay", 1280],
    ["/examples/kiosk-directory", 1280],
  ] as const) {
    test(`stays on top of ${path} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path);
      await scrolled(page);
      expect(await paintedOverHeader(page)).toEqual([]);
    });
  }
});

test("on a phone, the site's pages are in the header's drawer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // A page with no known axe findings: behind an open drawer the page is
  // hidden, and so would be the findings the home page is known for.
  await page.goto("/get-started");
  await hydrated(page);
  const banner = page.getByRole("banner");
  await expect(banner.getByRole("link", { name: "Examples" })).toBeHidden();
  await banner.getByRole("button", { name: "Site menu" }).click();
  const drawer = page.getByRole("dialog", { name: "Kozmos" });
  await expect(drawer).toBeVisible();
  // Open, the drawer is the page: its navigation is the only one exposed.
  await hydrated(page);
  expect(await axeViolations(page)).toEqual([]);
  await drawer.getByRole("link", { name: "Examples" }).click();
  await expect(page).toHaveURL(/\/examples$/);
  await expect(drawer).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Examples");
  await focusStaysOnContent(page);
});

test.describe("home layout", () => {
  test("the hero offers two next steps, and the examples come right after it", async ({
    page,
  }) => {
    await page.goto("/");
    await hydrated(page);
    await expect(
      page.locator('section[aria-labelledby="home-title"] .site-actions a'),
    ).toHaveCount(2);
    await expect(
      page.locator("main .site-section-header h2").first(),
    ).toHaveText("Built from it");
  });

  test("the featured examples carry their short taglines, not their summaries", async ({
    page,
  }) => {
    await page.goto("/");
    await scrolled(page);
    const cards = page.locator(".site-example-card");
    await expect(cards).toHaveCount(3);
    for (const [title, tagline] of [
      ["Wayfinding", /^Choose a place, compare the quickest/],
      ["Phone search sheet", /^A phone’s map screen: search or browse/],
      ["Operations dashboard", /^The venues console: facts across/],
    ] as const) {
      const card = cards.filter({ hasText: title });
      await expect(card.locator("p").filter({ hasText: tagline })).toHaveCount(
        1,
      );
      await expect(
        card.getByRole("link", { name: `Open ${title}` }),
      ).toHaveAttribute("href", /\/examples\//);
    }
  });

  for (const width of [1280, 1024]) {
    test(`the featured examples' pictures share one shape, so their titles line up at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      await scrolled(page);
      const cards = await page
        .locator(".site-example-card")
        .evaluateAll((elements) =>
          elements.map((card) => ({
            top: card.getBoundingClientRect().top,
            picture:
              card.querySelector('[role="img"]')?.getBoundingClientRect()
                .height ?? 0,
            title: card.querySelector("h3")?.getBoundingClientRect().top ?? 0,
          })),
        );
      expect(cards).toHaveLength(3);
      // One row: a picture taller than its neighbours pushes its title down.
      const row = cards.filter(
        (card) => Math.abs(card.top - cards[0]!.top) < 1,
      );
      expect(row).toHaveLength(3);
      for (const card of row) {
        expect(card.picture).toBeGreaterThan(0);
        expect(Math.abs(card.picture - row[0]!.picture)).toBeLessThan(1);
        expect(Math.abs(card.title - row[0]!.title)).toBeLessThan(1);
      }
    });
  }

  test("every muted band has a hairline at each edge, the footer's rule under the last", async ({
    page,
  }) => {
    await page.goto("/");
    await hydrated(page);
    const edges = await page.evaluate(() => {
      const hairline = (element: Element | null) =>
        element?.getAttribute("data-orientation") === "horizontal" &&
        Math.round(element.getBoundingClientRect().height) === 1;
      const bands = Array.from(document.querySelectorAll(".site-band-muted"));
      return bands.map((band, index) => ({
        above: hairline(band.previousElementSibling),
        below:
          index === bands.length - 1
            ? band.nextElementSibling === null
            : hairline(band.nextElementSibling),
      }));
    });
    // In the dark theme a muted band's tint is 1.04:1 against the page. The
    // last band ends the page's content, and the footer's rule is its edge.
    expect(edges.length).toBeGreaterThan(0);
    expect(edges).toEqual(edges.map(() => ({ above: true, below: true })));
    await expect(
      page.getByRole("contentinfo").locator('[data-orientation="horizontal"]'),
    ).toHaveCount(1);
  });

  test("the checklist's link lands on the checks, in view", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await scrolled(page);
    await page.getByRole("link", { name: "What each check does" }).click();
    await expect(page).toHaveURL(/\/get-started#checks$/);
    const section = page.getByRole("region", {
      name: "What every pull request runs",
    });
    await expect(section).toBeInViewport();
    // Below the sticky header, not under it.
    const [top, header] = await Promise.all([
      section.evaluate((element) => element.getBoundingClientRect().top),
      page
        .getByRole("banner")
        .evaluate((element) => element.getBoundingClientRect().bottom),
    ]);
    expect(top).toBeGreaterThanOrEqual(header - 1);
    // Focus follows the link to the section, so Tab continues from there.
    await expect(section).toBeFocused();
  });

  for (const width of [1280, 1024]) {
    test(`every card grid ends on a full row at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      await scrolled(page);
      const lastRows = await page.evaluate(() => {
        const grids = [
          document.querySelector(".site-bento"),
          document.querySelector("[aria-labelledby] .site-example-card")
            ?.parentElement ?? null,
        ].filter((grid): grid is Element => grid !== null);
        return grids.map((grid) => {
          const cards = [...grid.children].map((card) =>
            card.getBoundingClientRect(),
          );
          const lastTop = Math.max(
            ...cards.map((card) => Math.round(card.top)),
          );
          const row = cards.filter((card) => Math.round(card.top) === lastTop);
          const used =
            Math.max(...row.map((card) => card.right)) -
            Math.min(...row.map((card) => card.left));
          return {
            grid: grid.className,
            share: +(used / grid.getBoundingClientRect().width).toFixed(2),
          };
        });
      });
      expect(lastRows.length).toBe(2);
      for (const row of lastRows)
        expect(row.share, row.grid).toBeGreaterThan(0.98);
    });
  }

  test("every section keeps its distance from the one before", async ({
    page,
  }) => {
    await page.goto("/");
    await scrolled(page);
    const tight = await page.evaluate(() =>
      [...document.querySelectorAll("main .site-section-header h2")]
        .map((heading) => {
          const top = heading.getBoundingClientRect().top;
          const above = [...document.querySelectorAll("main *")]
            .map((element) => element.getBoundingClientRect())
            .filter(
              (box) => box.height > 0 && box.width > 0 && box.bottom <= top + 1,
            )
            .reduce((bottom, box) => Math.max(bottom, box.bottom), 0);
          return { title: heading.textContent, space: Math.round(top - above) };
        })
        .filter((section) => section.space < 48),
    );
    expect(tight).toEqual([]);
  });

  test("the page stays within six screens on a laptop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await scrolled(page);
    const screens = await page.evaluate(
      () => document.documentElement.scrollHeight / window.innerHeight,
    );
    expect(screens).toBeLessThanOrEqual(6);
  });

  test("the brand snippet is never an empty override", async ({ page }) => {
    await page.goto("/");
    await scrolled(page);
    const code = await page
      .getByRole("region", { name: "Make it yours" })
      .locator("pre")
      .first()
      .textContent();
    expect(code).not.toMatch(/tokens=\{\{\s*\}\}/);
  });
});

/**
 * Design-system gaps, measured. Each test pins what Kozmos draws today, so
 * it fails the day Kozmos fixes the gap: that is the signal to change the
 * expectation to the fixed one and close the gap in GAPS.md. DS-HANDOFF.md
 * lists each fix and the test it flips.
 */
test.describe("design-system gaps, measured", () => {
  test("GAP-38: the map sheet's handle is 4px tall and its grip has no width", async ({
    page,
  }) => {
    await page.goto("/examples/phone-search");
    await hydrated(page);
    const size = await page
      .getByRole("slider", { name: "Panel height" })
      .evaluate((handle) => {
        const grip = handle
          .querySelector(".kozmos-map-sheet-grip")
          ?.getBoundingClientRect();
        return {
          height: Math.round(handle.getBoundingClientRect().height),
          gripWidth: grip ? Math.round(grip.width) : null,
        };
      });
    expect(size).toEqual({ height: 4, gripWidth: 0 });
  });

  test("GAP-52: the provider's preflight zeroes a caller's border on its own box", async ({
    page,
  }) => {
    await page.goto("/");
    await hydrated(page);
    const widths = await page.evaluate(() => {
      const rule = document.createElement("style");
      rule.textContent = ".site-gap-probe { border: 1px solid; }";
      document.head.append(rule);
      const inside = document.createElement("div");
      inside.className = "site-gap-probe";
      document.querySelector("main")?.append(inside);
      const outside = document.createElement("div");
      outside.className = "site-gap-probe";
      document.body.append(outside);
      const result = {
        inside: getComputedStyle(inside).borderTopWidth,
        outside: getComputedStyle(outside).borderTopWidth,
      };
      inside.remove();
      outside.remove();
      rule.remove();
      return result;
    });
    // The same rule, the same box: inside the provider its scoped preflight
    // wins at equal specificity; outside it, the rule applies.
    expect(widths).toEqual({ inside: "0px", outside: "1px" });
  });

  test("GAP-53: on a phone's rounded screen the sheet keeps square, bordered bottom corners", async ({
    page,
  }) => {
    await page.goto("/examples/phone-search");
    await hydrated(page);
    const sheet = await page.locator(".ex-phone aside").evaluate((aside) => {
      const own = getComputedStyle(aside);
      const screen = aside.closest(".ex-phone");
      return {
        screen: screen ? getComputedStyle(screen).borderEndStartRadius : "",
        corner: own.borderEndStartRadius,
        bottom: own.borderBlockEndWidth,
        side: own.borderInlineStartWidth,
      };
    });
    expect(sheet.screen).not.toBe("0px");
    expect({ ...sheet, screen: undefined }).toEqual({
      screen: undefined,
      corner: "0px",
      bottom: "1px",
      side: "1px",
    });
  });

  test("GAP-09: a link drawn as a button keeps its underline", async ({
    page,
  }) => {
    await page.goto("/");
    await hydrated(page);
    const line = await page
      .locator('section[aria-labelledby="home-title"] .site-actions a')
      .first()
      .evaluate((link) => getComputedStyle(link).textDecorationLine);
    expect(line).toBe("underline");
  });

  test("GAP-40: MapView does not isolate its overlays", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    const isolation = await page
      .getByRole("region", { name: "Illustrative terminal map" })
      .evaluate((map) => getComputedStyle(map).isolation);
    expect(isolation).toBe("auto");
  });

  test("GAP-42: a CardTitle's line height equals its font size", async ({
    page,
  }) => {
    await page.goto("/");
    await scrolled(page);
    const ratio = await page
      .locator(".site-tile h3")
      .first()
      .evaluate((title) => {
        const style = getComputedStyle(title);
        return parseFloat(style.lineHeight) / parseFloat(style.fontSize);
      });
    expect(ratio).toBe(1);
  });

  test("GAP-43: the Slider's thumb takes a touch only on its own 20px", async ({
    page,
  }) => {
    await page.goto("/");
    await scrolled(page);
    const thumb = page.getByRole("slider", { name: "Host width" });
    await thumb.scrollIntoViewIfNeeded();
    // 20px from its centre is inside a 44px target; today it is the track.
    const hit = await thumb.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const target = document.elementFromPoint(
        box.left + box.width / 2 + 20,
        box.top + box.height / 2,
      );
      return (
        target !== null && (target === element || element.contains(target))
      );
    });
    expect(hit).toBe(false);
  });

  test("GAP-03: a dark-mode visitor's page is drawn light until the scripts run", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    // No script file loads: only something inline, before the page's own
    // scripts, could set the theme before the first paint.
    await page.route("**/*.js", (route) => route.abort());
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // What the visitor sees is Kozmos's own surfaces, drawn light: a fix has
    // to reach the components, not only <html>.
    const background = await page
      .getByRole("banner")
      .evaluate((header) => getComputedStyle(header).backgroundColor);
    expect(background).toBe("rgb(255, 255, 255)");
  });

  test("GAP-41: at 320px the Navbar drops the header's tools to a second row", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");
    await hydrated(page);
    // The navigation slot keeps a 16rem basis beside the logo, which leaves
    // a 320px screen no room for both on one row, whatever the logo.
    const height = await page
      .getByRole("banner")
      .evaluate((element) => element.getBoundingClientRect().height);
    expect(height).toBeGreaterThan(90);
  });

  test("GAP-45: the first brand variant's 600 reads 4.20:1 on the dark page", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await hydrated(page);
    const [variant, background] = await page.evaluate(() =>
      [
        "--primitives-colors-theme-variant-1-600",
        "--primitives-colors-background-0",
      ].map((name) =>
        getComputedStyle(document.documentElement)
          .getPropertyValue(name)
          .trim(),
      ),
    );
    const [foreground, ground] = [
      parseColour(variant),
      parseColour(background),
    ];
    expect(foreground && ground).toBeTruthy();
    if (!foreground || !ground) return;
    // Text needs 4.5:1. The default ramp's 600 reads 6.17:1 here.
    expect(formatRatio(contrastRatio(foreground, ground))).toBe("4.20:1");
  });

  test("GAP-37: SearchBar keeps the browser's own clear button", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "the cancel button is a Blink and WebKit pseudo-element; WebKit's field is unstyled anyway (GAP-20)",
    );
    await page.goto("/components/search-bar");
    await hydrated(page);
    const field = page.locator(".site-demos").getByRole("searchbox").first();
    await field.fill("bookshop");
    // Hidden either way a stylesheet can hide it: display or appearance.
    const drawn = await field.evaluate((input) => {
      const style = getComputedStyle(input, "::-webkit-search-cancel-button");
      return style.display !== "none" && style.appearance !== "none";
    });
    expect(drawn).toBe(true);
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
    const pairs = contrastContract.pairs.length;
    await expect(
      page.getByText(`All ${pairs} pairs pass in both themes`),
    ).toBeVisible();
    const table = page.getByRole("table", { name: "Contrast contract" });
    await expect(table.getByRole("row")).toHaveCount(pairs + 1);
    // Each result says pass or fail in words, not only in colour.
    await expect(table.getByText(/· Pass$/)).toHaveCount(pairs * 2);
    await expect(table.getByText(/· Fail$/)).toHaveCount(0);
  });

  test("swatches, samples and shapes are edged, so white on white shows", async ({
    page,
  }) => {
    for (const [address, selector] of [
      ["/foundations/colour", ".site-swatch-colour"],
      ["/foundations/colour", ".site-pair-sample"],
      ["/foundations/layout", ".site-shape"],
    ] as const) {
      await page.goto(address);
      await hydrated(page);
      const widths = await page
        .locator(selector)
        .evaluateAll((elements) =>
          elements.map((element) => getComputedStyle(element).borderTopWidth),
        );
      expect(widths.length).toBeGreaterThan(0);
      expect(new Set(widths)).toEqual(new Set(["1px"]));
    }
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
  test("the list of places sits inside the panel's padding", async ({
    page,
  }) => {
    await page.goto("/examples/venue-explorer");
    await hydrated(page);
    await page
      .getByRole("region", { name: "Venue explorer example" })
      .getByRole("searchbox", { name: "Search Riverside Centre" })
      .fill("o");
    expect(await listInset(page)).toBeGreaterThanOrEqual(16);
    expect(await clippedEdges(page)).toEqual([]);
  });

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
  test("the list of places sits inside the panel's padding", async ({
    page,
  }) => {
    await page.goto("/examples/wayfinding");
    await hydrated(page);
    expect(await listInset(page)).toBeGreaterThanOrEqual(16);
    expect(await clippedEdges(page)).toEqual([]);
    // Back from the route options, focus returns to the list; focusing it
    // must not scroll its padding away.
    const example = page.getByRole("region", { name: "Wayfinding example" });
    await example
      .getByRole("button", { name: /Bookshop/ })
      .first()
      .click();
    await example.getByRole("button", { name: "Back" }).click();
    await expect(
      example.getByRole("region", { name: "Where to?" }),
    ).toBeFocused();
    expect(await listInset(page)).toBeGreaterThanOrEqual(16);
  });

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
  test("the list of places sits inside the sheet's padding", async ({
    page,
  }) => {
    await page.goto("/examples/phone-search");
    await hydrated(page);
    await page
      .getByRole("region", { name: "Phone search sheet example" })
      .getByRole("searchbox", { name: "Search Riverside Centre" })
      .fill("o");
    expect(await listInset(page)).toBeGreaterThanOrEqual(16);
    expect(await clippedEdges(page)).toEqual([]);
  });

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
    // Focus is on the attract screen, and the directory under it is inert:
    // nothing in it takes focus. (Playwright's role queries do not count
    // inert content as hidden, so this asks the field to take focus.)
    const touch = example.getByRole("button", { name: "Touch to start" });
    await expect(touch).toBeFocused();
    const field = example.getByRole("searchbox", { name: "Search the centre" });
    await field.evaluate((input) => input.focus());
    await expect(field).not.toBeFocused();
    await expect(touch).toBeFocused();
    await touch.click();
    await expect(
      example.getByRole("heading", { level: 2, name: "Riverside Centre" }),
    ).toBeFocused();
    await expect(
      example.getByRole("button", { name: "Shops 3 places" }),
    ).toBeVisible();
  });
});

test.describe("sign-in example", () => {
  test("refuses a bad email and a short password, then a wrong code, then signs in", async ({
    page,
  }) => {
    await page.goto("/examples/sign-in");
    await hydrated(page);
    const example = page.getByRole("region", { name: "Sign in example" });
    const email = example.getByLabel("Email");
    const password = example.getByLabel("Password", { exact: true });
    await email.fill("not-an-email");
    await password.fill("short");
    await example.getByRole("button", { name: "Continue" }).click();
    await expect(
      example.getByText("Enter an email address, like name@example.com."),
    ).toBeVisible();
    await expect(
      example.getByText("Use at least 12 characters."),
    ).toBeVisible();
    await email.fill("sam@example.com");
    await password.fill("correct horse battery");
    await example.getByRole("button", { name: "Continue" }).click();
    await expect(example.getByText("Check your phone")).toBeVisible();
    // The step replaced the button that was pressed; its heading has focus.
    await expect(
      example.getByRole("heading", { name: "Check your phone" }),
    ).toBeFocused();

    const enterCode = async (code: string) => {
      for (const [index, digit] of [...code].entries()) {
        await example
          .getByRole("textbox", { name: `Digit ${index + 1} of 6` })
          .fill(digit);
      }
    };
    await enterCode("000000");
    await example.getByRole("button", { name: "Verify" }).click();
    await expect(
      example.getByText(
        "That code did not match. Check the message and try again.",
      ),
    ).toBeVisible();
    await enterCode("123456");
    await example.getByRole("button", { name: "Verify" }).click();
    await expect(example.getByText("Welcome back")).toBeVisible();
    await expect(
      example.getByText("You are signed in as sam@example.com."),
    ).toBeVisible();
    await hydrated(page);
    expect(await axeViolations(page)).toEqual([]);
    await example.getByRole("button", { name: "Sign out" }).click();
    await expect(example.getByText("Sign in to Venue Manager")).toBeVisible();
  });
});

test.describe("dashboard example", () => {
  test("pages, filters, searches, archives a venue and adds one", async ({
    page,
  }) => {
    await page.goto("/examples/dashboard");
    await hydrated(page);
    const example = page.getByRole("region", {
      name: "Operations dashboard example",
    });
    await expect(example.getByText("12 venues · page 1 of 3")).toBeVisible();
    await example.getByRole("link", { name: /next page/i }).click();
    await expect(example.getByText("12 venues · page 2 of 3")).toBeVisible();

    const status = example.getByRole("group", { name: "Status" });
    await status.getByRole("button", { name: "Draft" }).click();
    await expect(example.getByText("2 venues")).toBeVisible();
    await status.getByRole("button", { name: "All" }).click();
    await example
      .getByRole("searchbox", { name: "Search venues" })
      .fill("harbour");
    await expect(example.getByText("1 venue")).toBeVisible();
    await example
      .getByRole("button", { name: "Actions for Harbour Terminal" })
      .click();
    await page.getByRole("menuitem", { name: "Archive" }).click();
    await expect(
      example.getByText("Harbour Terminal is now archived."),
    ).toBeVisible();
    await expect(example.getByRole("cell", { name: "Archived" })).toBeVisible();

    await example.getByRole("searchbox", { name: "Search venues" }).fill("");
    await example.getByRole("button", { name: "Add venue" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Add a venue" });
    await dialog.getByRole("button", { name: "Add venue" }).click();
    await expect(dialog.getByText("Give the venue a name.")).toBeVisible();
    await dialog.getByLabel("Name").fill("Pier Market");
    await dialog.getByRole("button", { name: "Add venue" }).click();
    await expect(
      example.getByText("Pier Market was added as a draft."),
    ).toBeVisible();
    await expect(example.getByText("13 venues · page 1 of 3")).toBeVisible();
    await hydrated(page);
    expect(await axeViolations(page)).toEqual([]);
  });
});

test.describe("booking example", () => {
  test("checks each step before the next, then books", async ({ page }) => {
    await page.goto("/examples/booking");
    await hydrated(page);
    const example = page.getByRole("region", { name: "Room booking example" });
    await example.getByRole("button", { name: "Next" }).click();
    await expect(example.getByText("Choose a date.")).toBeVisible();
    await expect(example.getByText("Choose a start time.")).toBeVisible();
    await example.getByLabel("Date").fill("2026-10-05");
    await example.getByLabel("Start").fill("14:00");
    await example.getByRole("radio", { name: /Boardroom/ }).click();
    await example.getByRole("button", { name: "Next" }).click();
    await expect(
      example.getByRole("heading", { level: 3, name: "Details" }),
    ).toBeVisible();

    await example.getByRole("button", { name: "Next" }).click();
    await expect(example.getByText("Enter your name.")).toBeVisible();
    await expect(
      example.getByText("The room policy has to be accepted."),
    ).toBeVisible();
    await example.getByLabel("Your name").fill("Sam Rivera");
    await example.getByLabel("Email").fill("sam@example.com");
    await example.getByRole("checkbox", { name: /room policy/ }).click();
    await example.getByRole("button", { name: "Next" }).click();
    await expect(
      example.getByRole("heading", { level: 3, name: "Confirm" }),
    ).toBeVisible();
    await expect(example.getByText("Monday 5 October")).toBeVisible();
    await hydrated(page);
    expect(await axeViolations(page)).toEqual([]);
    await example.getByRole("button", { name: "Confirm booking" }).click();
    await expect(example.getByText("Booked.", { exact: true })).toBeVisible();
    await expect(
      example.getByText(/Boardroom on Monday 5 October at 14:00/),
    ).toBeVisible();
  });
});

test.describe("notifications example", () => {
  test("marks one read, shows only unread, marks all read and undoes it", async ({
    page,
  }) => {
    await page.goto("/examples/notifications");
    await hydrated(page);
    const example = page.getByRole("region", {
      name: "Notifications inbox example",
    });
    await expect(example.getByLabel("4 unread")).toBeVisible();
    await example
      .getByRole("button", {
        name: "Mark “Lift 3 is out of service at Riverside Centre” as read",
      })
      .click();
    await expect(
      example.getByText("1 notification marked as read."),
    ).toBeVisible();
    await expect(example.getByRole("button", { name: "Undo" })).toBeFocused();
    await expect(example.getByLabel("3 unread")).toBeVisible();

    await example.getByRole("switch", { name: "Only unread" }).click();
    await expect(example.getByRole("button", { name: /^Mark “/ })).toHaveCount(
      3,
    );
    await example.getByRole("tab", { name: "System" }).click();
    await expect(example.getByRole("button", { name: /^Mark “/ })).toHaveCount(
      1,
    );
    await example.getByRole("button", { name: "Mark all as read" }).click();
    await expect(
      example.getByText("3 notifications marked as read."),
    ).toBeVisible();
    await expect(example.getByText("You are all caught up")).toBeVisible();
    await hydrated(page);
    expect(await axeViolations(page)).toEqual([]);
    await example.getByRole("button", { name: "Undo" }).click();
    await expect(example.getByLabel("3 unread")).toBeVisible();
  });
});

test.describe("onboarding example", () => {
  test("walks the five steps and sums them up", async ({ page }) => {
    await page.goto("/examples/onboarding");
    await hydrated(page);
    const example = page.getByRole("region", {
      name: "First-run onboarding example",
    });
    await example.getByRole("button", { name: "Let’s go" }).click();
    await example
      .getByRole("group", { name: "Distances" })
      .getByRole("radio", { name: "Feet" })
      .click();
    await example.getByRole("button", { name: "Next" }).click();
    await example
      .getByRole("group", { name: "Interests" })
      .getByRole("button", { name: "Events" })
      .click();
    await expect(example.getByText("2 picked.")).toBeVisible();
    await example.getByRole("button", { name: "Next" }).click();
    await example.getByRole("radio", { name: /^Always/ }).click();
    await hydrated(page);
    expect(await axeViolations(page)).toEqual([]);
    await example.getByRole("button", { name: "Next" }).click();
    await expect(example.getByText(/Distances in feet/)).toBeVisible();
    await expect(example.getByText("Interests: Shops, Events.")).toBeVisible();
    await expect(example.getByText("Location: always.")).toBeVisible();
    await example.getByRole("button", { name: "Start exploring" }).click();
    await expect(example.getByText("You are set")).toBeVisible();
  });
});

test.describe("states example", () => {
  test("loads on its own, empties, fails and retries, and works offline", async ({
    page,
  }) => {
    await page.goto("/examples/states");
    await hydrated(page);
    const example = page.getByRole("region", {
      name: "Loading, empty, error, offline example",
    });
    await expect(example.getByText("Loading shops")).toBeVisible();
    await expect(example.getByText("3 shops, nearest first")).toBeVisible({
      timeout: 8000,
    });
    const state = example.getByRole("group", { name: "State" });
    await state.getByRole("radio", { name: "Empty" }).click();
    await expect(example.getByText("No shops match")).toBeVisible();
    await example.getByRole("button", { name: "Show every shop" }).click();
    await expect(example.getByText("3 shops, nearest first")).toBeVisible();
    await state.getByRole("radio", { name: "Error" }).click();
    await expect(
      example.getByText(/The shops could not be loaded/),
    ).toBeVisible();
    await hydrated(page);
    expect(await axeViolations(page)).toEqual([]);
    await example.getByRole("button", { name: "Try again" }).click();
    await expect(example.getByText("3 shops, nearest first")).toBeVisible({
      timeout: 8000,
    });
    await state.getByRole("radio", { name: "Offline" }).click();
    await expect(example.getByText(/You are offline/)).toBeVisible();
    await expect(example.getByText("Saved copy")).toBeVisible();
    await hydrated(page);
    expect(await axeViolations(page)).toEqual([]);
  });
});

test.describe("feedback survey example", () => {
  test("asks two more questions after the rating and thanks the visitor", async ({
    page,
  }) => {
    await page.goto("/examples/feedback-survey");
    await hydrated(page);
    const example = page.getByRole("region", {
      name: "Feedback survey example",
    });
    await example.getByRole("radio", { name: "Rate 4 out of 5 stars" }).click();
    await example.getByRole("button", { name: "Submit Feedback" }).click();
    await expect(example.getByText("Two more questions")).toBeVisible();
    await expect(
      example.getByText("You rated the visit 4 of 5."),
    ).toBeVisible();
    await example.getByRole("radio", { name: "Signs in the centre" }).click();
    await example
      .getByRole("checkbox", { name: "Opening hours on the map" })
      .click();
    await example
      .getByRole("switch", { name: "Someone may contact me about this" })
      .click();
    await example.getByRole("button", { name: "Send" }).click();
    await expect(
      example.getByText("Enter an email address, like name@example.com."),
    ).toBeVisible();
    await hydrated(page);
    expect(await axeViolations(page)).toEqual([]);
    await example.getByLabel("Email").fill("sam@example.com");
    await example.getByRole("button", { name: "Send" }).click();
    await expect(
      example.getByText("Thank you.", { exact: true }),
    ).toBeVisible();
    await expect(
      example.getByText(
        /found the way by signs in the centre; one thing would help/,
      ),
    ).toBeVisible();
  });
});

test.describe("saved places example", () => {
  test("removes a place after confirming, undoes it, and searches", async ({
    page,
  }) => {
    await page.goto("/examples/saved-places");
    await hydrated(page);
    const example = page.getByRole("region", { name: "Saved places example" });
    await expect(example.getByText(/6 places across 3 venues/)).toBeVisible();
    const bookshop = example.getByRole("treeitem", { name: /Bookshop/ });
    await expect(bookshop).toBeVisible();
    await bookshop.hover();
    await example
      .getByRole("button", { name: "Remove Bookshop from saved places" })
      .click();
    const dialog = page.getByRole("dialog", { name: "Remove Bookshop?" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Remove" }).click();
    await expect(
      example.getByText("Bookshop is no longer saved."),
    ).toBeVisible();
    // The row that opened the dialog is gone; focus is on the undo.
    await expect(example.getByRole("button", { name: "Undo" })).toBeFocused();
    await expect(example.getByText(/5 places across 3 venues/)).toBeVisible();
    await hydrated(page);
    expect(await axeViolations(page)).toEqual([]);
    await example.getByRole("button", { name: "Undo" }).click();
    await expect(example.getByText(/6 places across 3 venues/)).toBeVisible();
    await expect(
      example.getByRole("heading", { name: "Saved places" }),
    ).toBeFocused();
    await example
      .getByRole("searchbox", { name: "Search saved places" })
      .fill("gate");
    await expect(
      example.getByRole("treeitem", { name: /Gate B12/ }),
    ).toBeVisible();
    await expect(example.getByRole("treeitem")).toHaveCount(2);
  });
});

test("the search opens from the keyboard or the header and takes you there", async ({
  page,
}) => {
  await page.goto("/");
  await hydrated(page);
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Search the site" });
  await expect(dialog).toBeVisible();
  // Before a word: the pages and the foundations, as a contents list.
  await expect(dialog.getByRole("option", { name: /^Colour/ })).toBeVisible();
  await dialog.getByRole("searchbox", { name: "Search the site" }).fill("tree");
  await dialog.getByRole("option", { name: /^Tree/ }).click();
  await expect(page).toHaveURL(/\/components\/tree$/);
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tree");

  // From the header, Enter opens the first result.
  await page.getByRole("button", { name: "Search the site" }).click();
  await dialog
    .getByRole("searchbox", { name: "Search the site" })
    .fill("wayfinding");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/examples\/wayfinding$/);
  await expect(page.locator("main#main")).toBeFocused();

  // The down arrow moves into the results; a result opens from there.
  await page.keyboard.press("Control+k");
  const field = dialog.getByRole("searchbox", { name: "Search the site" });
  await field.fill("button");
  await expect(dialog.getByText(/results?$/)).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(dialog.getByRole("listbox", { name: "Results" })).toBeFocused();

  // However it closes, the next search starts from an empty field.
  await page.keyboard.press("Control+k");
  await expect(dialog).toBeHidden();
  await page.keyboard.press("Control+k");
  await expect(field).toHaveValue("");

  // Nothing found says so.
  await field.fill("zzzz");
  await expect(dialog.getByText(/Nothing has “zzzz”/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
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

    // A Radix primitive's own props are marked, with where they come from.
    await page.goto("/components/dialog");
    await hydrated(page);
    const modal = page
      .getByRole("table", { name: "Dialog props" })
      .getByRole("row")
      .filter({ has: page.getByRole("cell", { name: /^modal/ }) });
    await expect(modal).toContainText("Radix");
    await expect(modal).toContainText("@radix-ui/react-dialog");
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

// Every component page, in both themes, in one browser: the sampled pages
// above run in all three. Each page must answer, name itself, show a live
// example, pass axe and log nothing. The dark theme is walked too: a token
// can pass on white and fail on black (GAP-45).
test.describe("every component page", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "one browser walks all the pages",
  );

  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`${colorScheme} theme`, () => {
      test.use({ colorScheme });

      for (const { slug, name } of componentIndex.components) {
        componentPageTest(slug, name, colorScheme);
      }
    });
  }
});

/** One component page's walk: it answers, names itself, shows its demo, passes axe. */
function componentPageTest(
  slug: string,
  name: string,
  colorScheme: "light" | "dark",
) {
  test(`/components/${slug} shows ${name} live and passes axe`, async ({
    page,
  }) => {
    const errors = collectErrors(page);
    const response = await page.goto(`/components/${slug}`);
    expect(response?.status()).toBe(200);
    await hydrated(page);
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      colorScheme,
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    const stage = page.locator(".site-demo-stage").first();
    await expect(stage).toBeVisible();
    expect(
      await stage.evaluate((element) => element.childElementCount),
    ).toBeGreaterThan(0);
    await expect(page.getByRole("tab", { name: "SwiftUI" })).toBeVisible();
    await scrolled(page);
    expect(await axeViolations(page)).toEqual([]);
    expect(await overriddenSiteCss(page)).toEqual([]);
    expect(await clippedEdges(page)).toEqual([]);
    // WCAG 1.4.10: no sideways scroll at 320px, on every page.
    await page.setViewportSize({ width: 320, height: 700 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      ),
    ).toBeLessThanOrEqual(0);
    // The gallery's second example asks for an image that does not exist,
    // on purpose; the browser logs that request and nothing else may fail.
    expect(
      errors.filter((error) => !error.includes("does-not-exist.svg")),
    ).toEqual([]);
  });
}
