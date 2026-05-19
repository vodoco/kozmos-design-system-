import figma from "@figma/code-connect";
import { Icon } from "./Icon";

/**
 * Code Connect: Kozmos DS Core Library / Icon / Slot Default
 *
 * The Figma node is a placeholder instance-swap source. Real glyphs should
 * come from the Pointr Icon Library and map to the same `name` contract.
 */
figma.connect(
  Icon,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=15-2",
  {
    example: () => <Icon name="home-line" />,
  },
);
