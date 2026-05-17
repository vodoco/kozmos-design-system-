package com.kozmos.components.textarea

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.kozmos.tokens.KozmosColors

@Composable
fun KozmosTextarea(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String = "",
    minLines: Int = 3,
    maxLines: Int = 5,
    modifier: Modifier = Modifier
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = { Text(placeholder) },
        minLines = minLines,
        maxLines = maxLines,
        modifier = modifier.fillMaxWidth(),
        colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
            focusedBorderColor = KozmosColors.primitivesColorsTheme500,
            unfocusedBorderColor = KozmosColors.primitivesColorsForeground300,
            cursorColor = KozmosColors.primitivesColorsTheme500,
            focusedLabelColor = KozmosColors.primitivesColorsTheme500
        )
    )
}
