import { Box, Stack, Text } from "@kozmos/react";
import { DocsPage, foundationMeta } from "../../foundations/DocsPage";
import { TokenTable } from "../../foundations/parts";
import { foundationPage } from "../../foundations/nav";
import { shortName, tokensWithPrefix } from "../../lib/tokens";
import { Section } from "../../site/Section";

const page = foundationPage("layout");

export function meta() {
  return foundationMeta(page);
}

/** A scale of unitless pixel tokens, each drawn as a bar of its length. */
function Scale({ prefix, caption }: { prefix: string; caption: string }) {
  const entries = tokensWithPrefix(`${prefix}-`);
  return (
    <Stack gap={2} role="list" aria-label={caption}>
      {entries.map((entry) => (
        <Box key={entry.name} className="site-scale-row" role="listitem">
          <Text as="span" size="sm" className="site-mono">
            {shortName(entry.name, prefix)}
          </Text>
          <Box
            className="site-bar"
            style={{ "--len": `var(${entry.name})` }}
            aria-hidden="true"
          />
          <Text as="span" size="sm" color="muted" className="site-mono">
            {entry.light}
          </Text>
        </Box>
      ))}
    </Stack>
  );
}

function Shapes({
  entries,
  prefix,
  unitless,
}: {
  entries: readonly { name: string; light: string }[];
  prefix: string;
  unitless: boolean;
}) {
  return (
    <Box className="site-shape-row">
      {entries.map((entry) => (
        <Box key={entry.name} className="site-shape-cell">
          <Box
            className="site-shape"
            aria-hidden="true"
            style={{
              "--radius": unitless
                ? `calc(var(${entry.name}) * 1px)`
                : `var(${entry.name})`,
            }}
          />
          <Text as="span" size="sm" className="site-mono">
            {shortName(entry.name, prefix)}
          </Text>
          <Text as="span" size="xs" color="muted" className="site-mono">
            {entry.light}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

export default function Layout() {
  const semanticRadius = tokensWithPrefix("--semantics-radius-");
  const primitiveRadius = tokensWithPrefix("--primitives-radius-");
  const screens = tokensWithPrefix("--primitives-screen-");
  const touch = tokensWithPrefix("--primitives-touch-");
  return (
    <DocsPage page={page}>
      <Section
        title="Spacing"
        lead="Unitless pixels, so one scale serves CSS, SwiftUI and Compose. On the web, multiply by 1px."
      >
        <Scale prefix="--primitives-layout-spacing" caption="Spacing scale" />
      </Section>

      <Section
        title="Sizing"
        lead="Control and icon sizes, on the same footing."
      >
        <Scale prefix="--primitives-layout-sizing" caption="Sizing scale" />
      </Section>

      <Section
        title="Radius roles"
        lead="Five roles, unitless like the spacing. Re-point one alias and every control, container or panel follows."
      >
        <Stack gap={6}>
          <Shapes
            entries={semanticRadius}
            prefix="--semantics-radius"
            unitless
          />
          <TokenTable
            entries={semanticRadius}
            caption="Radius roles"
            labelPrefix="--semantics-radius"
          />
        </Stack>
      </Section>

      <Section
        title="Radius primitives"
        lead="The rem-based scale the roles were drawn from, and the legacy per-part aliases (card, input, button, default) that older code still reads."
      >
        <Shapes
          entries={primitiveRadius}
          prefix="--primitives-radius"
          unitless={false}
        />
      </Section>

      <Section title="Border widths">
        <TokenTable
          entries={tokensWithPrefix("--primitives-border-width-")}
          caption="Border widths"
          labelPrefix="--primitives-border-width"
        />
      </Section>

      <Section
        title="Breakpoints"
        lead="Named for the device class, used by the components' responsive utilities. CSS variables cannot appear in a media query, so these are documentation on the web and values in the native token files."
      >
        <Stack gap={2} role="list" aria-label="Breakpoints">
          {screens.map((entry) => (
            <Box key={entry.name} className="site-scale-row" role="listitem">
              <Text as="span" size="sm" className="site-mono">
                {shortName(entry.name, "--primitives-screen")}
              </Text>
              <Box
                className="site-bar"
                aria-hidden="true"
                style={{ "--len": `calc(${parseInt(entry.light, 10)} / 4)` }}
              />
              <Text as="span" size="sm" color="muted" className="site-mono">
                {entry.light}
              </Text>
            </Box>
          ))}
        </Stack>
      </Section>

      <Section
        title="Touch targets"
        lead="The smallest target a control may present, and the comfortable one. Every Kozmos control meets the minimum; the search bar's and category field's clear buttons are 44 around a 32 circle."
      >
        <Box className="site-shape-row">
          {touch.map((entry) => (
            <Box key={entry.name} className="site-shape-cell">
              <Box
                className="site-shape"
                aria-hidden="true"
                style={{ "--radius": "var(--site-radius-control)" }}
              />
              <Text as="span" size="sm" className="site-mono">
                {shortName(entry.name, "--primitives-touch")} · {entry.light}
              </Text>
            </Box>
          ))}
        </Box>
      </Section>

      <Section
        title="Layers"
        lead="The z-index steps, for the components' stacking."
      >
        <TokenTable
          entries={tokensWithPrefix("--primitives-layer-")}
          caption="Layers"
          labelPrefix="--primitives-layer"
        />
      </Section>
    </DocsPage>
  );
}
