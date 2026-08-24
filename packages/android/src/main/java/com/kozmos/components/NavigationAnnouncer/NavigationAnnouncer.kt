package com.kozmos.components.navigationannouncer

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.unit.dp

@Composable
fun KozmosNavigationAnnouncer(
    message: String,
    modifier: Modifier = Modifier,
    isActive: Boolean = true
) {
    if (!isActive || message.isBlank()) {
        return
    }

    Box(
        modifier = modifier
            .size(1.dp)
            .clearAndSetSemantics {
                liveRegion = LiveRegionMode.Assertive
                contentDescription = message
            }
    )
}
