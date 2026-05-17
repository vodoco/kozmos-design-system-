package com.kozmos.components.badge

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors
import androidx.compose.ui.unit.sp

enum class BadgeVariant {
    Default, Secondary, Destructive, Outline
}

@Composable
fun KozmosBadge(
    text: String,
    variant: BadgeVariant = BadgeVariant.Default,
    modifier: Modifier = Modifier
) {
    val (containerColor, contentColor) = when (variant) {
        BadgeVariant.Default -> KozmosColors.primitivesColorsTheme500 to androidx.compose.ui.graphics.Color.White
        BadgeVariant.Secondary -> KozmosColors.primitivesColorsBackground200 to KozmosColors.primitivesColorsForeground100
        BadgeVariant.Destructive -> KozmosColors.primitivesColorsEmotionalDanger600 to androidx.compose.ui.graphics.Color.White
        BadgeVariant.Outline -> Color.Transparent to KozmosColors.primitivesColorsForeground100
    }

    Box(
        modifier = modifier
            .background(containerColor, RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius200))
            .padding(horizontal = KozmosDimensions.primitivesLayoutSpacing100, vertical = KozmosDimensions.primitivesLayoutSpacing25),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            color = contentColor,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}
