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
import { Pipeline } from "../home/Pipeline";
import {
  AdaptiveTile,
  ContrastTile,
  DirectionTile,
  EmotionsTile,
  FigmaTile,
  GlassTile,
  IconsTile,
  MotionTile,
  PlatformsTile,
  ThemeTile,
  TokensTile,
  TypeTile,
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
];

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
              <ButtonLink to="/foundations" variant="outline" size="lg">
                Foundations
              </ButtonLink>
              <ButtonLink to="/examples" variant="ghost" size="lg">
                Examples
              </ButtonLink>
            </Box>
          </Box>
          <HeroScene />
        </section>
      </Container>

      <Box className="site-band">
        <Container>
          <Reveal>
            <Section
              title="See it work"
              lead="Not screenshots. Each tile is Kozmos rendering itself, with something to press."
            >
              <Box className="site-bento">
                <TokensTile />
                <TypeTile />
                <EmotionsTile />
                <AdaptiveTile />
                <PlatformsTile />
                <ThemeTile />
                <ContrastTile />
                <MotionTile />
                <DirectionTile />
                <GlassTile />
                <IconsTile />
                <FigmaTile />
              </Box>
            </Section>
          </Reveal>
        </Container>
      </Box>

      <Container className="site-page">
        <Reveal>
          <Section
            title="Make it yours"
            lead="A product re-points tokens through the provider, per module, without a rebuild. The tokens carry two variant brand ramps; try them, dark, and right to left."
          >
            <MakeItYours />
          </Section>
        </Reveal>
      </Container>

      <Box className="site-band site-band-tint">
        <Container>
          <Reveal>
            <Section
              title="Built from it"
              lead="Pages and apps made of Kozmos components and nothing else, shown here live and small. Each one records where Kozmos fell short."
              actions={
                <Text size="sm">
                  <SiteLink to="/examples">All examples</SiteLink>
                </Text>
              }
            >
              <Box className="site-grid site-grid-wide">
                {examples.map((example) => {
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
                        <CardDescription>{example.summary}</CardDescription>
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

      <Container className="site-page">
        <Reveal>
          <Section
            title="Three platforms, one contract"
            lead="React, SwiftUI and Jetpack Compose components read the same tokens and are held to shared contracts that CI compares on every pull request."
          >
            <Box className="site-grid site-grid-auto">
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
        <Reveal>
          <Section
            title="Checked on every pull request"
            lead="What the workflow runs before anything merges, in the order it runs it."
          >
            <Pipeline />
          </Section>
        </Reveal>
      </Container>
    </>
  );
}
