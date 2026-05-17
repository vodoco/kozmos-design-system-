package com.kozmos.providers

import androidx.compose.runtime.compositionLocalOf

data class KozmosAnalyticsEvent(
    val component: String,
    val eventName: String,
    val properties: Map<String, String>? = null
)

typealias KozmosAnalyticsTracker = (KozmosAnalyticsEvent) -> Unit

val LocalKozmosAnalytics = compositionLocalOf<KozmosAnalyticsTracker> {
    { event ->
        // Native fallback closure protecting composables detached from explicit telemetry anchors natively.
        println("[Kozmos Analytics] ${event.component} -> ${event.eventName}")
    }
}
