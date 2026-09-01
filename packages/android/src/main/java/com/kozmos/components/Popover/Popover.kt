package com.kozmos.components.popover

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import com.kozmos.tokens.KozmosThemeTokens

enum class KozmosPopoverSide {
    Top,
    Right,
    Bottom,
    Left
}

data class KozmosPopoverContent(
    val title: String,
    val description: String? = null,
    val side: KozmosPopoverSide = KozmosPopoverSide.Top
)

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
                shape = RoundedCornerShape(KozmosDimensions.semanticsRadiusControl),
                shadowElevation = 4.dp,
                color = KozmosThemeTokens.semanticsSurface0,
                border = BorderStroke(1.dp, KozmosThemeTokens.primitivesColorsForeground400),
                modifier = modifier
            ) {
                Box(modifier = Modifier.padding(KozmosDimensions.primitivesLayoutSpacing200)) {
                    content()
                }
            }
        }
    }
}

@Composable
fun KozmosPopover(
    isExpanded: Boolean,
    onDismissRequest: () -> Unit,
    title: String,
    modifier: Modifier = Modifier,
    description: String? = null,
    side: KozmosPopoverSide = KozmosPopoverSide.Top
) {
    KozmosPopover(
        isExpanded = isExpanded,
        onDismissRequest = onDismissRequest,
        content = KozmosPopoverContent(
            title = title,
            description = description,
            side = side
        ),
        modifier = modifier
    )
}

@Composable
fun KozmosPopover(
    isExpanded: Boolean,
    onDismissRequest: () -> Unit,
    content: KozmosPopoverContent,
    modifier: Modifier = Modifier
) {
    KozmosPopover(
        isExpanded = isExpanded,
        onDismissRequest = onDismissRequest,
        modifier = modifier.widthIn(min = 288.dp, max = 288.dp)
    ) {
        Column {
            Text(
                text = content.title,
                color = KozmosThemeTokens.primitivesColorsForeground100
            )

            content.description?.let { description ->
                Box(modifier = Modifier.padding(top = KozmosDimensions.primitivesLayoutSpacing100)) {
                    Text(
                        text = description,
                        color = KozmosThemeTokens.primitivesColorsForeground500
                    )
                }
            }
        }
    }
}
