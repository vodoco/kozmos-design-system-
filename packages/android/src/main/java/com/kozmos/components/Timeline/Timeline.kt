package com.kozmos.components.timeline

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors

data class TimelineItem(
    val time: String,
    val title: String,
    val description: String
)

@Composable
fun KozmosTimeline(
    modifier: Modifier = Modifier,
    content: @Composable androidx.compose.foundation.layout.ColumnScope.() -> Unit
) {
    Column(modifier = modifier) {
        content()
    }
}

@Composable
fun KozmosTimelineItem(
    modifier: Modifier = Modifier,
    isLast: Boolean = false,
    content: @Composable androidx.compose.foundation.layout.ColumnScope.() -> Unit
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(IntrinsicSize.Min)
    ) {
        Column(
            horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally,
            modifier = Modifier.width(KozmosDimensions.primitivesLayoutSizing500)
        ) {
            Box(
                modifier = Modifier
                    .size(KozmosDimensions.primitivesLayoutSpacing150)
                    .clip(CircleShape)
                    .background(KozmosColors.primitivesColorsTheme500)
            )
            if (!isLast) {
                Box(
                    modifier = Modifier
                        .width(KozmosDimensions.primitivesLayoutSpacing25)
                        .fillMaxHeight()
                        .background(KozmosColors.primitivesColorsBackground300)
                        .padding(top = KozmosDimensions.primitivesLayoutSpacing50)
                )
            }
        }
        
        Column(
            modifier = Modifier
                .padding(
                    start = KozmosDimensions.primitivesLayoutSpacing100, 
                    bottom = if (isLast) KozmosDimensions.primitivesLayoutSpacing0 else KozmosDimensions.primitivesLayoutSpacing400
                )
                .fillMaxWidth()
        ) {
            content()
        }
    }
}

@Composable
fun KozmosTimelineTime(
    time: String,
    modifier: Modifier = Modifier
) {
    Text(
        text = time,
        style = MaterialTheme.typography.labelMedium,
        color = KozmosColors.primitivesColorsForeground500,
        modifier = modifier
    )
}

@Composable
fun KozmosTimelineTitle(
    title: String,
    modifier: Modifier = Modifier
) {
    Text(
        text = title,
        style = MaterialTheme.typography.titleMedium,
        fontWeight = FontWeight.Bold,
        color = KozmosColors.primitivesColorsForeground100,
        modifier = modifier
    )
}

@Composable
fun KozmosTimelineDescription(
    description: String,
    modifier: Modifier = Modifier
) {
    Text(
        text = description,
        style = MaterialTheme.typography.bodyMedium,
        color = KozmosColors.primitivesColorsForeground500,
        modifier = modifier
    )
}
