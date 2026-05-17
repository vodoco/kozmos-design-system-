package com.kozmos.components.link

import androidx.compose.foundation.clickable
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextDecoration
import com.kozmos.tokens.KozmosColors

@Composable
fun KozmosLink(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Text(
        text = text,
        color = KozmosColors.primitivesColorsTheme500,
        textDecoration = TextDecoration.Underline,
        modifier = modifier.clickable { onClick() }
    )
}
