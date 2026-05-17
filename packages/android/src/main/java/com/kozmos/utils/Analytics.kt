package com.kozmos.utils

import androidx.compose.runtime.compositionLocalOf

data class KozmosAnalyticsEvent(
    val eventName: String,
    val properties: Map<String, Any> = emptyMap()
)

typealias KozmosAnalyticsTracker = (KozmosAnalyticsEvent) -> Unit

/**
 * A CompositionLocal to provide a custom analytics tracking pipeline down the compose tree.
 * Defaults to a no-op implementation.
 */
val LocalKozmosAnalytics = compositionLocalOf<KozmosAnalyticsTracker> {
    { _ -> /* No-op default */ }
}

/**
 * Global static fallback if LocalKozmosAnalytics is out of context
 */
object KozmosAnalytics {
    var globalTracker: KozmosAnalyticsTracker = { _ -> }
    
    fun track(eventName: String, properties: Map<String, Any> = emptyMap()) {
        globalTracker(KozmosAnalyticsEvent(eventName, properties))
    }
}
