package com.kozmos.components.button

import app.cash.paparazzi.Paparazzi
import org.junit.Rule
import org.junit.Test

class KozmosButtonPaparazziTest {
    @get:Rule
    val paparazzi = Paparazzi()

    @Test
    fun defaultButtonSnapshot() {
        paparazzi.snapshot {
            KozmosButton(
                text = "Snapshot Verification",
                onClick = {}
            )
        }
    }
}
