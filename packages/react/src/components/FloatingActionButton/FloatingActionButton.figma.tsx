import figma from "@figma/code-connect";
import { FloatingActionButton } from "./FloatingActionButton";

/**
 * Figma Code Connect: FloatingActionButton
 * @url https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=TBD
 */
figma.connect(
  FloatingActionButton,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=TBD",
  {
    props: { disabled: figma.boolean("Disabled") },
    example: (props) => <FloatingActionButton {...props} />,
  },
);
