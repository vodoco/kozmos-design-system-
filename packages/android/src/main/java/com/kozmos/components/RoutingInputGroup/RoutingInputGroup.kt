package com.kozmos.components.routinginputgroup

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.SwapVert
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.kozmos.providers.KozmosAnalyticsEvent
import com.kozmos.providers.LocalKozmosAnalytics
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions
import com.kozmos.tokens.KozmosThemeTokens
import com.kozmos.components.surface.KozmosSurfaceDefaults
import com.kozmos.components.surface.KozmosSurfaceStyle
import androidx.compose.ui.graphics.Color

data class KozmosRoutePoint(
    val id: String,
    val value: String,
    val placeholder: String? = null
)

@Composable
fun KozmosRoutingInputGroup(
    points: List<KozmosRoutePoint>,
    onPointChange: (String, String) -> Unit,
    modifier: Modifier = Modifier,
    onSwap: (() -> Unit)? = null,
    onAddPoint: (() -> Unit)? = null,
    onRemovePoint: ((String) -> Unit)? = null
) {
    val trackEvent = LocalKozmosAnalytics.current

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(KozmosDimensions.semanticsRadiusPanel),
        // The solid surface React's card sits on by default, themed: the
        // background with the subtle border. It was the background at 90 %
        // under a near-black hairline at 8 % until 2026-09-22.
        color = KozmosSurfaceDefaults.tint(KozmosSurfaceStyle.Solid),
        tonalElevation = 6.dp,
        shadowElevation = 12.dp,
        border = KozmosSurfaceDefaults.border(KozmosSurfaceStyle.Solid)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(KozmosDimensions.primitivesLayoutSpacing200),
            horizontalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing150),
            verticalAlignment = Alignment.Top
        ) {
            RouteTimeline(points)

            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing150)
            ) {
                points.forEachIndexed { index, point ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing100)
                    ) {
                        OutlinedTextField(
                            value = point.value,
                            onValueChange = { onPointChange(point.id, it) },
                            placeholder = { Text(point.placeholder ?: defaultPlaceholder(index)) },
                            singleLine = true,
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(KozmosDimensions.semanticsRadiusControl),
                            // No edge at rest, a wash instead, as React's field
                            // (border-transparent, bg-black/5) and SwiftUI's are;
                            // the theme's edge stays to mark focus. It was
                            // outlined in foreground/300 until 2026-09-22.
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = KozmosColors.primitivesColorsTheme500,
                                unfocusedBorderColor = Color.Transparent,
                                focusedContainerColor = KozmosThemeTokens.primitivesColorsForeground0.copy(alpha = 0.05f),
                                unfocusedContainerColor = KozmosThemeTokens.primitivesColorsForeground0.copy(alpha = 0.05f)
                            )
                        )

                        if (points.size > 2 && index > 0 && index < points.lastIndex && onRemovePoint != null) {
                            IconButton(
                                onClick = {
                                    trackEvent(KozmosAnalyticsEvent(component = "RoutingInputGroup", eventName = "point_removed", properties = mapOf("pointId" to point.id)))
                                    onRemovePoint(point.id)
                                },
                                modifier = Modifier.semantics { contentDescription = "Remove route point" }
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Close,
                                    contentDescription = null,
                                    tint = KozmosColors.primitivesColorsEmotionalDanger600
                                )
                            }
                        }
                    }
                }
            }

            Column(verticalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing100)) {
                if (points.size == 2 && onSwap != null) {
                    IconButton(
                        onClick = {
                            trackEvent(KozmosAnalyticsEvent(component = "RoutingInputGroup", eventName = "points_swapped"))
                            onSwap()
                        },
                        modifier = Modifier.semantics { contentDescription = "Swap route points" }
                    ) {
                        Icon(Icons.Default.SwapVert, contentDescription = null)
                    }
                }

                if (onAddPoint != null) {
                    IconButton(
                        onClick = {
                            trackEvent(KozmosAnalyticsEvent(component = "RoutingInputGroup", eventName = "point_added"))
                            onAddPoint()
                        },
                        modifier = Modifier.semantics { contentDescription = "Add route point" }
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null)
                    }
                }
            }
        }
    }
}

@Composable
private fun RouteTimeline(points: List<KozmosRoutePoint>) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        points.forEachIndexed { index, _ ->
            if (index == points.lastIndex) {
                Icon(
                    imageVector = Icons.Default.Place,
                    contentDescription = null,
                    tint = KozmosColors.primitivesColorsTheme500,
                    modifier = Modifier.size(18.dp)
                )
            } else {
                Box(
                    modifier = Modifier
                        .size(14.dp)
                        .background(
                            if (index == 0) KozmosColors.primitivesColorsTheme500.copy(alpha = 0.18f) else androidx.compose.ui.graphics.Color.Transparent,
                            CircleShape
                        )
                        .border(
                            2.dp,
                            if (index == 0) KozmosColors.primitivesColorsTheme500 else KozmosThemeTokens.primitivesColorsForeground400,
                            CircleShape
                        )
                )
            }

            if (index < points.lastIndex) {
                Box(
                    modifier = Modifier
                        .width(2.dp)
                        .height(36.dp)
                        .background(KozmosColors.primitivesColorsForeground300, RoundedCornerShape(1.dp))
                )
            }
        }
    }
}

private fun defaultPlaceholder(index: Int): String {
    return if (index == 0) "Choose Starting Point" else "Choose Destination"
}
