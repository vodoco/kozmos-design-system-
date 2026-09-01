package com.kozmos.components.scrollarea

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

enum class KozmosScrollAreaOrientation {
    Vertical,
    Horizontal,
    Both
}

@Composable
fun KozmosScrollArea(
    modifier: Modifier = Modifier,
    orientation: KozmosScrollAreaOrientation = KozmosScrollAreaOrientation.Vertical,
    content: @Composable () -> Unit
) {
    val verticalScrollState = rememberScrollState()
    val horizontalScrollState = rememberScrollState()
    val scrollModifier = when (orientation) {
        KozmosScrollAreaOrientation.Vertical -> Modifier.verticalScroll(verticalScrollState)
        KozmosScrollAreaOrientation.Horizontal -> Modifier.horizontalScroll(horizontalScrollState)
        KozmosScrollAreaOrientation.Both -> Modifier
            .verticalScroll(verticalScrollState)
            .horizontalScroll(horizontalScrollState)
    }

    Box(modifier = modifier.then(scrollModifier)) {
        content()
    }
}
