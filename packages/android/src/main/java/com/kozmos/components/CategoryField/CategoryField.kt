package com.kozmos.components.categoryfield

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.kozmos.components.categorytile.KozmosCategoryTint
import com.kozmos.components.counter.KozmosInkedFill
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

/**
 * The search field's form once a quick-access category is chosen — the
 * prototype's, measured: 48 tall, the control radius, the category's colour
 * at 12 % with a 1-dp border of it, the icon at 28, the name at 15 semibold,
 * a 22-tall count pill filled with the colour, a 32 clear at the end. It
 * takes the field's place in the search row.
 *
 * Mirrors `CategoryField` on the web and `KozmosCategoryField` on iOS.
 */
@Composable
fun KozmosCategoryField(
    label: String,
    onClear: () -> Unit,
    modifier: Modifier = Modifier,
    count: Int? = null,
    tint: KozmosCategoryTint = KozmosCategoryTint(
        KozmosColors.primitivesColorsTheme500,
        KozmosInkedFill(KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle, KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle)
    ),
    clearLabel: String = "Clear category",
    countLabel: (Int) -> String = { "$it places" },
    icon: (@Composable () -> Unit)? = null
) {
    val shape = RoundedCornerShape(KozmosDimensions.semanticsRadiusControl)
    Row(
        modifier = modifier
            .height(48.dp)
            .clip(shape)
            .background(tint.accent.copy(alpha = 0.12f))
            .border(1.dp, tint.accent, shape)
            .padding(start = KozmosDimensions.primitivesLayoutSpacing150, end = KozmosDimensions.primitivesLayoutSpacing100)
            .semantics(mergeDescendants = false) {
                contentDescription = if (count == null) label else "$label, ${countLabel(count)}"
            },
        verticalAlignment = Alignment.CenterVertically
    ) {
        CompositionLocalProvider(LocalContentColor provides tint.accent) {
            if (icon != null) {
                Box(modifier = Modifier.size(28.dp), contentAlignment = Alignment.Center) { icon() }
                Spacer(modifier = Modifier.size(KozmosDimensions.primitivesLayoutSpacing100))
            }
            Text(
                text = label,
                color = tint.accent,
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.weight(1f, fill = false)
            )
            if (count != null) {
                Spacer(modifier = Modifier.size(KozmosDimensions.primitivesLayoutSpacing100))
                Box(
                    modifier = Modifier
                        .defaultMinSize(minWidth = 22.dp, minHeight = 22.dp)
                        .clip(CircleShape)
                        .background(tint.fill.fill)
                        .padding(horizontal = KozmosDimensions.primitivesLayoutSpacing75)
                        .semantics { contentDescription = countLabel(count) },
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = count.toString(), color = tint.fill.ink, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
            }
            Spacer(modifier = Modifier.weight(1f))
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .clickable(role = Role.Button, onClick = onClear)
                    .semantics { contentDescription = clearLabel },
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = Icons.Default.Close, contentDescription = null, tint = tint.accent, modifier = Modifier.size(16.dp))
            }
        }
    }
}
