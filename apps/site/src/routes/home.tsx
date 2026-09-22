import {
  Box,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Heading,
  Stack,
  Tag,
  Text,
} from "@kozmos/react";
import { examples, exampleKindLabel } from "../examples/manifest";
import { exampleComponents, miniatureSize } from "../examples/registry";
import { HeroScene } from "../home/HeroScene";
import { MakeItYours } from "../home/MakeItYours";
import { Checklist } from "../home/Pipeline";
import {
  AdaptiveTile,
  ContrastTile,
  EmotionsTile,
  PlatformsTile,
  TokensTile,
} from "../home/tiles";
import { PACKAGES_PUBLISHED, pageTitle } from "../lib/site";
import { ExampleMiniature } from "../site/ExampleMiniature";
import { ButtonLink, SiteLink } from "../site/links";
import { Reveal } from "../site/Reveal";
import { Section } from "../site/Section";

export function meta() {
  return [
    { title: pageTitle() },
    {
      name: "description",
      content:
        "Kozmos is the design system for the Pointr SDK: core controls and map, POI and wayfinding components, from one set of tokens on the web, iOS and Android. Every part on this page is live.",
    },
  ];
}

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
  {
    title: "Figma",
    technology: "The Core Library",
    status: "Code Connect",
    description:
      "Painted from the same tokens by an importer plugin; every variant is checked against the code's contract, and Dev Mode shows each part's React, SwiftUI and Compose.",
  },
];

/** Three examples that look nothing alike: a map app, a phone, a console. */
const featured = examples.filter((example) => example.featured);

/**
 * The home page, in the order a visitor asks: what is it (the hero), what
 * has been built with it (the examples), what can it do (five live tiles),
 * can it be ours (a brand module), where does it run, and how is it kept
 * honest. Bands alternate plain and muted, each with the same padding.
 */
export default function Home() {
  return (
    <>
      <Container>
        <section className="site-hero" aria-labelledby="home-title">
          <Box className="site-hero-copy">
            {PACKAGES_PUBLISHED ? null : (
              <Tag variant="outline" emotion="informative">
                Pre-release
              </Tag>
            )}
            <Heading level={1} id="home-title" className="site-display">
              The design system for the Pointr SDK
            </Heading>
            <Text size="lg" color="muted">
              Maps, places and wayfinding, from one set of parts: core controls
              and product components drawn from the same tokens on the web, iOS
              and Android. Everything on this page is the real thing, running.
            </Text>
            <Box className="site-actions">
              <ButtonLink to="/get-started" size="lg">
                Get started
              </ButtonLink>
              <ButtonLink to="/components" variant="outline" size="lg">
                Browse components
              </ButtonLink>
            </Box>
          </Box>
          <HeroScene />
        </section>
      </Container>

      <Box className="site-band site-band-muted">
        <Container>
          <Reveal>
            <Section
              title="Built from it"
              lead="Pages and apps made of Kozmos components and nothing else, shown here live and small. Each one records where Kozmos fell short."
              actions={
                <Text size="sm">
                  <SiteLink to="/examples">
                    All {examples.length} examples
                  </SiteLink>
                </Text>
              }
            >
              <Box className="site-grid site-grid-3">
                {featured.map((example) => {
                  const Example = exampleComponents[example.slug];
                  const size = miniatureSize[example.kind];
                  return (
                    <Card key={example.slug} className="site-example-card">
                      {Example ? (
                        <ExampleMiniature
                          label={`${example.title} example, shown small`}
                          width={size.width}
                          height={size.height}
                        >
                          <Example />
                        </ExampleMiniature>
                      ) : null}
                      <CardHeader>
                        <Stack
                          direction="row"
                          align="center"
                          justify="between"
                          gap={2}
                        >
                          <CardTitle>{example.title}</CardTitle>
                          <Tag variant="secondary">
                            {exampleKindLabel[example.kind]}
                          </Tag>
                        </Stack>
                        <CardDescription>
                          {example.tagline ?? example.summary}
                        </CardDescription>
                        <Text size="sm">
                          <SiteLink to={`/examples/${example.slug}`}>
                            Open {example.title}
                          </SiteLink>
                        </Text>
                      </CardHeader>
                    </Card>
                  );
                })}
              </Box>
            </Section>
          </Reveal>
        </Container>
      </Box>

      <Box className="site-band">
        <Container>
          <Reveal>
            <Section
              title="See it work"
              lead="Not screenshots. Each tile is Kozmos rendering itself, with something to press."
            >
              <Box className="site-bento">
                <AdaptiveTile />
                <PlatformsTile />
                <TokensTile />
                <EmotionsTile />
                <ContrastTile />
              </Box>
              <Text size="sm" color="muted">
                More in Foundations:{" "}
                <SiteLink to="/foundations/typography">type</SiteLink>,{" "}
                <SiteLink to="/foundations/motion">motion</SiteLink>,{" "}
                <SiteLink to="/foundations/elevation">
                  elevation and glass
                </SiteLink>
                , <SiteLink to="/foundations/icons">icons</SiteLink> and{" "}
                <SiteLink to="/foundations/theming">theming</SiteLink>.
              </Text>
            </Section>
          </Reveal>
        </Container>
      </Box>

      <Box className="site-band site-band-muted">
        <Container>
          <Reveal>
            <Section
              title="Make it yours"
              lead="A product re-points tokens through the provider, per module, without a rebuild. The tokens carry two variant brand ramps; try them, dark, and right to left."
            >
              <MakeItYours />
            </Section>
          </Reveal>
        </Container>
      </Box>

      <Box className="site-band">
        <Container>
          <Reveal>
            <Section
              title="Web, iOS, Android and Figma"
              lead="React, SwiftUI and Jetpack Compose read the same tokens and are held to shared contracts that CI compares on every pull request; the Figma library is painted from the same tokens and linked to all three."
            >
              <Box className="site-grid site-grid-4">
                {platforms.map((platform) => (
                  <Card key={platform.title} className="site-card-fill">
                    <CardHeader>
                      <Stack
                        direction="row"
                        align="center"
                        justify="between"
                        gap={2}
                      >
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
          </Reveal>
        </Container>
      </Box>

      <Box className="site-band site-band-muted">
        <Container>
          <Reveal>
            <Section
              title="Checked on every pull request"
              lead="What the workflow runs before anything merges."
              actions={
                <Text size="sm">
                  <SiteLink to="/get-started#checks">
                    What each check does
                  </SiteLink>
                </Text>
              }
            >
              <Checklist />
            </Section>
          </Reveal>
        </Container>
      </Box>
    </>
  );
}
