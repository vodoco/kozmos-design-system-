package com.kozmos.components.dialog

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class KozmosDialogContentTest {
    @Test
    fun defaultContentKeepsCloseAffordance() {
        val content = KozmosDialogContent(title = "Edit profile")

        assertEquals("Edit profile", content.title)
        assertNull(content.description)
        assertNull(content.bodyText)
        assertNull(content.primaryActionText)
        assertNull(content.secondaryActionText)
        assertTrue(content.showCloseButton)
    }

    @Test
    fun contentCanRepresentFooterDialog() {
        val content = KozmosDialogContent(
            title = "Edit profile",
            description = "Make changes to your profile here.",
            bodyText = "Use dialog body content for a short task, form, or confirmation.",
            primaryActionText = "Save changes",
            secondaryActionText = "Cancel",
            showCloseButton = false
        )

        assertEquals("Make changes to your profile here.", content.description)
        assertEquals("Use dialog body content for a short task, form, or confirmation.", content.bodyText)
        assertEquals("Save changes", content.primaryActionText)
        assertEquals("Cancel", content.secondaryActionText)
        assertFalse(content.showCloseButton)
    }
}
