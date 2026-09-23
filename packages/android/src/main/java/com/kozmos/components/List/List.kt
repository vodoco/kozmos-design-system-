package com.kozmos.components.list

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Divider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosThemeTokens

@Composable
fun KozmosList(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    Column(modifier = modifier) {
        content()
    }
}

@Composable
fun KozmosListItem(
    text: String,
    modifier: Modifier = Modifier,
    showDivider: Boolean = true
) {
    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = text,
            style = MaterialTheme.typography.bodyLarge,
            color = KozmosThemeTokens.primitivesColorsForeground100,
            modifier = Modifier.padding(KozmosDimensions.primitivesLayoutSpacing200)
        )
        if (showDivider) {
            Divider(color = KozmosThemeTokens.primitivesColorsBackground300)
        }
    }
}
