package com.kozmos.components.counter

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.kozmos.tokens.KozmosDimensions
import com.kozmos.tokens.KozmosThemeTokens

enum class CounterTone {
    Neutral,
    Brand,
    Destructive,
    Inverse
}

enum class CounterSize {
    Default,
    Sm
}

@Composable
fun KozmosCounter(
    text: String,
    modifier: Modifier = Modifier,
    tone: CounterTone = CounterTone.Neutral,
    size: CounterSize = CounterSize.Default
) {
    val height = if (size == CounterSize.Sm) 18.dp else 20.dp
    val minWidth = if (size == CounterSize.Sm) 18.dp else 20.dp
    val horizontalPadding = if (size == CounterSize.Sm) 5.dp else KozmosDimensions.primitivesLayoutSpacing75
    val fontSize = if (size == CounterSize.Sm) 11.sp else 12.sp

    val containerColor = when (tone) {
        CounterTone.Neutral -> KozmosThemeTokens.componentsPrimaryButtonsNeutralButtonBackgroundIdle
        CounterTone.Brand -> KozmosThemeTokens.componentsPrimaryButtonsThemedButtonBackgroundIdle
        CounterTone.Destructive -> KozmosThemeTokens.componentsPrimaryButtonsDangerButtonBackgroundIdle
        CounterTone.Inverse -> KozmosThemeTokens.primitivesColorsBackground0
    }

    val contentColor = when (tone) {
        CounterTone.Neutral -> KozmosThemeTokens.componentsPrimaryButtonsNeutralButtonForegroundContentIdle
        CounterTone.Brand -> KozmosThemeTokens.componentsPrimaryButtonsThemedButtonForegroundContentIdle
        CounterTone.Destructive -> KozmosThemeTokens.componentsPrimaryButtonsDangerButtonForegroundContentIdle
        CounterTone.Inverse -> KozmosThemeTokens.primitivesColorsForeground100
    }

    Box(
        modifier = modifier
            .height(height)
            .widthIn(min = minWidth)
            .background(containerColor, CircleShape)
            .padding(horizontal = horizontalPadding),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = normalizeCounterText(text),
            color = contentColor,
            fontSize = fontSize,
            fontWeight = FontWeight.SemiBold,
            maxLines = 1
        )
    }
}

private fun normalizeCounterText(value: String): String {
    val trimmed = value.trim()
    if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
        return trimmed.removePrefix("(").removeSuffix(")").trim()
    }

    return trimmed
}
