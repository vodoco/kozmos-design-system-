package com.kozmos.components.mapcontrolsgroup

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.kozmos.providers.KozmosAnalyticsEvent
import com.kozmos.providers.LocalKozmosAnalytics
import com.kozmos.components.mapcontrolbutton.KozmosMapControlButton
import com.kozmos.components.mapcontrolbutton.KozmosMapControlButtonPresentation
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions
import com.kozmos.tokens.KozmosThemeTokens

@Composable
fun KozmosMapControlsGroup(
    modifier: Modifier = Modifier,
    compassBearing: Float = 0f,
    onZoomIn: () -> Unit = {},
    onZoomOut: () -> Unit = {},
    onCompassReset: (() -> Unit)? = null,
    onMyLocation: (() -> Unit)? = null,
    locationPresentation: KozmosMapControlButtonPresentation =
        KozmosMapControlButtonPresentation.IconOnly,
    locationLabel: String = "Locate me",
    locationStateLabel: String? = null
) {
    val trackEvent = LocalKozmosAnalytics.current

    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing100)
    ) {
        Surface(
            shape = RoundedCornerShape(KozmosDimensions.semanticsRadiusContainer),
            color = KozmosColors.primitivesColorsBackground0.copy(alpha = 0.9f),
            tonalElevation = 6.dp,
            shadowElevation = 8.dp,
            border = BorderStroke(1.dp, KozmosThemeTokens.semanticsBorderSubtle)
        ) {
            Column {
                MapControlIconButton(
                    icon = Icons.Default.Add,
                    contentDescription = "Zoom in",
                    onClick = {
                        trackEvent(KozmosAnalyticsEvent(component = "MapControlsGroup", eventName = "zoom_in"))
                        onZoomIn()
                    }
                )
                Divider(color = KozmosThemeTokens.semanticsBorderSubtle)
                MapControlIconButton(
                    icon = Icons.Default.Remove,
                    contentDescription = "Zoom out",
                    onClick = {
                        trackEvent(KozmosAnalyticsEvent(component = "MapControlsGroup", eventName = "zoom_out"))
                        onZoomOut()
                    }
                )
            }
        }

        onCompassReset?.let { reset ->
            Surface(
                modifier = Modifier.size(44.dp),
                shape = RoundedCornerShape(KozmosDimensions.semanticsRadiusContainer),
                color = KozmosColors.primitivesColorsBackground0.copy(alpha = 0.9f),
                tonalElevation = 6.dp,
                shadowElevation = 8.dp
            ) {
                MapControlIconButton(
                    modifier = Modifier.rotate(compassBearing),
                    icon = Icons.Default.Explore,
                    contentDescription = "Reset bearing",
                    onClick = {
                        trackEvent(KozmosAnalyticsEvent(component = "MapControlsGroup", eventName = "compass_reset"))
                        reset()
                    }
                )
            }
        }

        // Composes the shared MapControlButton so the labelled presentation and
        // its accessible name stay consistent with standalone map controls.
        onMyLocation?.let { locate ->
            KozmosMapControlButton(
                label = locationLabel,
                onClick = {
                    trackEvent(
                        KozmosAnalyticsEvent(
                            component = "MapControlsGroup",
                            eventName = "my_location_triggered"
                        )
                    )
                    locate()
                },
                icon = {
                    Icon(
                        imageVector = Icons.Default.MyLocation,
                        contentDescription = null
                    )
                },
                stateLabel = locationStateLabel,
                presentation = locationPresentation,
                pressed = true
            )
        }
    }
}

@Composable
private fun MapControlIconButton(
    icon: ImageVector,
    contentDescription: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    IconButton(
        onClick = onClick,
        modifier = modifier
            .size(44.dp)
            .semantics { this.contentDescription = contentDescription }
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = KozmosColors.primitivesColorsForeground100
        )
    }
}
