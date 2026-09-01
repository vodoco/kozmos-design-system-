package com.kozmos.components.timeline

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=660-4393")
class KozmosTimelineConnect {
    @FigmaProperty(FigmaType.Enum, "Content")
    val content: String = Figma.mapping(
        "Basic" to "basic",
        "Detailed" to "detailed"
    )

    @FigmaProperty(FigmaType.Enum, "Density")
    val density: KozmosTimelineDensity = Figma.mapping(
        "Default" to KozmosTimelineDensity.Default,
        "Compact" to KozmosTimelineDensity.Compact
    )

    @FigmaProperty(FigmaType.Text, "Item 1 Time")
    val item1Time: String = "09:00"

    @FigmaProperty(FigmaType.Text, "Item 1 Title")
    val item1Title: String = "Created"

    @FigmaProperty(FigmaType.Text, "Item 1 Description")
    val item1Description: String = "Initial event captured."

    @FigmaProperty(FigmaType.Text, "Item 2 Time")
    val item2Time: String = "10:30"

    @FigmaProperty(FigmaType.Text, "Item 2 Title")
    val item2Title: String = "Reviewed"

    @FigmaProperty(FigmaType.Text, "Item 2 Description")
    val item2Description: String = "Status changed by the team."

    @FigmaProperty(FigmaType.Text, "Item 3 Time")
    val item3Time: String = "Now"

    @FigmaProperty(FigmaType.Text, "Item 3 Title")
    val item3Title: String = "Published"

    @FigmaProperty(FigmaType.Text, "Item 3 Description")
    val item3Description: String = "Latest update is ready."

    @Composable
    fun ComponentExample() {
        val isDetailed = content == "detailed"

        KozmosTimeline(density = density) {
            KozmosTimelineItem {
                if (isDetailed) {
                    KozmosTimelineTime(item1Time)
                }
                KozmosTimelineTitle(item1Title)
                if (isDetailed) {
                    KozmosTimelineDescription(item1Description)
                }
            }
            KozmosTimelineItem {
                if (isDetailed) {
                    KozmosTimelineTime(item2Time)
                }
                KozmosTimelineTitle(item2Title)
                if (isDetailed) {
                    KozmosTimelineDescription(item2Description)
                }
            }
            KozmosTimelineItem(isLast = true) {
                if (isDetailed) {
                    KozmosTimelineTime(item3Time)
                }
                KozmosTimelineTitle(item3Title)
                if (isDetailed) {
                    KozmosTimelineDescription(item3Description)
                }
            }
        }
    }
}
