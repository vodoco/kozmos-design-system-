import figma from "@figma/code-connect";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "./Tooltip";

/**
 * Figma Code Connect: Tooltip
 * @url https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=91-4672
 */
figma.connect(
  TooltipContent,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=91-4672",
  {
    props: {
      side: figma.enum("Side", {
        Top: "top",
        Right: "right",
        Bottom: "bottom",
        Left: "left",
      }),
      children: figma.string("Content Text"),
    },
    example: ({ children, side }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent side={side}>{children}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
);
