import { useRef, useState, type ReactNode } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Icon,
  Link,
  Sidebar,
  Stack,
  Text,
} from "@kozmos/react";
import { SiteNavItem } from "./links";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { useFocusMainOnNavigate } from "./SiteShell";

export interface DocsSection {
  title: string;
  /** One line under the title in the navigation. */
  summary: string;
  pages: readonly { to: string; title: string; end?: boolean }[];
}

/**
 * The frame for reference pages: the site header, a section sidebar beside
 * the content, the footer. The sidebar is Kozmos's, an <aside> kept outside
 * <main> so it stays a top-level landmark. On a narrow screen it gives way
 * to a Drawer opened from a button above the content.
 */
export function DocsShell({
  section,
  children,
}: {
  section: DocsSection;
  children: ReactNode;
}) {
  const main = useRef<HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  useFocusMainOnNavigate(main);

  const navigation = (onNavigate?: () => void) => (
    <Stack gap={1}>
      {section.pages.map((page) => (
        <SiteNavItem
          key={page.to}
          to={page.to}
          end={page.end ?? true}
          placement="side"
          onNavigate={onNavigate}
        >
          {page.title}
        </SiteNavItem>
      ))}
    </Stack>
  );

  return (
    <Box className="site-shell">
      <Link href="#main" className="site-skip-link">
        Skip to content
      </Link>
      <SiteHeader />
      <Box className="site-docs">
        <Box className="site-docs-aside">
          <Sidebar
            aria-label={section.title}
            className="site-docs-sidebar"
            header={
              <Stack gap={1}>
                <Text as="span" weight="semibold">
                  {section.title}
                </Text>
                <Text as="span" size="sm" color="muted">
                  {section.summary}
                </Text>
              </Stack>
            }
            navigation={navigation()}
          />
        </Box>
        <Box className="site-docs-body">
          <Box className="site-docs-toolbar">
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                  <Icon name="menu" size="sm" />
                  {section.title}
                </Button>
              </DrawerTrigger>
              <DrawerContent side="left">
                <DrawerHeader>
                  <DrawerTitle>{section.title}</DrawerTitle>
                  <DrawerDescription>{section.summary}</DrawerDescription>
                </DrawerHeader>
                {navigation(() => setDrawerOpen(false))}
              </DrawerContent>
            </Drawer>
          </Box>
          <main id="main" ref={main} tabIndex={-1} className="site-main">
            {children}
          </main>
        </Box>
      </Box>
      <SiteFooter />
    </Box>
  );
}
