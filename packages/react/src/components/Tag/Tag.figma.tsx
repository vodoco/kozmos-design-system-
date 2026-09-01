import figma from "@figma/code-connect";
import { Tag } from "./Tag";

const tagUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=728-6184";

const tagProps = {
  variant: figma.enum("Variant", {
    Default: "default",
    Secondary: "secondary",
    Destructive: "destructive",
    Outline: "outline",
  }),
  children: figma.string("Label Text"),
};

figma.connect(Tag, tagUrl, {
  variant: { Removable: "False" },
  props: tagProps,
  example: ({ children, variant }) => <Tag variant={variant}>{children}</Tag>,
});

figma.connect(Tag, tagUrl, {
  variant: { Removable: "True" },
  props: tagProps,
  example: ({ children, variant }) => (
    <Tag onRemove={() => {}} variant={variant}>
      {children}
    </Tag>
  ),
});
