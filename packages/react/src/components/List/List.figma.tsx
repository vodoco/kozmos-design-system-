import figma from "@figma/code-connect";
import { List, ListItem } from "./List";

const listUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=237-2482";

figma.connect(List, listUrl, {
  props: {
    density: figma.enum("Density", {
      Default: "default",
      Compact: "compact",
    }),
    item1: figma.string("Item 1 Text"),
    item2: figma.string("Item 2 Text"),
    item3: figma.string("Item 3 Text"),
  },
  example: ({ density, item1, item2, item3 }) => (
    <List density={density}>
      <ListItem>{item1}</ListItem>
      <ListItem>{item2}</ListItem>
      <ListItem>{item3}</ListItem>
    </List>
  ),
});
