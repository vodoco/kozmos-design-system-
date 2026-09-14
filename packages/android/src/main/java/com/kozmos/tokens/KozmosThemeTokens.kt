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

    /**
     * The container edge and divider role. Both palettes have carried it from
     * the start; only the theme wrapper was missing, so Compose could not read
     * it — the same gap the emotion colours had before #32.
     */
    val semanticsBorderSubtle: Color
        @Composable get() = themed(
            KozmosDesignTokens.semanticsBorderSubtle,
            KozmosColorsDark.semanticsBorderSubtle
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

    // The six emotions, both tiers. The product drives all six and the
    // generated token files have carried them from the start; only themed,
    // neutral and danger were ever wrapped for the theme, which is why the
    // Compose button could not express the rest.
    val componentsPrimaryButtonsThemedButtonBackgroundHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsThemedButtonBackgroundHover,
            KozmosColorsDark.componentsPrimaryButtonsThemedButtonBackgroundHover
        )

    val componentsPrimaryButtonsThemedButtonForegroundContentHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsThemedButtonForegroundContentHover,
            KozmosColorsDark.componentsPrimaryButtonsThemedButtonForegroundContentHover
        )

    val componentsPrimaryButtonsNeutralButtonBackgroundHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsNeutralButtonBackgroundHover,
            KozmosColorsDark.componentsPrimaryButtonsNeutralButtonBackgroundHover
        )

    val componentsPrimaryButtonsNeutralButtonForegroundContentHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsNeutralButtonForegroundContentHover,
            KozmosColorsDark.componentsPrimaryButtonsNeutralButtonForegroundContentHover
        )

    val componentsPrimaryButtonsSuccessButtonBackgroundIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsSuccessButtonBackgroundIdle,
            KozmosColorsDark.componentsPrimaryButtonsSuccessButtonBackgroundIdle
        )

    val componentsPrimaryButtonsSuccessButtonBackgroundHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsSuccessButtonBackgroundHover,
            KozmosColorsDark.componentsPrimaryButtonsSuccessButtonBackgroundHover
        )

    val componentsPrimaryButtonsSuccessButtonForegroundContentIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsSuccessButtonForegroundContentIdle,
            KozmosColorsDark.componentsPrimaryButtonsSuccessButtonForegroundContentIdle
        )

    val componentsPrimaryButtonsSuccessButtonForegroundContentHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsSuccessButtonForegroundContentHover,
            KozmosColorsDark.componentsPrimaryButtonsSuccessButtonForegroundContentHover
        )

    val componentsPrimaryButtonsDangerButtonBackgroundHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsDangerButtonBackgroundHover,
            KozmosColorsDark.componentsPrimaryButtonsDangerButtonBackgroundHover
        )

    val componentsPrimaryButtonsDangerButtonForegroundContentHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsDangerButtonForegroundContentHover,
            KozmosColorsDark.componentsPrimaryButtonsDangerButtonForegroundContentHover
        )

    val componentsPrimaryButtonsInformativeButtonBackgroundIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsInformativeButtonBackgroundIdle,
            KozmosColorsDark.componentsPrimaryButtonsInformativeButtonBackgroundIdle
        )

    val componentsPrimaryButtonsInformativeButtonBackgroundHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsInformativeButtonBackgroundHover,
            KozmosColorsDark.componentsPrimaryButtonsInformativeButtonBackgroundHover
        )

    val componentsPrimaryButtonsInformativeButtonForegroundContentIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsInformativeButtonForegroundContentIdle,
            KozmosColorsDark.componentsPrimaryButtonsInformativeButtonForegroundContentIdle
        )

    val componentsPrimaryButtonsInformativeButtonForegroundContentHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsInformativeButtonForegroundContentHover,
            KozmosColorsDark.componentsPrimaryButtonsInformativeButtonForegroundContentHover
        )

    val componentsPrimaryButtonsAlertButtonBackgroundIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsAlertButtonBackgroundIdle,
            KozmosColorsDark.componentsPrimaryButtonsAlertButtonBackgroundIdle
        )

    val componentsPrimaryButtonsAlertButtonBackgroundHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsAlertButtonBackgroundHover,
            KozmosColorsDark.componentsPrimaryButtonsAlertButtonBackgroundHover
        )

    val componentsPrimaryButtonsAlertButtonForegroundContentIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsAlertButtonForegroundContentIdle,
            KozmosColorsDark.componentsPrimaryButtonsAlertButtonForegroundContentIdle
        )

    val componentsPrimaryButtonsAlertButtonForegroundContentHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsPrimaryButtonsAlertButtonForegroundContentHover,
            KozmosColorsDark.componentsPrimaryButtonsAlertButtonForegroundContentHover
        )

    val componentsSecondaryButtonsThemedButtonBackgroundIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsThemedButtonBackgroundIdle,
            KozmosColorsDark.componentsSecondaryButtonsThemedButtonBackgroundIdle
        )

    val componentsSecondaryButtonsThemedButtonBackgroundHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsThemedButtonBackgroundHover,
            KozmosColorsDark.componentsSecondaryButtonsThemedButtonBackgroundHover
        )

    val componentsSecondaryButtonsThemedButtonForegroundContentHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsThemedButtonForegroundContentHover,
            KozmosColorsDark.componentsSecondaryButtonsThemedButtonForegroundContentHover
        )

    val componentsSecondaryButtonsNeutralButtonBackgroundIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsNeutralButtonBackgroundIdle,
            KozmosColorsDark.componentsSecondaryButtonsNeutralButtonBackgroundIdle
        )

    val componentsSecondaryButtonsNeutralButtonBackgroundHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsNeutralButtonBackgroundHover,
            KozmosColorsDark.componentsSecondaryButtonsNeutralButtonBackgroundHover
        )

    val componentsSecondaryButtonsNeutralButtonForegroundContentIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsNeutralButtonForegroundContentIdle,
            KozmosColorsDark.componentsSecondaryButtonsNeutralButtonForegroundContentIdle
        )

    val componentsSecondaryButtonsNeutralButtonForegroundContentHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsNeutralButtonForegroundContentHover,
            KozmosColorsDark.componentsSecondaryButtonsNeutralButtonForegroundContentHover
        )

    val componentsSecondaryButtonsSuccessButtonBackgroundIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsSuccessButtonBackgroundIdle,
            KozmosColorsDark.componentsSecondaryButtonsSuccessButtonBackgroundIdle
        )

    val componentsSecondaryButtonsSuccessButtonBackgroundHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsSuccessButtonBackgroundHover,
            KozmosColorsDark.componentsSecondaryButtonsSuccessButtonBackgroundHover
        )

    val componentsSecondaryButtonsSuccessButtonForegroundContentIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsSuccessButtonForegroundContentIdle,
            KozmosColorsDark.componentsSecondaryButtonsSuccessButtonForegroundContentIdle
        )

    val componentsSecondaryButtonsSuccessButtonForegroundContentHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsSuccessButtonForegroundContentHover,
            KozmosColorsDark.componentsSecondaryButtonsSuccessButtonForegroundContentHover
        )

    val componentsSecondaryButtonsDangerButtonBackgroundIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsDangerButtonBackgroundIdle,
            KozmosColorsDark.componentsSecondaryButtonsDangerButtonBackgroundIdle
        )

    val componentsSecondaryButtonsDangerButtonBackgroundHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsDangerButtonBackgroundHover,
            KozmosColorsDark.componentsSecondaryButtonsDangerButtonBackgroundHover
        )

    val componentsSecondaryButtonsDangerButtonForegroundContentIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsDangerButtonForegroundContentIdle,
            KozmosColorsDark.componentsSecondaryButtonsDangerButtonForegroundContentIdle
        )

    val componentsSecondaryButtonsDangerButtonForegroundContentHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsDangerButtonForegroundContentHover,
            KozmosColorsDark.componentsSecondaryButtonsDangerButtonForegroundContentHover
        )

    val componentsSecondaryButtonsInformativeButtonBackgroundIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsInformativeButtonBackgroundIdle,
            KozmosColorsDark.componentsSecondaryButtonsInformativeButtonBackgroundIdle
        )

    val componentsSecondaryButtonsInformativeButtonBackgroundHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsInformativeButtonBackgroundHover,
            KozmosColorsDark.componentsSecondaryButtonsInformativeButtonBackgroundHover
        )

    val componentsSecondaryButtonsInformativeButtonForegroundContentIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsInformativeButtonForegroundContentIdle,
            KozmosColorsDark.componentsSecondaryButtonsInformativeButtonForegroundContentIdle
        )

    val componentsSecondaryButtonsInformativeButtonForegroundContentHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsInformativeButtonForegroundContentHover,
            KozmosColorsDark.componentsSecondaryButtonsInformativeButtonForegroundContentHover
        )

    val componentsSecondaryButtonsAlertButtonBackgroundIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsAlertButtonBackgroundIdle,
            KozmosColorsDark.componentsSecondaryButtonsAlertButtonBackgroundIdle
        )

    val componentsSecondaryButtonsAlertButtonBackgroundHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsAlertButtonBackgroundHover,
            KozmosColorsDark.componentsSecondaryButtonsAlertButtonBackgroundHover
        )

    val componentsSecondaryButtonsAlertButtonForegroundContentIdle: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsAlertButtonForegroundContentIdle,
            KozmosColorsDark.componentsSecondaryButtonsAlertButtonForegroundContentIdle
        )

    val componentsSecondaryButtonsAlertButtonForegroundContentHover: Color
        @Composable get() = themed(
            KozmosDesignTokens.componentsSecondaryButtonsAlertButtonForegroundContentHover,
            KozmosColorsDark.componentsSecondaryButtonsAlertButtonForegroundContentHover
        )

}
