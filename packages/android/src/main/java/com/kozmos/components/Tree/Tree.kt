package com.kozmos.components.tree

import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.unit.dp

data class TreeNode(
    val id: String,
    val name: String,
    val children: List<TreeNode> = emptyList()
)

@Composable
fun KozmosTree(
    data: List<TreeNode>,
    modifier: Modifier = Modifier
) {
    LazyColumn(modifier = modifier) {
        items(data) { item ->
            TreeItem(item, 0)
        }
    }
}

@Composable
fun TreeItem(item: TreeNode, depth: Int) {
    var isExpanded by remember { mutableStateOf(false) }
    val hasChildren = item.children.isNotEmpty()
    val rotation by animateFloatAsState(targetValue = if (isExpanded) 90f else 0f, label = "rotation")

    Column {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .clickable { if (hasChildren) isExpanded = !isExpanded }
                .padding(vertical = KozmosDimensions.primitivesLayoutSpacing50, horizontal = KozmosDimensions.primitivesLayoutSpacing100)
        ) {
            Spacer(modifier = Modifier.width((depth * 16).dp))
            if (hasChildren) {
                Icon(
                    imageVector = Icons.Default.KeyboardArrowRight,
                    contentDescription = "Expand",
                    modifier = Modifier
                        .size(KozmosDimensions.primitivesLayoutSizing300)
                        .rotate(rotation)
                )
            } else {
                Spacer(modifier = Modifier.size(KozmosDimensions.primitivesLayoutSizing300))
            }
            Text(
                text = item.name,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(start = KozmosDimensions.primitivesLayoutSpacing100)
            )
        }
        AnimatedVisibility(visible = isExpanded) {
            Column {
                item.children.forEach { child ->
                    TreeItem(child, depth + 1)
                }
            }
        }
    }
}
