import { Container, Separator, Stack, Text } from "@kozmos/react";
import { SiteLink } from "./links";
import { primaryNavigation } from "./SiteHeader";

/** GAP-08: Kozmos has no footer, so this one is composed from its parts. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container>
        <Stack gap={4}>
          <Separator />
          <Stack
            direction="row"
            wrap="wrap"
            justify="between"
            align="center"
            gap={4}
          >
            <Text size="sm" color="muted">
              Kozmos design system. MIT licence. Pre-release.
            </Text>
            <nav aria-label="Footer" className="site-footer-nav">
              {primaryNavigation.map((item) => (
                <Text key={item.to} as="span" size="sm">
                  <SiteLink to={item.to} variant="subtle">
                    {item.label}
                  </SiteLink>
                </Text>
              ))}
            </nav>
          </Stack>
        </Stack>
      </Container>
    </footer>
  );
}
