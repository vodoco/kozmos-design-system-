package com.kozmos.components.slider

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.kozmos.tokens.KozmosThemeTokens

@Composable
fun KozmosSlider(
    value: Float,
    onValueChange: (Float) -> Unit,
    modifier: Modifier = Modifier,
    valueRange: ClosedFloatingPointRange<Float> = 0f..1f,
    enabled: Boolean = true
) {
    val trackEvent = com.kozmos.providers.LocalKozmosAnalytics.current
    Slider(
        value = value,
        onValueChange = onValueChange,
        onValueChangeFinished = {
            trackEvent(com.kozmos.providers.KozmosAnalyticsEvent(component = "Slider", eventName = "slider_value_changed", properties = mapOf("value" to value.toString())))
        },
        modifier = modifier,
        valueRange = valueRange,
        enabled = enabled,
        colors = SliderDefaults.colors(
            thumbColor = KozmosThemeTokens.primitivesColorsTheme500,
            activeTrackColor = KozmosThemeTokens.primitivesColorsTheme500,
            inactiveTrackColor = KozmosThemeTokens.primitivesColorsBackground300,
        )
    )
}
