package com.kozmos.components.surface

import com.kozmos.components.CROSS_PLATFORM_MAX_PERCENT_DIFFERENCE
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.Paparazzi
import com.kozmos.components.feedbackcard.KozmosFeedbackCard
import com.kozmos.components.routinginputgroup.KozmosRoutePoint
import com.kozmos.components.routinginputgroup.KozmosRoutingInputGroup
import com.kozmos.components.savelocationcard.KozmosSaveLocationCard
import org.junit.Rule
import org.junit.Test

/**
 * The three cards React puts on its Surface, taking React's `surface` prop, on
 * red so the glass shows: solid, the cards are the background with the subtle
 * edge; glass, the red comes through the tint. Until 2026-09-22 Compose drew
 * all three solid only.
 */
class KozmosCardSurfacePaparazziTest {
    @get:Rule
    val paparazzi = Paparazzi(maxPercentDifference = CROSS_PLATFORM_MAX_PERCENT_DIFFERENCE)

    private fun cards(surface: KozmosSurfaceStyle) = paparazzi.snapshot {
        MaterialTheme {
            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.background(Color.Red).padding(16.dp)
            ) {
                KozmosFeedbackCard(modifier = Modifier.fillMaxWidth(), surface = surface)
                KozmosSaveLocationCard(modifier = Modifier.fillMaxWidth(), surface = surface)
                KozmosRoutingInputGroup(
                    points = listOf(KozmosRoutePoint(id = "a", value = ""), KozmosRoutePoint(id = "b", value = "")),
                    onPointChange = { _, _ -> },
                    modifier = Modifier.fillMaxWidth(),
                    surface = surface
                )
            }
        }
    }

    @Test
    fun theCardsOnTheSolidSurface() = cards(KozmosSurfaceStyle.Solid)

    @Test
    fun theCardsOnGlass() = cards(KozmosSurfaceStyle.Glass)
}
