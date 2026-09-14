import type { Meta, StoryObj } from "@storybook/react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  BottomSheet,
  BottomSheetContent,
  BottomSheetTitle,
  Button,
  Icon,
  IconButton,
  Link,
  POIMediaGallery,
  Separator,
  Stack,
  Tag,
  Text,
} from "@kozmos/react";

/**
 * `fullPOIDetailCard`, rebuilt from Kozmos components only.
 *
 * Source: POI Details Card Revamp, `HbFSXhCPxKUy2fWa5x9TKO`, node `241:4772`
 * (375×3183, 886 nodes), read over the Figma REST API on 2026-09-14.
 *
 * The rule this example is built under (`docs/ds-handoff.md` §11): only what
 * `@kozmos/react` exports, its tokens and its roles. No hand-rolled markup
 * standing in for a missing component, no raw hex, no one-off class that
 * quietly reinvents a part — a workaround would destroy the evidence this
 * example exists to collect.
 *
 * So where the design system cannot express a part, this file says so in an
 * `Alert` and renders nothing in its place. Those holes are the finding.
 * Every deviation is listed in `docs/poi-detail-card-gaps-2026-09-14.md`.
 */

const IMAGE = (label: string, hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="192"><rect width="320" height="192" fill="hsl(${hue} 18% 82%)"/><text x="160" y="100" font-family="sans-serif" font-size="16" fill="hsl(${hue} 25% 35%)" text-anchor="middle">${label}</text></svg>`,
  )}`;

const MEDIA = [
  { id: "1", src: IMAGE("Dining room", 20), alt: "The dining room" },
  { id: "2", src: IMAGE("Terrace", 150), alt: "The terrace" },
  { id: "3", src: IMAGE("Kitchen", 260), alt: "The open kitchen" },
] as const;

/**
 * The card's attribute sections, in the order the Figma node draws them. Each
 * is a label over a wrapped row of values — 24 of them in the source node.
 */
const ATTRIBUTE_SECTIONS: ReadonlyArray<{
  label: string;
  values: readonly string[];
}> = [
  { label: "Cuisines", values: ["American", "Asian Fusion"] },
  {
    label: "Dietary Options",
    values: ["Gluten-Free", "Halal", "Keto", "Dairy-Free", "Peanut-Free"],
  },
  {
    label: "Service Options",
    values: ["Dine-in", "Takeaway", "Delivery", "Curbside pickup"],
  },
  { label: "Product Types", values: ["Coffee", "Pastries", "Sandwiches"] },
  { label: "Clinical Specialty", values: ["Cardiology", "Dermatology"] },
  { label: "Sport Types", values: ["Yoga", "Pilates", "Spinning"] },
  { label: "Service Types", values: ["Walk-in"] },
  { label: "Amenities", values: ["Wi-Fi", "Parking", "Outdoor seating"] },
  { label: "Dress Code", values: ["Smart casual"] },
  {
    label: "Payment Methods",
    values: ["Visa", "Mastercard", "Cash", "Apple Pay"],
  },
];

/** The action row under the description: one themed CTA, then seven outline actions. */
const QUICK_ACTIONS = [
  "Share",
  "Book",
  "Order",
  "Menu",
  "Call",
  "Website",
  "Email",
] as const;

const meta: Meta = {
  title: "Examples/POI Detail Card",
  parameters: {
    layout: "fullscreen",
    // The source is a 375-wide phone card. `BottomSheet` has no width or
    // breakpoint axis and spans the viewport, so the viewport is what sets the
    // width here — a `max-w-[375px]` on the sheet is both a one-off class and a
    // dead one, since the docs app ships the packages' prebuilt CSS and never
    // compiles a class the design system does not already emit.
    viewport: {
      viewports: {
        phone: {
          name: "Phone 375",
          styles: { width: "375px", height: "812px" },
          type: "mobile",
        },
      },
      defaultViewport: "phone",
    },
    docs: {
      description: {
        component:
          "The SDK's `fullPOIDetailCard` (`HbFSXhCPxKUy2fWa5x9TKO`, node `241:4772`) " +
          "rebuilt from Kozmos components only. The `Alert`s mark parts the design " +
          "system cannot express today; see docs/poi-detail-card-gaps-2026-09-14.md.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function AttributeSection({
  label,
  values,
}: {
  label: string;
  values: readonly string[];
}) {
  return (
    <Stack gap={2}>
      <Text size="sm" color="muted">
        {label}
      </Text>
      <Stack direction="row" gap={2} wrap="wrap">
        {values.map((value) => (
          <Tag key={value} variant="outline">
            {value}
          </Tag>
        ))}
      </Stack>
    </Stack>
  );
}

/**
 * A part of the card that no Kozmos component expresses. It is named rather
 * than approximated: an approximation here would read as coverage the design
 * system does not have.
 */
function Gap({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Alert variant="warning">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}

export const Default: Story = {
  render: () => (
    <BottomSheet open onOpenChange={() => undefined}>
      <BottomSheetContent showClose={false}>
        <Stack className="overflow-y-auto" gap={4}>
          {/* cardHeader — logo, name, and the top quick buttons */}
          <Stack direction="row" align="center" gap={2}>
            {/* The source logo is a 56 square at radius 8. `Avatar` is a pill and
                cannot be talked out of it: `rounded-pill` and `rounded-control`
                are both custom names, tailwind-merge does not know they conflict,
                so both survive and CSS order picks the pill. Radius `small 8` was
                ruled on 2026-09-14 and is not built yet either. */}
            <Avatar className="h-14 w-14">
              <AvatarImage alt="Pizzeria Napoli" src={IMAGE("Logo", 40)} />
              <AvatarFallback>PN</AvatarFallback>
            </Avatar>
            <BottomSheetTitle className="flex-1 truncate">
              POI Name
            </BottomSheetTitle>
            <IconButton aria-label="Close">
              <Icon name="x-close" size="sm" />
            </IconButton>
          </Stack>

          <Gap title="Favourite and bookmark buttons">
            The card&apos;s `topQuickButtons` carries a heart and a bookmark
            beside the close button. `IconButton` expresses the control, but
            `@kozmos/icons` has neither glyph — 14 of this card&apos;s icons are
            absent from the 38-icon set.
          </Gap>

          {/* level / building, and the open-now status */}
          <Stack direction="row" align="center" gap={2}>
            <Text size="sm" color="muted">
              Current Floor / Building A
            </Text>
            <Tag variant="outline">Open</Tag>
          </Stack>

          <Text size="sm">
            Wood-fired Neapolitan pizza &amp; handmade pasta, served in a room
            built around the oven. <Link href="#read-more">Read More</Link>
          </Text>

          {/* quickButtons — the themed CTA, then the outline actions. The source
              row is 819 wide inside a 375 card and scrolls horizontally. It wraps
              here: `ScrollArea orientation="horizontal"` hard-codes `h-full` on
              both of its wrappers, so in an auto-height column it resolves to 0
              and the row disappears. Correcting that from the outside takes an
              `h-auto` the component should not need, so the row wraps and the
              defect is reported instead. */}
          <Stack direction="row" gap={2} wrap="wrap">
            <Button emotion="themed" size="lg">
              <Icon name="navigation-pointer-01" size="sm" />
              Go
            </Button>
            {QUICK_ACTIONS.map((action) => (
              <Button key={action} variant="outline">
                {action}
              </Button>
            ))}
          </Stack>

          <Gap title="poiMetaInformation — the meta strip">
            A row of seven bordered tiles: travel time, distance, rating, price
            band, wheelchair access, crowd level and access restriction. Nothing
            in Kozmos expresses a tile strip like it; `MetaStrip` is named as
            missing in `ds-handoff.md` §4.4 and this card is one of five
            surfaces that draw it.
          </Gap>

          <Separator />

          <POIMediaGallery
            label="Pizzeria Napoli photos"
            media={MEDIA}
            positionLabel={(current, total) => `Image ${current} of ${total}`}
          />

          {ATTRIBUTE_SECTIONS.map((section) => (
            <AttributeSection key={section.label} {...section} />
          ))}

          <Gap title="openingHours — the per-day rows">
            The source draws an `openingHours` instance: a status tag, a
            &quot;Closes 12:30 pm&quot; summary, a disclosure caret, and seven
            `dayItem` rows behind it. No Kozmos component covers it; the scan
            counted 410 instances across five surfaces.
          </Gap>

          <Stack gap={2}>
            <Text size="sm" color="muted">
              Description
            </Text>
            <Text size="sm">
              Pizzeria Napoli has served wood-fired Neapolitan pizza since 1998.
              The dough proves for 48 hours and the oven runs at 485°C, which is
              why a pizza takes 90 seconds.
            </Text>
          </Stack>
        </Stack>
      </BottomSheetContent>
    </BottomSheet>
  ),
};
