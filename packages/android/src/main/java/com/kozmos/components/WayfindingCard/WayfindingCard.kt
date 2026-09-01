package com.kozmos.components.wayfindingcard

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.SwapVert
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors
import com.kozmos.providers.LocalKozmosAnalytics

@Composable
fun KozmosWayfindingCard(
    modifier: Modifier = Modifier,
    title: String = "Navigation",
    onClose: (() -> Unit)? = null,
    content: @Composable () -> Unit
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
        colors = CardDefaults.cardColors(containerColor = KozmosColors.primitivesColorsBackground0)
    ) {
        Column(modifier = Modifier.padding(KozmosDimensions.primitivesLayoutSpacing200)) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.weight(1f)
                )
                if (onClose != null) {
                    IconButton(onClick = onClose) {
                        Icon(Icons.Default.Close, contentDescription = "Close")
                    }
                }
            }
            Spacer(modifier = Modifier.padding(top = KozmosDimensions.primitivesLayoutSpacing100))
            content()
        }
    }
}

@Composable
fun KozmosWayfindingInputRow(
    originValue: String,
    onOriginChange: (String) -> Unit,
    destinationValue: String,
    onDestinationChange: (String) -> Unit,
    onSwap: () -> Unit,
    originPlaceholder: String = "Starting point...",
    destinationPlaceholder: String = "Destination...",
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = originValue,
            onValueChange = onOriginChange,
            placeholder = { Text(originPlaceholder) },
            modifier = Modifier.fillMaxWidth().padding(bottom = KozmosDimensions.primitivesLayoutSpacing100),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(KozmosDimensions.semanticsRadiusControl),
            singleLine = true,
            colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
                focusedBorderColor = KozmosColors.primitivesColorsTheme500,
                unfocusedBorderColor = KozmosColors.primitivesColorsForeground300
            ) 
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.End
        ) {
            val trackEvent = LocalKozmosAnalytics.current
            
            IconButton(onClick = {
                trackEvent(com.kozmos.providers.KozmosAnalyticsEvent(
                    component = "WayfindingInputRow",
                    eventName = "wayfinding_route_swapped",
                    properties = mapOf("origin" to originValue, "destination" to destinationValue)
                ))
                onSwap()
            }) {
                Icon(Icons.Default.SwapVert, contentDescription = "Swap") 
            }
        }
        OutlinedTextField(
            value = destinationValue,
            onValueChange = onDestinationChange,
            placeholder = { Text(destinationPlaceholder) },
            modifier = Modifier.fillMaxWidth().padding(top = KozmosDimensions.primitivesLayoutSpacing100),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(KozmosDimensions.semanticsRadiusControl),
            singleLine = true,
            colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
                focusedBorderColor = KozmosColors.primitivesColorsTheme500,
                unfocusedBorderColor = KozmosColors.primitivesColorsForeground300
            )
        )
    }
}
