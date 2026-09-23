import { afterEach, describe, expect, it } from "vitest";
import { inertOutside } from "./modal-inert";

const releases: Array<() => void> = [];
afterEach(() => {
  releases.reverse().forEach((release) => release());
  releases.length = 0;
  document.body.replaceChildren();
});
const start = (target: HTMLElement) => {
  const release = inertOutside(target);
  releases.push(release);
  return release;
};
function setup() {
  document.body.innerHTML =
    '<main><button>Host</button></main><aside inert="existing">Already inert</aside><div id="portal"><div id="one">One</div></div><div aria-live="polite">Announcement</div>';
  return document.getElementById("one")!;
}

describe("modal inert ownership", () => {
  it("excludes the popup and live regions, then restores exact host attributes", () => {
    const popup = setup(),
      release = start(popup);
    expect(document.querySelector("main")).toHaveAttribute("inert");
    expect(popup.closest("[inert]")).toBeNull();
    expect(document.querySelector("[aria-live]")).not.toHaveAttribute("inert");
    release();
    release();
    expect(document.querySelector("main")).not.toHaveAttribute("inert");
    expect(document.querySelector("aside")).toHaveAttribute(
      "inert",
      "existing",
    );
    expect(document.querySelector("[aria-hidden]")).toBeNull();
  });
  it("hands interaction to the latest popup and restores the previous one", () => {
    const one = setup();
    start(one);
    const two = document.createElement("div");
    two.textContent = "Two";
    document.body.append(two);
    const closeTwo = start(two);
    expect(one.closest("[inert]")).not.toBeNull();
    expect(two.closest("[inert]")).toBeNull();
    closeTwo();
    expect(one.closest("[inert]")).toBeNull();
    expect(two).toHaveAttribute("inert");
  });
  it("handles dynamically added background roots and out-of-order releases", async () => {
    const one = setup(),
      closeOne = start(one);
    const late = document.createElement("button");
    document.body.append(late);
    await Promise.resolve();
    expect(late).toHaveAttribute("inert");
    const two = document.createElement("div");
    document.body.append(two);
    const closeTwo = start(two);
    closeOne();
    expect(two.closest("[inert]")).toBeNull();
    expect(late).toHaveAttribute("inert");
    closeTwo();
    expect(late).not.toHaveAttribute("inert");
  });
});
