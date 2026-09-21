import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const pages = [
  { path: "/", title: "The design system for the Pointr SDK" },
  { path: "/get-started", title: "Get started" },
  { path: "/examples", title: "Examples" },
  { path: "/examples/account-settings", title: "Account settings" },
] as const;

/** Console errors and uncaught exceptions, which a clean page has none of. */
function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
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
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every((animation) => animation.playState !== "running"),
  );
}

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
  return results.violations.map(
    (violation) =>
      `${violation.id} (${violation.impact}): ${violation.nodes
        .map((node) => node.target.join(" "))
        .join(" | ")}`,
  );
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
        expect(await axeViolations(page)).toEqual([]);
        expect(errors).toEqual([]);
      });
    }
  });
}

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const { path } of pages) {
    test(`${path} has no sideways scroll`, async ({ page }) => {
      await page.goto(path);
      await hydrated(page);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
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

test("the home demo themes and mirrors only itself", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await hydrated(page);
  const demo = page.locator(
    "section[aria-labelledby='home-title'] [data-kozmos-root]",
  );
  await expect(demo).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("group", { name: "This card's theme" })
    .getByRole("radio", { name: "Light" })
    .click();
  await expect(demo).toHaveAttribute("data-theme", "light");
  await page
    .getByRole("group", { name: "Direction" })
    .getByRole("radio", { name: "Right to left" })
    .click();
  await expect(demo).toHaveAttribute("dir", "rtl");
  // The page around it is untouched.
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(
    page.locator("body > [data-kozmos-root]").first(),
  ).toHaveAttribute("dir", "ltr");
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
