package com.kozmos.components.card

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

@Composable
fun KozmosCard(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = modifier.border(
            1.dp,
            KozmosColors.primitivesColorsBackground200,
            RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius200)
        ),
        shape = RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius200),
        colors = CardDefaults.cardColors(
            containerColor = KozmosColors.primitivesColorsBackground0,
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
        content = {
            Column(modifier = Modifier) {
                content()
            }
        }
    )
}

@Composable
fun KozmosCardHeader(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(
        modifier = modifier.padding(KozmosDimensions.primitivesLayoutSpacing300)
    ) {
        content()
    }
}

@Composable
fun KozmosCardTitle(
    title: String,
    modifier: Modifier = Modifier
) {
    Text(
        text = title,
        style = MaterialTheme.typography.titleLarge,
        fontWeight = FontWeight.SemiBold,
        color = KozmosColors.primitivesColorsForeground100,
        modifier = modifier
    )
}

@Composable
fun KozmosCardDescription(
    description: String,
    modifier: Modifier = Modifier
) {
    Text(
        text = description,
        style = MaterialTheme.typography.bodyMedium,
        color = KozmosColors.primitivesColorsForeground400,
        modifier = modifier.padding(top = KozmosDimensions.primitivesLayoutSpacing50)
    )
}

@Composable
fun KozmosCardContent(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(
        modifier = modifier
            .padding(horizontal = KozmosDimensions.primitivesLayoutSpacing300)
            .padding(bottom = KozmosDimensions.primitivesLayoutSpacing300)
    ) {
        content()
    }
}

@Composable
fun KozmosCardFooter(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit
) {
    Row(
        modifier = modifier
            .padding(horizontal = KozmosDimensions.primitivesLayoutSpacing300)
            .padding(bottom = KozmosDimensions.primitivesLayoutSpacing300),
        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
    ) {
        content()
    }
}
