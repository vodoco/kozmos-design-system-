package com.kozmos.components.button

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.RowScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

enum class KozmosButtonVariant {
    Default,
    Destructive,
    Outline,
    Secondary,
    Ghost,
    Link
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
    content: @Composable RowScope.() -> Unit
) {
    val height = when (size) {
        KozmosButtonSize.Default -> KozmosDimensions.primitivesLayoutSizing500
        KozmosButtonSize.Sm -> 36.dp // No token for 36
        KozmosButtonSize.Lg -> 44.dp // No token for 44
        KozmosButtonSize.Icon -> KozmosDimensions.primitivesLayoutSizing500
    }
    
    val contentPadding = when (size) {
        KozmosButtonSize.Default -> PaddingValues(horizontal = KozmosDimensions.primitivesLayoutSpacing200, vertical = KozmosDimensions.primitivesLayoutSpacing100)
        KozmosButtonSize.Sm -> PaddingValues(horizontal = KozmosDimensions.primitivesLayoutSpacing150, vertical = KozmosDimensions.primitivesLayoutSpacing75)
        KozmosButtonSize.Lg -> PaddingValues(horizontal = KozmosDimensions.primitivesLayoutSpacing400, vertical = 10.dp) // No 10 token
        KozmosButtonSize.Icon -> PaddingValues(KozmosDimensions.primitivesLayoutSpacing100)
    }

    // Dimension token graph synced from build.mjs
    val shape = RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius100)

    when (variant) {
        KozmosButtonVariant.Outline -> {
            OutlinedButton(
                onClick = onClick,
                modifier = modifier.height(height),
                shape = shape,
                contentPadding = contentPadding,
                border = BorderStroke(1.dp, KozmosColors.primitivesColorsBackground200),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = KozmosColors.primitivesColorsTheme500)
            ) {
                content()
            }
        }
        KozmosButtonVariant.Ghost -> {
            TextButton(
                onClick = onClick,
                modifier = modifier.height(height),
                shape = shape,
                contentPadding = contentPadding,
                colors = ButtonDefaults.textButtonColors(contentColor = KozmosColors.primitivesColorsTheme500)
            ) {
                content()
            }
        }
        KozmosButtonVariant.Link -> {
             TextButton(
                onClick = onClick,
                modifier = modifier.height(height),
                shape = shape,
                contentPadding = contentPadding,
                colors = ButtonDefaults.textButtonColors(contentColor = KozmosColors.primitivesColorsTheme500)
            ) {
                content()
            }
        }
        else -> {
            // Default, Destructive, Secondary
            val containerColor = when(variant) {
                KozmosButtonVariant.Destructive -> KozmosColors.primitivesColorsEmotionalDanger600
                KozmosButtonVariant.Secondary -> KozmosColors.primitivesColorsBackground200
                else -> KozmosColors.primitivesColorsTheme500
            }
            
            val contentColor = when(variant) {
                 KozmosButtonVariant.Secondary -> KozmosColors.primitivesColorsForeground100
                 else -> KozmosColors.primitivesColorsBackground0
            }
            
            Button(
                onClick = onClick,
                modifier = modifier.height(height),
                shape = shape,
                contentPadding = contentPadding,
                colors = ButtonDefaults.buttonColors(
                    containerColor = containerColor,
                    contentColor = contentColor
                )
            ) {
                content()
            }
        }
    }
}
