import figma from "@figma/code-connect";
import { FeedbackCard } from "./FeedbackCard";

const feedbackCardUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8382";

figma.connect(FeedbackCard, feedbackCardUrl, {
  props: {
    title: figma.string("Title Text"),
    description: figma.string("Description Text"),
    isSubmitting: figma.enum("State", {
      Default: false,
      Submitting: true,
      Success: false,
    }),
    successMessage: figma.enum("State", {
      Default: undefined,
      Submitting: undefined,
      Success: figma.string("Success Text"),
    }),
  },
  example: ({ title, description, isSubmitting, successMessage }) => (
    <FeedbackCard
      title={title}
      description={description}
      isSubmitting={isSubmitting}
      successMessage={successMessage}
      onSubmitFeedback={(rating, comment) => submitFeedback(rating, comment)}
    />
  ),
});
