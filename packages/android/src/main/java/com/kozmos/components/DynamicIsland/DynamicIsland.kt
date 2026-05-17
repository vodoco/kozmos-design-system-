package com.kozmos.components.DynamicIsland

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun KozmosDynamicIsland() {
    Text(
        text = "DynamicIsland",
        modifier = Modifier
            .padding(16.dp)
            .background(Color.LightGray.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
            .padding(16.dp)
    )
}
