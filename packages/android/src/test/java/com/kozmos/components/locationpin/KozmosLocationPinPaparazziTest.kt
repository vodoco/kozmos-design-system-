package com.kozmos.components.locationpin

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.Paparazzi
import com.kozmos.components.categorytile.KozmosCategoryTint
import com.kozmos.components.counter.KozmosInkedFill
import com.kozmos.tokens.KozmosColors
import org.junit.Rule
import org.junit.Test

/**
 * A pin in a category's colour, on the floor and off it. On it the marker is
 * solid with the fill's ink on the number; off it the marker is a hollow ring
 * in the colour and the number is in the foreground on the white disc
 * (Olcay, 2026-09-21: the yellow fill as the number's colour read 1.92:1).
 */
class KozmosLocationPinPaparazziTest {
    @get:Rule
    val paparazzi = Paparazzi(maxPercentDifference = 0.0)

    private val yellow = KozmosCategoryTint(
        KozmosColors.semanticsCategoryAccentYellow,
        KozmosInkedFill(KozmosColors.semanticsCategoryFillYellow, KozmosColors.semanticsCategoryOnfillYellow)
    )
    private val navy = KozmosCategoryTint(
        KozmosColors.semanticsCategoryAccentNavy,
        KozmosInkedFill(KozmosColors.semanticsCategoryFillNavy, KozmosColors.semanticsCategoryOnfillNavy)
    )

    @Test
    fun anOffFloorPinsNumberIsInTheForeground() {
        paparazzi.snapshot {
            MaterialTheme {
                Row(
                    modifier = Modifier.background(Color.White).padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    KozmosLocationPin(size = KozmosLocationPinSize.Lg, number = 4, tint = yellow)
                    KozmosLocationPin(size = KozmosLocationPinSize.Lg, number = 4, offFloor = true, tint = yellow)
                    KozmosLocationPin(size = KozmosLocationPinSize.Lg, number = 7, tint = navy)
                    KozmosLocationPin(size = KozmosLocationPinSize.Lg, number = 7, offFloor = true, tint = navy)
                }
            }
        }
    }
}
