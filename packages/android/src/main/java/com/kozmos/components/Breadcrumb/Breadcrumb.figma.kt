package com.kozmos.components.breadcrumb

import androidx.compose.runtime.Composable
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.figma.code.connect.FigmaVariant

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1048")
@FigmaVariant("Content", "Basic")
class KozmosBreadcrumbBasicConnect {
    @FigmaProperty(FigmaType.Text, "Item 1 Text")
    val item1: String = "Home"

    @FigmaProperty(FigmaType.Text, "Item 2 Text")
    val item2: String = "Library"

    @FigmaProperty(FigmaType.Text, "Current Page Text")
    val currentPage: String = "Component"

    @Composable
    fun ComponentExample() {
        KozmosBreadcrumb(
            items = listOf(item1, item2, currentPage),
            onItemClick = {}
        )
    }
}

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1048")
@FigmaVariant("Content", "Ellipsis")
class KozmosBreadcrumbEllipsisConnect {
    @FigmaProperty(FigmaType.Text, "Item 1 Text")
    val item1: String = "Home"

    @FigmaProperty(FigmaType.Text, "Current Page Text")
    val currentPage: String = "Component"

    @Composable
    fun ComponentExample() {
        KozmosBreadcrumb(
            items = listOf(item1, "...", currentPage),
            onItemClick = {}
        )
    }
}
