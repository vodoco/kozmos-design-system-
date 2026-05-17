package com.kozmos.components

import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import com.kozmos.components.box.KozmosBox
import org.junit.Rule
import org.junit.Test
import androidx.compose.material3.Text

class BoxTest {
    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun boxRendersContent() {
        composeTestRule.setContent {
            KozmosBox {
                Text("Hello")
            }
        }
        composeTestRule.onNodeWithText("Hello").assertExists()
    }
}
