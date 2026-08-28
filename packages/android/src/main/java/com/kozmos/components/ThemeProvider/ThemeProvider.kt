package com.kozmos.components.themeprovider

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.kozmos.tokens.KozmosTypography
import com.kozmos.tokens.LocalKozmosUseDarkTokens

enum class KozmosThemeMode {
    LIGHT, DARK, SYSTEM
}

class KozmosThemeManager(initialMode: KozmosThemeMode = KozmosThemeMode.SYSTEM) {
    var mode by mutableStateOf(initialMode)

    fun setThemeMode(newMode: KozmosThemeMode) {
        mode = newMode
    }
}

val LocalThemeManager = compositionLocalOf<KozmosThemeManager> {
    error("No KozmosThemeManager provided")
}

@Composable
fun KozmosThemeProvider(
    content: @Composable () -> Unit
) {
    val themeManager = remember { KozmosThemeManager() }
    val isSystemDark = isSystemInDarkTheme()

    val useDarkTheme = when (themeManager.mode) {
        KozmosThemeMode.SYSTEM -> isSystemDark
        KozmosThemeMode.LIGHT -> false
        KozmosThemeMode.DARK -> true
    }

    val colors = if (useDarkTheme) {
        darkColorScheme()
    } else {
        lightColorScheme()
    }

    CompositionLocalProvider(
        LocalThemeManager provides themeManager,
        LocalKozmosUseDarkTokens provides useDarkTheme
    ) {
        MaterialTheme(
            colorScheme = colors,
            // The theme carried colours only, so the font family was whatever
            // Material defaulted to. It is the same font today; the difference
            // is that it is now a decision with an address.
            typography = KozmosTypography.typography(),
            content = content
        )
    }
}
