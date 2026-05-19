import AxeBuilder from "@axe-core/playwright";
import { chromium, type Page } from "playwright";

/**
 * Skill: Accessibility Checker
 * Role: QA
 * Description: Automated A11y crawler for Storybook using Playwright + Axe
 */

const STORYBOOK_URL = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";
const STORY_LOAD_TIMEOUT_MS = 60000;
const STORY_RETRY_DELAY_MS = 1500;

async function getStories() {
  console.log("🔍 Discovering stories...");
  // In a real scenario, we might parse stories.json or crawl the sidebar.
  // For this MVP, we will test the known complex components.
  return [
    { id: "components-select--default", name: "Select" },
    { id: "components-tabs--default", name: "Tabs" },
    { id: "components-dialog--default", name: "Dialog" },
    { id: "components-badge--outline", name: "Badge (Outline)" },
    { id: "components-button--default", name: "Button" },
  ];
}

async function gotoStory(page: Page, url: string) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: STORY_LOAD_TIMEOUT_MS,
      });
      await page.locator("body").waitFor({ state: "attached", timeout: 5000 });
      return;
    } catch (error) {
      lastError = error;
      if (attempt === 1) {
        console.warn(
          "   ⚠️ Story iframe did not become ready; retrying once...",
        );
        await page.waitForTimeout(STORY_RETRY_DELAY_MS);
      }
    }
  }

  throw lastError;
}

async function runAudit() {
  console.log("🚀 Starting A11y Audit on: " + STORYBOOK_URL);

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const stories = await getStories();
    let violationCount = 0;

    for (const story of stories) {
      const url = `${STORYBOOK_URL}/iframe.html?id=${story.id}&viewMode=story`;
      console.log(`\nTesting: ${story.name} (${url})`);

      await gotoStory(page, url);
      try {
        await page.waitForLoadState("networkidle", { timeout: 5000 });
      } catch (e) {
        // console.warn('   ⚠️ Timeout waiting for networkidle, proceeding...');
      }

      // Special interaction for Select to reveal content
      if (story.name === "Select") {
        // console.log('   🖱️ Interacting with Select...');
        try {
          await page.click('button[role="combobox"]', { timeout: 2000 });
          await page.waitForTimeout(500);
        } catch (e) {
          // console.warn('   ⚠️ Could not interact with Select trigger');
        }
      }

      // Special interaction for Dialog
      if (story.name === "Dialog") {
        // console.log('   🖱️ Opening Dialog...');
        try {
          await page.getByText("Edit Profile").click({ timeout: 2000 });
          await page.waitForTimeout(500);
        } catch (e) {
          // console.warn('   ⚠️ Could not open Dialog');
        }
      }

      // Run check
      try {
        const results = await new AxeBuilder({ page })
          .disableRules([
            "page-has-heading-one",
            "landmark-one-main",
            "region",
            "aria-hidden-focus",
          ])
          .analyze();

        if (results.violations.length > 0) {
          console.error("   ❌ VIOLATION FOUND");
          results.violations.forEach((v) => {
            console.error(`      - [${v.impact}] ${v.help}`);
            console.error(`        nodes: ${v.nodes.length}`);
            if (v.nodes[0]) console.error(`        html: ${v.nodes[0].html}`);
          });
          violationCount++;
        } else {
          console.log("   ✅ Pass");
        }
      } catch (e: any) {
        console.error("   ❌ FAILED TO EXECUTE AXE");
        console.error(e);
        violationCount++;
      }
    }

    if (violationCount > 0) {
      console.error(
        `\n🚨 Audit Failed: ${violationCount} components have violations.`,
      );
      process.exit(1);
    } else {
      console.log("\n✨ Audit Complete: All checks passed!");
      process.exit(0);
    }
  } catch (error) {
    console.error("Fatal Error:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runAudit();
