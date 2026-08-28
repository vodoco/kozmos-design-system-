package com.kozmos.components.dialog

import androidx.compose.runtime.Composable
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.figma.code.connect.FigmaVariant

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=143-13060")
@FigmaVariant("Content", "Basic")
class KozmosDialogBasicConnect {
    @FigmaProperty(FigmaType.Text, "Title Text")
    val title: String = "Edit profile"

    @FigmaProperty(FigmaType.Text, "Description Text")
    val description: String = "Make changes to your profile here."

    @FigmaProperty(FigmaType.Text, "Body Text")
    val bodyText: String = "Use dialog body content for a short task, form, or confirmation."

    @Composable
    fun ComponentExample() {
        KozmosDialog(
            onDismissRequest = {},
            title = title,
            description = description,
            bodyText = bodyText
        )
    }
}

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=143-13060")
@FigmaVariant("Content", "Form")
class KozmosDialogFormConnect {
    @FigmaProperty(FigmaType.Text, "Title Text")
    val title: String = "Edit profile"

    @FigmaProperty(FigmaType.Text, "Description Text")
    val description: String = "Make changes to your profile here."

    @FigmaProperty(FigmaType.Text, "Body Text")
    val bodyText: String = "Use dialog body content for a short task, form, or confirmation."

    @Composable
    fun ComponentExample() {
        KozmosDialog(
            onDismissRequest = {},
            title = title,
            description = description,
            bodyText = bodyText,
            primaryActionText = "Save changes",
            onPrimaryAction = {}
        )
    }
}

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=143-13060")
@FigmaVariant("Content", "Footer")
class KozmosDialogFooterConnect {
    @FigmaProperty(FigmaType.Text, "Title Text")
    val title: String = "Review changes"

    @FigmaProperty(FigmaType.Text, "Description Text")
    val description: String = "Confirm the details before continuing."

    @FigmaProperty(FigmaType.Text, "Body Text")
    val bodyText: String = "Use dialog body content for a short task, form, or confirmation."

    @Composable
    fun ComponentExample() {
        KozmosDialog(
            onDismissRequest = {},
            title = title,
            description = description,
            bodyText = bodyText,
            primaryActionText = "Save changes",
            secondaryActionText = "Cancel",
            onPrimaryAction = {},
            onSecondaryAction = {}
        )
    }
}
