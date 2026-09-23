package com.kozmos.components.alert

import com.kozmos.tokens.KozmosDimensions

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosThemeTokens

enum class AlertStatus {
    Default, Info, Success, Warning, Error
}

@Composable
fun KozmosAlert(
    modifier: Modifier = Modifier,
    status: AlertStatus = AlertStatus.Default,
    content: @Composable androidx.compose.foundation.layout.RowScope.() -> Unit
) {
    val borderColor = alertBorderColor(status)

    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(KozmosThemeTokens.semanticsSurface0, RoundedCornerShape(KozmosDimensions.semanticsRadiusControl))
            .border(1.dp, borderColor, RoundedCornerShape(KozmosDimensions.semanticsRadiusControl))
            .padding(KozmosDimensions.primitivesLayoutSpacing200),
        verticalAlignment = Alignment.Top
    ) {
        content()
    }
}

@Composable
fun KozmosAlertIcon(
    status: AlertStatus = AlertStatus.Default,
    modifier: Modifier = Modifier,
    customIcon: ImageVector? = null
) {
    val icon = when (status) {
        AlertStatus.Default -> Icons.Default.Info
        AlertStatus.Info -> Icons.Default.Info
        AlertStatus.Success -> Icons.Default.CheckCircle
        AlertStatus.Warning -> Icons.Default.Warning
        AlertStatus.Error -> Icons.Default.Warning
    }
    Icon(
        imageVector = customIcon ?: icon,
        contentDescription = null,
        tint = alertForegroundColor(status),
        modifier = modifier.padding(end = KozmosDimensions.primitivesLayoutSpacing150)
    )
}

@Composable
fun KozmosAlertContent(
    modifier: Modifier = Modifier,
    content: @Composable androidx.compose.foundation.layout.ColumnScope.() -> Unit
) {
    Column(modifier = modifier) {
        content()
    }
}

@Composable
fun KozmosAlertTitle(
    title: String,
    modifier: Modifier = Modifier,
    color: Color = KozmosThemeTokens.primitivesColorsForeground100
) {
    Text(
        text = title,
        style = MaterialTheme.typography.titleMedium,
        fontWeight = FontWeight.Bold,
        color = color,
        modifier = modifier
    )
}

@Composable
fun KozmosAlertDescription(
    description: String,
    modifier: Modifier = Modifier,
    color: Color = KozmosThemeTokens.primitivesColorsForeground500
) {
    Text(
        text = description,
        style = MaterialTheme.typography.bodyMedium,
        color = color,
        modifier = modifier
    )
}

@Composable
@ReadOnlyComposable
internal fun alertForegroundColor(status: AlertStatus): Color = when (status) {
    AlertStatus.Default -> KozmosThemeTokens.primitivesColorsForeground0
    AlertStatus.Info -> KozmosThemeTokens.primitivesColorsTheme600
    AlertStatus.Success -> KozmosThemeTokens.primitivesColorsEmotionalSuccess900
    AlertStatus.Warning -> KozmosThemeTokens.primitivesColorsEmotionalAlert900
    AlertStatus.Error -> KozmosThemeTokens.primitivesColorsEmotionalDanger600
}

@Composable
@ReadOnlyComposable
private fun alertBorderColor(status: AlertStatus): Color = when (status) {
    AlertStatus.Default -> KozmosThemeTokens.primitivesColorsForeground500
    else -> alertForegroundColor(status)
}
