import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Chip,
  ChipGroup,
  Container,
  Heading,
  Icon,
  SearchBar,
  SegmentedControl,
  Stack,
  Surface,
  Switch,
  Tag,
  Text,
  ThemeProvider,
  type IconProps,
} from "@kozmos/react";
import { examples, exampleKindLabel } from "../examples/manifest";
import { PACKAGES_PUBLISHED, pageTitle } from "../lib/site";
import { ButtonLink, SiteLink } from "../site/links";
import { Section } from "../site/Section";

export function meta() {
  return [
    { title: pageTitle() },
    {
      name: "description",
      content:
        "Kozmos is the design system for the Pointr SDK: core controls and map, POI and wayfinding components, from one set of tokens on the web, iOS and Android.",
    },
  ];
}

const features: {
  icon: NonNullable<IconProps["name"]>;
  title: string;
  description: string;
}[] = [
  {
    icon: "layout-alt-02",
    title: "One source of tokens",
    description:
      "Colour, type, spacing, radius, elevation and motion are generated once, as CSS variables, JavaScript, Swift and Kotlin.",
  },
  {
    icon: "globe-02",
    title: "Web, iOS and Android",
    description:
      "React, SwiftUI and Jetpack Compose components held to shared contracts, which CI compares on every pull request.",
  },
  {
    icon: "feather",
    title: "Linked to Figma",
    description:
      "Code Connect is published for the Figma library, so Dev Mode shows a component's React, SwiftUI and Compose code beside its design.",
  },
  {
    icon: "settings-01",
    title: "Themes that stay in their module",
    description:
      "A ThemeProvider scopes light or dark, direction and token overrides to its own subtree, and its overlays follow it.",
  },
  {
    icon: "flip-backward",
    title: "Right to left",
    description:
      'Set dir="rtl" on a provider and both the layout and the keyboard navigation of everything inside it follow.',
  },
  {
    icon: "map-01",
    title: "Map layouts that fit their container",
    description:
      "AdaptiveMapShell puts its panel beside or below the map from the container's size, and reports the space the map can use.",
  },
  {
    icon: "check",
    title: "Accessibility in CI",
    description:
      "Contrast contracts between token pairs and accessibility audits of the component stories run on every pull request.",
  },
  {
    icon: "activity",
    title: "Renders on the server",
    description:
      "The React package renders on a server and marks itself as client code for Server Components. This site is pre-rendered with it.",
  },
];

const platforms = [
  {
    title: "Web",
    technology: "React 18 and 19",
    status: PACKAGES_PUBLISHED ? "On npm" : "npm soon",
    description: PACKAGES_PUBLISHED
      ? "@kozmos/react, with its tokens, icons and contracts."
      : "@kozmos/react is ready for npm and not yet published. Apps inside the repository use it today.",
  },
  {
    title: "iOS",
    technology: "SwiftUI · iOS 16 and later",
    status: "In the repository",
    description:
      "The Kozmos Swift package in packages/ios. It is not distributed through a registry yet.",
  },
  {
    title: "Android",
    technology: "Jetpack Compose",
    status: "In the repository",
    description:
      "The Compose library module in packages/android. It is not published to a Maven repository yet.",
  },
];

const demoFilters = ["Open now", "Step-free", "Food and drink"];

/**
 * A live corner of the system with its own ThemeProvider: its theme and
 * direction change here without touching the rest of the page.
 */
function ScopedDemo() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<ReadonlySet<string>>(
    () => new Set(["Open now"]),
  );
  const [avoidStairs, setAvoidStairs] = useState(true);

  function toggleFilter(filter: string) {
    setFilters((current) => {
      const next = new Set(current);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  }

  return (
    <Card>
      <Box className="site-demo">
        <Box className="site-demo-controls">
          <SegmentedControl
            label="This card's theme"
            size="sm"
            items={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
            value={theme}
            onValueChange={(next) => {
              if (next === "light" || next === "dark") setTheme(next);
            }}
          />
          <SegmentedControl
            label="Direction"
            size="sm"
            items={[
              { value: "ltr", label: "Left to right" },
              { value: "rtl", label: "Right to left" },
            ]}
            value={dir}
            onValueChange={(next) => {
              if (next === "ltr" || next === "rtl") setDir(next);
            }}
          />
        </Box>
        <ThemeProvider theme={theme} dir={dir}>
          <Surface className="site-demo-surface">
            <Stack gap={4}>
              <SearchBar
                aria-label="Search this building"
                placeholder="Search this building"
                value={query}
                onChange={setQuery}
                onClear={() => setQuery("")}
                variant="inline"
              />
              <ChipGroup aria-label="Filters">
                {demoFilters.map((filter) => (
                  <Chip
                    key={filter}
                    size="sm"
                    selected={filters.has(filter)}
                    onClick={() => toggleFilter(filter)}
                  >
                    {filter}
                  </Chip>
                ))}
              </ChipGroup>
              <Switch
                label="Avoid stairs"
                checked={avoidStairs}
                onCheckedChange={setAvoidStairs}
              />
              <Box className="site-demo-row">
                <Button emotion="themed">Get directions</Button>
                <Button variant="outline">Save place</Button>
              </Box>
            </Stack>
          </Surface>
        </ThemeProvider>
      </Box>
    </Card>
  );
}

export default function Home() {
  return (
    <Container>
      <section className="site-hero" aria-labelledby="home-title">
        <Box className="site-hero-copy">
          {PACKAGES_PUBLISHED ? null : (
            <Tag variant="outline" emotion="informative">
              Pre-release
            </Tag>
          )}
          <Heading level={1} id="home-title">
            The design system for the Pointr SDK
          </Heading>
          <Text size="lg" color="muted">
            Kozmos gives maps, places and wayfinding one set of parts: core
            controls and product components, drawn from the same tokens on the
            web, iOS and Android.
          </Text>
          <Box className="site-actions">
            <ButtonLink to="/get-started" size="lg">
              Get started
            </ButtonLink>
            <ButtonLink to="/examples" variant="outline" size="lg">
              Browse examples
            </ButtonLink>
          </Box>
        </Box>
        <ScopedDemo />
      </section>

      <Section
        title="What is in it"
        lead="Components are one layer. The rest is what keeps them the same everywhere."
      >
        <Box className="site-grid site-grid-auto">
          {features.map((feature) => (
            <Card key={feature.title} className="site-card-fill">
              <CardHeader>
                <Icon name={feature.icon} color="primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </Box>
      </Section>

      <Section
        title="Platforms"
        lead="The same components, contracts and tokens, three ways."
      >
        <Box className="site-grid site-grid-auto">
          {platforms.map((platform) => (
            <Card key={platform.title} className="site-card-fill">
              <CardHeader>
                <Stack direction="row" align="center" justify="between" gap={2}>
                  <CardTitle>{platform.title}</CardTitle>
                  <Tag variant="outline">{platform.status}</Tag>
                </Stack>
                <Text size="sm" weight="medium">
                  {platform.technology}
                </Text>
                <CardDescription>{platform.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </Box>
      </Section>

      <Section
        title="Examples"
        lead="Pages and apps built from Kozmos components and nothing else. Where Kozmos falls short, the example says so."
      >
        <Box className="site-grid site-grid-wide">
          {examples.map((example) => (
            <Card key={example.slug} className="site-card-fill">
              <CardHeader>
                <Stack direction="row" align="center" justify="between" gap={2}>
                  <CardTitle>{example.title}</CardTitle>
                  <Tag variant="secondary">
                    {exampleKindLabel[example.kind]}
                  </Tag>
                </Stack>
                <CardDescription>{example.summary}</CardDescription>
                <Text size="sm">
                  <SiteLink to={`/examples/${example.slug}`}>
                    Open {example.title}
                  </SiteLink>
                </Text>
              </CardHeader>
            </Card>
          ))}
        </Box>
      </Section>
    </Container>
  );
}
