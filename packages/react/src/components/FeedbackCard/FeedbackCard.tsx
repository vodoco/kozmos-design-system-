import React, { useState } from "react";
import { cn } from "../../utils";
import { surfaceClass, type SurfaceVariant } from "../Surface";
import { Button } from "../Button";
import { Rating } from "../Rating";
import { Textarea } from "../Textarea";
import { useKozmosAnalytics } from "../../utils/analytics";

export interface FeedbackCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** What the card sits on: solid by default, glass where the product asks for it. */
  surface?: SurfaceVariant;
  title?: string;
  description?: string;
  onSubmitFeedback?: (rating: number, comment: string) => void;
  isSubmitting?: boolean;
  successMessage?: string;
}

const FeedbackCard = React.forwardRef<HTMLDivElement, FeedbackCardProps>(
  (
    {
      className,
      surface = "solid",
      title = "Rate your experience",
      description = "How was your navigation today?",
      onSubmitFeedback,
      isSubmitting = false,
      successMessage = "Thank you for the feedback!",
      ...props
    },
    ref,
  ) => {
    const { trackEvent } = useKozmosAnalytics();
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
      trackEvent("FeedbackCard", "feedback_submitted", { rating });
      onSubmitFeedback?.(rating, comment);
      setSubmitted(true);
    };

    return (
      <div
        ref={ref}
        className={cn(
          `${surfaceClass(surface)} shadow-overlay rounded-panel p-6 flex flex-col gap-4 transition-all duration-300`,
          className,
        )}
        {...props}
      >
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 rounded-pill bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
              <span className="text-2xl">🎉</span>
            </div>
            <h4 className="font-semibold text-foreground text-lg">
              {successMessage}
            </h4>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1.5 text-center">
              <h3 className="font-semibold text-lg text-foreground tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="flex justify-center py-4">
              <Rating value={rating} onChange={(val) => setRating(val)} />
            </div>

            <div className="flex flex-col gap-3">
              {/* The control radius and the standard focus ring, as every
                  field has. Until 2026-09-22 this was rounded-panel (24) with
                  ring-0, as the routing fields were: no visible focus. */}
              <Textarea
                placeholder="Tell us more about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px] resize-none bg-black/5 dark:bg-white/10 border-transparent focus-visible:bg-black/10 dark:focus-visible:bg-white/20 transition-all duration-300"
              />
              <Button
                className="w-full font-medium"
                disabled={rating === 0 || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </>
        )}
      </div>
    );
  },
);

FeedbackCard.displayName = "FeedbackCard";

export { FeedbackCard };
