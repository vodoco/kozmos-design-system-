package com.kozmos.components.bottomnavigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=728-6447")
class KozmosBottomNavigationConnect {
    @FigmaProperty(FigmaType.Enum, "Count")
    val count: Int = Figma.mapping(
        "Three" to 3,
        "Four" to 4,
        "Five" to 5
    )

    @FigmaProperty(FigmaType.Enum, "Active")
    val activeIndex: Int = Figma.mapping(
        "One" to 0,
        "Two" to 1,
        "Three" to 2,
        "Four" to 3,
        "Five" to 4
    )

    @FigmaProperty(FigmaType.Text, "Item 1 Text")
    val item1Label: String = "Home"

    @FigmaProperty(FigmaType.Text, "Item 2 Text")
    val item2Label: String = "Search"

    @FigmaProperty(FigmaType.Text, "Item 3 Text")
    val item3Label: String = "Routes"

    @FigmaProperty(FigmaType.Text, "Item 4 Text")
    val item4Label: String = "Alerts"

    @FigmaProperty(FigmaType.Text, "Item 5 Text")
    val item5Label: String = "More"

    @Composable
    fun ComponentExample() {
        val labels = listOf(item1Label, item2Label, item3Label, item4Label, item5Label)
        val icons = listOf(
            Icons.Default.Home,
            Icons.Default.Search,
            Icons.Default.Settings,
            Icons.Default.Home,
            Icons.Default.Settings
        )
        val routes = listOf("home", "search", "routes", "alerts", "more")

        KozmosBottomNavigation(
            items = labels.indices.take(count).map { index ->
                BottomNavigationItem(labels[index], icons[index], routes[index])
            },
            currentRoute = routes.getOrElse(activeIndex) { "home" },
            onNavigate = {}
        )
    }
}
