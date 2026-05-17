package com.kozmos.components.progress

import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.kozmos.tokens.KozmosColors

@Composable
fun KozmosProgress(
    progress: Float,
    modifier: Modifier = Modifier
) {
    LinearProgressIndicator(
        progress = progress,
        modifier = modifier,
        color = KozmosColors.primitivesColorsTheme500,
        trackColor = KozmosColors.primitivesColorsBackground300,
    )
}
