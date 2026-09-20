package com.kozmos.components.aisearchbutton

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors

/**
 * The AI search, beside the search field: a 44 disc inside a 66 ring whose
 * sweep gradient runs through the theme's own ramp — 300 to 600 and back, the
 * first gradient the system draws, made of tokens — with a 16 icon. The
 * button shows the icon alone and is named by its label.
 */
@Composable
fun KozmosAISearchButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    label: String = "AI search",
    enabled: Boolean = true
) {
    Box(
        modifier = modifier
            .size(66.dp)
            .clip(CircleShape)
            .background(
                Brush.sweepGradient(
                    listOf(
                        KozmosColors.primitivesColorsTheme300,
                        KozmosColors.primitivesColorsTheme600,
                        KozmosColors.primitivesColorsTheme300
                    )
                )
            )
            .clickable(enabled = enabled, role = Role.Button, onClick = onClick)
            .semantics { contentDescription = label },
        contentAlignment = Alignment.Center
    ) {
        Surface(
            modifier = Modifier.size(44.dp),
            shape = CircleShape,
            color = KozmosColors.primitivesColorsBackground0,
            shadowElevation = 4.dp
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(
                    imageVector = Icons.Default.AutoAwesome,
                    contentDescription = null,
                    tint = KozmosColors.primitivesColorsTheme500,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}
