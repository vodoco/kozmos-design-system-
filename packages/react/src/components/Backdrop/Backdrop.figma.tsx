import figma from "@figma/code-connect";
import { Backdrop } from "./Backdrop";

/**
 * Figma Code Connect scaffold: Backdrop
 * @url https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=613-4791
 */
figma.connect(
  Backdrop,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=613-4791",
  {
    props: {
      visible: figma.enum("Visibility", {
        Visible: true,
        Hidden: false,
      }),
    },
    example: ({ visible }) => <Backdrop visible={visible} />,
  },
);
