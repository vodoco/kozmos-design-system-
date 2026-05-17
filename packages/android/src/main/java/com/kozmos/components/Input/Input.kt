package com.kozmos.components.input

import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun KozmosInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String = "",
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = { Text(placeholder) },
        enabled = enabled,
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(com.kozmos.tokens.KozmosDimensions.primitivesLayoutRadius100),
        singleLine = true,
        colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
            focusedBorderColor = com.kozmos.tokens.KozmosColors.primitivesColorsTheme500,
            unfocusedBorderColor = com.kozmos.tokens.KozmosColors.primitivesColorsForeground300,
            cursorColor = com.kozmos.tokens.KozmosColors.primitivesColorsTheme500,
            focusedLabelColor = com.kozmos.tokens.KozmosColors.primitivesColorsTheme500
        )
    )
}
