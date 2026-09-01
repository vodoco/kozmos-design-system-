package com.kozmos.components.directionstep

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.TurnLeft
import androidx.compose.material.icons.filled.TurnRight
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors

enum class DirectionType {
    Straight, Left, Right, Destination
}

@Composable
fun KozmosDirectionStep(
    type: DirectionType,
    instruction: String,
    modifier: Modifier = Modifier,
    distance: String? = null,
    duration: String? = null
) {
    // Turn icons must NOT auto-mirror: "turn left" stays a physical left turn
    // in RTL locales. Only reading-order affordances (back, forward, chevrons)
    // belong to Icons.AutoMirrored.
    val icon = when (type) {
        DirectionType.Straight -> Icons.Default.ArrowUpward
        DirectionType.Left -> Icons.Default.TurnLeft
        DirectionType.Right -> Icons.Default.TurnRight
        DirectionType.Destination -> Icons.Default.LocationOn
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(KozmosDimensions.semanticsRadiusControl))
            .background(KozmosColors.primitivesColorsBackground0)
            .border(1.dp, KozmosColors.primitivesColorsBackground300, RoundedCornerShape(KozmosDimensions.semanticsRadiusControl))
            .padding(KozmosDimensions.primitivesLayoutSpacing150),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(KozmosDimensions.primitivesLayoutSizing500)
                .clip(CircleShape)
                .background(KozmosColors.primitivesColorsTheme500.copy(alpha = 0.1f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = KozmosColors.primitivesColorsTheme500,
                modifier = Modifier.size(KozmosDimensions.primitivesLayoutSizing300)
            )
        }
        
        Spacer(modifier = Modifier.width(KozmosDimensions.primitivesLayoutSpacing150))
        
        Column {
            Text(
                text = instruction,
                style = MaterialTheme.typography.titleMedium,
                color = KozmosColors.primitivesColorsForeground100
            )
            if (distance != null || duration != null) {
                Text(
                    text = "${distance ?: ""} ${if (duration != null) "• $duration" else ""}",
                    style = MaterialTheme.typography.bodySmall,
                    color = KozmosColors.primitivesColorsForeground500
                )
            }
        }
    }
}
