package com.kozmos.components.dynamicisland

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

enum class KozmosDynamicIslandState {
    Compact,
    Expanded,
    Minimal
}

@Composable
fun KozmosDynamicIsland(
    modifier: Modifier = Modifier,
    state: KozmosDynamicIslandState = KozmosDynamicIslandState.Compact,
    compactLeading: @Composable () -> Unit = {},
    compactTrailing: @Composable () -> Unit = {},
    expandedContent: @Composable () -> Unit = {},
    minimalContent: @Composable () -> Unit = {}
) {
    val width by animateDpAsState(
        targetValue = when (state) {
            KozmosDynamicIslandState.Expanded -> 360.dp
            KozmosDynamicIslandState.Minimal -> 56.dp
            KozmosDynamicIslandState.Compact -> 240.dp
        },
        label = "KozmosDynamicIslandWidth"
    )
    val height by animateDpAsState(
        targetValue = when (state) {
            KozmosDynamicIslandState.Expanded -> 160.dp
            KozmosDynamicIslandState.Minimal -> 56.dp
            KozmosDynamicIslandState.Compact -> 44.dp
        },
        label = "KozmosDynamicIslandHeight"
    )
    val radius by animateFloatAsState(
        targetValue = if (state == KozmosDynamicIslandState.Expanded) 32f else 100f,
        label = "KozmosDynamicIslandRadius"
    )

    Surface(
        modifier = modifier.width(width).height(height),
        shape = RoundedCornerShape(radius.dp),
        color = Color.Black,
        tonalElevation = 8.dp,
        shadowElevation = 16.dp
    ) {
        when (state) {
            KozmosDynamicIslandState.Compact -> {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.CenterStart) {
                        compactLeading()
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.CenterEnd) {
                        compactTrailing()
                    }
                }
            }
            KozmosDynamicIslandState.Expanded -> {
                Box(contentAlignment = Alignment.Center) {
                    expandedContent()
                }
            }
            KozmosDynamicIslandState.Minimal -> {
                Box(contentAlignment = Alignment.Center) {
                    minimalContent()
                }
            }
        }
    }
}
