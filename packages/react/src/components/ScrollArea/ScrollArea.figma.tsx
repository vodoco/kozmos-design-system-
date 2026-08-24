import figma from "@figma/code-connect";
import { ScrollArea } from "./ScrollArea";

const scrollAreaUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=655-4973";

figma.connect(ScrollArea, scrollAreaUrl, {
  props: {
    children: figma.slot("Content Slot"),
    hideScrollbar: figma.enum("Scrollbar", {
      Hidden: true,
      Visible: false,
    }),
    orientation: figma.enum("Orientation", {
      Vertical: "vertical",
      Horizontal: "horizontal",
      Both: "both",
    }),
  },
  example: ({ children, hideScrollbar, orientation }) => (
    <ScrollArea hideScrollbar={hideScrollbar} orientation={orientation}>
      {children}
    </ScrollArea>
  ),
});
