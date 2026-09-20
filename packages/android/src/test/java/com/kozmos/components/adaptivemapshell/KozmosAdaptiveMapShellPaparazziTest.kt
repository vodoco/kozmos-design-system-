package com.kozmos.components.adaptivemapshell

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.Paparazzi
import com.kozmos.components.surface.KozmosSurfaceStyle
import org.junit.Rule
import org.junit.Test

/**
 * The shell's bottom panel: as tall as what it holds, on the surface style —
 * solid by default, glass on request, over a red map.
 */
class KozmosAdaptiveMapShellPaparazziTest {
    @get:Rule
    val paparazzi = Paparazzi(maxPercentDifference = 0.0)

    private fun shell(surface: KozmosSurfaceStyle) = @androidx.compose.runtime.Composable {
        MaterialTheme {
            Box(modifier = Modifier.fillMaxSize().height(640.dp)) {
                KozmosAdaptiveMapShell(
                    map = { Box(modifier = Modifier.fillMaxSize().background(Color.Red)) },
                    panel = {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Airport Shuttles")
                            Text("4 min · 201 m")
                        }
                    },
                    panelSurface = surface
                )
            }
        }
    }

    @Test
    fun theBottomPanelFitsItsContentOnASolidSurface() {
        paparazzi.snapshot(composable = shell(KozmosSurfaceStyle.Solid))
    }

    @Test
    fun theBottomPanelCanBeGlass() {
        paparazzi.snapshot(composable = shell(KozmosSurfaceStyle.Glass))
    }
}
