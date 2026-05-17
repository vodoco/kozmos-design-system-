package com.kozmos.components.dialog

import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog

@Composable
fun KozmosDialog(
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    Dialog(onDismissRequest = onDismissRequest) {
        Surface(
            shape = RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius200),
            color = MaterialTheme.colorScheme.surface,
            modifier = modifier
        ) {
            Box(modifier = Modifier.padding(KozmosDimensions.primitivesLayoutSpacing300)) {
                content()
            }
        }
    }
}
