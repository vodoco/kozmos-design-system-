package com.kozmos.components.routepreviewpanel

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Divider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.kozmos.components.button.KozmosButton
import com.kozmos.components.iconbutton.KozmosIconButton
import com.kozmos.components.iconbutton.KozmosIconButtonVariant
import com.kozmos.components.routeoptioncard.KozmosRouteOptionCard
import com.kozmos.contracts.KozmosRouteOptionPresentation
import com.kozmos.contracts.KozmosRouteReadiness
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

/**
 * A route preview with selectable options and a continue action.
 *
 * Mirrors the React `RoutePreviewPanel`. The panel never changes its own
 * selected route, and continuation is disabled while the route status is
 * `Calculating`, `NoRoute`, `Error`, or `Idle`.
 */
@Composable
fun KozmosRoutePreviewPanel(
    destinationName: String,
    options: List<KozmosRouteOptionPresentation>,
    status: KozmosRouteReadiness,
    backLabel: String,
    continueLabel: String,
    onOptionSelect: (String) -> Unit,
    onBack: () -> Unit,
    onContinue: (String) -> Unit,
    modifier: Modifier = Modifier,
    destinationLabel: String = "To",
    optionsLabel: String = "Route options",
    optionsCountLabel: String? = null,
    selectedRouteAnnouncement: String? = null,
    statusContent: (@Composable () -> Unit)? = null,
    alert: (@Composable () -> Unit)? = null
) {
    val selectedOption = options.firstOrNull { it.selected && it.available }
    val ready = status == KozmosRouteReadiness.Ready

    // The options list scrolls between a pinned header and a pinned footer,
    // which requires a bounded height. When the caller nests the panel
    // somewhere unbounded (another scroll container, wrapContentSize) Compose
    // would throw, so fall back to growing naturally — the same way the web
    // panel behaves.
    BoxWithConstraints(modifier = modifier.fillMaxWidth()) {
    val bodyScrolls = constraints.hasBoundedHeight
    val bodyScrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(KozmosColors.primitivesColorsBackground0)
            .semantics { contentDescription = "Route preview" }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(KozmosDimensions.primitivesLayoutSpacing200),
            verticalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing50)
        ) {
            Text(
                text = destinationLabel.uppercase(),
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.SemiBold,
                color = KozmosColors.primitivesColorsForeground500
            )
            Text(
                text = destinationName,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.SemiBold,
                color = KozmosColors.primitivesColorsForeground100,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }

        Divider(color = KozmosColors.primitivesColorsForeground300)

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .then(
                    if (bodyScrolls) {
                        Modifier
                            .weight(1f, fill = false)
                            .verticalScroll(bodyScrollState)
                    } else {
                        Modifier
                    }
                )
                .padding(KozmosDimensions.primitivesLayoutSpacing200),
            verticalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing150)
        ) {
            if (selectedRouteAnnouncement != null) {
                Box(
                    modifier = Modifier
                        .size(1.dp)
                        .semantics {
                            contentDescription = selectedRouteAnnouncement
                            liveRegion = LiveRegionMode.Polite
                        }
                )
            }

            if (status != KozmosRouteReadiness.Ready && statusContent != null) {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(KozmosDimensions.semanticsRadiusPanel),
                    color = KozmosColors.primitivesColorsBackground100.copy(alpha = 0.4f),
                    border = BorderStroke(1.dp, KozmosColors.primitivesColorsForeground300)
                ) {
                    Box(
                        modifier = Modifier.padding(KozmosDimensions.primitivesLayoutSpacing300),
                        contentAlignment = Alignment.Center
                    ) {
                        statusContent()
                    }
                }
            } else {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState())
                        .semantics { contentDescription = optionsLabel },
                    horizontalArrangement = Arrangement.spacedBy(
                        KozmosDimensions.primitivesLayoutSpacing150
                    )
                ) {
                    options.forEach { option ->
                        KozmosRouteOptionCard(
                            option = option,
                            onSelect = onOptionSelect,
                            modifier = Modifier.width(208.dp)
                        )
                    }
                }

                if (options.size > 1 && optionsCountLabel != null) {
                    Text(
                        text = optionsCountLabel,
                        style = MaterialTheme.typography.bodySmall,
                        color = KozmosColors.primitivesColorsForeground500
                    )
                }
            }

            if (alert != null) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(KozmosDimensions.semanticsRadiusControl))
                        .background(KozmosColors.primitivesColorsEmotionalAlert500.copy(alpha = 0.15f))
                        .padding(KozmosDimensions.primitivesLayoutSpacing150)
                ) {
                    alert()
                }
            }
        }

        Divider(color = KozmosColors.primitivesColorsForeground300)

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(KozmosDimensions.primitivesLayoutSpacing200),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing150)
        ) {
            KozmosIconButton(
                icon = Icons.AutoMirrored.Filled.ArrowBack,
                onClick = onBack,
                contentDescription = backLabel,
                variant = KozmosIconButtonVariant.Outline
            )

            KozmosButton(
                onClick = { selectedOption?.let { onContinue(it.id) } },
                modifier = Modifier.weight(1f),
                enabled = ready && selectedOption != null,
                isLoading = status == KozmosRouteReadiness.Calculating
            ) {
                Text(continueLabel)
            }
        }
    }
    }
}
