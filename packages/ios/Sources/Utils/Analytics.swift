import Foundation
import SwiftUI

/// A type-erased wrapper to cleanly support encoding mixed property dictionaries to JSON
public enum KozmosAnyCodable: Codable {
    case string(String)
    case int(Int)
    case double(Double)
    case bool(Bool)
    case null
    
    public init(_ value: Any?) {
        switch value {
        case let string as String: self = .string(string)
        case let int as Int: self = .int(int)
        case let double as Double: self = .double(double)
        case let bool as Bool: self = .bool(bool)
        default: self = .null
        }
    }
    
    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .string(let s): try container.encode(s)
        case .int(let i): try container.encode(i)
        case .double(let d): try container.encode(d)
        case .bool(let b): try container.encode(b)
        case .null: try container.encodeNil()
        }
    }
    
    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let b = try? container.decode(Bool.self) { self = .bool(b) }
        else if let i = try? container.decode(Int.self) { self = .int(i) }
        else if let d = try? container.decode(Double.self) { self = .double(d) }
        else if let s = try? container.decode(String.self) { self = .string(s) }
        else { self = .null }
    }
}

/// Defines the shape of our analytics events in iOS
public struct KozmosAnalyticsEvent: Codable, Identifiable {
    public let id: UUID
    public let eventName: String
    public let component: String
    public let timestamp: TimeInterval
    public let properties: [String: KozmosAnyCodable]?
    
    public init(eventName: String, component: String, properties: [String: Any]? = nil) {
        self.id = UUID()
        self.eventName = eventName
        self.component = component
        self.timestamp = Date().timeIntervalSince1970
        self.properties = properties?.mapValues { KozmosAnyCodable($0) }
    }
}

/// The main telemetry engine for Kozmos SwiftUI components
public class KozmosAnalytics: ObservableObject {
    @Published private(set) var queue: [KozmosAnalyticsEvent] = []
    
    private let onDispatch: (([KozmosAnalyticsEvent]) -> Void)?
    private let batchDelay: TimeInterval
    private var timer: Timer?
    
    public init(batchDelayMs: Int = 2000, onDispatch: (([KozmosAnalyticsEvent]) -> Void)? = nil) {
        self.batchDelay = TimeInterval(batchDelayMs) / 1000.0
        self.onDispatch = onDispatch
    }
    
    public func trackEvent(component: String, eventName: String, properties: [String: Any]? = nil) {
        let event = KozmosAnalyticsEvent(eventName: eventName, component: component, properties: properties)
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            
            self.queue.append(event)
            self.timer?.invalidate()
            self.timer = Timer.scheduledTimer(withTimeInterval: self.batchDelay, repeats: false) { [weak self] _ in
                self?.flushQueue()
            }
        }
    }
    
    public func flushQueue() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, !self.queue.isEmpty else { return }
            
            // Shallow copy elements to dispatch
            let eventsToDispatch = self.queue
            self.queue.removeAll()
            
            // Dispatch to the application layer delegate
            self.onDispatch?(eventsToDispatch)
        }
    }
    
    deinit {
        timer?.invalidate()
        flushQueue()
    }
}

/// View modifier to quickly inject the global analytics engine into the View hierarchy
public extension View {
    func kozmosAnalytics(batchDelayMs: Int = 2000, onDispatch: @escaping ([KozmosAnalyticsEvent]) -> Void) -> some View {
        self.environmentObject(KozmosAnalytics(batchDelayMs: batchDelayMs, onDispatch: onDispatch))
    }
}
