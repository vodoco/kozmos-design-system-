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
    val paparazzi = Paparazzi()

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
