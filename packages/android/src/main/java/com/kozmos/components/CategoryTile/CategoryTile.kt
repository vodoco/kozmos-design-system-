package com.kozmos.components.categorytile

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.kozmos.contracts.KozmosCategoryPresentation
import com.kozmos.providers.KozmosAnalyticsEvent
import com.kozmos.providers.LocalKozmosAnalytics
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

/**
 * A single browsable category cell.
 *
 * Mirrors the React `CategoryTile`: the tile owns presentation and selection
 * semantics only. Category identity, labels, counts, and selected state are
 * supplied by the consuming app through [KozmosCategoryPresentation].
 */
@Composable
fun KozmosCategoryTile(
    category: KozmosCategoryPresentation,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    icon: (@Composable () -> Unit)? = null
) {
    val trackEvent = LocalKozmosAnalytics.current
    val isEnabled = enabled && !category.disabled

    Surface(
        onClick = {
            trackEvent(
                KozmosAnalyticsEvent(
                    component = "CategoryTile",
                    eventName = "category_selected",
                    properties = mapOf("categoryId" to category.id)
                )
            )
            onSelect(category.id)
        },
        modifier = modifier
            .fillMaxWidth()
            .defaultMinSize(minHeight = 112.dp)
            .semantics {
                contentDescription = category.label
                selected = category.selected
                category.resultCountLabel?.let { stateDescription = it }
            },
        enabled = isEnabled,
        shape = RoundedCornerShape(KozmosDimensions.semanticsRadiusPanel),
        color = if (category.selected) {
            KozmosColors.primitivesColorsTheme500.copy(alpha = 0.05f)
        } else {
            KozmosColors.primitivesColorsBackground0
        },
        border = BorderStroke(
            width = if (category.selected) 2.dp else 1.dp,
            color = if (category.selected) {
                KozmosColors.primitivesColorsTheme500
            } else {
                KozmosColors.primitivesColorsForeground300
            }
        )
    ) {
        Column(
            modifier = Modifier.padding(KozmosDimensions.primitivesLayoutSpacing150),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(
                KozmosDimensions.primitivesLayoutSpacing100,
                Alignment.CenterVertically
            )
        ) {
            if (icon != null) {
                Box(
                    modifier = Modifier.size(40.dp),
                    contentAlignment = Alignment.Center
                ) {
                    icon()
                }
            }

            Text(
                text = category.label,
                style = MaterialTheme.typography.bodyMedium,
                color = if (isEnabled) {
                    KozmosColors.primitivesColorsForeground100
                } else {
                    KozmosColors.primitivesColorsForeground100.copy(alpha = 0.5f)
                },
                textAlign = TextAlign.Center
            )

            category.resultCountLabel?.let { resultCountLabel ->
                Text(
                    text = resultCountLabel,
                    style = MaterialTheme.typography.bodySmall,
                    color = KozmosColors.primitivesColorsForeground500,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}
