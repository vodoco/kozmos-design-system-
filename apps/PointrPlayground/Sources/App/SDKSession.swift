import SwiftUI
import PointrKit
import Kozmos
import os

struct QAConfiguration: Decodable {
    let baseUrl: String
    let clientIdentifier: String
    let licenseKey: String
    let siteId: String
    let buildingId: String

    static func load() throws -> Self {
        guard let url = Bundle.main.url(forResource: "QAConfig", withExtension: "json") else {
            throw ConfigurationError.missing
        }
        return try decode(Data(contentsOf: url))
    }
    static func decode(_ data: Data) throws -> Self {
        let result = try JSONDecoder().decode(Self.self, from: data)
        guard let url = URL(string: result.baseUrl), url.host == "design-qa-v10.pointr.cloud",
              url.scheme == "https", url.user == nil, url.password == nil,
              url.query == nil, url.fragment == nil, url.port == nil,
              ["", "/"].contains(url.path),
              !result.clientIdentifier.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
              !result.licenseKey.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
              UUID(uuidString: result.siteId) != nil,
              UUID(uuidString: result.buildingId) != nil else { throw ConfigurationError.invalid }
        return result
    }
    enum ConfigurationError: Error { case missing, invalid }
}

/// Owns SDK state at the app boundary. Kozmos never imports PointrKit.
@MainActor
final class SDKSession: NSObject, ObservableObject, PointrStateChangeListener, PTRMapEventsListener, PTRPoiManagerDelegate, PTRDataManagerDelegate, PTRPermissionManagerDelegate {
    @Published private(set) var status = "Connecting to Design-QA…"
    @Published private(set) var failure: String?
    @Published private(set) var widget: PTRMapWidgetViewController?
    @Published private(set) var building: PTRBuilding?
    @Published private(set) var pois: [PTRPoi] = []
    @Published private(set) var selected: PTRPoi?
    /// The selected place mapped for the card, with the contact addresses the
    /// host keeps and the diagnostics it logs.
    @Published private(set) var selectedDetails: SDKPOIDetails?
    /// What the card shows on a contact action after it was tried.
    @Published private(set) var actionStates: [String: KozmosPOIActionState] = [:]
    @Published private(set) var selectedFloorId = ""
    @Published private(set) var poiDataReady = false
    @Published var query = ""
    @Published var saved = Set<String>()
    @Published var favourites = Set<String>()
    private var configuration: QAConfiguration?
    private let log = Logger(subsystem: "com.kozmos.pointrqa", category: "poi")
    /// What the shell's chrome covers, as it last reported it.
    private var chromeInsets = KozmosMapCollisionInsets.zero
    /// Whether the selected place is still framed the way `focusPoi` leaves
    /// it. Moving the map — a pan, a pinch, a rotation, the zoom buttons —
    /// hands the camera to the visitor.
    private var framesSelection = false
    private var started = false
    private var loadingBuilding = false
    private var buildingTask: Task<Void, Never>?
    private var generation = UUID()

    func start() {
        guard !started else { return }
        started = true
        do { configuration = try .load() } catch {
            failure = "QA configuration is missing or invalid. Run the local setup script."
            return
        }
        guard let configuration else { return }
        let requestGeneration = generation
        // Browse-only milestone: do not request location/motion permissions.
        Pointr.shared.permissionManager?.delegate = self
        Pointr.shared.addListener(self)
        let params = PTRParams()
        params.baseUrl = configuration.baseUrl
        params.clientIdentifier = configuration.clientIdentifier
        params.licenseKey = configuration.licenseKey
        params.mode = PointrDebugMode()
        params.loggerLevel = .error
        Pointr.shared.start(with: params) { [weak self] state in
            Task { @MainActor in
                guard self?.generation == requestGeneration else { return }
                self?.handle(state)
            }
        }
    }

    func stop() {
        generation = UUID()
        buildingTask?.cancel()
        buildingTask = nil
        widget?.removeListener(self)
        Pointr.shared.poiManager?.removeListener(self)
        Pointr.shared.dataManager?.removeListener(self)
        Pointr.shared.removeListener(self)
        Pointr.shared.permissionManager?.delegate = nil
        Pointr.shared.stop()
        widget = nil
        building = nil
        selected = nil
        selectedDetails = nil
        actionStates = [:]
        framesSelection = false
        pois = []
        poiDataReady = false
        loadingBuilding = false
        started = false
    }

    func retry() {
        stop()
        failure = nil
        status = "Connecting to Design-QA…"
        start()
    }

    nonisolated func pointrStateDidChange(to state: PointrState) {
        Task { @MainActor in self.handle(state) }
    }

    private func handle(_ state: PointrState) {
        Pointr.shared.permissionManager?.delegate = self
        status = PTRPointrStateToString(state)
        switch state {
        case .running:
            guard !loadingBuilding, widget == nil else { return }
            loadingBuilding = true
            buildingTask = Task { await loadBuilding() }
        case .failedNoInternet: failure = "The SDK could not connect. Check network access."
        case .failedRegistration, .failedValidation: failure = "Design-QA rejected native SDK registration or license validation."
        default: break
        }
    }

    private func loadBuilding() async {
        guard let config = configuration, let manager = Pointr.shared.siteManager else { return }
        let result = await manager.buildings(forSiteId: config.siteId)
        guard !Task.isCancelled else { return }
        guard let target = result.0.first(where: { $0.identifier == config.buildingId }) else {
            failure = "The selected QA building is unavailable to this SDK client."
            loadingBuilding = false
            return
        }
        building = target
        selectedFloorId = SDKPOIAdapter.floorId(target.defaultLevel ?? target.levels.first)
        let policy = SDKMapPolicy.make()
        let controller = PTRMapWidgetViewController(location: target.mapWidgetLocation, configuration: policy)
        controller.addListener(self)
        widget = controller
        Pointr.shared.poiManager?.addListener(self)
        Pointr.shared.dataManager?.addListener(self)
        Pointr.shared.dataManager?.loadData(forSite: config.siteId)
        refreshPOIs()
        status = "Loading map…"
    }

    func refreshPOIs() {
        guard let building else { return }
        pois = Pointr.shared.poiManager?.pois(for: building)?.getPoiList() ?? []
        poiDataReady = Pointr.shared.dataManager?.isContentReady(forSite: building.site.identifier) ?? false
    }

    func select(_ poi: PTRPoi) {
        selected = poi
        let details = SDKPOIAdapter.details(poi)
        selectedDetails = details
        actionStates = [:]
        // What the data did not let the card show, for whoever is testing
        // the venue's content. Place content, never configuration.
        for issue in details.issues { log.notice("\(poi.name, privacy: .public): \(issue, privacy: .public)") }
        if let level = poi.position.level { updateLevel(level) }
        widget?.mapViewController.highlightPoi(poi)
        // Padding first: `focusPoi` centres the place in whatever viewport
        // the map has when it is called.
        applyCameraPadding(animated: false)
        framesSelection = true
        widget?.mapViewController.focusPoi(poi, shouldZoom: true)
    }
    func closeSelection() { clearSelection(animated: true) }
    func selectFloor(_ id: String) {
        guard let level = building?.levels.first(where: { SDKPOIAdapter.floorId($0) == id }) else { return }
        updateLevel(level)
        // Not animated: the level's own camera move follows immediately.
        clearSelection(animated: false)
        widget?.mapViewController.showLevel(level, shouldZoomToLevel: true)
    }
    /// A contact action from the card. The address was validated when the
    /// place was mapped; the device decides whether it can open it — a
    /// simulator has no phone — and the card is told either way.
    func perform(action: String, poiId: String) {
        guard selected?.identifier == poiId, let contact = selectedDetails?.contacts[action] else { return }
        let url = contact.url
        guard UIApplication.shared.canOpenURL(url) else {
            let what: String
            switch contact {
            case .website: what = "Websites can't be opened on this device."
            case .call: what = "Calling isn't available on this device."
            case .email: what = "Email isn't set up on this device."
            }
            actionStates[action] = .init(message: what, messageTone: .status)
            return
        }
        actionStates[action] = .init(loading: true)
        UIApplication.shared.open(url) { [weak self] opened in
            self?.actionStates[action] = opened ? .init() : .init(message: "That couldn't be opened.", messageTone: .error)
        }
    }

    private func clearSelection(animated: Bool) {
        selected = nil
        selectedDetails = nil
        actionStates = [:]
        framesSelection = false
        widget?.mapViewController.unhighlightPoi()
        applyCameraPadding(animated: animated)
    }

    /// The shell reports its chrome after every settled layout change: the
    /// sheet, the keyboard, the window.
    ///
    /// A padding change re-centres the map on whatever is at its centre, and
    /// cancels a camera move in flight. Measured: the sheet settling while
    /// `focusPoi` was flying ended the flight at its starting zoom, and the
    /// place was left off-centre. Until the visitor moves the map, a selected
    /// place is focused again in the new viewport instead. The visitor can only
    /// change the zoom by pinching or with the buttons, and either ends the
    /// framing, so focusing with zoom never undoes their zoom.
    func setChromeInsets(_ insets: KozmosMapCollisionInsets) {
        chromeInsets = insets
        guard applyCameraPadding(animated: false), framesSelection, let selected else { return }
        widget?.mapViewController.focusPoi(selected, shouldZoom: true)
    }
    /// Returns whether the padding changed.
    @discardableResult
    private func applyCameraPadding(animated: Bool) -> Bool {
        guard let map = widget?.mapViewController.mapLibreView else { return false }
        let inset = SDKCameraPadding.contentInset(
            chrome: chromeInsets, mapHeight: map.bounds.height, hasSelection: selected != nil)
        guard inset != map.contentInset else { return false }
        if animated {
            map.setContentInset(inset, animated: true, completionHandler: nil)
        } else {
            map.contentInset = inset
        }
        return true
    }
    private func updateLevel(_ level: PTRLevel) {
        let changedBuilding = building?.identifier != level.building.identifier
        building = level.building
        selectedFloorId = SDKPOIAdapter.floorId(level)
        if changedBuilding { refreshPOIs() }
    }
    func zoom(_ delta: Double) {
        framesSelection = false
        guard let map = widget?.mapViewController else { return }
        map.setZoomLevel(min(map.maximumZoomLevel, max(map.minimumZoomLevel, map.zoomLevel + delta)), animated: true)
    }

    // The visitor moving the map. Measured on Design-QA: a pan reports
    // `mapDidReceivePan`, a pinch `didZoom`, and a `focusPoi` flight neither.
    nonisolated func mapDidReceivePan(_ map: PTRMapViewController) {
        Task { @MainActor in self.framesSelection = false }
    }
    nonisolated func map(_ map: PTRMapViewController, didZoom zoomValue: Double) {
        Task { @MainActor in self.framesSelection = false }
    }
    nonisolated func mapDidReceiveSignificantRotationGesture(_ map: PTRMapViewController) {
        Task { @MainActor in self.framesSelection = false }
    }

    nonisolated func map(_ map: PTRMapViewController, didReceiveTapOnFeature feature: PTRFeature) {
        Task { @MainActor in
            if let poi = feature as? PTRPoi { self.select(poi) }
            else if let poi = self.pois.first(where: { $0.identifier == feature.identifier }) { self.select(poi) }
        }
    }
    nonisolated func map(_ map: PTRMapViewController, didChangeLevel level: PTRLevel) {
        Task { @MainActor in self.updateLevel(level) }
    }
    nonisolated func mapDidEndLoading(_ map: PTRMapViewController) {
        Task { @MainActor in self.status = "Ready"; self.refreshPOIs() }
    }
    nonisolated func map(_ map: PTRMapViewController, didFailToLoadWith error: Error) {
        Task { @MainActor in self.failure = "The map could not load. Check QA availability and try again." }
    }
    @objc(onPoiManagerChangedPoisForSite:)
    nonisolated func onPoiManagerChangedPois(for site: PTRSite) {
        Task { @MainActor in self.refreshPOIs() }
    }
    @objc(onDataManagerReadyForSite:)
    nonisolated func onDataManagerReady(for site: PTRSite) {
        Task { @MainActor in self.refreshPOIs() }
    }
    nonisolated func permissionManagerShouldRequestLocationAuthorizationPermissionForWhenInUse(_ permissionManager: any PTRPermissionManagerInterface) -> Bool { false }
    nonisolated func permissionManagerShouldRequestLocationAuthorizationPermissionForAlways(_ permissionManager: any PTRPermissionManagerInterface) -> Bool { false }
    nonisolated func permissionManagerShouldRequestCoreMotionAuthorizationPermission(_ permissionManager: any PTRPermissionManagerInterface) -> Bool { false }
    nonisolated func permissionManagerShouldRequestBluetoothServicesPermission(_ permissionManager: any PTRPermissionManagerInterface) -> Bool { false }
    nonisolated func permissionManagerShouldRequestBluetoothAuthorizationPermission(_ permissionManager: any PTRPermissionManagerInterface) -> Bool { false }
}

enum SDKMapPolicy {
    static func make() -> PTRMapWidgetConfiguration {
        let policy = PTRMapWidgetConfiguration.mapOnlyConfiguration()
        // Explicit ownership of every non-map control, even if preset defaults change.
        policy.isSearchEnabled = false
        policy.isPoiDetailViewEnabled = false
        policy.isRouteSummaryEnabled = false
        policy.isWayfindingHeaderViewEnabled = false
        policy.isWayfindingFooterViewEnabled = false
        policy.isLevelSelectorEnabled = false
        policy.isMapTrackingModeButtonEnabled = false
        policy.isExitButtonEnabled = false
        policy.isSplashScreenEnabled = false
        policy.isOnboardingEnabled = false
        policy.isJoystickEnabled = false
        policy.isToastMessagesEnabled = false
        policy.isInfoButtonEnabled = false
        policy.isLocationIndicatorEnabled = false
        policy.isQuickAccessEnabled = false
        policy.isAppBannerEnabled = false
        policy.isMarkMyCarEnabled = false
        policy.isLoadingViewEnabled = false
        policy.shouldFocusOnFirstUserPosition = false
        return policy
    }
}
