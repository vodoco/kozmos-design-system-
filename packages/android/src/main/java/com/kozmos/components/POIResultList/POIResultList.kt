package com.kozmos.components.poiresultlist

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.kozmos.components.poiresultcard.KozmosPOIResultCard
import com.kozmos.contracts.KozmosPOIPresentation
import com.kozmos.contracts.KozmosPOIResultPresentation
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

/** One row of a POI result list, pairing a POI with its result metadata. */
data class KozmosPOIResultListItem(
    val poi: KozmosPOIPresentation,
    val result: KozmosPOIResultPresentation
)

/**
 * A list of POI search results.
 *
 * Mirrors the React `POIResultList`. When [selectedPoiId] is supplied it wins
 * over each result's own `selected` flag, so marker and list selection stay
 * derived from a single canonical ID.
 *
 * This is a plain [Column] rather than a `LazyColumn` so it can be nested
 * inside an already-scrolling detail panel. Callers rendering very long result
 * sets should place it in a scroll container of their own.
 */
@Composable
fun KozmosPOIResultList(
    items: List<KozmosPOIResultListItem>,
    resultCountLabel: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String = "Points of interest",
    selectedPoiId: String? = null,
    featuredLabel: String = "Featured",
    emptyState: (@Composable () -> Unit)? = null
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .semantics { contentDescription = label },
        verticalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing150)
    ) {
        // Announced by TalkBack without occupying layout space, matching the
        // web implementation's visually hidden live region.
        Box(
            modifier = Modifier
                .size(1.dp)
                .semantics {
                    contentDescription = resultCountLabel
                    liveRegion = LiveRegionMode.Polite
                }
        )

        if (items.isEmpty()) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius300),
                color = KozmosColors.primitivesColorsBackground100.copy(alpha = 0.4f),
                border = BorderStroke(1.dp, KozmosColors.primitivesColorsForeground300)
            ) {
                Box(
                    modifier = Modifier.padding(KozmosDimensions.primitivesLayoutSpacing300),
                    contentAlignment = Alignment.Center
                ) {
                    emptyState?.invoke()
                }
            }
        } else {
            items.forEach { item ->
                KozmosPOIResultCard(
                    poi = item.poi,
                    result = item.result.selecting(selectedPoiId),
                    onSelect = onSelect,
                    featuredLabel = featuredLabel
                )
            }
        }
    }
}
