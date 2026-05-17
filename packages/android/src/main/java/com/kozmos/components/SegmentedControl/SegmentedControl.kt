package com.kozmos.components.segmentedcontrol

import androidx.compose.foundation.layout.Row
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@androidx.compose.material3.ExperimentalMaterial3Api
@Composable
fun KozmosSegmentedControl(
    options: List<String>,
    selectedIndex: Int,
    onOptionSelected: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(modifier = modifier) {
        options.forEachIndexed { index, label ->
            androidx.compose.material3.TextButton(
                onClick = { onOptionSelected(index) },
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = label,
                    color = if (index == selectedIndex) 
                        com.kozmos.tokens.KozmosColors.primitivesColorsTheme500 
                    else 
                        com.kozmos.tokens.KozmosColors.primitivesColorsForeground500
                )
            }
        }
    }
}
