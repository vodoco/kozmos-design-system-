package com.kozmos.components.navbar

import androidx.compose.foundation.layout.RowScope
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.kozmos.tokens.KozmosColors

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KozmosNavbar(
    title: String,
    modifier: Modifier = Modifier,
    navigationIcon: @Composable () -> Unit = {},
    actions: @Composable RowScope.() -> Unit = {}
) {
    TopAppBar(
        title = { Text(title) },
        modifier = modifier,
        navigationIcon = navigationIcon,
        actions = actions,
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = KozmosColors.primitivesColorsBackground0,
            titleContentColor = KozmosColors.primitivesColorsForeground100,
            actionIconContentColor = KozmosColors.primitivesColorsForeground100
        )
    )
}
