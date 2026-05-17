import SwiftUI

public typealias KozmosAnalyticsTracker = (KozmosAnalyticsEvent) -> Void

public struct KozmosAnalyticsKey: EnvironmentKey {
    public static let defaultValue: KozmosAnalyticsTracker = { event in
        // Passive logging node capturing orphaned telemetry pipelines natively
        print("[Kozmos Analytics] \\(event.component) -> \\(event.eventName)")
    }
}

public extension EnvironmentValues {
    var kozmosAnalytics: KozmosAnalyticsTracker {
        get { self[KozmosAnalyticsKey.self] }
        set { self[KozmosAnalyticsKey.self] = newValue }
    }
}
