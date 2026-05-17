package com.kozmos.components.locationpin

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors

@Composable
fun KozmosLocationPin(
    modifier: Modifier = Modifier,
    tint: Color = KozmosColors.primitivesColorsTheme500
) {
    Icon(
        imageVector = Icons.Default.LocationOn,
        contentDescription = "Location Pin",
        modifier = modifier.size(KozmosDimensions.primitivesLayoutSizing400),
        tint = tint
    )
}
