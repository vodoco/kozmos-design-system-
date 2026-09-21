import { Container, Separator, Stack, Text } from "@kozmos/react";
import { SiteLink } from "./links";

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
              Kozmos design system. MIT licence.
            </Text>
            <nav aria-label="Footer" className="site-footer-nav">
              <Text as="span" size="sm">
                <SiteLink to="/get-started" variant="subtle">
                  Get started
                </SiteLink>
              </Text>
              <Text as="span" size="sm">
                <SiteLink to="/examples" variant="subtle">
                  Examples
                </SiteLink>
              </Text>
            </nav>
          </Stack>
        </Stack>
      </Container>
    </footer>
  );
}
