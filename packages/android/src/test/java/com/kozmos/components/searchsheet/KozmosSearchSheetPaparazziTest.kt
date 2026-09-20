package com.kozmos.components.searchsheet

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.Paparazzi
import com.kozmos.components.aisearchbutton.KozmosAISearchButton
import com.kozmos.components.categorytile.KozmosCategoryTile
import com.kozmos.components.poiresultcard.KozmosPOIResultCard
import com.kozmos.components.searchbar.KozmosSearchBar
import com.kozmos.components.userlocationmarker.KozmosUserLocationMarker
import com.kozmos.contracts.KozmosCategoryPresentation
import com.kozmos.contracts.KozmosPOIPresentation
import com.kozmos.contracts.KozmosPOIResultPresentation
import org.junit.Rule
import org.junit.Test

/** The search sheet's parts on the prototype's geometry: the field and the AI search, four tiles, two rows, the marker. */
class KozmosSearchSheetPaparazziTest {
    @get:Rule
    val paparazzi = Paparazzi(maxPercentDifference = 0.0)

    @Test
    fun theSearchSheetsParts() {
        paparazzi.snapshot {
            MaterialTheme {
                Column(modifier = Modifier.padding(16.dp).width(360.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        KozmosSearchBar(value = "sta", onValueChange = {}, onClear = {}, modifier = Modifier.weight(1f))
                        KozmosAISearchButton(onClick = {})
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        listOf("Food and drink", "Shops", "Toilets", "Gates").forEachIndexed { index, label ->
                            KozmosCategoryTile(
                                category = KozmosCategoryPresentation(id = label, label = label, selected = index == 0),
                                onSelect = {},
                                modifier = Modifier.weight(1f)
                            ) { Icon(Icons.Default.Restaurant, contentDescription = null) }
                        }
                    }
                    val poi = KozmosPOIPresentation(id = "p", name = "Dunkin'", floorId = "b:2", floorLabel = "Second Floor", buildingLabel = "Terminal B")
                    KozmosPOIResultCard(poi = poi, result = KozmosPOIResultPresentation(poiId = "p", resultIndex = 1, selected = false, featured = false, floorId = "b:2"), onSelect = {}, currentFloorId = "b:2")
                    KozmosPOIResultCard(poi = poi.copy(id = "q", name = "Starbucks", floorId = "b:1", floorLabel = "First Floor"), result = KozmosPOIResultPresentation(poiId = "q", resultIndex = 2, selected = false, featured = false, floorId = "b:1"), onSelect = {}, currentFloorId = "b:2")
                    KozmosUserLocationMarker(showHeading = false)
                }
            }
        }
    }
}
