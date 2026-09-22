import { useState } from "react";
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Icon,
  IconButton,
  Navbar,
  Stack,
  Text,
} from "@kozmos/react";
import { SITE_NAME } from "../lib/site";
import { SiteLink, SiteNavItem } from "./links";
import { SiteSearch } from "./SiteSearch";
import { ThemeMenu } from "./ThemeMenu";

export const primaryNavigation = [
  { to: "/foundations", label: "Foundations" },
  { to: "/components", label: "Components" },
  { to: "/examples", label: "Examples" },
  { to: "/get-started", label: "Get started" },
] as const;

/**
 * One row at every width. Kozmos's Navbar gives its leading group a 32rem
 * basis, so anything in its trailing slot drops to a second row on a phone
 * (GAPS.md, GAP-41). Everything therefore goes in the navigation slot: the
 * page links, which a narrow screen moves into a drawer, and the three small
 * tools — theme, search, and the drawer's button.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Navbar
      navigationLabel="Site"
      logo={
        <SiteLink to="/" variant="subtle">
          <Text as="span" size="lg" weight="bold">
            {SITE_NAME}
          </Text>
        </SiteLink>
      }
      navigation={
        <Box className="site-header-bar">
          <Box className="site-header-links">
            {primaryNavigation.map((item) => (
              <SiteNavItem key={item.to} to={item.to}>
                {item.label}
              </SiteNavItem>
            ))}
          </Box>
          <Box className="site-header-tools">
            <ThemeMenu />
            <SiteSearch />
            <Box className="site-header-menu">
              <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
                <DrawerTrigger asChild>
                  <IconButton variant="ghost" aria-label="Site menu">
                    <Icon name="menu-01" size="sm" />
                  </IconButton>
                </DrawerTrigger>
                <DrawerContent side="right">
                  <DrawerHeader>
                    <DrawerTitle>{SITE_NAME}</DrawerTitle>
                    <DrawerDescription>
                      The design system for the Pointr SDK.
                    </DrawerDescription>
                  </DrawerHeader>
                  <nav aria-label="Site" className="site-header-drawer-nav">
                    <Stack gap={1}>
                      {primaryNavigation.map((item) => (
                        <SiteNavItem
                          key={item.to}
                          to={item.to}
                          placement="side"
                          onNavigate={() => setMenuOpen(false)}
                        >
                          {item.label}
                        </SiteNavItem>
                      ))}
                    </Stack>
                  </nav>
                </DrawerContent>
              </Drawer>
            </Box>
          </Box>
        </Box>
      }
    />
  );
}
