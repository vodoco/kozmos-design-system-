package com.kozmos.components.menu

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Divider
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosThemeTokens

enum class KozmosMenuContentType {
    Basic,
    Checkbox,
    Radio,
    Submenu
}

data class KozmosMenuItem(
    val text: String,
    val shortcut: String? = null,
    val checked: Boolean = false,
    val selected: Boolean = false,
    val submenuItems: List<String> = emptyList()
)

data class KozmosMenuContent(
    val label: String? = null,
    val items: List<KozmosMenuItem>,
    val contentType: KozmosMenuContentType = KozmosMenuContentType.Basic
)

@Composable
fun KozmosMenu(
    expanded: Boolean,
    onDismissRequest: () -> Unit,
    items: List<String>,
    onItemClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    KozmosMenu(
        expanded = expanded,
        onDismissRequest = onDismissRequest,
        content = KozmosMenuContent(
            items = items.map { KozmosMenuItem(text = it) }
        ),
        modifier = modifier,
        onItemClick = { item -> onItemClick(item.text) }
    )
}

@Composable
fun KozmosMenu(
    expanded: Boolean,
    onDismissRequest: () -> Unit,
    content: KozmosMenuContent,
    modifier: Modifier = Modifier,
    onItemClick: (KozmosMenuItem) -> Unit = {}
) {
    DropdownMenu(
        expanded = expanded,
        onDismissRequest = onDismissRequest,
        modifier = modifier
    ) {
        content.label?.let { label ->
            DropdownMenuItem(
                text = {
                    Text(
                        text = label,
                        color = KozmosThemeTokens.primitivesColorsForeground500
                    )
                },
                onClick = {}
            )
            Divider(color = KozmosThemeTokens.semanticsBorderSubtle)
        }

        content.items.forEach { item ->
            DropdownMenuItem(
                text = { Text(item.text) },
                onClick = {
                    onItemClick(item)
                    onDismissRequest()
                },
                leadingIcon = {
                    when (content.contentType) {
                        KozmosMenuContentType.Checkbox ->
                            if (item.checked) {
                                Icon(Icons.Default.Check, contentDescription = null)
                            } else {
                                Spacer(modifier = Modifier.width(24.dp))
                            }
                        KozmosMenuContentType.Radio ->
                            if (item.selected) {
                                Icon(Icons.Default.Check, contentDescription = null)
                            } else {
                                Spacer(modifier = Modifier.width(24.dp))
                            }
                        else -> Unit
                    }
                },
                trailingIcon = {
                    when {
                        content.contentType == KozmosMenuContentType.Submenu && item.submenuItems.isNotEmpty() ->
                            Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = null)
                        item.shortcut != null ->
                            Text(
                                text = item.shortcut,
                                color = KozmosThemeTokens.primitivesColorsForeground500
                            )
                    }
                }
            )
        }
    }
}
