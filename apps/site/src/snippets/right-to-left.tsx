import type { ReactNode } from "react";
import { ThemeProvider } from "@kozmos/react";

export function ArabicModule({ children }: { children: ReactNode }) {
  return <ThemeProvider dir="rtl">{children}</ThemeProvider>;
}
