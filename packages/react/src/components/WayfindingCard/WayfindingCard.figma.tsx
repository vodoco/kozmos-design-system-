import figma from "@figma/code-connect";
import { WayfindingCard } from "./WayfindingCard";

const wayfindingCardUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6893";

figma.connect(WayfindingCard, wayfindingCardUrl, {
  props: {
    title: figma.enum("Content", {
      Basic: undefined,
      Titled: figma.string("Title Text"),
    }),
    children: figma.string("Body Text"),
  },
  // onClose is what renders the dismiss affordance, so it pairs with Titled.
  example: ({ title, children }) => (
    <WayfindingCard title={title} onClose={() => dismiss()}>
      {children}
    </WayfindingCard>
  ),
});
