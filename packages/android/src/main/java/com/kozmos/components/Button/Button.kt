package com.kozmos.components.button

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.RowScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosDimensions
import com.kozmos.tokens.KozmosThemeTokens

enum class KozmosButtonVariant {
    Default,
    Destructive,
    Outline,
    Secondary,
    Ghost,
    Link,
    Glass
}

enum class KozmosButtonSize {
    Default,
    Sm,
    Lg,
    Icon
}

@Composable
fun KozmosButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: KozmosButtonVariant = KozmosButtonVariant.Default,
    size: KozmosButtonSize = KozmosButtonSize.Default,
    enabled: Boolean = true,
    isLoading: Boolean = false,
    content: @Composable RowScope.() -> Unit
) {
    val height = when (size) {
        KozmosButtonSize.Default -> 44.dp
        KozmosButtonSize.Sm -> 44.dp
        KozmosButtonSize.Lg -> 44.dp
        KozmosButtonSize.Icon -> 44.dp
    }

    val rootModifier = modifier
        .height(height)
        .then(if (size == KozmosButtonSize.Icon) Modifier.width(44.dp) else Modifier)
    
    val contentPadding = when (size) {
        KozmosButtonSize.Default -> PaddingValues(horizontal = KozmosDimensions.primitivesLayoutSpacing200, vertical = 0.dp)
        KozmosButtonSize.Sm -> PaddingValues(horizontal = KozmosDimensions.primitivesLayoutSpacing150, vertical = 0.dp)
        KozmosButtonSize.Lg -> PaddingValues(horizontal = KozmosDimensions.primitivesLayoutSpacing400, vertical = 0.dp)
        KozmosButtonSize.Icon -> PaddingValues(0.dp)
    }

    // Dimension token graph synced from build.mjs
    val shape = RoundedCornerShape(KozmosDimensions.semanticsRadiusControl)

    when (variant) {
        KozmosButtonVariant.Outline -> {
            OutlinedButton(
                onClick = onClick,
                modifier = rootModifier,
                enabled = enabled && !isLoading,
                shape = shape,
                contentPadding = contentPadding,
                border = BorderStroke(1.dp, KozmosThemeTokens.componentsSecondaryButtonsThemedButtonForegroundContentIdle),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = KozmosThemeTokens.componentsSecondaryButtonsThemedButtonForegroundContentIdle)
            ) {
                ButtonContent(isLoading, content)
            }
        }
        KozmosButtonVariant.Ghost, KozmosButtonVariant.Link -> {
            TextButton(
                onClick = onClick,
                modifier = rootModifier,
                enabled = enabled && !isLoading,
                shape = shape,
                contentPadding = contentPadding,
                colors = ButtonDefaults.textButtonColors(contentColor = KozmosThemeTokens.componentsSecondaryButtonsThemedButtonForegroundContentIdle)
            ) {
                ButtonContent(isLoading, content)
            }
        }
        else -> {
            // Default, Destructive, Secondary, Glass
            val containerColor = when(variant) {
                KozmosButtonVariant.Destructive -> KozmosThemeTokens.componentsPrimaryButtonsDangerButtonBackgroundIdle
                KozmosButtonVariant.Secondary -> KozmosThemeTokens.componentsPrimaryButtonsNeutralButtonBackgroundIdle
                KozmosButtonVariant.Glass -> KozmosThemeTokens.primitivesColorsForeground0.copy(alpha = 0.16f)
                else -> KozmosThemeTokens.componentsPrimaryButtonsThemedButtonBackgroundIdle
            }
            
            val contentColor = when(variant) {
                 KozmosButtonVariant.Secondary -> KozmosThemeTokens.componentsPrimaryButtonsNeutralButtonForegroundContentIdle
                 KozmosButtonVariant.Destructive -> KozmosThemeTokens.componentsPrimaryButtonsDangerButtonForegroundContentIdle
                 KozmosButtonVariant.Glass -> KozmosThemeTokens.primitivesColorsForeground1000
                 else -> KozmosThemeTokens.componentsPrimaryButtonsThemedButtonForegroundContentIdle
            }
            
            Button(
                onClick = onClick,
                modifier = rootModifier,
                enabled = enabled && !isLoading,
                shape = shape,
                contentPadding = contentPadding,
                colors = ButtonDefaults.buttonColors(
                    containerColor = containerColor,
                    contentColor = contentColor
                )
            ) {
                ButtonContent(isLoading, content)
            }
        }
    }
}

@Composable
private fun RowScope.ButtonContent(
    isLoading: Boolean,
    content: @Composable RowScope.() -> Unit
) {
    if (isLoading) {
        CircularProgressIndicator(
            modifier = Modifier.size(14.dp),
            color = LocalContentColor.current,
            strokeWidth = 2.dp
        )
    }
    content()
}
