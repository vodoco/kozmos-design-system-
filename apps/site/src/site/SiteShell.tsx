import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { useLocation } from "react-router";
import { Box, Link } from "@kozmos/react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/**
 * The path the last frame saw. Kept outside any component: a navigation
 * between the site's two frames (the reference's sidebar layout and the plain
 * one) mounts a new frame, and a new frame must still know that the page has
 * just changed — or focus would stay wherever it was, on the link or on the
 * body, for every header link between sections.
 */
let lastPathname: string | undefined;

/**
 * After a client-side navigation, focus moves to the main region, so a screen
 * reader lands on the new page's content instead of staying on the link that
 * was pressed. The first render is left alone.
 */
export function useFocusMainOnNavigate(main: RefObject<HTMLElement | null>) {
  const { pathname } = useLocation();
  useEffect(() => {
    if (lastPathname === undefined) {
      lastPathname = pathname;
      return;
    }
    if (lastPathname === pathname) return;
    lastPathname = pathname;
    main.current?.focus({ preventScroll: true });
  }, [main, pathname]);
}

/** The page frame: skip link, header, main and footer. */
export function SiteShell({ children }: { children: ReactNode }) {
  const main = useRef<HTMLElement>(null);
  useFocusMainOnNavigate(main);

  return (
    <Box className="site-shell">
      <Link href="#main" className="site-skip-link">
        Skip to content
      </Link>
      <SiteHeader />
      <main id="main" ref={main} tabIndex={-1} className="site-main">
        {children}
      </main>
      <SiteFooter />
    </Box>
  );
}
