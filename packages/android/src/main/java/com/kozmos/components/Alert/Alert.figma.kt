package com.kozmos.components.alert

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-308")
class KozmosAlertConnect {
    @FigmaProperty(FigmaType.Enum, "Variant")
    val status: AlertStatus = Figma.mapping(
        "Default" to AlertStatus.Default,
        "Destructive" to AlertStatus.Error,
        "Success" to AlertStatus.Success,
        "Warning" to AlertStatus.Warning,
        "Info" to AlertStatus.Info
    )

    @FigmaProperty(FigmaType.Text, "Title")
    val title: String = "Heads up"

    @FigmaProperty(FigmaType.Text, "Description")
    val description: String = "Use alert description for important status detail."

    @Composable
    fun ComponentExample() {
        KozmosAlert(status = status) {
            KozmosAlertIcon(status = status)
            KozmosAlertContent {
                KozmosAlertTitle(title, color = alertForegroundColor(status))
                KozmosAlertDescription(description, color = alertForegroundColor(status))
            }
        }
    }
}
