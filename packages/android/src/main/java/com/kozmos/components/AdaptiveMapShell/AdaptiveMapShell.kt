package com.kozmos.components.adaptivemapshell

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.kozmos.contracts.KozmosMapCollisionInsets
import com.kozmos.contracts.KozmosMapReadiness
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

enum class KozmosMapPanelPlacement {
    Start,
    End
}

/**
 * Adaptive container that layers a map, its controls, and a detail panel.
 *
 * Mirrors the React `AdaptiveMapShell`. The shell owns layout and z-ordering
 * only. [collisionInsets] are surfaced back to the caller through
 * [onCollisionInsetsChange] so the map renderer can pad its camera — layout
 * alone cannot move SDK labels, routes, attribution, or marker collision boxes.
 */
@Composable
fun KozmosAdaptiveMapShell(
    map: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    mapLabel: String = "Map",
    mapStatus: KozmosMapReadiness = KozmosMapReadiness.Ready,
    mapStatusContent: (@Composable () -> Unit)? = null,
    controls: (@Composable () -> Unit)? = null,
    topBar: (@Composable () -> Unit)? = null,
    panel: (@Composable () -> Unit)? = null,
    panelLabel: String = "Map details",
    panelPlacement: KozmosMapPanelPlacement = KozmosMapPanelPlacement.End,
    collisionInsets: KozmosMapCollisionInsets = KozmosMapCollisionInsets.Zero,
    onCollisionInsetsChange: ((KozmosMapCollisionInsets) -> Unit)? = null
) {
    LaunchedEffect(collisionInsets) {
        onCollisionInsetsChange?.invoke(collisionInsets)
    }

    BoxWithConstraints(
        modifier = modifier
            .fillMaxWidth()
            .defaultMinSize(minHeight = 448.dp)
            .background(KozmosColors.primitivesColorsBackground100)
    ) {
        // Wide layouts float the panel beside the map; compact layouts dock it
        // to the bottom edge, matching the web breakpoint behaviour.
        val isRegularWidth = maxWidth >= 600.dp
        val availableHeight = maxHeight
        val availableWidth = maxWidth

        Box(
            modifier = Modifier
                .fillMaxSize()
                .semantics { contentDescription = mapLabel }
        ) {
            map()
        }

        if (mapStatus != KozmosMapReadiness.Ready && mapStatusContent != null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(KozmosColors.primitivesColorsBackground0.copy(alpha = 0.8f))
                    .semantics { liveRegion = LiveRegionMode.Polite },
                contentAlignment = Alignment.Center
            ) {
                mapStatusContent()
            }
        }

        if (topBar != null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(KozmosDimensions.primitivesLayoutSpacing200)
                    .align(Alignment.TopCenter),
                contentAlignment = Alignment.TopCenter
            ) {
                Box(modifier = Modifier.widthIn(max = 672.dp)) { topBar() }
            }
        }

        if (controls != null) {
            Box(
                modifier = Modifier
                    .padding(KozmosDimensions.primitivesLayoutSpacing200)
                    .align(
                        if (panelPlacement == KozmosMapPanelPlacement.End) {
                            Alignment.TopStart
                        } else {
                            Alignment.TopEnd
                        }
                    )
            ) {
                controls()
            }
        }

        if (panel != null) {
            val radius = KozmosDimensions.semanticsRadiusPanel

            if (isRegularWidth) {
                // 42% of the shell, capped at 416.dp — computed rather than
                // chained, because `widthIn` before `fillMaxWidth` would take
                // the fraction of the cap instead of capping the fraction.
                val panelWidth = minOf(416.dp, availableWidth * 0.42f)

                Surface(
                    modifier = Modifier
                        .padding(KozmosDimensions.primitivesLayoutSpacing200)
                        .width(panelWidth)
                        .fillMaxHeight()
                        .align(
                            if (panelPlacement == KozmosMapPanelPlacement.End) {
                                Alignment.CenterEnd
                            } else {
                                Alignment.CenterStart
                            }
                        )
                        .semantics { contentDescription = panelLabel },
                    shape = RoundedCornerShape(radius),
                    color = KozmosColors.primitivesColorsBackground0,
                    shadowElevation = 24.dp
                ) {
                    panel()
                }
            } else {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = availableHeight * 0.64f)
                        .align(Alignment.BottomCenter)
                        .semantics { contentDescription = panelLabel },
                    shape = RoundedCornerShape(topStart = radius, topEnd = radius),
                    color = KozmosColors.primitivesColorsBackground0,
                    shadowElevation = 24.dp
                ) {
                    panel()
                }
            }
        }
    }
}
