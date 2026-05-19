package com.kozmos.components.popover

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class KozmosPopoverContentTest {
    @Test
    fun defaultContentMapsFigmaAnatomy() {
        val content = KozmosPopoverContent(title = "Transit filters")

        assertEquals("Transit filters", content.title)
        assertNull(content.description)
        assertEquals(KozmosPopoverSide.Top, content.side)
    }

    @Test
    fun contentCanRepresentSideAndDescription() {
        val content = KozmosPopoverContent(
            title = "Transit filters",
            description = "Choose which route details are visible.",
            side = KozmosPopoverSide.Bottom
        )

        assertEquals("Choose which route details are visible.", content.description)
        assertEquals(KozmosPopoverSide.Bottom, content.side)
    }
}
