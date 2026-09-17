import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot, type Root } from "react-dom/client";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeProvider";

function Reader() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme("dark")}>
      {theme}:{resolvedTheme}
    </button>
  );
}

describe("module-owned themes", () => {
  let media: MediaQueryList;
  beforeEach(() => {
    media = Object.assign(new EventTarget(), {
      matches: false,
      media: "(prefers-color-scheme: dark)",
    }) as MediaQueryList;
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => media),
    );
    localStorage.clear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.documentElement.removeAttribute("data-theme");
  });

  it("keeps sibling and nested theme state off the host document", () => {
    document.documentElement.setAttribute("data-theme", "host");
    const { container, unmount } = render(
      <>
        <ThemeProvider defaultTheme="dark">
          <Reader />
          <ThemeProvider defaultTheme="light">
            <Reader />
          </ThemeProvider>
        </ThemeProvider>
        <ThemeProvider defaultTheme="light">
          <Reader />
        </ThemeProvider>
      </>,
    );
    expect(document.documentElement.getAttribute("data-theme")).toBe("host");
    expect(
      [...container.querySelectorAll("[data-kozmos-root]")].map((el) =>
        el.getAttribute("data-theme"),
      ),
    ).toEqual(["dark", "light", "light"]);
    expect(document.querySelectorAll("[data-kozmos-portal]")).toHaveLength(3);
    unmount();
    expect(document.querySelectorAll("[data-kozmos-portal]")).toHaveLength(0);
    expect(document.documentElement.getAttribute("data-theme")).toBe("host");
    document.documentElement.removeAttribute("data-theme");
  });

  it("keeps controlled state controlled and reports requested changes", () => {
    const onThemeChange = vi.fn();
    const { rerender } = render(
      <ThemeProvider theme="light" onThemeChange={onThemeChange}>
        <Reader />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onThemeChange).toHaveBeenCalledWith("dark");
    expect(screen.getByRole("button")).toHaveTextContent("light:light");
    rerender(
      <ThemeProvider theme="dark" onThemeChange={onThemeChange}>
        <Reader />
      </ThemeProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("dark:dark");
  });

  it("follows live system preferences and unsubscribes on unmount", () => {
    const remove = vi.spyOn(media, "removeEventListener");
    const { unmount } = render(
      <ThemeProvider>
        <Reader />
      </ThemeProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("system:light");
    act(() => {
      Object.defineProperty(media, "matches", { value: true });
      media.dispatchEvent(new Event("change"));
    });
    expect(screen.getByRole("button")).toHaveTextContent("system:dark");
    unmount();
    expect(remove).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("does not read storage on the server or persist without an explicit key", () => {
    localStorage.setItem("vite-ui-theme", "dark");
    const read = vi.spyOn(Storage.prototype, "getItem");
    const write = vi.spyOn(Storage.prototype, "setItem");
    const html = renderToString(
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Reader />
      </ThemeProvider>,
    );
    expect(html).toContain('data-theme="light"');
    expect(read).not.toHaveBeenCalled();
    render(
      <ThemeProvider defaultTheme="light">
        <Reader />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(write).not.toHaveBeenCalled();
    read.mockRestore();
    write.mockRestore();
  });

  it("ignores invalid storage values and tolerates denied storage", () => {
    localStorage.setItem("module-a", "invalid");
    const { unmount } = render(
      <ThemeProvider storageKey="module-a" defaultTheme="light">
        <Reader />
      </ThemeProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("light:light");
    unmount();
    const read = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("denied");
      });
    const write = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("denied");
      });
    render(
      <ThemeProvider storageKey="module-b" defaultTheme="light">
        <Reader />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("dark:dark");
    read.mockRestore();
    write.mockRestore();
  });

  it("hydrates deterministic markup before restoring an explicit stored preference", async () => {
    localStorage.setItem("module-hydration", "dark");
    const app = (
      <ThemeProvider defaultTheme="light" storageKey="module-hydration">
        <Reader />
      </ThemeProvider>
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(app);
    document.body.append(container);
    expect(container.querySelector("button")).toHaveTextContent("light:light");
    const error = vi.fn();
    let root: Root;
    await act(async () => {
      root = hydrateRoot(container, app, { onRecoverableError: error });
    });
    expect(container.querySelector("button")).toHaveTextContent("dark:dark");
    expect(error).not.toHaveBeenCalled();
    act(() => root.unmount());
    container.remove();
  });

  it("does not let stored preferences override controlled state", () => {
    localStorage.setItem("module-controlled", "dark");
    const write = vi.spyOn(Storage.prototype, "setItem");
    render(
      <ThemeProvider theme="light" storageKey="module-controlled">
        <Reader />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("light:light");
    expect(write).not.toHaveBeenCalled();
  });

  it("owns exactly one portal root under StrictMode and cleans it up", () => {
    const { unmount } = render(
      <StrictMode>
        <ThemeProvider defaultTheme="light">
          <Reader />
        </ThemeProvider>
      </StrictMode>,
    );
    expect(document.querySelectorAll("[data-kozmos-portal]")).toHaveLength(1);
    unmount();
    expect(document.querySelectorAll("[data-kozmos-portal]")).toHaveLength(0);
  });
});
