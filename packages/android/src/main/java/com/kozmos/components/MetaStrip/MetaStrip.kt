package com.kozmos.components.metastrip

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.kozmos.tokens.KozmosThemeTokens

/**
 * One fact in a [KozmosMetaStrip]: a label and the value it describes.
 *
 * The label is required even when it is not drawn. A tile reading "$$$$" or
 * "4.5" is clear to someone looking at it and meaningless to someone listening,
 * so the label always reaches TalkBack.
 */
data class KozmosMetaStripItem(
    val label: String,
    val value: String,
    val showLabel: Boolean = false
)

/**
 * A row of small facts about one thing, each a label and a value.
 *
 * Measured from the SDK's POI detail card (`HbFSXhCPxKUy2fWa5x9TKO`, node
 * `241:4772`, 2026-09-14): a 64-tall strip of bordered tiles. It scrolls rather
 * than wrapping, because a fact tile on a second row reads as a different kind
 * of thing.
 *
 * Domain-neutral: it knows about facts, not about places.
 */
@Composable
fun KozmosMetaStrip(
    items: List<KozmosMetaStripItem>,
    modifier: Modifier = Modifier
) {
    val border = KozmosThemeTokens.semanticsBorderSubtle

    Column(modifier = modifier.background(KozmosThemeTokens.primitivesColorsBackground0)) {
        Divider(border)
        Row(
            modifier = Modifier
                .height(STRIP_HEIGHT.dp)
                .horizontalScroll(rememberScrollState()),
            verticalAlignment = Alignment.CenterVertically
        ) {
            items.forEachIndexed { index, item ->
                if (index > 0) {
                    Box(
                        Modifier
                            .fillMaxHeight()
                            .widthIn(min = 1.dp, max = 1.dp)
                            .background(border)
                    )
                }
                Tile(item)
            }
        }
        Divider(border)
    }
}

@Composable
private fun Divider(color: androidx.compose.ui.graphics.Color) {
    Box(
        Modifier
            .height(1.dp)
            .background(color)
    )
}

@Composable
private fun Tile(item: KozmosMetaStripItem) {
    Column(
        modifier = Modifier
            .widthIn(min = MIN_TILE_WIDTH.dp)
            .fillMaxHeight()
            .padding(horizontal = 16.dp)
            .clearAndSetSemantics { contentDescription = "${item.label}: ${item.value}" },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = item.value,
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium,
            color = KozmosThemeTokens.primitivesColorsForeground0
        )
        if (item.showLabel) {
            Text(
                text = item.label,
                fontSize = 12.sp,
                color = KozmosThemeTokens.primitivesColorsForeground400
            )
        }
    }
}

private const val STRIP_HEIGHT = 64
private const val MIN_TILE_WIDTH = 128
