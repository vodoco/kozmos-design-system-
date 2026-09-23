package com.kozmos.contracts

/**
 * Platform-neutral, already-localized presentation models.
 *
 * These mirror the TypeScript contracts in `@kozmos-ds/product-contracts` so that
 * React, SwiftUI, and Compose Product / SDK components describe the same shape.
 *
 * API and map-SDK objects must be adapted into these contracts outside UI
 * components. Human-readable labels are included alongside machine values so
 * each platform renders the same meaning without embedding English formatters.
 */

enum class KozmosPOIAvailability(val value: String) {
    Open("open"),
    Closed("closed"),
    Unknown("unknown")
}

enum class KozmosPOIAccessRestrictions(val value: String) {
    /** The POI is known to have no access restrictions. */
    None("none"),
    Present("present"),
    Unknown("unknown")
}

enum class KozmosPOIAction(val value: String) {
    Navigate("navigate"),
    Favourite("favourite"),
    Bookmark("bookmark"),
    Share("share"),
    Order("order")
}

data class KozmosPOIMediaPresentation(
    val id: String,
    val src: String,
    val alt: String
)

data class KozmosPOIServicePresentation(
    val id: String,
    val label: String,
    val iconName: String? = null
)

data class KozmosPOILogoPresentation(
    val src: String,
    val alt: String
)

data class KozmosPOIPresentation(
    val id: String,
    val name: String,
    val floorId: String,
    val floorLabel: String,
    val categoryId: String? = null,
    val categoryLabel: String? = null,
    val buildingId: String? = null,
    val buildingLabel: String? = null,
    val logo: KozmosPOILogoPresentation? = null,
    val media: List<KozmosPOIMediaPresentation> = emptyList(),
    val availability: KozmosPOIAvailability? = null,
    val availabilityLabel: String? = null,
    val description: String? = null,
    val accessRestrictions: KozmosPOIAccessRestrictions? = null,
    val accessRestrictionsLabel: String? = null,
    val services: List<KozmosPOIServicePresentation>? = null,
    val actions: List<KozmosPOIAction> = emptyList()
) {
    /** Floor and building joined the same way every platform renders it. */
    val locationLabel: String
        get() = listOfNotNull(floorLabel, buildingLabel)
            .filter { it.isNotEmpty() }
            .joinToString(" · ")

    /** Single-character fallback used when no logo artwork is supplied. */
    val logoFallbackInitial: String
        get() = name.take(1).uppercase()
}

data class KozmosTravelEstimatePresentation(
    val durationSeconds: Double,
    val durationLabel: String,
    val distanceMetres: Double? = null,
    val distanceLabel: String? = null,
    val mode: String? = null,
    val modeLabel: String? = null
)

data class KozmosPOIResultPresentation(
    val poiId: String,
    val resultIndex: Int,
    val floorId: String,
    val selected: Boolean = false,
    val featured: Boolean = false,
    val travelEstimate: KozmosTravelEstimatePresentation? = null,
    val available: Boolean? = null,
    val unavailableReason: String? = null
) {
    /** Mirrors the web rule: only an explicit `false` marks a result unavailable. */
    val isAvailable: Boolean
        get() = available != false

    /** Returns a copy with `selected` driven by the single canonical selection ID. */
    fun selecting(selectedPoiId: String?): KozmosPOIResultPresentation =
        if (selectedPoiId == null) this else copy(selected = selectedPoiId == poiId)
}

data class KozmosFloorPresentation(
    val id: String,
    val label: String,
    val shortLabel: String,
    val disabled: Boolean = false
)

data class KozmosCategoryPresentation(
    val id: String,
    val label: String,
    val iconName: String? = null,
    val selected: Boolean = false,
    val disabled: Boolean = false,
    val resultCount: Int? = null,
    val resultCountLabel: String? = null
)

enum class KozmosRoutePreference(val value: String) {
    Quickest("quickest"),
    StepFree("step-free"),
    Custom("custom")
}

data class KozmosRouteOptionPresentation(
    val id: String,
    val label: String,
    val durationSeconds: Double,
    val durationLabel: String,
    val distanceMetres: Double,
    val distanceLabel: String,
    val preference: KozmosRoutePreference,
    val selected: Boolean = false,
    val available: Boolean = true,
    val warning: String? = null
)

enum class KozmosRouteReadiness(val value: String) {
    Idle("idle"),
    Calculating("calculating"),
    Ready("ready"),
    NoRoute("no-route"),
    Error("error")
}

enum class KozmosMapReadiness(val value: String) {
    Loading("loading"),
    Ready("ready"),
    Error("error"),
    Offline("offline"),
    Unsupported("unsupported")
}

enum class KozmosUserLocationState(val value: String) {
    Off("off"),
    Locating("locating"),
    Following("following"),
    Heading("heading"),
    PermissionDenied("permission-denied"),
    Stale("stale"),
    Unavailable("unavailable")
}

data class KozmosMapCollisionInsets(
    val top: Double = 0.0,
    val right: Double = 0.0,
    val bottom: Double = 0.0,
    val left: Double = 0.0
) {
    companion object {
        val Zero = KozmosMapCollisionInsets()
    }
}
