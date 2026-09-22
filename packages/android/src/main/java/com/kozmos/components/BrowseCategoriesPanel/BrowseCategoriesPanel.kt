package com.kozmos.components.browsecategoriespanel

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
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.kozmos.components.categorytile.KozmosCategoryTile
import com.kozmos.components.categorytile.KozmosCategoryTint
import com.kozmos.contracts.KozmosCategoryPresentation
import com.kozmos.tokens.KozmosDimensions
import com.kozmos.tokens.KozmosThemeTokens

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
    /** A category's colours for its tile, or null for the theme's. */
    tint: (KozmosCategoryPresentation) -> KozmosCategoryTint? = { null },
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

            // The container edge's role, as React's border-b draws it and as
            // the prototype draws every rule (a light grey), themed. It was
            // foreground/300, a text colour, in its light value only, until
            // 2026-09-22.
            Divider(color = KozmosThemeTokens.semanticsBorderSubtle)
        }

        if (categories.isEmpty()) {
            // Dashed, in the same role, as React's and SwiftUI's empty states
            // are; it was a solid foreground/300 edge until 2026-09-22.
            val edge = KozmosThemeTokens.semanticsBorderSubtle
            val radius = KozmosDimensions.semanticsRadiusPanel
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(KozmosDimensions.primitivesLayoutSpacing200)
                    .drawWithContent {
                        drawContent()
                        // Inside the edge, as SwiftUI's strokeBorder draws it.
                        val width = 1.dp.toPx()
                        val dash = 4.dp.toPx()
                        drawRoundRect(
                            color = edge,
                            topLeft = Offset(width / 2, width / 2),
                            size = Size(size.width - width, size.height - width),
                            cornerRadius = CornerRadius(radius.toPx() - width / 2),
                            style = Stroke(
                                width = width,
                                pathEffect = PathEffect.dashPathEffect(floatArrayOf(dash, dash))
                            )
                        )
                    },
                shape = RoundedCornerShape(radius),
                color = KozmosThemeTokens.primitivesColorsBackground100.copy(alpha = 0.4f)
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
                // Four across, 8 apart, and rows 12 apart: the prototype's grid
                // (row-gap 12px, column-gap 8px, measured on 2026-09-22). The
                // rows were 8 apart here until then.
                columns = GridCells.Fixed(4),
                modifier = Modifier.fillMaxWidth(),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(
                    KozmosDimensions.primitivesLayoutSpacing200
                ),
                horizontalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing100),
                verticalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing150)
            ) {
                items(categories, key = { it.id }) { category ->
                    KozmosCategoryTile(
                        category = category,
                        onSelect = onSelect,
                        tint = tint(category),
                        icon = renderIcon?.let { render -> { render(category) } }
                    )
                }
            }
        }
    }
}
