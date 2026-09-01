import figma from "@figma/code-connect";
import { Link } from "./Link";

figma.connect(
  Link,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1385",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "default",
        Subtle: "subtle",
      }),
      children: figma.string("Link Text"),
    },
    example: ({ children, variant }) => (
      <Link href="#" variant={variant}>
        {children}
      </Link>
    ),
  },
);
