import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  buildReactFixture,
  launchFixtureBrowser,
  settleLayout,
} from "./lib/built-react-fixture.mjs";

const { code, css } = await buildReactFixture("owned-css-host.tsx");
const require = createRequire(`${process.cwd()}/packages/react/package.json`);
const postcss = require("postcss");
const root = postcss.parse(css);
root.walkAtRules("scope", (rule) => rule.remove());
const browser = await launchFixtureBrowser();
try {
  // Run the same assertions with and without the legacy stylesheet. A modern
  // browser cannot hide a dependency on @scope in the migrated slice.
  for (const [mode, stylesheet] of [
    ["full", css],
    ["without-scope", root.toString()],
  ]) {
    const page = await browser.newPage({
      viewport: { width: 1100, height: 1100 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setContent(`<html><head><style>
      html {font-size:16px} body {margin:13px}
      input,textarea,button {background:orange;border:3px solid purple;border-radius:3px}
      label {font-size:30px} p {margin:20px}
      .flex {display:block} .rounded-control {border-radius:3px}
      .host-slot-button {background:orange;border:3px solid purple;border-radius:3px}
    </style></head><body><button id="host">Host</button><div id="fixture"></div></body></html>`);
    const measure = (locator) =>
      locator.evaluate((node) => {
        const s = getComputedStyle(node);
        return Object.fromEntries(
          [
            "backgroundColor",
            "color",
            "height",
            "width",
            "paddingLeft",
            "borderRadius",
            "borderTopWidth",
            "borderTopColor",
            "boxShadow",
            "fontSize",
            "lineHeight",
            "fontWeight",
            "display",
            "opacity",
            "direction",
            "animationName",
            "animationDuration",
          ].map((key) => [key, s[key]]),
        );
      });
    const hostBefore = await measure(page.locator("#host"));
    await page.addStyleTag({ content: stylesheet });
    // Deliberate consumer overrides are loaded after the package, need no
    // Tailwind compiler. State-specific overrides follow normal CSS specificity.
    await page.addStyleTag({
      content:
        ".consumer-control {border-radius:7px;padding-left:19px;background:rgb(10,20,30)}",
    });
    await page.addScriptTag({ content: code });
    await page.getByTestId("outer-input").waitFor();
    await settleLayout(page);
    assert.deepEqual(await measure(page.locator("#host")), hostBefore);
    const value = async (id, token) =>
      page.getByTestId(id).evaluate((node, name) => {
        const probe = document.createElement("span");
        probe.style.color = `var(${name})`;
        node.parentElement.append(probe);
        const result = getComputedStyle(probe).color;
        probe.remove();
        return result;
      }, token);
    for (const id of ["outer", "nested"]) {
      const field = page.getByTestId(`${id}-input`);
      const s = await measure(field);
      assert.equal(s.height, "44px");
      assert.equal(s.paddingLeft, "12px");
      assert.equal(s.borderRadius, "16px");
      assert.equal(s.borderTopWidth, "1px");
      assert.equal(s.fontSize, "14px");
      assert.equal(s.direction, "rtl");
      assert.equal(
        s.backgroundColor,
        await value(`${id}-input`, "--primitives-colors-background-0"),
      );
      const override = await measure(page.getByTestId(`${id}-override`));
      assert.equal(override.borderRadius, "7px");
      assert.equal(override.paddingLeft, "19px");
      assert.equal(override.backgroundColor, "rgb(10, 20, 30)");
      await field.focus();
      assert.notEqual((await measure(field)).boxShadow, "none");
      const disabled = await measure(page.getByTestId(`${id}-disabled`));
      assert.equal(
        disabled.backgroundColor,
        await value(`${id}-disabled`, "--primitives-colors-background-100"),
      );
      for (const [state, token] of [
        ["invalid", "danger-600"],
        ["warning", "alert-800"],
        ["success", "success-800"],
      ]) {
        const result = await measure(page.getByTestId(`${id}-${state}`));
        assert.equal(
          result.borderTopColor,
          await value(
            `${id}-${state}`,
            `--primitives-colors-emotional-${token}`,
          ),
        );
      }
      assert.equal(
        (await measure(page.getByTestId(`${id}-button`))).height,
        "44px",
      );
      assert.equal(
        (await measure(page.getByTestId(`${id}-button`))).borderTopWidth,
        "0px",
      );
      assert.equal(
        (await measure(page.getByTestId(`${id}-helper-button`))).width,
        "44px",
      );
      assert.equal(
        (await measure(page.getByTestId(`${id}-helper-input`))).height,
        "44px",
      );
      assert.equal(
        (await measure(page.getByTestId(`${id}-helper-error`))).borderTopColor,
        await value(
          `${id}-helper-error`,
          "--primitives-colors-emotional-danger-600",
        ),
        "the exported helper's error flag must override its warning status",
      );
      if (mode === "full") {
        // Shared exported helpers reach existing compositions too. These are
        // regression checks, not claims that those whole components migrated.
        assert.equal(
          (await measure(page.getByTestId(`${id}-password`))).height,
          "44px",
        );
        assert.equal(
          (await measure(page.getByTestId(`${id}-number`))).height,
          "44px",
        );
        assert.equal(
          (await measure(page.getByTestId(`${id}-map-control`)))
            .backgroundColor,
          await value(
            `${id}-button`,
            "--components-primary-buttons-themed-button-background-idle",
          ),
        );
      }
      assert.equal(await page.getByTestId(`${id}-loading`).isDisabled(), true);
      const loader = await measure(
        page.getByTestId(`${id}-loading`).locator("svg"),
      );
      assert.equal(loader.width, "16px");
      assert.match(loader.animationName, /^kozmos-/);
      assert.notEqual(loader.animationDuration, "0s");
      const button = page.getByTestId(`${id}-button`);
      assert.equal(
        (await measure(button)).backgroundColor,
        await value(
          `${id}-button`,
          "--components-primary-buttons-themed-button-background-idle",
        ),
      );
      await button.hover();
      await page.waitForTimeout(250);
      assert.equal(
        (await measure(button)).backgroundColor,
        await value(
          `${id}-button`,
          "--components-primary-buttons-themed-button-background-hover",
        ),
      );
      assert.equal(
        (await measure(page.getByTestId(`${id}-outline`))).color,
        await value(
          `${id}-outline`,
          "--components-secondary-buttons-success-button-foreground-content-idle",
        ),
      );
      assert.equal(
        (await measure(page.getByTestId(`${id}-disabled-button`))).opacity,
        "0.5",
      );
      assert.equal(
        (
          await measure(
            page
              .getByTestId(id)
              .locator("label")
              .filter({ hasText: `${id} name` }),
          )
        ).fontSize,
        "14px",
      );
      await page
        .getByRole("button", { name: `Open ${id}`, exact: true })
        .click();
      const overlay = page.getByTestId(`${id}-popover`);
      await overlay.waitFor();
      await settleLayout(page);
      assert.equal((await measure(overlay)).backgroundColor, s.backgroundColor);
      assert.equal((await measure(overlay)).borderRadius, "16px");
      assert.equal(
        (await measure(page.getByTestId(`${id}-portal-input`))).height,
        "44px",
      );
      await page.getByTestId(`${id}-portal-input`).fill("Pointr");
      const handle = await overlay.elementHandle();
      if (id === "outer") {
        await page.locator("#switch-theme").evaluate((node) => node.click());
        await settleLayout(page);
        assert.equal(await handle.evaluate((node) => node.isConnected), true);
        assert.notEqual(
          (await measure(overlay)).backgroundColor,
          s.backgroundColor,
        );
        await page.locator("#switch-theme").evaluate((node) => node.click());
        await settleLayout(page);
      }
      await page.keyboard.press("Escape");
      await overlay.waitFor({ state: "hidden" });
      assert.equal(
        await page
          .getByRole("button", { name: `Open ${id}`, exact: true })
          .evaluate((node) => node === document.activeElement),
        true,
      );
    }
    assert.notEqual(
      (await measure(page.getByTestId("outer-glass"))).backgroundColor,
      (await measure(page.getByTestId("nested-glass"))).backgroundColor,
    );
    if (mode === "without-scope") {
      const slot = await measure(
        page.getByTestId("outer").locator(".host-slot-button"),
      );
      assert.equal(slot.backgroundColor, "rgb(255, 165, 0)");
      assert.equal(slot.borderTopWidth, "3px");
    }
    // Late generic host resets still cannot override namespaced controls.
    await page.addStyleTag({
      content:
        "input,textarea,button {border-radius:2px;padding:0;background:orange}",
    });
    assert.equal(
      (await measure(page.getByTestId("outer-input"))).borderRadius,
      "16px",
    );
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "20px";
    });
    assert.equal(
      (await measure(page.getByTestId("outer-input"))).height,
      "55px",
    );
    assert.equal(
      (await measure(page.getByTestId("outer-input"))).fontSize,
      "17.5px",
    );
    assert.deepEqual(errors, []);
    console.log(
      `PASS ${mode}: local reset, forms/states, consumer CSS, exported helpers, buttons, loading animation, nested themes, RTL, portal updates and keyboard dismissal`,
    );
    await page.close();
  }
} finally {
  await browser.close();
}
