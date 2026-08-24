package com.kozmos.components.browsecategoriespanel

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Divider
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.kozmos.components.categorytile.KozmosCategoryTile
import com.kozmos.contracts.KozmosCategoryPresentation
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

/**
 * A scrollable grid of browsable categories with optional search and actions.
 *
 * Mirrors the React `BrowseCategoriesPanel`. The panel renders whatever
 * categories it is given; filtering, searching, and result counts belong to
 * the consuming app.
 */
@Composable
fun KozmosBrowseCategoriesPanel(
    categories: List<KozmosCategoryPresentation>,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String = "Browse categories",
    renderIcon: (@Composable (KozmosCategoryPresentation) -> Unit)? = null,
    search: (@Composable () -> Unit)? = null,
    actions: (@Composable () -> Unit)? = null,
    emptyState: (@Composable () -> Unit)? = null
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .semantics { contentDescription = label }
    ) {
        if (search != null || actions != null) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(KozmosDimensions.primitivesLayoutSpacing200),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing100)
            ) {
                if (search != null) {
                    Box(modifier = Modifier.weight(1f)) { search() }
                }
                if (actions != null) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(
                            KozmosDimensions.primitivesLayoutSpacing100
                        )
                    ) {
                        actions()
                    }
                }
            }

            Divider(color = KozmosColors.primitivesColorsForeground300)
        }

        if (categories.isEmpty()) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(KozmosDimensions.primitivesLayoutSpacing200),
                shape = RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius300),
                color = KozmosColors.primitivesColorsBackground100.copy(alpha = 0.4f),
                border = BorderStroke(1.dp, KozmosColors.primitivesColorsForeground300)
            ) {
                Box(
                    modifier = Modifier.padding(KozmosDimensions.primitivesLayoutSpacing300),
                    contentAlignment = Alignment.Center
                ) {
                    emptyState?.invoke()
                }
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Adaptive(minSize = 140.dp),
                modifier = Modifier.fillMaxWidth(),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(
                    KozmosDimensions.primitivesLayoutSpacing200
                ),
                horizontalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing150),
                verticalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing150)
            ) {
                items(categories, key = { it.id }) { category ->
                    KozmosCategoryTile(
                        category = category,
                        onSelect = onSelect,
                        icon = renderIcon?.let { render -> { render(category) } }
                    )
                }
            }
        }
    }
}
