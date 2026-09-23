package com.kozmos.components.separator

import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Divider
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosThemeTokens

enum class SeparatorOrientation {
    Horizontal,
    Vertical
}

@Composable
fun KozmosSeparator(
    modifier: Modifier = Modifier,
    orientation: SeparatorOrientation = SeparatorOrientation.Horizontal
) {
    if (orientation == SeparatorOrientation.Horizontal) {
        Divider(modifier = modifier, color = KozmosThemeTokens.primitivesColorsBackground300)
    } else {
        Divider(
            modifier = modifier
                .fillMaxHeight()
                .width(1.dp),
            color = KozmosThemeTokens.primitivesColorsBackground300
        )
    }
}
