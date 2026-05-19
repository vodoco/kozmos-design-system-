import figma from "@figma/code-connect";
import { Spinner } from "./Spinner";

/**
 * Figma Code Connect: Spinner
 * @url https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-261
 */
figma.connect(
  Spinner,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-261",
  {
    props: {
      size: figma.enum("Size", {
        Small: "sm",
        Medium: "md",
        Large: "lg",
        XLarge: "xl",
      }),
    },
    example: (props) => <Spinner {...props} />,
  },
);
