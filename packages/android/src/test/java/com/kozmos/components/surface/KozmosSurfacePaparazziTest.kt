package com.kozmos.components.glasssurface

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.Paparazzi
import com.kozmos.tokens.KozmosDimensions
import com.kozmos.tokens.KozmosEffects
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test

/** The glass surface role over pure red: the tint at the token's opacity. */
class KozmosGlassSurfacePaparazziTest {
    @get:Rule
    val paparazzi = Paparazzi(maxPercentDifference = 0.0)

    @Test
    fun theRoleReadsTheGlassToken() {
        assertEquals(0.7f, KozmosEffects.semanticsEffectGlass.opacity, 0.001f)
        assertEquals(20f, KozmosEffects.semanticsEffectGlass.blur, 0f)
        assertEquals(0.2f, KozmosEffects.semanticsEffectGlass.borderOpacity, 0.001f)
        // A Compose colour keeps eight bits of alpha: 0.7 comes back as 179/255.
        assertEquals(KozmosEffects.semanticsEffectGlass.opacity, KozmosGlassSurfaceDefaults.tint.alpha, 0.005f)
    }

    @Test
    fun theSurfaceTintsWhatIsBehindIt() {
        paparazzi.snapshot {
            MaterialTheme {
                Box(modifier = Modifier.width(360.dp).height(200.dp).background(Color.Red), contentAlignment = Alignment.Center) {
                    Box(
                        modifier = Modifier
                            .size(width = 240.dp, height = 80.dp)
                            .kozmosGlassSurface(RoundedCornerShape(KozmosDimensions.semanticsRadiusContainer))
                    )
                }
            }
        }
    }
}
