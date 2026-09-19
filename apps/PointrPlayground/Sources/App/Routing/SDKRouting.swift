import CoreLocation
import MapLibre
import PointrKit
import Kozmos
import UIKit

/// Routing on the QA host: a route between two places the visitor names.
///
/// There is no visitor position in this milestone — location, motion and
/// Bluetooth permissions are declined — so a route starts where the visitor
/// says it does, and "directions" are stepped through by hand. Nothing here
/// is live navigation, and nothing calls itself that. The SDK calculates and
/// draws the route; the host owns the flow and the framing.
extension SDKSession {
    // MARK: - Setup

    /// Go on the card.
    func startRouteSetup() {
        guard selected != nil else { return }
        calculationTask?.cancel()
        originQuery = ""
        origin = nil
        routeStatus = .idle
        routeMessage = nil
        phase = .routeSetup
    }

    /// Where a route can start: this building's places, except the destination.
    var originCandidates: [PTRPoi] {
        let needle = originQuery.trimmingCharacters(in: .whitespacesAndNewlines)
        return pois
            .filter { $0.identifier != selected?.identifier && (needle.isEmpty || $0.name.localizedCaseInsensitiveContains(needle)) }
            .sorted { $0.name.localizedStandardCompare($1.name) == .orderedAscending }
    }

    func chooseOrigin(_ id: String) {
        guard let poi = pois.first(where: { $0.identifier == id }), let destination = selected else { return }
        origin = poi
        calculateRoutes(from: poi, to: destination)
    }

    func cancelRouteSetup() {
        calculationTask?.cancel()
        phase = .browse
    }

    // MARK: - Calculation

    /// Two calculations, one per mode: the mode is a manager-wide setting, so
    /// it is set before each and put back after. The SDK calculates
    /// synchronously; cancellation takes effect between the two and after
    /// them, not inside one.
    func calculateRoutes(from origin: PTRPoi, to destination: PTRPoi) {
        calculationTask?.cancel()
        phase = .routePreview
        routeStatus = .calculating
        routeMessage = nil
        quickestRoute = nil
        stepFreeRoute = nil
        sdkRoutes = [:]
        calculationTask = Task { @MainActor [weak self] in
            guard let self else { return }
            guard let manager = Pointr.shared.wayfindingManager,
                  let site = destination.position.site ?? building?.site,
                  manager.isReady(for: site) else {
                routeStatus = .error
                routeMessage = "Routing data for this site hasn't finished loading. Try again in a moment."
                return
            }
            let started = Date()
            let normal = calculate(manager, from: origin, to: destination, mode: .normal)
            guard !Task.isCancelled else { return }
            let accessible = calculate(manager, from: origin, to: destination, mode: .accessible)
            manager.setCurrentMode(.normal)
            guard !Task.isCancelled else { return }
            let elapsed = Int(Date().timeIntervalSince(started) * 1000)
            log.notice("route \(origin.name, privacy: .public) → \(destination.name, privacy: .public): quickest \(normal.map { "\(Int($0.walkingDistance)) m, \(Int($0.travelTime)) s, \($0.directions.count) steps" } ?? "none", privacy: .public); step-free \(accessible.map { "\(Int($0.walkingDistance)) m, \(Int($0.travelTime)) s, \($0.directions.count) steps" } ?? "none", privacy: .public); \(elapsed, privacy: .public) ms")
            // Every step, for whoever is checking the venue's routing data.
            for (name, route) in [("quickest", normal), ("step-free", accessible)] {
                for (index, direction) in (route?.directions ?? []).enumerated() {
                    let accessible = direction.transitionInfo.map { String($0.isAccessible) } ?? "-"
                    let transition = direction.transitionInfo.map { "\($0.mainType)/\($0.subType) icon \($0.iconId)" } ?? "-"
                    log.debug("\(name, privacy: .public) step \(index, privacy: .public): type \(direction.messageType.rawValue, privacy: .public) \(direction.message, privacy: .public) · \(Int(direction.distance), privacy: .public) m \(Int(direction.duration), privacy: .public) s · \(direction.position.level?.name ?? "-", privacy: .public) · transition \(direction.isTransition, privacy: .public) \(transition, privacy: .public) accessible \(accessible, privacy: .public)")
                }
            }
            quickestRoute = normal.map(SDKRoute.init)
            stepFreeRoute = accessible.map(SDKRoute.init)
            sdkRoutes = [SDKRoutePresenter.OptionID.quickest: normal, SDKRoutePresenter.OptionID.stepFree: accessible]
                .compactMapValues { $0 }
            guard quickestRoute != nil || stepFreeRoute != nil else {
                routeStatus = .noRoute
                routeMessage = "No route was found between these places."
                return
            }
            selectedOptionId = quickestRoute != nil ? SDKRoutePresenter.OptionID.quickest : SDKRoutePresenter.OptionID.stepFree
            routeStatus = .ready
            showRoute()
        }
    }

    /// The not-ready state's recovery: the same request again.
    func retryRouteCalculation() {
        guard let origin, let destination = selected else { return }
        calculateRoutes(from: origin, to: destination)
    }

    private func calculate(_ manager: any PTRWayfindingManagerInterface, from origin: PTRPoi, to destination: PTRPoi,
                           mode: PTRWayfindingMode) -> PTRRoute? {
        manager.setCurrentMode(mode)
        return manager.calculateRoute(fromPosition: origin, toNearestPositionIn: [destination])
    }

    // MARK: - Preview

    var selectedRoute: SDKRoute? {
        selectedOptionId == SDKRoutePresenter.OptionID.stepFree ? stepFreeRoute : quickestRoute
    }

    var routeOptions: [KozmosRouteOptionPresentation] {
        SDKRoutePresenter.options(quickest: quickestRoute, stepFree: stepFreeRoute, selected: selectedOptionId)
    }

    var selectedRouteAnnouncement: String? {
        guard routeStatus == .ready, let option = routeOptions.first(where: { $0.id == selectedOptionId }) else { return nil }
        return "\(option.label) route selected. \(option.durationLabel), \(option.distanceLabel)."
    }

    func selectRouteOption(_ id: String) {
        guard sdkRoutes[id] != nil else { return }
        selectedOptionId = id
        showRoute()
    }

    /// Draw the chosen route, show its first level, and fit it to the map.
    private func showRoute() {
        guard let map = widget?.mapViewController, let sdkRoute = sdkRoutes[selectedOptionId], let route = selectedRoute else { return }
        framesSelection = false
        map.currentRoute = sdkRoute
        if let level = origin?.position.level, SDKPOIAdapter.floorId(level) != selectedFloorId {
            updateLevel(level)
            map.showLevel(level, shouldZoomToLevel: false)
        }
        applyCameraPadding(animated: false)
        framesRoute = true
        fitRoute(route)
    }

    /// The whole route in view, inside the chrome the shell reported. The
    /// map's own padding already carries the chrome, so only a margin is
    /// added here; MapLibre accumulates the two.
    func fitRoute(_ route: SDKRoute) {
        guard let map = widget?.mapViewController.mapLibreView, let first = route.coordinates.first else { return }
        var southWest = first, northEast = first
        for coordinate in route.coordinates {
            southWest.latitude = min(southWest.latitude, coordinate.latitude)
            southWest.longitude = min(southWest.longitude, coordinate.longitude)
            northEast.latitude = max(northEast.latitude, coordinate.latitude)
            northEast.longitude = max(northEast.longitude, coordinate.longitude)
        }
        let margin: CGFloat = 24
        let camera = map.cameraThatFitsCoordinateBounds(
            MLNCoordinateBounds(sw: southWest, ne: northEast),
            edgePadding: UIEdgeInsets(top: margin, left: margin, bottom: margin, right: margin))
        map.setCamera(camera, animated: true)
    }

    // MARK: - Directions, stepped by hand

    func showDirections() {
        guard routeStatus == .ready, selectedRoute != nil else { return }
        stepIndex = 0
        phase = .directions
        showStep()
    }

    func advanceStep() {
        guard let route = selectedRoute, stepIndex < route.steps.count - 1 else { return }
        stepIndex += 1
        showStep()
    }

    func rewindStep() {
        guard stepIndex > 0 else { return }
        stepIndex -= 1
        showStep()
    }

    /// The level a step happens on, from the SDK's route.
    func stepFloorLabel(_ index: Int) -> String? {
        let directions = sdkRoutes[selectedOptionId]?.directions ?? []
        guard directions.indices.contains(index) else { return nil }
        return directions[index].position.level?.name
    }

    /// The map follows the step: its level, then its position at a reading zoom.
    private func showStep() {
        guard let route = selectedRoute, route.steps.indices.contains(stepIndex), let map = widget?.mapViewController else { return }
        let directions = sdkRoutes[selectedOptionId]?.directions ?? []
        if directions.indices.contains(stepIndex), let level = directions[stepIndex].position.level,
           SDKPOIAdapter.floorId(level) != selectedFloorId {
            updateLevel(level)
            map.showLevel(level, shouldZoomToLevel: false)
        }
        framesRoute = false
        map.mapLibreView.setCenter(route.steps[stepIndex].coordinate, zoomLevel: 19, animated: true)
    }

    // MARK: - Ending

    /// Back from the preview, End route, Finish: the route comes off the map
    /// and the card returns, framed as it was.
    func endRoute() {
        resetRouting()
        phase = .browse
        if let selected { frame(selected) }
    }

    /// Route state to nothing, without touching the selection. Called when
    /// the selection itself changes or closes.
    func resetRouting() {
        calculationTask?.cancel()
        calculationTask = nil
        widget?.mapViewController.currentRoute = nil
        framesRoute = false
        sdkRoutes = [:]
        quickestRoute = nil
        stepFreeRoute = nil
        selectedOptionId = SDKRoutePresenter.OptionID.quickest
        routeStatus = .idle
        routeMessage = nil
        stepIndex = 0
        origin = nil
        originQuery = ""
        phase = .browse
    }
}

extension SDKSession: PTRWayfindingManagerDelegate {
    @objc(onWayfindingManagerReadyForSite:)
    nonisolated func onWayfindingManagerReady(for site: PTRSite) {
        Task { @MainActor in
            self.wayfindingReady = true
            self.log.notice("wayfinding ready for \(site.name, privacy: .public), \(self.millisecondsSinceStart, privacy: .public) ms after start")
            if SDKRoutePresenter.retriesOnReadiness(phase: self.phase, status: self.routeStatus) { self.retryRouteCalculation() }
        }
    }
}
