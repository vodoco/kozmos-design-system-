package com.kozmos.components.accordion

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

@Composable
fun KozmosAccordion(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(modifier = modifier) {
        content()
    }
}

@Composable
fun KozmosAccordionItem(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(modifier = modifier) {
        content()
    }
}

@Composable
fun KozmosAccordionTrigger(
    value: String,
    selectedValue: String?,
    onValueChange: (String?) -> Unit,
    title: String,
    modifier: Modifier = Modifier
) {
    val trackEvent = com.kozmos.providers.LocalKozmosAnalytics.current
    val isExpanded = value == selectedValue
    val rotation by animateFloatAsState(if (isExpanded) 180f else 0f, label = "rotation")

    Column(modifier = modifier) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .clickable {
                    if (!isExpanded) {
                        trackEvent(com.kozmos.providers.KozmosAnalyticsEvent(component = "Accordion", eventName = "accordion_toggled", properties = mapOf("value" to value.toString())))
                        onValueChange(value)
                    } else {
                        onValueChange(null)
                    }
                }
                .padding(KozmosDimensions.primitivesLayoutSpacing200)
        ) {
            Text(
                text = title,
                modifier = Modifier.weight(1f)
            )
            Icon(
                imageVector = Icons.Default.KeyboardArrowDown,
                contentDescription = if (isExpanded) "Collapse" else "Expand",
                modifier = Modifier.rotate(rotation)
            )
        }
        Divider(color = KozmosColors.primitivesColorsBackground300)
    }
}

@Composable
fun KozmosAccordionContent(
    value: String,
    selectedValue: String?,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    val isExpanded = value == selectedValue
    AnimatedVisibility(visible = isExpanded) {
        Column(modifier = modifier.padding(horizontal = KozmosDimensions.primitivesLayoutSpacing200, vertical = KozmosDimensions.primitivesLayoutSpacing100)) {
            content()
        }
    }
}
