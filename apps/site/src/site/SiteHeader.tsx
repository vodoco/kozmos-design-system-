import { Box, Navbar, Text } from "@kozmos/react";
import { SITE_NAME } from "../lib/site";
import { SiteLink, SiteNavItem } from "./links";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const primaryNavigation = [
  { to: "/foundations", label: "Foundations" },
  { to: "/components", label: "Components" },
  { to: "/examples", label: "Examples" },
  { to: "/get-started", label: "Get started" },
] as const;

export function SiteHeader() {
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
        <Box className="site-header-nav">
          {primaryNavigation.map((item) => (
            <SiteNavItem key={item.to} to={item.to}>
              {item.label}
            </SiteNavItem>
          ))}
        </Box>
      }
      utilities={<ThemeSwitcher />}
    />
  );
}
