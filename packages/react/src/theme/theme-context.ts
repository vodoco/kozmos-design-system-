import { createContext } from "react";
import type {
  Theme,
  ResolvedTheme,
  ThemeTokens,
} from "../components/ThemeProvider/ThemeProvider";
export interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  dir: "ltr" | "rtl";
  tokens: ThemeTokens;
  portalContainer: HTMLDivElement | null;
}

export const ThemeProviderContext = createContext<ThemeState | undefined>(
  undefined,
);
