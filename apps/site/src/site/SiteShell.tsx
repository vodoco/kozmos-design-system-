import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { useLocation } from "react-router";
import { Box, Link } from "@kozmos/react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/**
 * After a client-side navigation, focus moves to the main region, so a screen
 * reader lands on the new page's content instead of staying on the link that
 * was pressed. The first render is left alone.
 */
export function useFocusMainOnNavigate(main: RefObject<HTMLElement | null>) {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
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
