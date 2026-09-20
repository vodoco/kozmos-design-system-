package com.kozmos.components.button

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.Color
import com.kozmos.components.iconbutton.KozmosIconButton
import com.kozmos.components.iconbutton.KozmosIconButtonVariant
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.Paparazzi
import org.junit.Rule
import org.junit.Test

class KozmosButtonPaparazziTest {
    @get:Rule
    val paparazzi = Paparazzi(
        // Paparazzi defaults to maxPercentDifference = 0.1. Taking a button's
        // corner radius from 8dp to 16dp moves 0.1069% of the pixels — measured
        // by diffing the two goldens — so a change nobody could miss by eye sat
        // a hair inside the default and the gate stayed green. Rendering is
        // deterministic on one machine (re-recording gives a byte-identical
        // file), so on a fixed platform any tolerance only buys silence.
        //
        // One caveat, and it predates this setting: goldens are recorded
        // locally on macOS and CI verifies on ubuntu-latest. That mismatch has
        // been hidden until now by the loose default. If the Android job goes
        // red on an unchanged render, cross-platform rasterisation is the
        // reason — re-record on the CI platform rather than widening this back
        // out. Note that the signal here (0.1069%) is uncomfortably close to
        // the old threshold either way, which says the frame is mostly empty
        // background: more components, rendered tighter, is the real fix.
        maxPercentDifference = 0.0,
    )

    @Test
    fun defaultButtonSnapshot() {
        paparazzi.snapshot {
            MaterialTheme {
                Box(modifier = Modifier.padding(24.dp)) {
                    KozmosButton(
                        onClick = {}
                    ) {
                        Text("Snapshot Verification")
                    }
                }
            }
        }
    }

    /**
     * The glass variant is the glass surface: over pure red, the tint at
     * the token's opacity with the light edge, the label in ink — not the
     * dark chip of white at 16 % it used to be.
     */
    @Test
    fun glassButtonsAreTheGlassSurface() {
        paparazzi.snapshot {
            MaterialTheme {
                Box(modifier = Modifier.background(Color.Red).padding(24.dp)) {
                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.CenterVertically) {
                        KozmosButton(onClick = {}, variant = KozmosButtonVariant.Glass) { Text("Glass") }
                        KozmosIconButton(icon = Icons.Default.Add, onClick = {}, contentDescription = "Add", variant = KozmosIconButtonVariant.Glass)
                    }
                }
            }
        }
    }
}

