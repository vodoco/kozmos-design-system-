package com.kozmos.components.mapcontrolbutton

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

enum class KozmosMapControlButtonPresentation {
    IconOnly,
    Labelled
}

/**
 * How an active map control reads.
 *
 * [Tinted] keeps the map surface and colours the icon and the edge, which is
 * what the SDK draws — a control over a map has to stay legible against the
 * tiles behind it, and a solid fill hides the very thing it sits on.
 * [Filled] is the inverted treatment this component shipped before
 * 2026-09-15, kept for callers that want the heavier emphasis.
 */
enum class KozmosMapControlButtonEmphasis {
    Tinted,
    Filled
}

/**
 * Where a control's state sits relative to its label.
 *
 * [Inline] runs them along one line. [Stacked] sets the state under the label,
 * which is how a map pill fits a two-word state into a control that has to
 * stay thumb-sized.
 */
enum class KozmosMapControlButtonLabelPlacement {
    Inline,
    Stacked
}

/**
 * A single floating map control.
 *
 * Mirrors the React `MapControlButton`. [label] is the localized action name
 * and always becomes the accessible name; [stateLabel] is appended so screen
 * reader users hear the current state without relying on visual styling.
 */
@Composable
fun KozmosMapControlButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: (@Composable () -> Unit)? = null,
    stateLabel: String? = null,
    presentation: KozmosMapControlButtonPresentation = KozmosMapControlButtonPresentation.IconOnly,
    emphasis: KozmosMapControlButtonEmphasis = KozmosMapControlButtonEmphasis.Tinted,
    labelPlacement: KozmosMapControlButtonLabelPlacement = KozmosMapControlButtonLabelPlacement.Inline,
    pressed: Boolean = false,
    enabled: Boolean = true
) {
    val accessibleLabel = if (stateLabel != null) "$label, $stateLabel" else label
    // A tinted control keeps the map chrome in both states; only a filled one
    // inverts its surface.
    val isFilled = pressed && emphasis == KozmosMapControlButtonEmphasis.Filled

    val contentColor = if (isFilled) {
        KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle
    } else {
        KozmosColors.primitivesColorsForeground100
    }
    // Only the glyph carries the tint, so the label keeps its contrast against
    // the surface behind it.
    val iconColor = when {
        isFilled -> KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle
        pressed -> KozmosColors.primitivesColorsTheme600
        else -> KozmosColors.primitivesColorsForeground100
    }
    val borderColor by animateColorAsState(
        targetValue = if (pressed && !isFilled) {
            KozmosColors.primitivesColorsTheme600
        } else {
            KozmosColors.primitivesColorsForeground300
        },
        label = "MapControlButtonBorder"
    )

    Surface(
        onClick = onClick,
        modifier = modifier
            .height(44.dp)
            .then(
                if (presentation == KozmosMapControlButtonPresentation.IconOnly) {
                    Modifier.size(44.dp)
                } else {
                    Modifier.widthIn(max = 256.dp).defaultMinSize(minWidth = 44.dp)
                }
            )
            .semantics {
                contentDescription = accessibleLabel
                selected = pressed
            },
        enabled = enabled,
        shape = RoundedCornerShape(KozmosDimensions.semanticsRadiusControl),
        color = if (isFilled) {
            KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle
        } else {
            KozmosColors.primitivesColorsBackground0.copy(alpha = 0.9f)
        },
        contentColor = contentColor,
        border = BorderStroke(1.dp, borderColor),
        shadowElevation = if (pressed) 2.dp else 8.dp
    ) {
        Row(
            modifier = Modifier.padding(
                horizontal = if (presentation == KozmosMapControlButtonPresentation.Labelled) {
                    KozmosDimensions.primitivesLayoutSpacing150
                } else {
                    0.dp
                }
            ),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(
                KozmosDimensions.primitivesLayoutSpacing100,
                Alignment.CenterHorizontally
            )
        ) {
            if (icon != null) {
                CompositionLocalProvider(LocalContentColor provides iconColor) {
                    icon()
                }
            }

            if (presentation == KozmosMapControlButtonPresentation.Labelled) {
                if (labelPlacement == KozmosMapControlButtonLabelPlacement.Stacked) {
                    Column(horizontalAlignment = Alignment.Start) {
                        // The SDK sets these at 11sp over 13sp semibold. The
                        // type scale has no role at either size yet, so this
                        // reaches for the nearest roles and the deviation is
                        // recorded in the gap list rather than hard-coded here.
                        Text(
                            text = label,
                            style = MaterialTheme.typography.labelSmall,
                            color = KozmosColors.primitivesColorsForeground400,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )

                        if (stateLabel != null) {
                            Text(
                                text = stateLabel,
                                style = MaterialTheme.typography.bodySmall,
                                fontWeight = FontWeight.SemiBold,
                                maxLines = 1
                            )
                        }
                    }
                } else {
                    Text(
                        text = label,
                        style = MaterialTheme.typography.bodyMedium,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )

                    if (stateLabel != null) {
                        Text(
                            text = stateLabel,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold,
                            maxLines = 1
                        )
                    }
                }
            }
        }
    }
}
