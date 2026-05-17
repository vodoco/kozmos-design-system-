package com.kozmos.components.MapOverlay

import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

enum class OverlayPosition {
    TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT, TOP_CENTER, BOTTOM_CENTER
}

@Composable
fun KozmosMapOverlay(
    modifier: Modifier = Modifier,
    position: OverlayPosition = OverlayPosition.TOP_LEFT,
    content: @Composable () -> Unit
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            // Translates `pointer-events-none` into native transparent interaction bounds
            // Ensures Android System Navigation Bars do not collide with absolute components
            .windowInsetsPadding(WindowInsets.safeDrawing)
    ) {
        val alignment = when (position) {
            OverlayPosition.TOP_LEFT -> Alignment.TopStart
            OverlayPosition.TOP_RIGHT -> Alignment.TopEnd
            OverlayPosition.BOTTOM_LEFT -> Alignment.BottomStart
            OverlayPosition.BOTTOM_RIGHT -> Alignment.BottomEnd
            OverlayPosition.TOP_CENTER -> Alignment.TopCenter
            OverlayPosition.BOTTOM_CENTER -> Alignment.BottomCenter
        }

        // Structural map geometry clearance (MapLibre telemetry / Compass bounds)
        val paddingModifier = when (position) {
            OverlayPosition.BOTTOM_LEFT, OverlayPosition.BOTTOM_RIGHT, OverlayPosition.BOTTOM_CENTER -> 
                Modifier.padding(bottom = KozmosDimensions.primitivesLayoutSpacing600, start = KozmosDimensions.primitivesLayoutSpacing200, end = KozmosDimensions.primitivesLayoutSpacing200, top = KozmosDimensions.primitivesLayoutSpacing200)
            else -> Modifier.padding(KozmosDimensions.primitivesLayoutSpacing200)
        }

        Box(
            modifier = Modifier
                .align(alignment)
                .then(paddingModifier)
                .widthIn(max = 384.dp) // `md:w-96` standard bounds translation natively
        ) {
            content()
        }
    }
}
