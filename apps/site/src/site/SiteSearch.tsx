import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Icon,
  IconButton,
  Listbox,
  SearchBar,
  Text,
  type ComboboxOption,
} from "@kozmos/react";
import { examples } from "../examples/manifest";
import { foundationPages } from "../foundations/nav";
import { componentIndex, laneTitle } from "../reference/nav";

interface Entry {
  to: string;
  label: string;
  description: string;
  group: "Pages" | "Foundations" | "Components" | "Examples";
}

/** Everything the site has a page for, from the same data the pages use. */
const entries: readonly Entry[] = [
  {
    to: "/get-started",
    label: "Get started",
    description:
      "Install, set up, dark mode, right to left, tokens, the platforms.",
    group: "Pages",
  },
  {
    to: "/foundations",
    label: "Foundations",
    description: "What every component is made from.",
    group: "Pages",
  },
  {
    to: "/components",
    label: "Components",
    description: `${componentIndex.components.length} components in four lanes, live.`,
    group: "Pages",
  },
  {
    to: "/examples",
    label: "Examples",
    description: "Pages and apps built from Kozmos and nothing else.",
    group: "Pages",
  },
  ...foundationPages.map(
    (page): Entry => ({
      to: `/foundations/${page.slug}`,
      label: page.title,
      description: page.summary,
      group: "Foundations",
    }),
  ),
  ...componentIndex.components.map(
    (component): Entry => ({
      to: `/components/${component.slug}`,
      label: component.name,
      description: component.description || laneTitle(component.lane),
      group: "Components",
    }),
  ),
  ...examples.map(
    (example): Entry => ({
      to: `/examples/${example.slug}`,
      label: example.title,
      description: example.summary,
      group: "Examples",
    }),
  ),
];

const LIMIT = 12;

function rank(entry: Entry, query: string) {
  const name = entry.label.toLowerCase();
  if (name === query) return 0;
  if (name.startsWith(query)) return 1;
  if (name.includes(query)) return 2;
  return 3;
}

function search(query: string): Entry[] {
  const trimmed = query.trim().toLowerCase();
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    // Nothing typed yet: the pages and the foundations, as a table of contents.
    return entries.filter(
      (entry) => entry.group === "Pages" || entry.group === "Foundations",
    );
  }
  return entries
    .filter((entry) => {
      const haystack = `${entry.label} ${entry.description}`.toLowerCase();
      return words.every((word) => haystack.includes(word));
    })
    .sort((a, b) => rank(a, trimmed) - rank(b, trimmed))
    .slice(0, LIMIT);
}

/**
 * The site's search: a dialog with a field and a list of everything that has
 * a page, opened from the header or with ⌘K / Ctrl+K anywhere. Enter opens
 * the first result; the arrow keys walk the list, as Listbox does.
 */
export function SiteSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = useRef<HTMLDivElement>(null);
  // A chosen result closes the dialog first and navigates once it has gone:
  // the navigation's focus on the new page's main (SiteShell) is then the
  // last word, not the dialog's return to the header button. Deferring is
  // what makes it hold in WebKit as well.
  const pending = useRef<string>(undefined);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const shown = useMemo(() => search(query), [query]);
  const options: ComboboxOption[] = shown.map((entry) => ({
    value: entry.to,
    label: entry.label,
    description: `${entry.group} · ${entry.description}`,
  }));

  function go(to: string) {
    pending.current = to;
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <IconButton
        aria-label="Search the site"
        variant="ghost"
        onClick={() => setOpen(true)}
      >
        <Icon name="search-md" size="sm" />
      </IconButton>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
      >
        <DialogContent
          className="site-search"
          onCloseAutoFocus={(event) => {
            const to = pending.current;
            if (!to) return;
            event.preventDefault();
            pending.current = undefined;
            navigate(to);
          }}
        >
          <DialogHeader>
            <DialogTitle>Search the site</DialogTitle>
            <DialogDescription>
              Components, examples, foundations and the pages. ⌘K or Ctrl+K
              opens this anywhere.
            </DialogDescription>
          </DialogHeader>
          <SearchBar
            variant="inline"
            aria-label="Search the site"
            placeholder="A component, an example, a page"
            value={query}
            onChange={setQuery}
            onClear={() => setQuery("")}
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Enter" && shown[0]) {
                event.preventDefault();
                go(shown[0].to);
              } else if (event.key === "ArrowDown") {
                event.preventDefault();
                results.current
                  ?.querySelector<HTMLElement>('[role="listbox"]')
                  ?.focus();
              }
            }}
          />
          <Box ref={results} className="site-search-results">
            {options.length > 0 ? (
              <Listbox
                aria-label="Results"
                options={options}
                onValueChange={(value) => {
                  if (typeof value === "string") go(value);
                }}
              />
            ) : (
              <Text size="sm" color="muted">
                Nothing has “{query.trim()}” in its name or its summary.
              </Text>
            )}
          </Box>
          <Text size="xs" color="muted">
            Enter opens the first result; the arrow keys walk the list.
          </Text>
        </DialogContent>
      </Dialog>
    </>
  );
}
