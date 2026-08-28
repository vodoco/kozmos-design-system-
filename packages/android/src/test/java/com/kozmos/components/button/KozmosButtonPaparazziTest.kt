package com.kozmos.components.button

import androidx.compose.foundation.layout.Box
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
        // Paparazzi defaults to maxPercentDifference = 0.1, and layoutlib renders
        // deterministically, so any tolerance at all just buys silence. Taking a
        // button's corner radius from 8dp to 16dp moves 0.1069% of the pixels —
        // a change nobody could miss by eye — and sailed through the default.
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
}
