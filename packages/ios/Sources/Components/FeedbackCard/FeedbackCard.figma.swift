import SwiftUI
import Figma

struct KozmosFeedbackCardConnect: FigmaConnect {
    let component = KozmosFeedbackCard.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8382"

    @FigmaString("Title Text")
    var title: String = "How was your visit?"

    @FigmaString("Description Text")
    var description: String = "Rate your wayfinding experience and add a comment."

    @FigmaString("Success Text")
    var successMessage: String = "Thanks for your feedback."

    @FigmaEnum(
        "State",
        mapping: [
            "Default": false,
            "Submitting": true,
            "Success": false
        ]
    )
    var isSubmitting: Bool = false

    var body: some View {
        KozmosFeedbackCard(
            title: self.title,
            description: self.description,
            isSubmitting: self.isSubmitting,
            successMessage: self.successMessage,
            onSubmitFeedback: { _, _ in }
        )
    }
}
