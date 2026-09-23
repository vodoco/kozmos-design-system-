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
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosThemeTokens
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
 * What a map control's state resolves to, before any colour is chosen.
 *
 * Kept apart from the composable because this decision is the part a design
 * ruling changes — tinted became the default on 2026-09-15 — and it can be
 * tested without rendering anything.
 */
internal data class KozmosMapControlButtonAppearance(
    val surface: Surface,
    val icon: Tone,
    val label: Tone,
    /** The small line above a stacked state; muted only on the map's surface. */
    val caption: Tone,
    val edge: Edge
) {
    enum class Surface { Chrome, Filled }
    enum class Tone { Ink, Muted, Theme, OnFill }
    enum class Edge { Subtle, Theme }

    companion object {
        fun resolve(
            pressed: Boolean,
            emphasis: KozmosMapControlButtonEmphasis
        ): KozmosMapControlButtonAppearance = when {
            pressed && emphasis == KozmosMapControlButtonEmphasis.Filled ->
                KozmosMapControlButtonAppearance(Surface.Filled, Tone.OnFill, Tone.OnFill, Tone.OnFill, Edge.Subtle)
            // Only the glyph and the edge take the theme, so the label keeps its
            // contrast against a surface that stays the map's.
            pressed ->
                KozmosMapControlButtonAppearance(Surface.Chrome, Tone.Theme, Tone.Ink, Tone.Muted, Edge.Theme)
            else ->
                KozmosMapControlButtonAppearance(Surface.Chrome, Tone.Ink, Tone.Ink, Tone.Muted, Edge.Subtle)
        }
    }
}

@Composable
@ReadOnlyComposable
private fun KozmosMapControlButtonAppearance.Tone.color() = when (this) {
    KozmosMapControlButtonAppearance.Tone.Ink -> KozmosThemeTokens.primitivesColorsForeground100
    KozmosMapControlButtonAppearance.Tone.Muted -> KozmosThemeTokens.primitivesColorsForeground400
    KozmosMapControlButtonAppearance.Tone.Theme -> KozmosThemeTokens.primitivesColorsTheme600
    KozmosMapControlButtonAppearance.Tone.OnFill -> KozmosThemeTokens.componentsPrimaryButtonsThemedButtonForegroundContentIdle
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
    val appearance = KozmosMapControlButtonAppearance.resolve(pressed, emphasis)
    val borderColor by animateColorAsState(
        targetValue = if (appearance.edge == KozmosMapControlButtonAppearance.Edge.Theme) {
            KozmosThemeTokens.primitivesColorsTheme600
        } else {
            KozmosThemeTokens.primitivesColorsForeground300
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
        color = if (appearance.surface == KozmosMapControlButtonAppearance.Surface.Filled) {
            KozmosThemeTokens.componentsPrimaryButtonsThemedButtonBackgroundIdle
        } else {
            KozmosThemeTokens.primitivesColorsBackground0.copy(alpha = 0.9f)
        },
        contentColor = appearance.label.color(),
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
                CompositionLocalProvider(LocalContentColor provides appearance.icon.color()) {
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
                            color = appearance.caption.color(),
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
