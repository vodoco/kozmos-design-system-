import figma from "@figma/code-connect";
import { Tree } from "./Tree";

const treeUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=662-5094";

figma.connect(Tree, treeUrl, {
  props: {
    density: figma.enum("Density", {
      Default: "default",
      Compact: "compact",
    }),
    children: figma.slot("Content Slot") ?? figma.children(["Content Slot"]),
  },
  example: ({ children, density }) => (
    <Tree ariaLabel="Map content" density={density}>
      {children}
    </Tree>
  ),
});
