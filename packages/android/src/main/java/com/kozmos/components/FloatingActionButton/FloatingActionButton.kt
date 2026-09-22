package com.kozmos.components.floatingactionbutton

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import com.kozmos.tokens.KozmosThemeTokens

@Composable
fun KozmosFloatingActionButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector = Icons.Default.Add
) {
    FloatingActionButton(
        onClick = onClick,
        modifier = modifier,
        containerColor = KozmosThemeTokens.primitivesColorsTheme500,
        contentColor = KozmosThemeTokens.primitivesColorsBackground0
    ) {
        Icon(icon, contentDescription = "Action")
    }
}
