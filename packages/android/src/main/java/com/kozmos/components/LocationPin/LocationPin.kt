package com.kozmos.components.locationpin

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

/** Colour role of a map marker, mirroring the React `LocationPin.variant` prop. */
enum class KozmosLocationPinVariant {
    Default,
    Primary,
    Secondary,
    Accent
}

/** Marker footprint, mirroring the React `LocationPin.size` prop. */
enum class KozmosLocationPinSize(val diameter: Dp) {
    Sm(24.dp),
    Md(32.dp),
    Lg(40.dp)
}

/** Where the marker's label sits relative to the marker. */
enum class KozmosLocationPinLabelPlacement {
    Top,
    Right,
    Bottom,
    Left
}

/**
 * A map marker for a point of interest.
 *
 * Mirrors the React `LocationPin` API. Selection, featured, off-floor, and
 * disabled are independent flags rather than one state axis, matching React,
 * so a pin can be both featured and selected. Placement on the map and
 * collision handling stay with the renderer.
 */
@Composable
fun KozmosLocationPin(
    modifier: Modifier = Modifier,
    variant: KozmosLocationPinVariant = KozmosLocationPinVariant.Primary,
    size: KozmosLocationPinSize = KozmosLocationPinSize.Md,
    label: String? = null,
    number: Int? = null,
    labelPlacement: KozmosLocationPinLabelPlacement = KozmosLocationPinLabelPlacement.Bottom,
    selected: Boolean = false,
    featured: Boolean = false,
    offFloor: Boolean = false,
    enabled: Boolean = true
) {
    val markerColor: Color = when {
        featured -> KozmosColors.primitivesColorsEmotionalAlert500
        variant == KozmosLocationPinVariant.Default -> KozmosColors.primitivesColorsForeground100
        variant == KozmosLocationPinVariant.Primary -> KozmosColors.primitivesColorsTheme500
        variant == KozmosLocationPinVariant.Secondary -> KozmosColors.primitivesColorsForeground400
        else -> KozmosColors.primitivesColorsThemeVariant1500
    }

    // Selected pins grow as well as recolor, so selection is not colour-only.
    val diameter = if (selected) size.diameter + 8.dp else size.diameter
    val alpha = if (enabled) 1f else 0.5f

    val description = listOfNotNull(
        label,
        number?.toString(),
        if (featured) "Featured" else null,
        if (offFloor) "On another floor" else null
    ).joinToString(", ")

    // Captured so the semantics `selected` property is not shadowed by the
    // parameter of the same name.
    val isSelected = selected
    val rootModifier = modifier.semantics {
        if (description.isNotEmpty()) contentDescription = description
        this.selected = isSelected
    }

    val marker: @Composable () -> Unit = {
        Box(contentAlignment = Alignment.Center) {
            Canvas(modifier = Modifier.size(diameter)) {
                val radius = this.size.minDimension / 2f
                drawCircle(color = markerColor.copy(alpha = alpha), radius = radius)
                // Off-floor pins are outlined rather than filled, so the state
                // is not carried by colour alone.
                drawCircle(
                    color = KozmosColors.primitivesColorsForeground1000.copy(alpha = alpha),
                    radius = radius - 1f,
                    style = Stroke(
                        width = 2f * density,
                        pathEffect = if (offFloor) {
                            PathEffect.dashPathEffect(floatArrayOf(6f, 6f))
                        } else {
                            null
                        }
                    )
                )
            }

            number?.let {
                Text(
                    text = it.toString(),
                    fontSize = (diameter.value * 0.44f).sp,
                    fontWeight = FontWeight.Bold,
                    color = KozmosColors.primitivesColorsForeground1000.copy(alpha = alpha)
                )
            }
        }
    }

    val labelContent: @Composable () -> Unit = {
        label?.let {
            Text(
                text = it,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = KozmosColors.primitivesColorsForeground100.copy(alpha = alpha),
                maxLines = 1
            )
        }
    }

    val spacing = KozmosDimensions.primitivesLayoutSpacing50

    when (labelPlacement) {
        KozmosLocationPinLabelPlacement.Top,
        KozmosLocationPinLabelPlacement.Bottom -> Column(
            modifier = rootModifier,
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(spacing)
        ) {
            if (labelPlacement == KozmosLocationPinLabelPlacement.Top) {
                labelContent()
                marker()
            } else {
                marker()
                labelContent()
            }
        }

        KozmosLocationPinLabelPlacement.Left,
        KozmosLocationPinLabelPlacement.Right -> Row(
            modifier = rootModifier,
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(spacing)
        ) {
            if (labelPlacement == KozmosLocationPinLabelPlacement.Left) {
                labelContent()
                marker()
            } else {
                marker()
                labelContent()
            }
        }
    }
}
