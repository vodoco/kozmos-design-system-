import figma from "@figma/code-connect";
import { Alert, AlertDescription, AlertTitle } from "./Alert";
figma.connect(
  Alert,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-308",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "default",
        Destructive: "destructive",
        Success: "success",
        Warning: "warning",
        Info: "info",
      }),
      title: figma.string("Title"),
      description: figma.string("Description"),
    },
    example: ({ description, title, variant }) => (
      <Alert variant={variant}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    ),
  },
);
