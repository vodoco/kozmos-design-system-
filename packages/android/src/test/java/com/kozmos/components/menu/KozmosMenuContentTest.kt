package com.kozmos.components.menu

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class KozmosMenuContentTest {
    @Test
    fun defaultContentRepresentsBasicMenu() {
        val content = KozmosMenuContent(
            label = "Actions",
            items = listOf(
                KozmosMenuItem(text = "Rename", shortcut = "R"),
                KozmosMenuItem(text = "Duplicate")
            )
        )

        assertEquals("Actions", content.label)
        assertEquals(KozmosMenuContentType.Basic, content.contentType)
        assertEquals("R", content.items.first().shortcut)
    }

    @Test
    fun contentCanRepresentCheckboxAndSubmenuStates() {
        val checkboxItem = KozmosMenuItem(text = "Transit", checked = true)
        val submenuItem = KozmosMenuItem(text = "Share", submenuItems = listOf("Invite people", "Export"))

        assertTrue(checkboxItem.checked)
        assertFalse(checkboxItem.selected)
        assertEquals(listOf("Invite people", "Export"), submenuItem.submenuItems)
    }
}
