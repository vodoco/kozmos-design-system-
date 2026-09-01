package com.kozmos.components.tree

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=662-5094")
class KozmosTreeConnect {
    @FigmaProperty(FigmaType.Enum, "Density")
    val density: KozmosTreeDensity = Figma.mapping(
        "Default" to KozmosTreeDensity.Default,
        "Compact" to KozmosTreeDensity.Compact
    )

    @Composable
    fun ComponentExample() {
        KozmosTree(
            data = listOf(
                TreeNode(
                    id = "map-content",
                    name = "Map content",
                    children = listOf(
                        TreeNode(id = "places", name = "Places"),
                        TreeNode(id = "amenities", name = "Amenities")
                    )
                ),
                TreeNode(
                    id = "reports",
                    name = "Reports",
                    children = listOf(
                        TreeNode(id = "daily-summary", name = "Daily summary")
                    )
                )
            ),
            density = density
        )
    }
}
