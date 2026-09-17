"use client";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DirectionProvider } from "@radix-ui/react-direction";
import {
  ThemeProviderContext,
  type ThemeState,
} from "../../theme/theme-context";

export type Theme = "dark" | "light" | "system";
export type ResolvedTheme = Exclude<Theme, "system">;
export type ThemeTokens = Record<`--${string}`, string | number>;

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  /** Controlled preference. In this mode the caller owns persistence. */
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  /** Persistence is opt-in. Use a key owned by your product/module. */
  storageKey?: string;
  /** Deterministic system fallback for SSR and the first hydration render. */
  defaultSystemTheme?: ResolvedTheme;
  dir?: "ltr" | "rtl";
  /** Explicit overrides are inherited by nested providers and owned portals. */
  tokens?: ThemeTokens;
}

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

/** A module boundary, never a document-global theme switch. */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  theme: controlledTheme,
  onThemeChange,
  storageKey,
  defaultSystemTheme = "light",
  dir,
  tokens,
}: ThemeProviderProps) {
  const parent = useContext(ThemeProviderContext);
  const root = useRef<HTMLDivElement>(null);
  const [preference, setPreference] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] =
    useState<ResolvedTheme>(defaultSystemTheme);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );
  const theme = controlledTheme ?? preference;
  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const direction = dir ?? parent?.dir ?? "ltr";
  const inheritedTokens = useMemo(
    () => ({ ...parent?.tokens, ...tokens }),
    [parent?.tokens, tokens],
  );

  useEffect(() => {
    setPortalHost(root.current?.ownerDocument.body ?? null);
  }, []);

  useEffect(() => {
    if (controlledTheme !== undefined || !storageKey) return;
    try {
      const stored =
        root.current?.ownerDocument.defaultView?.localStorage.getItem(
          storageKey,
        );
      if (isTheme(stored)) setPreference(stored);
    } catch {
      // Storage can be unavailable in sandboxed or privacy-restricted hosts.
    }
  }, [controlledTheme, storageKey]);

  useEffect(() => {
    if (theme !== "system") return;
    const view = root.current?.ownerDocument.defaultView;
    if (!view?.matchMedia) return;
    const query = view.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemTheme(query.matches ? "dark" : "light");
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [theme]);

  const value: ThemeState = {
    theme,
    resolvedTheme,
    dir: direction,
    tokens: inheritedTokens,
    portalContainer,
    setTheme(next) {
      if (!isTheme(next)) return;
      if (controlledTheme === undefined) {
        setPreference(next);
        if (storageKey) {
          try {
            root.current?.ownerDocument.defaultView?.localStorage.setItem(
              storageKey,
              next,
            );
          } catch {
            // An unavailable persistence layer must not disable the UI.
          }
        }
      }
      onThemeChange?.(next);
    },
  };
  const attributes = {
    "data-kozmos-root": "",
    "data-theme": resolvedTheme,
    dir: direction,
    style: { ...inheritedTokens, display: "contents" } as React.CSSProperties,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      <DirectionProvider dir={direction}>
        <div ref={root} {...attributes}>
          {children}
        </div>
        {portalHost &&
          createPortal(
            <div
              ref={setPortalContainer}
              data-kozmos-portal=""
              {...attributes}
            />,
            portalHost,
          )}
      </DirectionProvider>
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return {
    theme: context.theme,
    resolvedTheme: context.resolvedTheme,
    setTheme: context.setTheme,
  };
}
