package com.kozmos.components.stack

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

enum class StackDirection {
    Horizontal,
    Vertical
}

@Composable
fun KozmosStack(
    modifier: Modifier = Modifier,
    direction: StackDirection = StackDirection.Vertical,
    spacing: Dp = com.kozmos.tokens.KozmosDimensions.primitivesLayoutSpacing100,
    content: @Composable () -> Unit
) {
    val arrangement = Arrangement.spacedBy(spacing)
    
    when (direction) {
        StackDirection.Horizontal -> {
            Row(modifier = modifier, horizontalArrangement = arrangement) {
                content()
            }
        }
        StackDirection.Vertical -> {
            Column(modifier = modifier, verticalArrangement = arrangement) {
                content()
            }
        }
    }
}
