package com.kozmos.components.spinner

import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.kozmos.tokens.KozmosColors

@Composable
fun KozmosSpinner(
    modifier: Modifier = Modifier
) {
    CircularProgressIndicator(
        modifier = modifier,
        color = KozmosColors.primitivesColorsTheme500
    )
}
