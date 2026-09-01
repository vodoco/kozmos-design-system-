package com.kozmos.components.sidebar

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=752-6807")
class KozmosSidebarConnect {
    @FigmaProperty(FigmaType.Enum, "Content")
    val content: String = Figma.mapping(
        "Basic" to "basic",
        "Sections" to "sections",
        "Tools" to "tools",
        "Rail" to "rail"
    )

    @Composable
    fun ComponentExample() {
        KozmosSidebar(
            variant = if (content == "rail") KozmosSidebarVariant.Rail else KozmosSidebarVariant.Expanded,
            header = {
                Text("Header")
            },
            navigation = {
                if (content == "sections" || content == "tools") {
                    Text("Section")
                }
                Text("Navigation")
            },
            tools = {
                if (content == "tools") {
                    Text("Tools")
                }
            },
            footer = {
                Text("Footer")
            }
        )
    }
}
