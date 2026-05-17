package com.kozmos.components.select

import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KozmosSelect(
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
    trigger: @Composable ExposedDropdownMenuBoxScope.(Boolean) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = onExpandedChange,
        modifier = modifier
    ) {
        trigger(expanded)
        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { onExpandedChange(false) },
        ) {
            content()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KozmosSelectItem(
    value: String,
    label: String,
    onValueChange: (String) -> Unit,
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier
) {
    val trackEvent = com.kozmos.providers.LocalKozmosAnalytics.current
    DropdownMenuItem(
        text = { Text(label) },
        onClick = {
            trackEvent(com.kozmos.providers.KozmosAnalyticsEvent(component = "Select", eventName = "select_value_changed", properties = mapOf("value" to value.toString())))
            onValueChange(value)
            onDismissRequest()
        },
        contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding,
        modifier = modifier
    )
}
