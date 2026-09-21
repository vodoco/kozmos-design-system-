import figma from "@figma/code-connect";
import { AISearchButton } from "./AISearchButton";

// The set is new on 2026-09-21: Build AISearchButton in the importer, then put
// the node id its log prints here and add this file and AISearchButton.tsx to
// figma.linked.config.json. Until then the file is not published.
const aiSearchButtonUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=0-0";

figma.connect(AISearchButton, aiSearchButtonUrl, {
  props: {
    disabled: figma.enum("State", { Default: false, Disabled: true }),
  },
  // The ring turns in the product (3.6 s a turn, still under reduced motion);
  // Figma holds it at rest. label is what assistive technology hears.
  example: ({ disabled }) => <AISearchButton disabled={disabled} />,
});
