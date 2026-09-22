package com.kozmos.components.container

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun KozmosContainer(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    Box(
        modifier = modifier.padding(KozmosDimensions.primitivesLayoutSpacing200)
    ) {
        content()
    }
}
