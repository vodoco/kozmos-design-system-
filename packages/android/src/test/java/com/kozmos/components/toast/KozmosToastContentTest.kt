package com.kozmos.components.toast

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class KozmosToastContentTest {
    @Test
    fun defaultContentKeepsCloseAffordance() {
        val content = KozmosToastContent(title = "Scheduled: Catch up")

        assertEquals("Scheduled: Catch up", content.title)
        assertNull(content.description)
        assertNull(content.actionText)
        assertTrue(content.showCloseButton)
    }

    @Test
    fun contentCanRepresentActionToast() {
        val content = KozmosToastContent(
            title = "Scheduled: Catch up",
            description = "Friday, February 10, 2023 at 5:57 PM",
            actionText = "Undo",
            showCloseButton = false
        )

        assertEquals("Friday, February 10, 2023 at 5:57 PM", content.description)
        assertEquals("Undo", content.actionText)
        assertFalse(content.showCloseButton)
    }
}
