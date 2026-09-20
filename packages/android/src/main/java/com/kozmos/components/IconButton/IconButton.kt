package com.kozmos.components.iconbutton

import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.OutlinedIconButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.border
import androidx.compose.foundation.shape.CircleShape
import com.kozmos.components.surface.KozmosSurfaceDefaults
import com.kozmos.components.surface.KozmosSurfaceStyle
import com.kozmos.tokens.KozmosThemeTokens

enum class KozmosIconButtonVariant {
    Default,
    Destructive,
    Outline,
    Secondary,
    Ghost,
    Link,
    Glass
}

enum class KozmosIconButtonSize {
    Default,
    Sm,
    Lg
}

@Composable
fun KozmosIconButton(
    icon: ImageVector,
    onClick: () -> Unit,
    contentDescription: String? = null,
    modifier: Modifier = Modifier,
    variant: KozmosIconButtonVariant = KozmosIconButtonVariant.Ghost,
    size: KozmosIconButtonSize = KozmosIconButtonSize.Default,
    enabled: Boolean = true,
    isLoading: Boolean = false
) {
    val rootModifier = modifier.size(44.dp)
    val iconSize = when (size) {
        KozmosIconButtonSize.Sm -> 14.dp
        KozmosIconButtonSize.Lg -> 20.dp
        KozmosIconButtonSize.Default -> 16.dp
    }

    val content: @Composable () -> Unit = {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(if (size == KozmosIconButtonSize.Lg) 16.dp else 14.dp),
                color = LocalContentColor.current,
                strokeWidth = 2.dp
            )
        } else {
            Icon(
                imageVector = icon,
                contentDescription = contentDescription,
                modifier = Modifier.size(iconSize)
            )
        }
    }

    when (variant) {
        KozmosIconButtonVariant.Outline -> {
            OutlinedIconButton(
                onClick = onClick,
                modifier = rootModifier,
                enabled = enabled && !isLoading,
                shape = CircleShape,
                colors = IconButtonDefaults.outlinedIconButtonColors(
                    contentColor = KozmosThemeTokens.componentsSecondaryButtonsThemedButtonForegroundContentIdle
                ),
                content = content
            )
        }
        KozmosIconButtonVariant.Ghost, KozmosIconButtonVariant.Link -> {
            IconButton(
                onClick = onClick,
                modifier = rootModifier,
                enabled = enabled && !isLoading,
                colors = IconButtonDefaults.iconButtonColors(
                    contentColor = KozmosThemeTokens.componentsSecondaryButtonsThemedButtonForegroundContentIdle
                ),
                content = content
            )
        }
        else -> {
            val containerColor = when (variant) {
                KozmosIconButtonVariant.Destructive -> KozmosThemeTokens.componentsPrimaryButtonsDangerButtonBackgroundIdle
                KozmosIconButtonVariant.Secondary -> KozmosThemeTokens.componentsPrimaryButtonsNeutralButtonBackgroundIdle
                // The glass variant is the glass surface, composed from the token.
                KozmosIconButtonVariant.Glass -> KozmosSurfaceDefaults.tint(KozmosSurfaceStyle.Glass)
                else -> KozmosThemeTokens.componentsPrimaryButtonsThemedButtonBackgroundIdle
            }
            val contentColor = when (variant) {
                KozmosIconButtonVariant.Destructive -> KozmosThemeTokens.componentsPrimaryButtonsDangerButtonForegroundContentIdle
                KozmosIconButtonVariant.Secondary -> KozmosThemeTokens.componentsPrimaryButtonsNeutralButtonForegroundContentIdle
                KozmosIconButtonVariant.Glass -> KozmosThemeTokens.primitivesColorsForeground100
                else -> KozmosThemeTokens.componentsPrimaryButtonsThemedButtonForegroundContentIdle
            }

            FilledIconButton(
                onClick = onClick,
                modifier = if (variant == KozmosIconButtonVariant.Glass) {
                    rootModifier.border(KozmosSurfaceDefaults.border(KozmosSurfaceStyle.Glass), CircleShape)
                } else {
                    rootModifier
                },
                enabled = enabled && !isLoading,
                colors = IconButtonDefaults.filledIconButtonColors(
                    containerColor = containerColor,
                    contentColor = contentColor
                ),
                content = content
            )
        }
    }
}
