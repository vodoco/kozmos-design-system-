import "@kozmos/react/style.css";
import type { ReactNode } from "react";
import { ThemeProvider } from "@kozmos/react";

export function App({ children }: { children: ReactNode }) {
  return <ThemeProvider defaultTheme="system">{children}</ThemeProvider>;
}
