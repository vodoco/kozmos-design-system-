import { SegmentedControl, useTheme, type Theme } from "@kozmos/react";

const options: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

function isTheme(value: string | undefined): value is Theme {
  return options.some((option) => option.value === value);
}

/**
 * Chooses the nearest ThemeProvider's theme. Words, not glyphs: the icon set
 * has no sun, moon or display (GAPS.md, GAP-07).
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <SegmentedControl
      aria-label="Colour theme"
      size="sm"
      items={options}
      value={theme}
      // A second press on the chosen segment reports undefined; the theme
      // always has a value, so that press changes nothing.
      onValueChange={(next) => {
        if (isTheme(next)) setTheme(next);
      }}
    />
  );
}
