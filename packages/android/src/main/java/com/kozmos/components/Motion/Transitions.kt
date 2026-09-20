package com.kozmos.components.motion

import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.animation.core.FiniteAnimationSpec
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import com.kozmos.tokens.KozmosMotion

/**
 * How the system's parts enter and leave, on the motion tokens: the same few
 * moves everywhere, so a row changing form reads as one thing happening.
 * Mirrors `KozmosTransitions` on iOS and the `kozmos-pop`, `kozmos-reveal`
 * and `kozmos-crossfade` rules on the web.
 */
object KozmosTransitions {
    /** The standard curve over the quick, standard and deliberate durations. */
    fun <T> quick(): FiniteAnimationSpec<T> = tween(KozmosMotion.semanticsMotionDurationQuick, easing = KozmosMotion.semanticsMotionEasingStandard)
    fun <T> standard(): FiniteAnimationSpec<T> = tween(KozmosMotion.semanticsMotionDurationStandard, easing = KozmosMotion.semanticsMotionEasingStandard)
    fun <T> deliberate(): FiniteAnimationSpec<T> = tween(KozmosMotion.semanticsMotionDurationDeliberate, easing = KozmosMotion.semanticsMotionEasingStandard)
    /** The emphasised curve over the standard duration: a small overshoot. */
    fun <T> emphasised(): FiniteAnimationSpec<T> = tween(KozmosMotion.semanticsMotionDurationStandard, easing = KozmosMotion.semanticsMotionEasingEmphasised)

    /** A control appearing beside another: it fades in from its side. */
    val reveal: EnterTransition = fadeIn(standard()) + slideInHorizontally(standard()) { it / 4 }
    val conceal: ExitTransition = fadeOut(standard()) + slideOutHorizontally(standard()) { it / 4 }

    /** A chip or a field taking another's place — the prototype's chip: from 90 %, a little left, fading in. */
    val pop: EnterTransition = fadeIn(emphasised()) + scaleIn(emphasised(), initialScale = 0.9f) + slideInHorizontally(emphasised()) { -22 }
    val unpop: ExitTransition = fadeOut(standard()) + scaleOut(standard(), targetScale = 0.9f) + slideOutHorizontally(standard()) { -22 }

    /** Content replacing content. */
    val crossfadeIn: EnterTransition = fadeIn(standard())
    val crossfadeOut: ExitTransition = fadeOut(standard())
}
