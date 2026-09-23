import { test, expect } from "@playwright/experimental-ct-react";
import React from "react";
import {
  FeedbackCardFixture,
  RoutingInputGroupFixture,
} from "./FieldFocus.fixture";

// A route point's field keeps the control radius and draws the standard focus
// ring — 2px of the page, then 2px of theme/600 — as every other field does.
// Until 2026-09-22 it was rounded-panel (24px) with ring-0: the one field in
// the system that showed no focus.
test("a route field has the control radius and the standard focus ring", async ({
  mount,
}) => {
  const component = await mount(<RoutingInputGroupFixture />);
  const field = component.getByPlaceholder("Choose Destination");
  await expect(field).toHaveCSS("border-top-left-radius", "16px");
  await field.focus();
  // The field transitions its shadow over 300ms; toHaveCSS waits for it.
  await expect(field).toHaveCSS(
    "box-shadow",
    /rgb\(16, 81, 232\) 0px 0px 0px 4px/,
  );
});

// The feedback card's comment box had the same two overrides and loses them
// for the same reason.
test("the feedback comment box has the control radius and the standard focus ring", async ({
  mount,
}) => {
  const component = await mount(<FeedbackCardFixture />);
  const box = component.getByPlaceholder(
    "Tell us more about your experience...",
  );
  await expect(box).toHaveCSS("border-top-left-radius", "16px");
  await box.focus();
  await expect(box).toHaveCSS(
    "box-shadow",
    /rgb\(16, 81, 232\) 0px 0px 0px 4px/,
  );
});
