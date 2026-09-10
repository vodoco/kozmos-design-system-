import SwiftUI

public struct KozmosFeedbackCard: View {
    @Environment(\.kozmosAnalytics) private var trackEvent

    private let title: String
    private let description: String
    private let isSubmitting: Bool
    private let successMessage: String
    private let onSubmitFeedback: ((Int, String) -> Void)?

    @State private var rating: Int
    @State private var comment: String
    @State private var submitted: Bool

    public init(
        title: String = "Rate your experience",
        description: String = "How was your navigation today?",
        isSubmitting: Bool = false,
        successMessage: String = "Thank you for the feedback!",
        initialRating: Int = 0,
        initialComment: String = "",
        onSubmitFeedback: ((Int, String) -> Void)? = nil
    ) {
        self.title = title
        self.description = description
        self.isSubmitting = isSubmitting
        self.successMessage = successMessage
        self.onSubmitFeedback = onSubmitFeedback
        self._rating = State(initialValue: initialRating)
        self._comment = State(initialValue: initialComment)
        self._submitted = State(initialValue: false)
    }

    public var body: some View {
        VStack(spacing: KozmosDimensions.primitivesLayoutSpacing200) {
            if submitted {
                VStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 44, weight: .semibold))
                        .foregroundColor(KozmosColors.primitivesColorsEmotionalSuccess600)

                    Text(successMessage)
                        .font(.headline.weight(.semibold))
                        .foregroundColor(KozmosColors.primitivesColorsForeground100)
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity, minHeight: 148)
            } else {
                VStack(spacing: KozmosDimensions.primitivesLayoutSpacing50) {
                    Text(title)
                        .font(.headline.weight(.semibold))
                        .foregroundColor(KozmosColors.primitivesColorsForeground100)

                    Text(description)
                        .font(KozmosTypography.subheadline)
                        .foregroundColor(KozmosColors.primitivesColorsForeground500)
                        .multilineTextAlignment(.center)
                }

                KozmosRating(value: $rating)

                KozmosTextarea(text: $comment, placeholder: "Tell us more about your experience...")
                    .frame(minHeight: 96)

                KozmosButton(
                    isSubmitting ? "Submitting..." : "Submit Feedback",
                    isDisabled: rating == 0 || isSubmitting
                ) {
                    trackEvent(KozmosAnalyticsEvent(eventName: "feedback_submitted", component: "FeedbackCard", properties: ["rating": String(rating)]))
                    onSubmitFeedback?(rating, comment)
                    submitted = true
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(KozmosDimensions.primitivesLayoutSpacing300)
        .background(KozmosColors.primitivesColorsBackground0.opacity(0.9))
        .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous)
                .stroke(KozmosColors.primitivesColorsForeground900.opacity(0.08), lineWidth: 1)
        )
        .kozmosElevation(KozmosShadows.semanticsElevationFloating)
    }
}
