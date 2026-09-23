package com.kozmos.components.sidebar

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.PermanentDrawerSheet
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosThemeTokens

enum class KozmosSidebarVariant {
    Expanded,
    Rail
}

@Composable
fun KozmosSidebar(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    KozmosSidebar(
        modifier = modifier,
        navigation = content
    )
}

@Composable
fun KozmosSidebar(
    modifier: Modifier = Modifier,
    variant: KozmosSidebarVariant = KozmosSidebarVariant.Expanded,
    header: @Composable ColumnScope.() -> Unit = {},
    navigation: @Composable ColumnScope.() -> Unit,
    tools: @Composable ColumnScope.() -> Unit = {},
    footer: @Composable ColumnScope.() -> Unit = {}
) {
    val isRail = variant == KozmosSidebarVariant.Rail
    PermanentDrawerSheet(
        modifier = modifier.width(if (isRail) 80.dp else 280.dp),
        drawerContainerColor = KozmosThemeTokens.primitivesColorsBackground0,
    ) {
        Column(
            modifier = Modifier
                .padding(
                    horizontal = if (isRail) KozmosDimensions.primitivesLayoutSpacing100 else KozmosDimensions.primitivesLayoutSpacing200,
                    vertical = KozmosDimensions.primitivesLayoutSpacing300
                )
                .fillMaxHeight(),
            horizontalAlignment = if (isRail) Alignment.CenterHorizontally else Alignment.Start,
            verticalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing200)
        ) {
            header()
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                horizontalAlignment = if (isRail) Alignment.CenterHorizontally else Alignment.Start,
                verticalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing100),
                content = navigation
            )
            tools()
            footer()
        }
    }
}
