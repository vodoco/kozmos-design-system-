import { useState } from "react";
import { Box, FeedbackCard, Text } from "@kozmos/react";
import type { DemoModule } from "../types";

function RateTheRoute() {
  const [note, setNote] = useState("Rate, add a comment, submit.");
  return (
    <Box className="site-demo-column">
      <FeedbackCard
        onSubmitFeedback={(rating, comment) =>
          setNote(
            `Submitted ${rating} of 5${comment ? ` with a comment: “${comment}”` : ""}.`,
          )
        }
      />
      <Text size="sm" color="muted" aria-live="polite">
        {note}
      </Text>
    </Box>
  );
}

function Submitting() {
  return (
    <Box className="site-demo-column">
      <FeedbackCard
        title="How was the walk?"
        description="Two questions, thirty seconds."
        isSubmitting
      />
    </Box>
  );
}

function OnGlass() {
  return (
    <Box className="site-glass-stage">
      {(["green", "turquoise"] as const).map((colour, index) => (
        <Box
          key={colour}
          className="site-blob"
          aria-hidden="true"
          style={{
            "--blob": `var(--semantics-category-fill-${colour})`,
            "--x": `${30 + index * 40}%`,
            "--y": "50%",
          }}
        />
      ))}
      <Box className="site-glass-card">
        <FeedbackCard surface="glass" />
      </Box>
    </Box>
  );
}

export const demos: DemoModule["demos"] = [
  {
    title: "Rate the route",
    description:
      "A Rating, a Textarea and a submit; the card shows successMessage afterwards.",
    Component: RateTheRoute,
  },
  { title: "Submitting", Component: Submitting },
  { title: "On glass", Component: OnGlass },
];
