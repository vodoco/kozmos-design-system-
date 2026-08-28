package com.kozmos.components.feedbackcard

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8382")
class KozmosFeedbackCardConnect {
    @FigmaProperty(FigmaType.Text, "Title Text")
    val title: String = "How was your visit?"

    @FigmaProperty(FigmaType.Text, "Description Text")
    val description: String = "Rate your wayfinding experience and add a comment."

    @FigmaProperty(FigmaType.Text, "Success Text")
    val successMessage: String = "Thanks for your feedback."

    @FigmaProperty(FigmaType.Enum, "State")
    val isSubmitting: Boolean = Figma.mapping(
        "Default" to false,
        "Submitting" to true,
        "Success" to false
    )

    @Composable
    fun ComponentExample() {
        KozmosFeedbackCard(
            title = title,
            description = description,
            isSubmitting = isSubmitting,
            successMessage = successMessage,
            onSubmitFeedback = { _, _ -> }
        )
    }
}
