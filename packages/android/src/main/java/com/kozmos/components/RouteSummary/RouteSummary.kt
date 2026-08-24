package com.kozmos.components.routesummary

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.kozmos.components.button.KozmosButton
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

enum class KozmosRouteSummaryState {
    Active,
    Preview
}

@Composable
fun KozmosRouteSummary(
    etaText: String,
    distanceText: String,
    onEndRoute: () -> Unit,
    modifier: Modifier = Modifier,
    state: KozmosRouteSummaryState = KozmosRouteSummaryState.Active,
    onStartNavigation: (() -> Unit)? = null,
    transportModeIcon: (@Composable () -> Unit)? = null
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius300),
        color = KozmosColors.primitivesColorsBackground0.copy(alpha = 0.9f),
        tonalElevation = 6.dp,
        shadowElevation = 12.dp,
        border = BorderStroke(1.dp, KozmosColors.primitivesColorsForeground900.copy(alpha = 0.08f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(KozmosDimensions.primitivesLayoutSpacing200),
            verticalArrangement = Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing200)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                if (transportModeIcon != null) {
                    Surface(
                        modifier = Modifier.size(40.dp),
                        shape = CircleShape,
                        color = KozmosColors.primitivesColorsTheme500.copy(alpha = 0.12f)
                    ) {
                        androidx.compose.foundation.layout.Box(contentAlignment = Alignment.Center) {
                            transportModeIcon()
                        }
                    }
                    Spacer(modifier = Modifier.size(KozmosDimensions.primitivesLayoutSpacing150))
                }

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = etaText,
                        style = MaterialTheme.typography.titleLarge,
                        color = KozmosColors.primitivesColorsForeground100
                    )
                    Text(
                        text = distanceText,
                        style = MaterialTheme.typography.bodyMedium,
                        color = KozmosColors.primitivesColorsForeground500
                    )
                }

                if (state == KozmosRouteSummaryState.Active) {
                    IconButton(
                        onClick = onEndRoute,
                        modifier = Modifier
                            .size(40.dp)
                            .semantics { contentDescription = "End route" }
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = null,
                            tint = KozmosColors.primitivesColorsEmotionalDanger600
                        )
                    }
                }
            }

            if (state == KozmosRouteSummaryState.Preview && onStartNavigation != null) {
                KozmosButton(
                    onClick = onStartNavigation,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Navigation, contentDescription = null)
                    Spacer(modifier = Modifier.size(KozmosDimensions.primitivesLayoutSpacing100))
                    Text("Start Navigation")
                }
            }
        }
    }
}
