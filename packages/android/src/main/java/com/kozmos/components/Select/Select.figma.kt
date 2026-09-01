package com.kozmos.components.select

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=80-432")
class KozmosSelectConnect {
    @FigmaProperty(FigmaType.Text, "Placeholder Text")
    val placeholder: String = "Select option"

    @FigmaProperty(FigmaType.Enum, "State")
    val state: String = Figma.mapping(
        "Default" to "default",
        "Focus" to "focus",
        "Disabled" to "disabled"
    )

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun ComponentExample() {
        KozmosSelect(
            expanded = false,
            onExpandedChange = {},
            trigger = { expanded ->
                OutlinedTextField(
                    value = "",
                    onValueChange = {},
                    readOnly = true,
                    enabled = state != "disabled",
                    placeholder = { Text(placeholder) },
                    trailingIcon = {
                        ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded)
                    },
                    modifier = Modifier.menuAnchor()
                )
            }
        ) {
            KozmosSelectItem(
                value = "option",
                label = "Option",
                onValueChange = {},
                onDismissRequest = {}
            )
        }
    }
}
