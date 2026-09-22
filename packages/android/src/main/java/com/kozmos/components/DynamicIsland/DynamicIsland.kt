package com.kozmos.components.dynamicisland

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosThemeTokens
import com.kozmos.tokens.LocalKozmosUseDarkTokens

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

    // The island is black in both themes, so what sits in it reads from the
    // dark palette, as SwiftUI scopes its island to the dark scheme. Until
    // 2026-09-22 its content took the page's theme: dark ink on black in light
    // mode.
    CompositionLocalProvider(LocalKozmosUseDarkTokens provides true) {
        Surface(
            modifier = modifier.width(width).height(height),
            shape = RoundedCornerShape(radius.dp),
            color = Color.Black,
            contentColor = KozmosThemeTokens.primitivesColorsForeground100,
            tonalElevation = 8.dp,
            shadowElevation = 16.dp
        ) {
            when (state) {
                // 16 in from the pill's ends, and 16 around the expanded
                // card, as React and SwiftUI inset them. Compose drew both
                // flush to the edge until 2026-09-22.
                KozmosDynamicIslandState.Compact -> {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
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
                    Box(modifier = Modifier.padding(16.dp), contentAlignment = Alignment.Center) {
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
}
