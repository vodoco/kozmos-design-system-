package com.kozmos.components.poidetailpanel

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.Paparazzi
import com.kozmos.contracts.KozmosPOIAction
import com.kozmos.contracts.KozmosPOIPresentation
import org.junit.Rule
import org.junit.Test

class KozmosPOIDetailPanelPaparazziTest {
    @get:Rule
    val paparazzi = Paparazzi(maxPercentDifference = 0.0)

    /**
     * The name and the close button share one row: a long name wraps beside
     * it, three lines at most, and never pushes it under — the rule iOS and
     * the web follow. The golden is the evidence; a one-line ellipsis or a
     * button under the name changes it.
     */
    @Test
    fun aLongNameWrapsBesideTheButtonsAndStopsAtThreeLines() {
        paparazzi.snapshot {
            MaterialTheme {
                Box(modifier = Modifier.padding(24.dp).width(320.dp)) {
                    KozmosPOIDetailPanel(
                        poi = KozmosPOIPresentation(
                            id = "long-content",
                            name = "Il Forno — Neapolitan restaurant and handmade pasta kitchen on the upper concourse",
                            floorId = "1",
                            floorLabel = "Upper concourse",
                            buildingLabel = "Terminal 1",
                            actions = listOf(KozmosPOIAction.Navigate, KozmosPOIAction.Favourite, KozmosPOIAction.Bookmark)
                        ),
                        actionLabels = mapOf(
                            KozmosPOIAction.Navigate to "Go",
                            KozmosPOIAction.Favourite to "Favourite",
                            KozmosPOIAction.Bookmark to "Bookmark"
                        ),
                        onAction = { _, _ -> },
                        onClose = {}
                    )
                }
            }
        }
    }
}
