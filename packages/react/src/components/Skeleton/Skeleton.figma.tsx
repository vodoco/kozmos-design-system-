import figma from "@figma/code-connect";
import { Skeleton } from "./Skeleton";

figma.connect(
  Skeleton,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1062",
  {
    props: {
      className: figma.enum("Shape", {
        Line: "h-4 w-40",
        Block: "h-20 w-64",
        Circle: "h-10 w-10 rounded-full",
      }),
    },
    example: (props) => <Skeleton className={props.className} />,
  },
);
