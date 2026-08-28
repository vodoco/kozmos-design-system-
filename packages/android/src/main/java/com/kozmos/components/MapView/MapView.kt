package com.kozmos.components.mapview

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors

@Composable
fun KozmosMapView(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit = {}
) {
    Box(
        modifier = modifier
            .defaultMinSize(minHeight = 400.dp)
            .background(KozmosColors.primitivesColorsBackground100)
            .clip(RoundedCornerShape(KozmosDimensions.semanticsRadiusControl))
            .border(1.dp, KozmosColors.primitivesColorsBackground300, RoundedCornerShape(KozmosDimensions.semanticsRadiusControl))
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(KozmosColors.primitivesColorsBackground300.copy(alpha = 0.1f))
        )
        content()
    }
}
