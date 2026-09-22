package com.kozmos.components.avatar

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.kozmos.tokens.KozmosThemeTokens

@Composable
fun KozmosAvatar(
    imageUrl: String?,
    fallbackText: String,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .size(KozmosDimensions.primitivesLayoutSizing500)
            .clip(CircleShape)
            .background(KozmosThemeTokens.primitivesColorsBackground300),
        contentAlignment = Alignment.Center
    ) {
        if (imageUrl != null) {
            AsyncImage(
                model = imageUrl,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.matchParentSize()
            )
        } else {
            Text(
                text = fallbackText,
                style = MaterialTheme.typography.titleMedium,
                color = KozmosThemeTokens.primitivesColorsForeground500
            )
        }
    }
}
