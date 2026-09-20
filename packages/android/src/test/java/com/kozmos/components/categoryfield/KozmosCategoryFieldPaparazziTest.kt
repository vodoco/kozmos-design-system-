package com.kozmos.components.categoryfield

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Flight
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.Paparazzi
import com.kozmos.tokens.KozmosColors
import org.junit.Rule
import org.junit.Test

/** The category field in two colours: the prototype's form with a category chosen. */
class KozmosCategoryFieldPaparazziTest {
    @get:Rule
    val paparazzi = Paparazzi(maxPercentDifference = 0.0)

    @Test
    fun theFieldTakesTheCategorysColour() {
        paparazzi.snapshot {
            MaterialTheme {
                Column(modifier = Modifier.padding(16.dp)) {
                    KozmosCategoryField(
                        label = "Gates", count = 2, tint = KozmosColors.semanticsDataYellow, onClear = {},
                        modifier = Modifier.fillMaxWidth(),
                        icon = { Icon(Icons.Default.Flight, contentDescription = null) }
                    )
                    KozmosCategoryField(
                        label = "Dining", count = 19, tint = KozmosColors.semanticsDataOrange, onClear = {},
                        modifier = Modifier.fillMaxWidth().padding(top = 12.dp),
                        icon = { Icon(Icons.Default.Restaurant, contentDescription = null) }
                    )
                }
            }
        }
    }
}
