package com.kozmos.components.heading

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.kozmos.tokens.KozmosColors

/**
 * Heading rank, mirroring the React `Heading.level` prop.
 *
 * Rank drives the type scale. Compose semantics only expose `heading()` as a
 * boolean with no rank, so TalkBack announces "heading" without a level;
 * SwiftUI carries the full rank via `accessibilityHeading`.
 */
enum class KozmosHeadingLevel(val level: Int, val fontSize: Int) {
    H1(1, 36),
    H2(2, 30),
    H3(3, 24),
    H4(4, 20),
    H5(5, 18),
    H6(6, 16)
}

/**
 * A ranked heading.
 *
 * Mirrors the React `Heading` API. Unlike `Text`, rank is not styling — it is
 * document structure, so it is expressed as a variant rather than left to the
 * platform type system.
 */
@Composable
fun KozmosHeading(
    text: String,
    modifier: Modifier = Modifier,
    level: KozmosHeadingLevel = KozmosHeadingLevel.H1
) {
    Text(
        text = text,
        modifier = modifier.semantics { heading() },
        fontSize = level.fontSize.sp,
        fontWeight = FontWeight.Bold,
        color = KozmosColors.primitivesColorsForeground100
    )
}
