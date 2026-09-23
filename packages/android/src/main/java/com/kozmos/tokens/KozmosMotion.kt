// Do not edit directly, this file was auto-generated.
package com.kozmos.tokens

import androidx.compose.animation.core.CubicBezierEasing

/**
 * The motion tokens, mirroring `Semantics.Motion` in `packages/tokens`: three
 * durations — quick for a state's small change, standard for a layout change,
 * deliberate for a large move — and two easings, standard (ease out and
 * settle) and emphasised (a small overshoot). `pnpm tokens:motion:check` holds
 * every number here to the token files.
 */
object KozmosMotion {
    /** Milliseconds. */
    const val semanticsMotionDurationQuick: Int = 150
    const val semanticsMotionDurationStandard: Int = 280
    const val semanticsMotionDurationDeliberate: Int = 460
    val semanticsMotionEasingStandard: CubicBezierEasing = CubicBezierEasing(0.4f, 0f, 0.2f, 1f)
    val semanticsMotionEasingEmphasised: CubicBezierEasing = CubicBezierEasing(0.34f, 1.56f, 0.64f, 1f)
}
