package com.kozmos.components.savelocationcard

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DirectionsCar
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.kozmos.components.button.KozmosButton
import com.kozmos.providers.KozmosAnalyticsEvent
import com.kozmos.providers.LocalKozmosAnalytics
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

@Composable
fun KozmosSaveLocationCard(
    modifier: Modifier = Modifier,
    title: String = "Mark My Car",
    description: String = "Remember where you parked",
    isSaved: Boolean = false,
    onSaveToggle: (() -> Unit)? = null,
    onRouteToLocation: (() -> Unit)? = null,
    onEditNote: (() -> Unit)? = null
) {
    val trackEvent = LocalKozmosAnalytics.current

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius300),
        color = KozmosColors.primitivesColorsBackground0.copy(alpha = 0.9f),
        tonalElevation = 6.dp,
        shadowElevation = 12.dp,
        border = BorderStroke(1.dp, KozmosColors.primitivesColorsForeground900.copy(alpha = 0.08f))
    ) {
        Column(
            verticalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing200),
            modifier = Modifier
                .fillMaxWidth()
                .padding(KozmosDimensions.primitivesLayoutSpacing300)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Surface(
                    modifier = Modifier.size(48.dp),
                    shape = CircleShape,
                    color = if (isSaved) KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle else KozmosColors.primitivesColorsBackground0,
                    border = BorderStroke(1.dp, KozmosColors.primitivesColorsForeground900.copy(alpha = 0.08f))
                ) {
                    androidx.compose.foundation.layout.Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.DirectionsCar,
                            contentDescription = null,
                            tint = if (isSaved) KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle else KozmosColors.primitivesColorsForeground100
                        )
                    }
                }

                Column(modifier = Modifier.weight(1f)) {
                    Text(text = title, style = MaterialTheme.typography.titleMedium, color = KozmosColors.primitivesColorsForeground100)
                    Text(text = description, style = MaterialTheme.typography.bodyMedium, color = KozmosColors.primitivesColorsForeground500)
                }

                if (isSaved && onEditNote != null) {
                    IconButton(
                        onClick = onEditNote,
                        modifier = Modifier.semantics { contentDescription = "Edit location note" }
                    ) {
                        Icon(Icons.Default.Edit, contentDescription = null, tint = KozmosColors.primitivesColorsForeground500)
                    }
                }
            }

            Row(
                horizontalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing150),
                modifier = Modifier.fillMaxWidth()
            ) {
                if (isSaved) {
                    OutlinedButton(
                        onClick = {
                            trackEvent(KozmosAnalyticsEvent(component = "SaveLocationCard", eventName = "save_toggled", properties = mapOf("isSaved" to (!isSaved).toString())))
                            onSaveToggle?.invoke()
                        },
                        modifier = Modifier.weight(1f),
                        border = BorderStroke(1.dp, KozmosColors.primitivesColorsTheme500),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = KozmosColors.primitivesColorsTheme500)
                    ) {
                        Icon(Icons.Default.LocationOn, contentDescription = null)
                        Spacer(modifier = Modifier.size(KozmosDimensions.primitivesLayoutSpacing100))
                        Text("Remove Location")
                    }
                } else {
                    KozmosButton(
                        onClick = {
                            trackEvent(KozmosAnalyticsEvent(component = "SaveLocationCard", eventName = "save_toggled", properties = mapOf("isSaved" to (!isSaved).toString())))
                            onSaveToggle?.invoke()
                        },
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.LocationOn, contentDescription = null)
                        Spacer(modifier = Modifier.size(KozmosDimensions.primitivesLayoutSpacing100))
                        Text("Save Location")
                    }
                }

                if (isSaved && onRouteToLocation != null) {
                    KozmosButton(
                        onClick = {
                            trackEvent(KozmosAnalyticsEvent(component = "SaveLocationCard", eventName = "route_requested"))
                            onRouteToLocation()
                        },
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.Navigation, contentDescription = null)
                        Spacer(modifier = Modifier.size(KozmosDimensions.primitivesLayoutSpacing100))
                        Text("Guide Me")
                    }
                }
            }
        }
    }
}
