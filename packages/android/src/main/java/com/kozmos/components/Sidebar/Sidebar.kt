package com.kozmos.components.sidebar

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.DrawerDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.PermanentDrawerSheet
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors

@Composable
fun KozmosSidebar(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    PermanentDrawerSheet(
        modifier = modifier.width(280.dp),
        drawerContainerColor = KozmosColors.primitivesColorsBackground0,
    ) {
        Column(
            modifier = Modifier
                .padding(KozmosDimensions.primitivesLayoutSpacing200)
                .fillMaxHeight()
        ) {
            content()
        }
    }
}
