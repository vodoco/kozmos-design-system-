package com.kozmos.components.poiresultcard

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.kozmos.contracts.KozmosPOIAvailability
import com.kozmos.contracts.KozmosPOIPresentation
import com.kozmos.contracts.KozmosPOIResultPresentation
import com.kozmos.providers.KozmosAnalyticsEvent
import com.kozmos.providers.LocalKozmosAnalytics
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

/** Characters `encodeURIComponent` leaves untouched. */
private const val URI_COMPONENT_UNRESERVED =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~*'()"

/**
 * Stable identifier for a POI result, shared with map markers so a pin and its
 * list row can be kept in sync from one selection ID.
 *
 * Produces the same value as the web `getPOIResultDomId`, so an identifier
 * generated on any platform matches the other two.
 */
fun kozmosPOIResultIdentifier(poiId: String): String = buildString {
    append("poi-result-")
    for (byte in poiId.toByteArray(Charsets.UTF_8)) {
        val char = byte.toInt().toChar()
        if (byte >= 0 && URI_COMPONENT_UNRESERVED.indexOf(char) >= 0) {
            append(char)
        } else {
            append('%')
            append(((byte.toInt() and 0xFF) + 0x100).toString(16).substring(1).uppercase())
        }
    }
}

/**
 * A POI search/list result row.
 *
 * Mirrors the React `POIResultCard`. Selection is reported upward only; the
 * card renders exactly the state described by [poi] and [result].
 */
@Composable
fun KozmosPOIResultCard(
    poi: KozmosPOIPresentation,
    result: KozmosPOIResultPresentation,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    featuredLabel: String = "Featured",
    selectionLabel: String? = null
) {
    val trackEvent = LocalKozmosAnalytics.current
    val available = result.isAvailable

    val accessibilityDescription = selectionLabel ?: listOfNotNull(
        poi.name,
        poi.categoryLabel,
        poi.locationLabel,
        poi.availabilityLabel,
        result.travelEstimate?.durationLabel,
        if (available) null else result.unavailableReason
    ).joinToString(", ")

    Surface(
        onClick = {
            trackEvent(
                KozmosAnalyticsEvent(
                    component = "POIResultCard",
                    eventName = "poi_result_selected",
                    properties = mapOf(
                        "poiId" to poi.id,
                        "resultIndex" to result.resultIndex.toString(),
                        "featured" to result.featured.toString()
                    )
                )
            )
            onSelect(poi.id)
        },
        modifier = modifier
            .fillMaxWidth()
            .semantics {
                contentDescription = accessibilityDescription
                selected = result.selected
            },
        enabled = available,
        shape = RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius300),
        color = KozmosColors.primitivesColorsBackground0,
        border = BorderStroke(
            width = if (result.selected) 2.dp else 1.dp,
            color = if (result.selected) {
                KozmosColors.primitivesColorsTheme500
            } else {
                KozmosColors.primitivesColorsForeground300
            }
        )
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            if (result.featured) {
                Row(
                    modifier = Modifier
                        .padding(
                            start = KozmosDimensions.primitivesLayoutSpacing200,
                            top = KozmosDimensions.primitivesLayoutSpacing100
                        )
                        .clip(RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius100))
                        .background(KozmosColors.componentsPrimaryButtonsAlertButtonBackgroundIdle)
                        .padding(
                            horizontal = KozmosDimensions.primitivesLayoutSpacing100,
                            vertical = KozmosDimensions.primitivesLayoutSpacing50
                        ),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(
                        KozmosDimensions.primitivesLayoutSpacing50
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = null,
                        tint = KozmosColors.componentsPrimaryButtonsAlertButtonForegroundContentIdle,
                        modifier = Modifier.size(14.dp)
                    )
                    Text(
                        text = featuredLabel,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.SemiBold,
                        color = KozmosColors.componentsPrimaryButtonsAlertButtonForegroundContentIdle
                    )
                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .defaultMinSize(minHeight = 96.dp)
                    .padding(KozmosDimensions.primitivesLayoutSpacing200),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(
                    KozmosDimensions.primitivesLayoutSpacing150
                )
            ) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = result.resultIndex.toString(),
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        color = KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle
                    )
                }

                Column(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(
                        KozmosDimensions.primitivesLayoutSpacing25
                    )
                ) {
                    Text(
                        text = poi.name,
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.SemiBold,
                        color = KozmosColors.primitivesColorsForeground100,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )

                    poi.categoryLabel?.let { categoryLabel ->
                        Text(
                            text = categoryLabel,
                            style = MaterialTheme.typography.bodyMedium,
                            color = KozmosColors.primitivesColorsForeground500,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(
                            KozmosDimensions.primitivesLayoutSpacing50
                        )
                    ) {
                        Icon(
                            imageVector = Icons.Default.Place,
                            contentDescription = null,
                            tint = KozmosColors.primitivesColorsForeground500,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(
                            text = poi.locationLabel,
                            style = MaterialTheme.typography.bodyMedium,
                            color = KozmosColors.primitivesColorsForeground500,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }

                    poi.availabilityLabel?.let { availabilityLabel ->
                        Text(
                            text = availabilityLabel,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.SemiBold,
                            color = if (poi.availability == KozmosPOIAvailability.Open) {
                                KozmosColors.componentsPrimaryButtonsSuccessButtonBackgroundIdle
                            } else {
                                KozmosColors.primitivesColorsForeground500
                            }
                        )
                    }
                }

                Column(
                    horizontalAlignment = Alignment.End,
                    verticalArrangement = Arrangement.spacedBy(
                        KozmosDimensions.primitivesLayoutSpacing100
                    )
                ) {
                    POILogo(poi = poi)

                    result.travelEstimate?.let { travelEstimate ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(
                                KozmosDimensions.primitivesLayoutSpacing50
                            )
                        ) {
                            Icon(
                                imageVector = Icons.Default.Schedule,
                                contentDescription = null,
                                tint = KozmosColors.primitivesColorsForeground100,
                                modifier = Modifier.size(14.dp)
                            )
                            Text(
                                text = travelEstimate.durationLabel,
                                style = MaterialTheme.typography.labelSmall,
                                color = KozmosColors.primitivesColorsForeground100
                            )
                        }
                    }
                }
            }

            if (!available && result.unavailableReason != null) {
                Divider(color = KozmosColors.primitivesColorsForeground300)

                Text(
                    text = result.unavailableReason,
                    style = MaterialTheme.typography.bodySmall,
                    color = KozmosColors.primitivesColorsForeground500,
                    modifier = Modifier.padding(
                        horizontal = KozmosDimensions.primitivesLayoutSpacing200,
                        vertical = KozmosDimensions.primitivesLayoutSpacing100
                    )
                )
            }
        }
    }
}

@Composable
private fun POILogo(poi: KozmosPOIPresentation) {
    val logo = poi.logo
    val shape = RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius100)

    if (logo != null) {
        AsyncImage(
            model = logo.src,
            contentDescription = logo.alt,
            contentScale = ContentScale.Fit,
            modifier = Modifier
                .size(40.dp)
                .clip(shape)
        )
    } else {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(shape)
                .background(KozmosColors.primitivesColorsBackground100),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = poi.logoFallbackInitial,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold,
                color = KozmosColors.primitivesColorsForeground500
            )
        }
    }
}
