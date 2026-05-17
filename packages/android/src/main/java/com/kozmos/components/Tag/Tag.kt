package com.kozmos.components.tag

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.kozmos.tokens.KozmosColors

@Composable
fun KozmosTag(
    text: String,
    onRemove: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .background(KozmosColors.primitivesColorsTheme500, RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius200))
            .padding(horizontal = KozmosDimensions.primitivesLayoutSpacing100, vertical = KozmosDimensions.primitivesLayoutSpacing50),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = text,
            color = KozmosColors.primitivesColorsBackground0,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold
        )
        if (onRemove != null) {
            Icon(
                imageVector = Icons.Default.Close,
                contentDescription = "Remove",
                tint = KozmosColors.primitivesColorsBackground0,
                modifier = Modifier
                    .padding(start = KozmosDimensions.primitivesLayoutSpacing50)
                    .size(KozmosDimensions.primitivesLayoutSizing200)
                    .clip(CircleShape)
                    .clickable { onRemove() }
            )
        }
    }
}
