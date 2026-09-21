import { useState, type ReactNode } from "react";
import {
  AdaptiveMapShell,
  Box,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
  MapView,
  SegmentedControl,
  Slider,
  Stack,
  Surface,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  Text,
  ThemeProvider,
  type IconProps,
} from "@kozmos/react";
import { kozmosIconNames } from "@kozmos/icons";
import { DirectionSample } from "../foundations/DirectionSample";
import { GlassStage } from "../foundations/GlassStage";
import { MotionRace } from "../foundations/MotionRace";
import button from "../generated/components/button.json";
import contract from "../generated/contrast-contract.json";
import { contrastRatio, formatRatio, parseColour } from "../lib/contrast";
import { ramp, token } from "../lib/tokens";
import { CodeBlock } from "../site/CodeBlock";
import { SiteLink } from "../site/links";

function Tile({
  span,
  title,
  description,
  children,
}: {
  span: 4 | 6 | 8;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className={`site-tile site-tile-${span}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Box className="site-tile-body">{children}</Box>
    </Card>
  );
}

function SwatchRow({ prefix, label }: { prefix: string; label: string }) {
  return (
    <Stack gap={1}>
      <Text as="span" size="xs" color="muted" className="site-mono">
        {label}
      </Text>
      <Box className="site-swatch-row" aria-hidden="true">
        {ramp(prefix).map((entry) => (
          <Box
            key={entry.name}
            className="site-swatch-cell"
            style={{ "--swatch": `var(${entry.name})` }}
          />
        ))}
      </Box>
    </Stack>
  );
}

export function TokensTile() {
  const [dark, setDark] = useState(false);
  return (
    <Tile
      span={4}
      title="One set of tokens"
      description="Colour, type, spacing, radius, elevation and motion, generated once as CSS, JavaScript, Swift and Kotlin. Flip this tile's theme and watch the ramps."
    >
      <Switch label="Dark" checked={dark} onCheckedChange={setDark} />
      {/* A provider paints nothing itself (display: contents), so the nested
          theme gets a Surface of its own to sit on. */}
      <ThemeProvider theme={dark ? "dark" : "light"}>
        <Surface className="site-theme-sample">
          <SwatchRow
            prefix="--primitives-colors-background"
            label="background"
          />
          <SwatchRow prefix="--primitives-colors-theme" label="theme" />
          <SwatchRow
            prefix="--primitives-colors-emotional-success"
            label="success"
          />
          <SwatchRow
            prefix="--primitives-colors-emotional-danger"
            label="danger"
          />
        </Surface>
      </ThemeProvider>
      <Text size="sm">
        <SiteLink to="/foundations/colour">Every ramp and role</SiteLink>
      </Text>
    </Tile>
  );
}

const textSizes = [
  "4xl",
  "3xl",
  "2xl",
  "xl",
  "lg",
  "base",
  "sm",
  "xs",
] as const;

export function TypeTile() {
  return (
    <Tile
      span={4}
      title="A type scale"
      description="Eight sizes and four weights on Text; Heading takes the top six."
    >
      <Box className="site-type-scale">
        {textSizes.map((size) => (
          <Stack key={size} direction="row" align="baseline" gap={3}>
            <Text as="span" size="xs" color="muted" className="site-mono">
              {size}
            </Text>
            <Text as="span" size={size} weight="semibold" truncate>
              Find your way
            </Text>
          </Stack>
        ))}
      </Box>
      <Text size="sm">
        <SiteLink to="/foundations/typography">
          Families, tokens and sizes
        </SiteLink>
      </Text>
    </Tile>
  );
}

const emotions = [
  "themed",
  "neutral",
  "success",
  "danger",
  "informative",
  "alert",
] as const;

export function EmotionsTile() {
  return (
    <Tile
      span={4}
      title="Six meanings"
      description="A button says what it does: themed, neutral, success, danger, informative or alert, filled or outlined, from the same tokens on every platform."
    >
      <Box className="site-emotions">
        {emotions.map((emotion) => (
          <Button key={emotion} emotion={emotion}>
            {emotion}
          </Button>
        ))}
        {emotions.map((emotion) => (
          <Button
            key={`${emotion}-outline`}
            emotion={emotion}
            variant="outline"
          >
            {emotion}
          </Button>
        ))}
      </Box>
    </Tile>
  );
}

export function AdaptiveTile() {
  const [width, setWidth] = useState(720);
  const [presentation, setPresentation] = useState<string>("side");
  return (
    <Tile
      span={8}
      title="A map layout that fits its container"
      description="AdaptiveMapShell puts its panel beside the map or below it from the space it has, not the viewport, and tells the map engine what it can use. Resize the host."
    >
      <Slider
        label="Host width"
        min={320}
        max={960}
        step={10}
        value={[width]}
        onValueChange={([value]) => {
          if (value !== undefined) setWidth(value);
        }}
        formatValue={(value) => `${value}px`}
      />
      <Box className="site-adaptive-host" style={{ "--host-width": width }}>
        <AdaptiveMapShell
          mapLabel="Map area"
          panelLabel="Selected place"
          map={
            <MapView mapLabel="Map engine slot">
              <Box className="site-adaptive-map">
                <Text size="sm" color="muted">
                  Map engine
                </Text>
              </Box>
            </MapView>
          }
          panel={
            <Box className="site-adaptive-panel">
              <Text weight="semibold">Bookshop</Text>
              <Text size="sm" color="muted">
                First floor · 3 min on foot
              </Text>
              <Button size="sm">Directions</Button>
            </Box>
          }
          onLayoutChange={(layout) => setPresentation(layout.presentation)}
        />
      </Box>
      <Stack direction="row" align="center" gap={2}>
        <Text as="span" size="sm" color="muted">
          Panel presentation
        </Text>
        <Tag variant="secondary">{presentation}</Tag>
      </Stack>
    </Tile>
  );
}

const platforms = [
  { value: "react", label: "React", file: "Button.tsx" },
  { value: "swift", label: "SwiftUI", file: "Button.swift" },
  { value: "kotlin", label: "Compose", file: "Button.kt" },
] as const;

export function PlatformsTile() {
  const snippets = button.snippets as Partial<
    Record<(typeof platforms)[number]["value"], string>
  >;
  return (
    <Tile
      span={4}
      title="Three platforms, one part"
      description="The same Button in React, SwiftUI and Jetpack Compose, from the component's own documentation."
    >
      <Tabs defaultValue="react">
        <TabsList aria-label="Platform">
          {platforms.map((platform) => (
            <TabsTrigger key={platform.value} value={platform.value}>
              {platform.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {platforms.map((platform) => (
          <TabsContent key={platform.value} value={platform.value}>
            {snippets[platform.value] ? (
              <CodeBlock
                label={platform.file}
                code={snippets[platform.value] ?? ""}
              />
            ) : (
              <Text size="sm" color="muted">
                No {platform.label} snippet in the docs.
              </Text>
            )}
          </TabsContent>
        ))}
      </Tabs>
      <Text size="sm">
        <SiteLink to="/components/button">The Button, in full</SiteLink>
      </Text>
    </Tile>
  );
}

const featuredPairs = [
  "primary action",
  "muted foreground on app background",
  "selected navigation item",
  "button outline border idle",
];

export function ContrastTile() {
  const pairs = (
    contract.pairs as {
      name: string;
      background: string;
      foreground: string;
      minimum: number;
    }[]
  ).filter((pair) => featuredPairs.includes(pair.name));
  return (
    <Tile
      span={4}
      title="Contrast, under contract"
      description="Twenty-two colour pairs are measured in both themes on every pull request. Four of them, measured here from the same token values."
    >
      <Stack gap={3}>
        {pairs.map((pair) => {
          const bg = token(`--${pair.background}`);
          const fg = token(`--${pair.foreground}`);
          const ratios = (["light", "dark"] as const).map((theme) => {
            const b = bg && parseColour(bg[theme]);
            const f = fg && parseColour(fg[theme]);
            return b && f ? contrastRatio(f, b) : undefined;
          });
          const ok = ratios.every(
            (ratio) => ratio !== undefined && ratio >= pair.minimum,
          );
          return (
            <Box key={pair.name} className="site-pair">
              <Box
                className="site-pair-sample"
                aria-hidden="true"
                style={{
                  "--pair-bg": `var(--${pair.background})`,
                  "--pair-fg": `var(--${pair.foreground})`,
                }}
              >
                <Text as="span" weight="semibold" className="site-pair-text">
                  Aa
                </Text>
              </Box>
              <Stack gap={0}>
                <Text as="span" size="sm" weight="medium">
                  {pair.name}
                </Text>
                <Text as="span" size="xs" color="muted" className="site-mono">
                  {ratios
                    .map((ratio) =>
                      ratio === undefined ? "?" : formatRatio(ratio),
                    )
                    .join(" · ")}{" "}
                  · min {pair.minimum}:1
                </Text>
              </Stack>
              <Tag emotion={ok ? "success" : "danger"} variant="outline">
                {ok ? "Pass" : "Fail"}
              </Tag>
            </Box>
          );
        })}
      </Stack>
      <Text size="sm">
        <SiteLink to="/foundations/colour">All twenty-two pairs</SiteLink>
      </Text>
    </Tile>
  );
}

export function MotionTile() {
  return (
    <Tile
      span={4}
      title="Motion from tokens"
      description="Three durations and two curves. The markers travel on the tokens; so does everything that moves in the components."
    >
      <MotionRace compact />
    </Tile>
  );
}

export function DirectionTile() {
  return (
    <Tile
      span={4}
      title="Right to left"
      description="Set dir on a provider and the layout, the icons' slots and Radix's keyboard navigation follow."
    >
      <DirectionSample compact />
    </Tile>
  );
}

export function GlassTile() {
  return (
    <Tile
      span={4}
      title="Glass, when asked for"
      description="A material a product chooses per surface, from the effect tokens. With transparency reduced, it is the plain colour."
    >
      <GlassStage />
    </Tile>
  );
}

const iconSample = [...kozmosIconNames].slice(0, 24) as NonNullable<
  IconProps["name"]
>[];

export function IconsTile() {
  return (
    <Tile
      span={4}
      title={`${kozmosIconNames.length} icons`}
      description="Stable keys, aliases for the common ones, and outlines matched to the Figma library by component key."
    >
      <Box className="site-icon-grid" aria-hidden="true">
        {iconSample.map((name) => (
          <Box key={name} className="site-icon-cell">
            <Icon name={name} />
          </Box>
        ))}
      </Box>
      <Text size="sm">
        <SiteLink to="/foundations/icons">Search the set</SiteLink>
      </Text>
    </Tile>
  );
}

export function FigmaTile() {
  return (
    <Tile
      span={4}
      title="Designed in Figma, linked to code"
      description="The Core Library is painted by an importer plugin from the same tokens, and Code Connect is published for all three platforms, so Dev Mode shows a component's React, SwiftUI and Compose beside its design."
    >
      <Stack direction="row" wrap="wrap" gap={2}>
        <Tag emotion="success" variant="outline">
          Code Connect published
        </Tag>
        <Tag variant="secondary">React</Tag>
        <Tag variant="secondary">SwiftUI</Tag>
        <Tag variant="secondary">Compose</Tag>
      </Stack>
      <Text size="sm" color="muted">
        Every variant in Figma is verified against the code’s contract before a
        set is updated; the library is never rebuilt, only updated, so the node
        ids Code Connect pins stay stable.
      </Text>
    </Tile>
  );
}

export function ThemeTile() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <Tile
      span={4}
      title="Themes that stay in their module"
      description="A ThemeProvider owns its subtree, never the document, and its overlays follow it. Two providers can disagree on one page."
    >
      <SegmentedControl
        label="This tile's theme"
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
      <ThemeProvider theme={theme}>
        <Surface
          className="site-theme-sample site-elevated"
          style={{ "--shadow": "var(--semantics-elevation-raised)" }}
        >
          <Stack direction="row" align="center" justify="between" gap={2}>
            <Text weight="semibold">Bookshop</Text>
            <Tag emotion="success" variant="outline">
              Open
            </Tag>
          </Stack>
          <Text size="sm" color="muted">
            First floor · 3 min on foot
          </Text>
          <Stack direction="row" gap={2}>
            <Button size="sm" emotion="themed">
              Directions
            </Button>
            <Button size="sm" variant="outline">
              Save
            </Button>
          </Stack>
        </Surface>
      </ThemeProvider>
    </Tile>
  );
}
