package com.kozmos.tokens

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.ui.graphics.Color

val LocalKozmosUseDarkTokens = compositionLocalOf<Boolean?> { null }

object KozmosThemeTokens {
    val primitivesColorsBackground0: Color
        @Composable get() = themed(
            KozmosColors.primitivesColorsBackground0,
            KozmosColorsDark.primitivesColorsBackground0
        )

    val primitivesColorsBackground100: Color
        @Composable get() = themed(
            KozmosColors.primitivesColorsBackground100,
            KozmosColorsDark.primitivesColorsBackground100
        )

    val primitivesColorsBackground200: Color
        @Composable get() = themed(
            KozmosColors.primitivesColorsBackground200,
            KozmosColorsDark.primitivesColorsBackground200
        )

    val semanticsSurface0: Color
        @Composable get() = themed(
            KozmosDesignTokens.semanticsSurface0,
            KozmosColorsDark.semanticsSurface0
        )

    val semanticsOverlayScrim: Color
        @Composable get() = themed(
            KozmosDesignTokens.semanticsOverlayScrim,
            KozmosColorsDark.semanticsOverlayScrim
        )

    val primitivesColorsTheme500: Color
        @Composable get() = themed(
            KozmosColors.primitivesColorsTheme500,
            KozmosColorsDark.primitivesColorsTheme500
        )

    val primitivesColorsEmotionalDanger600: Color
        @Composable get() = themed(
            KozmosColors.primitivesColorsEmotionalDanger600,
            KozmosColorsDark.primitivesColorsEmotionalDanger600
        )

    val primitivesColorsEmotionalAlert600: Color
        @Composable get() = themed(
            KozmosColors.primitivesColorsEmotionalAlert600,
            KozmosColorsDark.primitivesColorsEmotionalAlert600
        )

    val primitivesColorsEmotionalSuccess600: Color
        @Composable get() = themed(
            KozmosColors.primitivesColorsEmotionalSuccess600,
            KozmosColorsDark.primitivesColorsEmotionalSuccess600
        )

    val primitivesColorsForeground0: Color
        @Composable get() = themed(
            KozmosColors.primitivesColorsForeground0,
            KozmosColorsDark.primitivesColorsForeground0
        )

    val primitivesColorsForeground100: Color
        @Composable get() = themed(
            KozmosColors.primitivesColorsForeground100,
            KozmosColorsDark.primitivesColorsForeground100
        )

    val primitivesColorsForeground400: Color
        @Composable get() = themed(
            KozmosColors.primitivesColorsForeground400,
            KozmosColorsDark.primitivesColorsForeground400
        )

    val primitivesColorsForeground500: Color
        @Composable get() = themed(
            KozmosColors.primitivesColorsForeground500,
            KozmosColorsDark.primitivesColorsForeground500
        )

    val primitivesColorsForeground1000: Color
        @Composable get() = themed(
            KozmosColors.primitivesColorsForeground1000,
            KozmosColorsDark.primitivesColorsForeground1000
        )

    val componentsPrimaryButtonsThemedButtonBackgroundIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsThemedButtonBackgroundIdle,
            KozmosColorsDark.componentsPrimaryButtonsThemedButtonBackgroundIdle
        )

    val componentsPrimaryButtonsThemedButtonForegroundContentIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsThemedButtonForegroundContentIdle,
            KozmosColorsDark.componentsPrimaryButtonsThemedButtonForegroundContentIdle
        )

    val componentsPrimaryButtonsDangerButtonBackgroundIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsDangerButtonBackgroundIdle,
            KozmosColorsDark.componentsPrimaryButtonsDangerButtonBackgroundIdle
        )

    val componentsPrimaryButtonsDangerButtonForegroundContentIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsDangerButtonForegroundContentIdle,
            KozmosColorsDark.componentsPrimaryButtonsDangerButtonForegroundContentIdle
        )

    val componentsPrimaryButtonsNeutralButtonBackgroundIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsNeutralButtonBackgroundIdle,
            KozmosColorsDark.componentsPrimaryButtonsNeutralButtonBackgroundIdle
        )

    val componentsPrimaryButtonsNeutralButtonForegroundContentIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsNeutralButtonForegroundContentIdle,
            KozmosColorsDark.componentsPrimaryButtonsNeutralButtonForegroundContentIdle
        )

    val componentsSecondaryButtonsThemedButtonForegroundContentIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsThemedButtonForegroundContentIdle,
            KozmosColorsDark.componentsSecondaryButtonsThemedButtonForegroundContentIdle
        )

    @Composable
    private fun themed(light: Color, dark: Color): Color {
        val useDark = LocalKozmosUseDarkTokens.current ?: isSystemInDarkTheme()
        return if (useDark) dark else light
    }
}
