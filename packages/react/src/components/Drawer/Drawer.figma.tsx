import figma from "@figma/code-connect";
import { Drawer, DrawerContent } from "./Drawer";
figma.connect(
  DrawerContent,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=TBD",
  {
    props: {
      side: figma.enum("Side", {
        Top: "top",
        Bottom: "bottom",
        Left: "left",
        Right: "right",
      }),
    },
    example: (props) => (
      <Drawer>
        <DrawerContent {...props}>
          <div>Drawer Content</div>
        </DrawerContent>
      </Drawer>
    ),
  },
);
