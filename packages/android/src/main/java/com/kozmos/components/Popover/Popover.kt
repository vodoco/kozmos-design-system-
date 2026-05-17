package com.kozmos.components.popover

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import com.kozmos.tokens.KozmosColors

@Composable
fun KozmosPopover(
    isExpanded: Boolean,
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    if (isExpanded) {
        Popup(
            onDismissRequest = onDismissRequest,
            properties = PopupProperties(focusable = true)
        ) {
            Surface(
                shape = RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius100),
                shadowElevation = 4.dp,
                color = KozmosColors.primitivesColorsBackground0,
                modifier = modifier
            ) {
                Box(modifier = Modifier.padding(KozmosDimensions.primitivesLayoutSpacing200)) {
                    content()
                }
            }
        }
    }
}
