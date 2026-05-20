import figma from "@figma/code-connect";
import { Container } from "./Container";

figma.connect(
  Container,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1034",
  {
    props: {
      centered: figma.enum("Centered", {
        True: true,
        False: false,
      }),
      children: figma.string("Container Text"),
    },
    example: ({ centered, children }) => (
      <Container centered={centered}>{children}</Container>
    ),
  },
);
