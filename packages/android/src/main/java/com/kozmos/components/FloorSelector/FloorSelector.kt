package com.kozmos.components.floorselector

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.kozmos.providers.KozmosAnalyticsEvent
import com.kozmos.providers.LocalKozmosAnalytics
import com.kozmos.tokens.KozmosShadows
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

/** Layout of the floor selector, mirroring the React `FloorSelector.variant`. */
enum class KozmosFloorSelectorVariant(val value: String) {
    VerticalList("vertical-list"),
    HorizontalList("horizontal-list"),
    CompactStepper("compact-stepper")
}

/**
 * Switches the active level of a venue.
 *
 * Mirrors the React `FloorSelector` API. [selectedFloor] is the canonical floor
 * ID, never a display label, and the component reports selection rather than
 * deriving it.
 */
@Composable
fun KozmosFloorSelector(
    floors: List<String>,
    selectedFloor: String,
    onFloorSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    variant: KozmosFloorSelectorVariant = KozmosFloorSelectorVariant.VerticalList,
    label: String = "Floor selector"
) {
    val trackEvent = LocalKozmosAnalytics.current
    val selectedIndex = floors.indexOf(selectedFloor).takeIf { it >= 0 } ?: 0

    fun select(floor: String) {
        trackEvent(
            KozmosAnalyticsEvent(
                component = "FloorSelector",
                eventName = "floor_selected",
                properties = mapOf("floor" to floor)
            )
        )
        onFloorSelect(floor)
    }

    val floorButton: @Composable (String) -> Unit = { floor ->
        val isSelected = floor == selectedFloor
        Box(
            modifier = Modifier
                .size(KozmosDimensions.primitivesLayoutSizing500)
                .clip(RoundedCornerShape(KozmosDimensions.semanticsRadiusPanel))
                .background(
                    if (isSelected) KozmosColors.primitivesColorsTheme500 else Color.Transparent
                )
                .clickable { select(floor) }
                .semantics {
                    contentDescription = floor
                    selected = isSelected
                },
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = floor,
                color = if (isSelected) {
                    KozmosColors.primitivesColorsBackground0
                } else {
                    KozmosColors.primitivesColorsForeground100
                },
                style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold)
            )
        }
    }

    // Steps through the floor list. `offset` is in list order, so -1 is the
    // entry above the current one.
    val stepperButton: @Composable (Int, String) -> Unit = { offset, description ->
        val target = selectedIndex + offset
        val isEnabled = target in floors.indices
        Box(
            modifier = Modifier
                .size(KozmosDimensions.primitivesLayoutSizing500)
                .alpha(if (isEnabled) 1f else 0.4f)
                .clickable(enabled = isEnabled) { select(floors[target]) }
                .semantics { contentDescription = description },
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = if (offset < 0) {
                    Icons.Default.KeyboardArrowUp
                } else {
                    Icons.Default.KeyboardArrowDown
                },
                contentDescription = null,
                tint = KozmosColors.primitivesColorsForeground500
            )
        }
    }

    val rootModifier = modifier
        .shadow(KozmosShadows.semanticsElevationFloating, RoundedCornerShape(KozmosDimensions.semanticsRadiusPanel))
        .background(
            KozmosColors.primitivesColorsBackground0,
            RoundedCornerShape(KozmosDimensions.semanticsRadiusPanel)
        )
        .padding(KozmosDimensions.primitivesLayoutSpacing50)
        .semantics { contentDescription = label }

    val spacing = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing100)

    when (variant) {
        KozmosFloorSelectorVariant.HorizontalList -> Row(
            modifier = rootModifier,
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = spacing
        ) {
            floors.forEach { floorButton(it) }
        }

        KozmosFloorSelectorVariant.VerticalList -> Column(
            modifier = rootModifier,
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = spacing
        ) {
            floors.forEach { floorButton(it) }
        }

        KozmosFloorSelectorVariant.CompactStepper -> Column(
            modifier = rootModifier,
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = spacing
        ) {
            stepperButton(-1, "Floor up")
            floorButton(selectedFloor)
            stepperButton(1, "Floor down")
        }
    }
}
