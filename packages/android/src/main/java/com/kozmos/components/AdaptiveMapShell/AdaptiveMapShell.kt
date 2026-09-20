package com.kozmos.components.adaptivemapshell

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.input.nestedscroll.NestedScrollConnection
import androidx.compose.ui.input.nestedscroll.NestedScrollSource
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.layout.AlignmentLine
import androidx.compose.ui.layout.HorizontalAlignmentLine
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.layout
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.setProgress
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.Velocity
import androidx.compose.ui.unit.dp
import kotlin.math.roundToInt
import com.kozmos.contracts.KozmosMapCollisionInsets
import com.kozmos.contracts.KozmosMapReadiness
import com.kozmos.components.motion.KozmosTransitions
import com.kozmos.components.surface.KozmosSurfaceDefaults
import com.kozmos.components.surface.KozmosSurfaceStyle
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

enum class KozmosMapPanelPlacement {
    Start,
    End
}

/**
 * The peek anchor's bottom edge, carried up to the sheet as an alignment
 * line: the sheet reads it while it measures its content, in the same frame,
 * as the iOS shell reads its anchor preference. Two anchors: the lower wins.
 */
internal val KozmosPanelPeekAnchorLine = HorizontalAlignmentLine(::maxOf)

/**
 * Marks the row the sheet's smallest detent rests on: `Collapsed` then
 * resolves to this row's bottom edge plus a margin, within a quarter and
 * three quarters of the shell — the prototype's place card peeks at its Go
 * row. Without an anchor `Collapsed` is a fifth of the shell.
 */
fun Modifier.kozmosPanelPeekAnchor(): Modifier = layout { measurable, constraints ->
    val placeable = measurable.measure(constraints)
    layout(placeable.width, placeable.height, mapOf(KozmosPanelPeekAnchorLine to placeable.height)) {
        placeable.place(0, 0)
    }
}

/** The detents a bottom sheet offers unless told otherwise; it rests at medium. */
val KozmosDefaultPanelDetents: List<KozmosMapPanelDetent> =
    listOf(KozmosMapPanelDetent.Collapsed, KozmosMapPanelDetent.Medium, KozmosMapPanelDetent.Large)

/**
 * Adaptive container that layers a map, its controls, and a detail panel.
 *
 * Mirrors the React `AdaptiveMapShell`. The shell owns layout and z-ordering
 * only. [collisionInsets] are surfaced back to the caller through
 * [onCollisionInsetsChange] so the map renderer can pad its camera — layout
 * alone cannot move SDK labels, routes, attribution, or marker collision boxes.
 */
@Composable
fun KozmosAdaptiveMapShell(
    map: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    mapLabel: String = "Map",
    mapStatus: KozmosMapReadiness = KozmosMapReadiness.Ready,
    mapStatusContent: (@Composable () -> Unit)? = null,
    controls: (@Composable () -> Unit)? = null,
    topBar: (@Composable () -> Unit)? = null,
    panel: (@Composable () -> Unit)? = null,
    panelLabel: String = "Map details",
    panelPlacement: KozmosMapPanelPlacement = KozmosMapPanelPlacement.End,
    collisionInsets: KozmosMapCollisionInsets = KozmosMapCollisionInsets.Zero,
    onCollisionInsetsChange: ((KozmosMapCollisionInsets) -> Unit)? = null,
    /** What the panel sits on: solid by default, glass where the product asks for it. */
    panelSurface: KozmosSurfaceStyle = KozmosSurfaceStyle.Solid,
    /**
     * Where a bottom sheet may rest: collapsed (a fifth of the shell, or the
     * content's peek anchor), medium (54 %), large (94 %), fitted to its
     * content, a fraction or a height. Dragged anywhere on the sheet, it
     * snaps to the nearest of these; a scrollable inside it scrolls only at
     * the largest. Unset, the sheet offers collapsed, medium and large and
     * rests at medium.
     */
    panelDetents: List<KozmosMapPanelDetent> = KozmosDefaultPanelDetents,
    /** The detent the sheet rests at: controlled, with [onPanelDetentChange]. */
    panelDetent: KozmosMapPanelDetent? = null,
    onPanelDetentChange: ((KozmosMapPanelDetent) -> Unit)? = null
) {
    LaunchedEffect(collisionInsets) {
        onCollisionInsetsChange?.invoke(collisionInsets)
    }

    BoxWithConstraints(
        modifier = modifier
            .fillMaxWidth()
            .defaultMinSize(minHeight = 448.dp)
            .background(KozmosColors.primitivesColorsBackground100)
    ) {
        // Wide layouts float the panel beside the map; compact layouts dock it
        // to the bottom edge, matching the web breakpoint behaviour.
        val isRegularWidth = maxWidth >= 600.dp
        val availableHeight = maxHeight
        val availableWidth = maxWidth

        Box(
            modifier = Modifier
                .fillMaxSize()
                .semantics { contentDescription = mapLabel }
        ) {
            map()
        }

        if (mapStatus != KozmosMapReadiness.Ready && mapStatusContent != null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(KozmosColors.primitivesColorsBackground0.copy(alpha = 0.8f))
                    .semantics { liveRegion = LiveRegionMode.Polite },
                contentAlignment = Alignment.Center
            ) {
                mapStatusContent()
            }
        }

        // The map runs to every edge; the chrome keeps the window's safe
        // insets — the status bar, a cutout, the navigation bar — so an
        // edge-to-edge activity (enableEdgeToEdge) shows the prototype's
        // screen and a padded one loses nothing.
        if (topBar != null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Top + WindowInsetsSides.Horizontal))
                    .padding(KozmosDimensions.primitivesLayoutSpacing200)
                    .align(Alignment.TopCenter),
                contentAlignment = Alignment.TopCenter
            ) {
                Box(modifier = Modifier.widthIn(max = 672.dp)) { topBar() }
            }
        }

        if (controls != null) {
            Box(
                modifier = Modifier
                    .windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Top + WindowInsetsSides.Horizontal))
                    .padding(KozmosDimensions.primitivesLayoutSpacing200)
                    .align(
                        if (panelPlacement == KozmosMapPanelPlacement.End) {
                            Alignment.TopStart
                        } else {
                            Alignment.TopEnd
                        }
                    )
            ) {
                controls()
            }
        }

        if (panel != null) {
            val radius = KozmosDimensions.semanticsRadiusPanel

            if (isRegularWidth) {
                // 42% of the shell, capped at 416.dp — computed rather than
                // chained, because `widthIn` before `fillMaxWidth` would take
                // the fraction of the cap instead of capping the fraction.
                val panelWidth = minOf(416.dp, availableWidth * 0.42f)

                Surface(
                    modifier = Modifier
                        .windowInsetsPadding(WindowInsets.safeDrawing)
                        .padding(KozmosDimensions.primitivesLayoutSpacing200)
                        .width(panelWidth)
                        .fillMaxHeight()
                        .align(
                            if (panelPlacement == KozmosMapPanelPlacement.End) {
                                Alignment.CenterEnd
                            } else {
                                Alignment.CenterStart
                            }
                        )
                        .semantics { contentDescription = panelLabel },
                    shape = RoundedCornerShape(radius),
                    color = KozmosSurfaceDefaults.tint(panelSurface),
                    border = KozmosSurfaceDefaults.border(panelSurface),
                    shadowElevation = 24.dp
                ) {
                    panel()
                }
            } else {
                BottomSheet(
                    panel = panel,
                    panelLabel = panelLabel,
                    panelSurface = panelSurface,
                    panelDetents = panelDetents,
                    panelDetent = panelDetent,
                    onPanelDetentChange = onPanelDetentChange,
                    shellHeight = availableHeight,
                    radius = radius,
                    modifier = Modifier.align(Alignment.BottomCenter)
                )
            }
        }
    }
}

/**
 * The docked sheet: the prototype's three detents and its drag rule
 * (docs/pointr-prototype-initial-sheet-2026-09-20.md §1–§2), shared with the
 * iOS and web shells. The whole sheet drags; a scrollable inside it takes
 * part through nested scrolling, so it scrolls only at the largest detent
 * and a downward drag empties its scroll before the sheet moves; a release
 * snaps to the nearest detent, the fling's velocity counted.
 */
@Composable
private fun BottomSheet(
    panel: @Composable () -> Unit,
    panelLabel: String,
    panelSurface: KozmosSurfaceStyle,
    panelDetents: List<KozmosMapPanelDetent>,
    panelDetent: KozmosMapPanelDetent?,
    onPanelDetentChange: ((KozmosMapPanelDetent) -> Unit)?,
    shellHeight: Dp,
    radius: Dp,
    modifier: Modifier = Modifier
) {
    val density = LocalDensity.current
    // What the last measure pass learned about the content: the peek anchor's
    // edge and the content's height. Written in layout, read for the gesture
    // maths; the height itself is decided in the same pass, so the first
    // frame is already right.
    var measures by remember { mutableStateOf(KozmosPanelMeasures()) }
    val offered = if (panelDetents.isEmpty()) listOf(KozmosMapPanelDetent.Medium) else panelDetents
    val ordered = orderPanelDetents(offered, shellHeight, measures)
    var uncontrolled by remember {
        mutableStateOf(if (ordered.contains(KozmosMapPanelDetent.Medium)) KozmosMapPanelDetent.Medium else ordered[ordered.size / 2])
    }
    val active = panelDetent ?: uncontrolled
    fun heights(with: KozmosPanelMeasures): Triple<Dp, Dp, Dp> {
        val sorted = orderPanelDetents(offered, shellHeight, with)
        val smallest = sorted.first().height(shellHeight, with)
        val largest = sorted.last().height(shellHeight, with)
        return Triple(smallest, largest, active.height(shellHeight, with).coerceIn(smallest, largest))
    }
    val (smallest, largest, settled) = heights(measures)
    val atLargest = settled >= largest - 0.5.dp
    // Dragging up is a negative offset and makes the sheet taller.
    var dragOffset by remember { mutableFloatStateOf(0f) }
    // Between detents on the standard motion, the prototype's own curve.
    val animatedSettled by animateDpAsState(
        targetValue = settled,
        animationSpec = KozmosTransitions.standard(),
        label = "kozmos-sheet-detent"
    )
    val index = ordered.indexOfFirst { it.height(shellHeight, measures).value.roundToInt() == settled.value.roundToInt() }.coerceAtLeast(0)
    fun setDetent(detent: KozmosMapPanelDetent) {
        if (panelDetent == null) uncontrolled = detent
        if (detent != active) onPanelDetentChange?.invoke(detent)
    }
    fun snap(velocity: Float) {
        // The fling's velocity, projected 120 ms on, so a fast short drag
        // still lands on the detent it was aiming for.
        val target = with(density) { (settled - dragOffset.toDp() - (velocity * 0.12f).toDp()) }
        dragOffset = 0f
        nearestPanelDetent(ordered, target, shellHeight, measures)?.let(::setDetent)
    }
    val connection = remember(atLargest, smallest, largest) {
        object : NestedScrollConnection {
            // A child scrolling up grows the sheet until it is at the largest
            // detent; only then does the child keep the delta.
            override fun onPreScroll(available: Offset, source: NestedScrollSource): Offset {
                if (source != NestedScrollSource.Drag || available.y >= 0f || atLargest) return Offset.Zero
                if (with(density) { (settled - dragOffset.toDp()) } >= largest) return Offset.Zero
                dragOffset += available.y
                return Offset(0f, available.y)
            }

            // A child that has scrolled back to its top hands what is left of
            // a downward drag to the sheet.
            override fun onPostScroll(consumed: Offset, available: Offset, source: NestedScrollSource): Offset {
                if (source != NestedScrollSource.Drag || available.y <= 0f) return Offset.Zero
                dragOffset += available.y
                return Offset(0f, available.y)
            }

            override suspend fun onPreFling(available: Velocity): Velocity {
                if (dragOffset == 0f) return Velocity.Zero
                snap(available.y)
                return available
            }
        }
    }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .nestedScroll(connection)
            // The whole sheet drags, not only its handle: the prototype's rule.
            .draggable(
                orientation = Orientation.Vertical,
                state = rememberDraggableState { delta -> dragOffset += delta },
                onDragStopped = { velocity -> snap(velocity) }
            )
            .semantics { contentDescription = panelLabel },
        shape = RoundedCornerShape(topStart = radius, topEnd = radius),
        color = KozmosSurfaceDefaults.tint(panelSurface),
        border = KozmosSurfaceDefaults.border(panelSurface),
        shadowElevation = 24.dp
    ) {
        val showsHandle = ordered.size > 1
        Layout(
            content = {
                if (showsHandle) {
                    SheetHandle(
                        description = active.description,
                        index = index,
                        count = ordered.size,
                        onCycle = { setDetent(ordered[(index + 1) % ordered.size]) },
                        onStep = { step -> setDetent(ordered[(index + step).coerceIn(0, ordered.size - 1)]) }
                    )
                }
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        // The sheet's surface reaches the bottom edge; what it
                        // holds keeps above the navigation bar.
                        .windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Bottom + WindowInsetsSides.Horizontal))
                ) { panel() }
            }
        ) { measurables, constraints ->
            // The content keeps its own size at every detent: measured as tall
            // as the largest detent allows and clipped to the sheet, so a peek
            // anchor row is never squashed by a collapsed sheet and a list
            // inside has a bounded height.
            val handleHeight = KozmosDimensions.primitivesLayoutSpacing200.roundToPx()
            val loose = constraints.copy(minWidth = 0, minHeight = 0)
            val handle = if (showsHandle) measurables[0].measure(loose.copy(maxHeight = handleHeight)) else null
            val contentMeasurable = measurables.last()
            val largestNow = orderPanelDetents(offered, shellHeight, measures).last().height(shellHeight, measures)
            val content = contentMeasurable.measure(loose.copy(maxHeight = largestNow.roundToPx()))
            val line = content[KozmosPanelPeekAnchorLine]
            val fresh = KozmosPanelMeasures(
                contentHeight = (content.height + (handle?.height ?: 0)).toDp(),
                peekBottom = if (line != AlignmentLine.Unspecified) (line + (handle?.height ?: 0)).toDp() else 0.dp
            )
            if (fresh != measures) measures = fresh
            val (freshSmallest, freshLargest, freshSettled) = heights(fresh)
            // Between detents the animated height leads; otherwise the fresh
            // measurement decides at once, so the first frame is right.
            val resting = animatedSettled == settled
            val height = with(density) {
                ((if (resting) freshSettled else animatedSettled) - dragOffset.toDp()).coerceIn(freshSmallest, freshLargest)
            }
            layout(constraints.maxWidth, height.roundToPx().coerceIn(constraints.minHeight, constraints.maxHeight)) {
                handle?.place(0, 0)
                content.place(0, handle?.height ?: 0)
            }
        }
    }
}

/** The grab handle's row: 16 tall, a 40 x 4 capsule; a tap cycles the detents, accessibility adjusts them. */
@Composable
private fun SheetHandle(
    description: String,
    index: Int,
    count: Int,
    onCycle: () -> Unit,
    onStep: (Int) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(KozmosDimensions.primitivesLayoutSpacing200)
            .clickable(onClick = onCycle)
            .semantics {
                contentDescription = "Panel height"
                stateDescription = description
                progressBarRangeInfo = ProgressBarRangeInfo(index.toFloat(), 0f..(count - 1).toFloat(), count - 1)
                setProgress { value -> onStep(value.roundToInt() - index); true }
            },
        contentAlignment = Alignment.TopCenter
    ) {
        Box(
            modifier = Modifier
                .padding(top = KozmosDimensions.primitivesLayoutSpacing75)
                .size(width = KozmosDimensions.primitivesLayoutSizing500, height = 4.dp)
                .background(KozmosColors.primitivesColorsBackground300, RoundedCornerShape(999.dp))
        )
    }
}
