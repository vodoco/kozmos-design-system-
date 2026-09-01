package com.kozmos.contracts

import com.kozmos.components.poiresultcard.kozmosPOIResultIdentifier
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * These derivations are duplicated across React, SwiftUI, and Compose. They are
 * the pieces most likely to drift silently, so they are asserted directly
 * rather than only exercised through a composable.
 */
class ProductContractsTest {

    private fun makePOI(
        name: String = "Gate 42",
        floorLabel: String = "Level 2",
        buildingLabel: String? = "Terminal B"
    ) = KozmosPOIPresentation(
        id = "poi-1",
        name = name,
        floorId = "floor-2",
        floorLabel = floorLabel,
        buildingLabel = buildingLabel
    )

    // region locationLabel

    @Test
    fun locationLabelJoinsFloorAndBuilding() {
        assertEquals("Level 2 · Terminal B", makePOI().locationLabel)
    }

    @Test
    fun locationLabelOmitsMissingBuilding() {
        assertEquals("Level 2", makePOI(buildingLabel = null).locationLabel)
    }

    @Test
    fun locationLabelOmitsEmptyBuilding() {
        assertEquals("Level 2", makePOI(buildingLabel = "").locationLabel)
    }

    // endregion

    // region logoFallbackInitial

    @Test
    fun logoFallbackInitialIsUppercasedFirstCharacter() {
        assertEquals("B", makePOI(name = "boots").logoFallbackInitial)
    }

    @Test
    fun logoFallbackInitialHandlesEmptyName() {
        assertEquals("", makePOI(name = "").logoFallbackInitial)
    }

    // endregion

    // region isAvailable

    private fun makeResult(available: Boolean?) = KozmosPOIResultPresentation(
        poiId = "poi-1",
        resultIndex = 1,
        floorId = "floor-2",
        available = available
    )

    @Test
    fun onlyExplicitFalseMarksResultUnavailable() {
        assertTrue(makeResult(null).isAvailable)
        assertTrue(makeResult(true).isAvailable)
        assertFalse(makeResult(false).isAvailable)
    }

    // endregion

    // region selecting

    @Test
    fun selectingDerivesSelectionFromCanonicalId() {
        val result = KozmosPOIResultPresentation(
            poiId = "poi-1",
            resultIndex = 1,
            floorId = "floor-2",
            selected = false
        )

        assertTrue(result.selecting("poi-1").selected)
        assertFalse(result.selecting("poi-2").selected)
    }

    @Test
    fun selectingWithNullPreservesExistingFlag() {
        val selected = KozmosPOIResultPresentation(
            poiId = "poi-1",
            resultIndex = 1,
            floorId = "floor-2",
            selected = true
        )

        assertTrue(selected.selecting(null).selected)
    }

    @Test
    fun selectingPreservesEveryOtherField() {
        val estimate = KozmosTravelEstimatePresentation(
            durationSeconds = 120.0,
            durationLabel = "2 min"
        )
        val result = KozmosPOIResultPresentation(
            poiId = "poi-1",
            resultIndex = 3,
            floorId = "floor-2",
            selected = false,
            featured = true,
            travelEstimate = estimate,
            available = false,
            unavailableReason = "Closed for maintenance"
        )

        val reselected = result.selecting("poi-1")

        assertEquals(3, reselected.resultIndex)
        assertTrue(reselected.featured)
        assertEquals("floor-2", reselected.floorId)
        assertEquals(estimate, reselected.travelEstimate)
        assertEquals(false, reselected.available)
        assertEquals("Closed for maintenance", reselected.unavailableReason)
    }

    // endregion

    // region Identifier parity with the web

    @Test
    fun resultIdentifierMatchesEncodeURIComponent() {
        assertEquals("poi-result-poi-1", kozmosPOIResultIdentifier("poi-1"))
        assertEquals("poi-result-a%20b", kozmosPOIResultIdentifier("a b"))
        assertEquals("poi-result-a%2Fb", kozmosPOIResultIdentifier("a/b"))
        assertEquals("poi-result-caf%C3%A9", kozmosPOIResultIdentifier("café"))
    }

    @Test
    fun resultIdentifierLeavesUnreservedCharactersIntact() {
        assertEquals("poi-result--_.!~*'()", kozmosPOIResultIdentifier("-_.!~*'()"))
    }

    // endregion

    // region Raw values shared with the other platforms

    @Test
    fun hyphenatedEnumValuesMatchTheSharedContract() {
        assertEquals("step-free", KozmosRoutePreference.StepFree.value)
        assertEquals("no-route", KozmosRouteReadiness.NoRoute.value)
        assertEquals("permission-denied", KozmosUserLocationState.PermissionDenied.value)
    }

    // endregion
}
