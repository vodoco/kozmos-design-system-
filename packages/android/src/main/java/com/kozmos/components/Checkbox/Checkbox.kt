package com.kozmos.components.checkbox

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors

@Composable
fun KozmosCheckbox(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    label: String? = null,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    val trackEvent = com.kozmos.providers.LocalKozmosAnalytics.current
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier
            .clickable(enabled = enabled) { 
                trackEvent(com.kozmos.providers.KozmosAnalyticsEvent(component = "Checkbox", eventName = "checkbox_toggled", properties = mapOf("checked" to (!checked).toString())))
                onCheckedChange(!checked) 
            }
            .padding(KozmosDimensions.primitivesLayoutSpacing50)
    ) {
        Checkbox(
            checked = checked,
            onCheckedChange = null, // Handled by Row clickable for better touch target
            enabled = enabled,
            colors = CheckboxDefaults.colors(
                checkedColor = KozmosColors.primitivesColorsTheme500,
                uncheckedColor = KozmosColors.primitivesColorsForeground500
            )
        )
        
        if (label != null) {
            Spacer(modifier = Modifier.width(KozmosDimensions.primitivesLayoutSpacing100))
            Text(
                text = label,
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}
