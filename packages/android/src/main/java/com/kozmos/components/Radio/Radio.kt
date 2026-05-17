package com.kozmos.components.radio

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
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
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

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
    label: String? = null
) {
    val trackEvent = com.kozmos.providers.LocalKozmosAnalytics.current
    Row(
        modifier = modifier
            .fillMaxWidth()
            .selectable(
                selected = (value == selectedValue),
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
            selected = (value == selectedValue),
            onClick = null,
            colors = RadioButtonDefaults.colors(
                selectedColor = KozmosColors.primitivesColorsTheme500,
                unselectedColor = KozmosColors.primitivesColorsForeground500
            )
        )
        if (label != null) {
            Spacer(modifier = Modifier.width(KozmosDimensions.primitivesLayoutSpacing100))
            Text(
                text = label,
                style = MaterialTheme.typography.bodyLarge,
                color = KozmosColors.primitivesColorsForeground100
            )
        }
    }
}
