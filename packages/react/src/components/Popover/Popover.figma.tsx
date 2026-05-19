import figma from "@figma/code-connect";
import { Button } from "../Button/Button";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

const popoverUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=101-8118";

figma.connect(PopoverContent, popoverUrl, {
  props: {
    side: figma.enum("Side", {
      Top: "top",
      Right: "right",
      Bottom: "bottom",
      Left: "left",
    }),
    title: figma.string("Title Text"),
    description: figma.string("Description Text"),
  },
  example: ({ description, side, title }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent side={side}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
});
