package com.kozmos.components.search

import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun KozmosSearch(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String = "Search",
    modifier: Modifier = Modifier
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = { Text(placeholder) },
        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius100),
        singleLine = true,
        colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
            focusedBorderColor = com.kozmos.tokens.KozmosColors.primitivesColorsTheme500,
            unfocusedBorderColor = com.kozmos.tokens.KozmosColors.primitivesColorsForeground300,
            cursorColor = com.kozmos.tokens.KozmosColors.primitivesColorsTheme500,
            focusedLeadingIconColor = com.kozmos.tokens.KozmosColors.primitivesColorsForeground500,
            unfocusedLeadingIconColor = com.kozmos.tokens.KozmosColors.primitivesColorsForeground500
        )
    )
}
