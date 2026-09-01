package com.kozmos.components.tag

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.kozmos.tokens.KozmosColors

enum class KozmosTagVariant {
    Default,
    Secondary,
    Destructive,
    Outline
}

@Composable
fun KozmosTag(
    text: String,
    variant: KozmosTagVariant = KozmosTagVariant.Default,
    onRemove: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    val shape = RoundedCornerShape(KozmosDimensions.semanticsRadiusContainer)
    val backgroundColor = when (variant) {
        KozmosTagVariant.Default -> KozmosColors.primitivesColorsTheme500
        KozmosTagVariant.Secondary -> KozmosColors.primitivesColorsBackground100
        KozmosTagVariant.Destructive -> KozmosColors.semanticsDataRed
        KozmosTagVariant.Outline -> Color.Transparent
    }
    val foregroundColor = when (variant) {
        KozmosTagVariant.Default,
        KozmosTagVariant.Destructive -> KozmosColors.primitivesColorsBackground0
        KozmosTagVariant.Secondary,
        KozmosTagVariant.Outline -> KozmosColors.primitivesColorsForeground900
    }
    val borderedModifier = if (variant == KozmosTagVariant.Outline) {
        Modifier.border(
            width = 1.dp,
            color = KozmosColors.primitivesColorsBackground200,
            shape = shape
        )
    } else {
        Modifier
    }

    Row(
        modifier = modifier
            .background(backgroundColor, shape)
            .then(borderedModifier)
            .padding(horizontal = KozmosDimensions.primitivesLayoutSpacing100, vertical = KozmosDimensions.primitivesLayoutSpacing50),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = text,
            color = foregroundColor,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold
        )
        if (onRemove != null) {
            Icon(
                imageVector = Icons.Default.Close,
                contentDescription = "Remove",
                tint = foregroundColor,
                modifier = Modifier
                    .padding(start = KozmosDimensions.primitivesLayoutSpacing50)
                    .size(KozmosDimensions.primitivesLayoutSizing200)
                    .clip(CircleShape)
                    .clickable { onRemove() }
            )
        }
    }
}
