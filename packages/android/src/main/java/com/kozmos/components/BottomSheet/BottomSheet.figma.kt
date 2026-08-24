package com.kozmos.components.bottomsheet

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.figma.code.connect.FigmaVariant

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=624-4362")
@FigmaVariant("Content", "Basic")
class KozmosBottomSheetBasicConnect {
    @FigmaProperty(FigmaType.Text, "Title Text")
    val title: String = "Sheet title"

    @FigmaProperty(FigmaType.Text, "Description Text")
    val description: String = "Sheet supporting content."

    @Composable
    fun ComponentExample() {
        KozmosBottomSheet(onDismissRequest = {}) {
            Text(title)
            Text(description)
        }
    }
}

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=624-4362")
@FigmaVariant("Content", "Form")
class KozmosBottomSheetFormConnect {
    @FigmaProperty(FigmaType.Text, "Title Text")
    val title: String = "Route details"

    @FigmaProperty(FigmaType.Text, "Description Text")
    val description: String = "Review nearby stops and choose what to do next."

    @Composable
    fun ComponentExample() {
        KozmosBottomSheet(onDismissRequest = {}) {
            Text(title)
            Text(description)
            Text("Search places")
            Text("Optional context")
        }
    }
}

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=624-4362")
@FigmaVariant("Content", "Footer")
class KozmosBottomSheetFooterConnect {
    @FigmaProperty(FigmaType.Text, "Title Text")
    val title: String = "Route details"

    @FigmaProperty(FigmaType.Text, "Description Text")
    val description: String = "Review nearby stops and choose what to do next."

    @Composable
    fun ComponentExample() {
        KozmosBottomSheet(onDismissRequest = {}) {
            Text(title)
            Text(description)
            Text("Cancel")
            Text("Apply")
        }
    }
}
