package com.kozmos.components.backdrop

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.kozmos.tokens.KozmosThemeTokens

@Composable
fun KozmosBackdrop(
    visible: Boolean = true,
    onTap: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    if (visible) {
        Box(
            modifier = modifier
                .fillMaxSize()
                // The scrim role, as React, Figma, the dialog and the drawer
                // draw it: black at half, in both themes. It was background/800
                // at 40 % until 2026-09-22, which turns light in dark mode.
                .background(KozmosThemeTokens.semanticsOverlayScrim)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onTap
                )
        )
    }
}
