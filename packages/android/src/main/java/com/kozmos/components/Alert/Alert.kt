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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors

enum class AlertStatus {
    Info, Success, Warning, Error
}

@Composable
fun KozmosAlert(
    modifier: Modifier = Modifier,
    status: AlertStatus = AlertStatus.Info,
    content: @Composable androidx.compose.foundation.layout.RowScope.() -> Unit
) {
    val color = when (status) {
        AlertStatus.Info -> KozmosColors.primitivesColorsEmotionalInfo600
        AlertStatus.Success -> KozmosColors.primitivesColorsEmotionalSuccess600
        AlertStatus.Warning -> KozmosColors.primitivesColorsEmotionalAlert600
        AlertStatus.Error -> KozmosColors.primitivesColorsEmotionalDanger600
    }
    
    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(color.copy(alpha = 0.1f), RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius100))
            .border(1.dp, color.copy(alpha = 0.3f), RoundedCornerShape(KozmosDimensions.primitivesLayoutRadius100))
            .padding(KozmosDimensions.primitivesLayoutSpacing200),
        verticalAlignment = Alignment.Top
    ) {
        content()
    }
}

@Composable
fun KozmosAlertIcon(
    status: AlertStatus = AlertStatus.Info,
    modifier: Modifier = Modifier,
    customIcon: ImageVector? = null
) {
    val (color, icon) = when (status) {
        AlertStatus.Info -> KozmosColors.primitivesColorsEmotionalInfo600 to Icons.Default.Info
        AlertStatus.Success -> KozmosColors.primitivesColorsEmotionalSuccess600 to Icons.Default.CheckCircle
        AlertStatus.Warning -> KozmosColors.primitivesColorsEmotionalAlert600 to Icons.Default.Warning
        AlertStatus.Error -> KozmosColors.primitivesColorsEmotionalDanger600 to Icons.Default.Info
    }
    Icon(
        imageVector = customIcon ?: icon,
        contentDescription = null,
        tint = color,
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
    modifier: Modifier = Modifier
) {
    Text(
        text = title,
        style = MaterialTheme.typography.titleMedium,
        fontWeight = FontWeight.Bold,
        color = KozmosColors.primitivesColorsForeground100,
        modifier = modifier
    )
}

@Composable
fun KozmosAlertDescription(
    description: String,
    modifier: Modifier = Modifier
) {
    Text(
        text = description,
        style = MaterialTheme.typography.bodyMedium,
        color = KozmosColors.primitivesColorsForeground500,
        modifier = modifier
    )
}
