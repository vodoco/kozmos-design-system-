package com.kozmos.components.mapcontrolbutton

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
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
    pressed: Boolean = false,
    enabled: Boolean = true
) {
    val accessibleLabel = if (stateLabel != null) "$label, $stateLabel" else label
    val contentColor = if (pressed) {
        KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle
    } else {
        KozmosColors.primitivesColorsForeground100
    }

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
        shape = RoundedCornerShape(KozmosDimensions.semanticsRadiusPanel),
        color = if (pressed) {
            KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle
        } else {
            KozmosColors.primitivesColorsBackground0.copy(alpha = 0.9f)
        },
        contentColor = contentColor,
        border = BorderStroke(1.dp, KozmosColors.primitivesColorsForeground300),
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
            icon?.invoke()

            if (presentation == KozmosMapControlButtonPresentation.Labelled) {
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
