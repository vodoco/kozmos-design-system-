import figma from "@figma/code-connect";
import { MetaStrip, MetaStripItem } from "./MetaStrip";

/**
 * The Figma set draws three tiles because a strip of one reads as a label.
 * In code the tiles are children, so the mapping shows the shape rather than
 * pretending the count is an axis.
 */
figma.connect(
  MetaStrip,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1890-8911",
  {
    props: {
      showLabel: figma.enum("Label", {
        Shown: true,
        Hidden: false,
      }),
      valueOne: figma.string("Value 1"),
      labelOne: figma.string("Label 1"),
      valueTwo: figma.string("Value 2"),
      labelTwo: figma.string("Label 2"),
      valueThree: figma.string("Value 3"),
      labelThree: figma.string("Label 3"),
    },
    example: ({
      showLabel,
      valueOne,
      labelOne,
      valueTwo,
      labelTwo,
      valueThree,
      labelThree,
    }) => (
      <MetaStrip aria-label="About this place">
        <MetaStripItem label={labelOne} showLabel={showLabel}>
          {valueOne}
        </MetaStripItem>
        <MetaStripItem label={labelTwo} showLabel={showLabel}>
          {valueTwo}
        </MetaStripItem>
        <MetaStripItem label={labelThree} showLabel={showLabel}>
          {valueThree}
        </MetaStripItem>
      </MetaStrip>
    ),
  },
);
