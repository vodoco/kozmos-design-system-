package com.kozmos.components.badge

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosThemeTokens
import androidx.compose.ui.unit.sp

enum class BadgeVariant {
    Default, Secondary, Destructive, Outline, Ghost, Link
}

enum class BadgeSize {
    Default, Sm, Lg, Icon
}

@Composable
fun KozmosBadge(
    text: String,
    variant: BadgeVariant = BadgeVariant.Default,
    modifier: Modifier = Modifier,
    size: BadgeSize = BadgeSize.Default
) {
    val (containerColor, contentColor) = when (variant) {
        BadgeVariant.Default -> KozmosThemeTokens.componentsPrimaryButtonsThemedButtonBackgroundIdle to KozmosThemeTokens.componentsPrimaryButtonsThemedButtonForegroundContentIdle
        BadgeVariant.Secondary -> KozmosThemeTokens.componentsPrimaryButtonsNeutralButtonBackgroundIdle to KozmosThemeTokens.componentsPrimaryButtonsNeutralButtonForegroundContentIdle
        BadgeVariant.Destructive -> KozmosThemeTokens.componentsPrimaryButtonsDangerButtonBackgroundIdle to KozmosThemeTokens.componentsPrimaryButtonsDangerButtonForegroundContentIdle
        BadgeVariant.Outline, BadgeVariant.Ghost, BadgeVariant.Link -> Color.Transparent to KozmosThemeTokens.componentsSecondaryButtonsThemedButtonForegroundContentIdle
    }

    val horizontalPadding = when (size) {
        BadgeSize.Sm -> KozmosDimensions.primitivesLayoutSpacing150
        BadgeSize.Default -> KozmosDimensions.primitivesLayoutSpacing200
        BadgeSize.Lg -> KozmosDimensions.primitivesLayoutSpacing400
        BadgeSize.Icon -> 0.dp
    }

    Box(
        modifier = modifier
            .height(44.dp)
            .then(if (size == BadgeSize.Icon) Modifier.width(44.dp) else Modifier)
            .background(containerColor, RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius100))
            .border(
                width = if (variant == BadgeVariant.Outline) 1.dp else 0.dp,
                color = if (variant == BadgeVariant.Outline) contentColor else Color.Transparent,
                shape = RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius100)
            )
            .padding(horizontal = horizontalPadding, vertical = 0.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            color = contentColor,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            textDecoration = if (variant == BadgeVariant.Link) TextDecoration.Underline else TextDecoration.None
        )
    }
}
