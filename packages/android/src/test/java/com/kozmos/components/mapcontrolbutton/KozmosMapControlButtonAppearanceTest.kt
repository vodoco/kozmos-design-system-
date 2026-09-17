package com.kozmos.components.mapcontrolbutton

import com.kozmos.components.mapcontrolbutton.KozmosMapControlButtonAppearance.Edge
import com.kozmos.components.mapcontrolbutton.KozmosMapControlButtonAppearance.Surface
import com.kozmos.components.mapcontrolbutton.KozmosMapControlButtonAppearance.Tone
import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * The state → appearance decision for a map control, tested without rendering.
 *
 * These mirror the React and SwiftUI assertions, so all three platforms are held
 * to the same ruling: tinted keeps the map's surface and colours only the glyph
 * and the edge; filled inverts the surface.
 */
class KozmosMapControlButtonAppearanceTest {
    @Test
    fun restingControlKeepsTheMapSurfaceWhateverItsEmphasis() {
        val tinted = KozmosMapControlButtonAppearance.resolve(false, KozmosMapControlButtonEmphasis.Tinted)
        assertEquals(Surface.Chrome, tinted.surface)
        assertEquals(Tone.Ink, tinted.icon)
        assertEquals(Edge.Subtle, tinted.edge)
        assertEquals(tinted, KozmosMapControlButtonAppearance.resolve(false, KozmosMapControlButtonEmphasis.Filled))
    }

    @Test
    fun tintedPressedColoursOnlyTheGlyphAndTheEdge() {
        val appearance = KozmosMapControlButtonAppearance.resolve(true, KozmosMapControlButtonEmphasis.Tinted)
        assertEquals(Surface.Chrome, appearance.surface)
        assertEquals(Tone.Theme, appearance.icon)
        assertEquals(Edge.Theme, appearance.edge)
        assertEquals(Tone.Ink, appearance.label)
        assertEquals(Tone.Muted, appearance.caption)
    }

    @Test
    fun filledPressedInvertsTheSurfaceAndEveryLineOnIt() {
        val appearance = KozmosMapControlButtonAppearance.resolve(true, KozmosMapControlButtonEmphasis.Filled)
        assertEquals(Surface.Filled, appearance.surface)
        assertEquals(Tone.OnFill, appearance.icon)
        assertEquals(Tone.OnFill, appearance.label)
        // A muted caption would sit at about 1.9:1 on the theme fill.
        assertEquals(Tone.OnFill, appearance.caption)
    }
}
