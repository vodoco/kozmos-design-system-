package com.kozmos.components.splitbutton

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosThemeTokens

data class SplitContextMenuItem(val label: String, val onClick: () -> Unit)

@Composable
fun KozmosSplitButton(
    label: String,
    onMainClick: () -> Unit,
    menuItems: List<SplitContextMenuItem>,
    modifier: Modifier = Modifier
) {
    var expanded by remember { mutableStateOf(false) }

    Row(modifier = modifier) {
        Button(
            onClick = onMainClick,
            shape = RoundedCornerShape(topStart = KozmosDimensions.semanticsRadiusPanel, bottomStart = KozmosDimensions.semanticsRadiusPanel, topEnd = KozmosDimensions.semanticsRadiusNone, bottomEnd = KozmosDimensions.semanticsRadiusNone),
            colors = ButtonDefaults.buttonColors(containerColor = KozmosThemeTokens.primitivesColorsTheme500, contentColor = KozmosThemeTokens.primitivesColorsBackground0)
        ) {
            Text(label)
        }
        Spacer(modifier = Modifier.width(1.dp))
        Button(
            onClick = { expanded = true },
            shape = RoundedCornerShape(topStart = KozmosDimensions.semanticsRadiusNone, bottomStart = KozmosDimensions.semanticsRadiusNone, topEnd = KozmosDimensions.semanticsRadiusPanel, bottomEnd = KozmosDimensions.semanticsRadiusPanel),
            colors = ButtonDefaults.buttonColors(containerColor = KozmosThemeTokens.primitivesColorsTheme500, contentColor = KozmosThemeTokens.primitivesColorsBackground0)
        ) {
            Icon(Icons.Default.ArrowDropDown, contentDescription = "More actions")
            DropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false }
            ) {
                menuItems.forEach { item ->
                    DropdownMenuItem(
                        text = { Text(item.label) },
                        onClick = {
                            item.onClick()
                            expanded = false
                        }
                    )
                }
            }
        }
    }
}
