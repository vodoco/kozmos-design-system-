package com.kozmos.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import com.kozmos.tokens.KozmosThemeTokens

/**
 * What a control means, as opposed to how much it weighs.
 *
 * The product drives this axis on `Button`, `Tag` and `Counter` and uses all
 * six values — 80% of its mapped control instances, measured 2026-09-14. The
 * colours come from `Semantics.Emotion`, which exists so a tag does not have to
 * borrow a button's tokens.
 */
enum class KozmosEmotion {
    Neutral,
    Themed,
    Success,
    Danger,
    Informative,
    Alert;

    val surface: Color
        @Composable get() = when (this) {
            Neutral -> KozmosThemeTokens.semanticsEmotionNeutralSurface
            Themed -> KozmosThemeTokens.semanticsEmotionThemedSurface
            Success -> KozmosThemeTokens.semanticsEmotionSuccessSurface
            Danger -> KozmosThemeTokens.semanticsEmotionDangerSurface
            Informative -> KozmosThemeTokens.semanticsEmotionInformativeSurface
            Alert -> KozmosThemeTokens.semanticsEmotionAlertSurface
        }

    val onSurface: Color
        @Composable get() = when (this) {
            Neutral -> KozmosThemeTokens.semanticsEmotionNeutralOnsurface
            Themed -> KozmosThemeTokens.semanticsEmotionThemedOnsurface
            Success -> KozmosThemeTokens.semanticsEmotionSuccessOnsurface
            Danger -> KozmosThemeTokens.semanticsEmotionDangerOnsurface
            Informative -> KozmosThemeTokens.semanticsEmotionInformativeOnsurface
            Alert -> KozmosThemeTokens.semanticsEmotionAlertOnsurface
        }

    /**
     * The emotion on the page itself, at the first step of each ramp that
     * reaches 4.5:1 — which is not the same step for every emotion.
     */
    val text: Color
        @Composable get() = when (this) {
            Neutral -> KozmosThemeTokens.semanticsEmotionNeutralText
            Themed -> KozmosThemeTokens.semanticsEmotionThemedText
            Success -> KozmosThemeTokens.semanticsEmotionSuccessText
            Danger -> KozmosThemeTokens.semanticsEmotionDangerText
            Informative -> KozmosThemeTokens.semanticsEmotionInformativeText
            Alert -> KozmosThemeTokens.semanticsEmotionAlertText
        }
}
