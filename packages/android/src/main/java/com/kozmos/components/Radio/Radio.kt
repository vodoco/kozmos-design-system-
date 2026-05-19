package com.kozmos.components.radio

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosDimensions
import com.kozmos.tokens.KozmosThemeTokens

@Composable
fun KozmosRadioGroup(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(modifier = modifier.selectableGroup()) {
        content()
    }
}

@Composable
fun KozmosRadioGroupItem(
    value: String,
    selectedValue: String,
    onOptionSelected: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    enabled: Boolean = true,
    error: Boolean = false
) {
    val trackEvent = com.kozmos.providers.LocalKozmosAnalytics.current
    val selected = value == selectedValue
    val selectedColor = if (error) {
        KozmosThemeTokens.primitivesColorsEmotionalDanger600
    } else {
        KozmosThemeTokens.primitivesColorsTheme500
    }
    val unselectedColor = if (error) {
        KozmosThemeTokens.primitivesColorsEmotionalDanger600
    } else {
        KozmosThemeTokens.primitivesColorsForeground500
    }
    val disabledColor = KozmosThemeTokens.primitivesColorsForeground500
    val labelColor = when {
        error -> KozmosThemeTokens.primitivesColorsEmotionalDanger600
        !enabled -> disabledColor
        else -> MaterialTheme.colorScheme.onSurface
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .heightIn(min = 44.dp)
            .selectable(
                selected = selected,
                enabled = enabled,
                onClick = { 
                    trackEvent(com.kozmos.providers.KozmosAnalyticsEvent(component = "RadioGroup", eventName = "radio_selection_changed", properties = mapOf("value" to value.toString())))
                    onOptionSelected(value) 
                },
                role = Role.RadioButton
            )
            .padding(vertical = KozmosDimensions.primitivesLayoutSpacing100),
        verticalAlignment = Alignment.CenterVertically
    ) {
        RadioButton(
            selected = selected,
            onClick = null,
            enabled = enabled,
            colors = RadioButtonDefaults.colors(
                selectedColor = selectedColor,
                unselectedColor = unselectedColor,
                disabledSelectedColor = disabledColor,
                disabledUnselectedColor = disabledColor
            )
        )
        if (label != null) {
            Spacer(modifier = Modifier.width(KozmosDimensions.primitivesLayoutSpacing100))
            Text(
                text = label,
                style = MaterialTheme.typography.bodyLarge,
                color = labelColor
            )
        }
    }
}
