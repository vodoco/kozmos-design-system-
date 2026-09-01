import type { Meta, StoryObj } from "@storybook/react";
import { FeedbackCard } from "./FeedbackCard";

const meta = {
  title: "Platform/FeedbackCard",
  component: FeedbackCard,
  parameters: { layout: "centered" },
} satisfies Meta<typeof FeedbackCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "w-[360px]",
    title: "Rate your visit",
    description: "How was your route today?",
    onSubmitFeedback: (rating, comment) =>
      console.log("feedback", { rating, comment }),
  },
};

export const Submitting: Story = {
  args: {
    ...Default.args,
    isSubmitting: true,
  },
};
