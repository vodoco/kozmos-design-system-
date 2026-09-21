import { Box, Navbar, Text } from "@kozmos/react";
import { SITE_NAME } from "../lib/site";
import { SiteLink, SiteNavItem } from "./links";
import { ThemeSwitcher } from "./ThemeSwitcher";

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
          <SiteNavItem to="/get-started">Get started</SiteNavItem>
          <SiteNavItem to="/examples">Examples</SiteNavItem>
        </Box>
      }
      utilities={<ThemeSwitcher />}
    />
  );
}
