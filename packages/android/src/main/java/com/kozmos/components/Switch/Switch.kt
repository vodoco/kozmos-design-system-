package com.kozmos.components.switch

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.kozmos.tokens.KozmosColors

@Composable
fun KozmosSwitch(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    val trackEvent = com.kozmos.providers.LocalKozmosAnalytics.current
    Switch(
        checked = checked,
        onCheckedChange = { 
            trackEvent(com.kozmos.providers.KozmosAnalyticsEvent(component = "Switch", eventName = "switch_toggled", properties = mapOf("checked" to it.toString())))
            onCheckedChange(it) 
        },
        modifier = modifier,
        enabled = enabled,
        colors = SwitchDefaults.colors(
            checkedThumbColor = KozmosColors.primitivesColorsBackground0,
            checkedTrackColor = KozmosColors.primitivesColorsTheme500,
            uncheckedThumbColor = KozmosColors.primitivesColorsBackground300,
            uncheckedTrackColor = KozmosColors.primitivesColorsBackground100,
        )
    )
}
