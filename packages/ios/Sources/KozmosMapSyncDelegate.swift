import Foundation
import QuartzCore

/// A standardized generic struct containing raw Apple Map engine constraints
public struct KozmosCameraState {
    public let pitch: Double
    public let bearing: Double
    public let zoom: Double
    public let isMoving: Bool
    
    public init(pitch: Double, bearing: Double, zoom: Double, isMoving: Bool) {
        self.pitch = pitch
        self.bearing = bearing
        self.zoom = zoom
        self.isMoving = isMoving
    }
}

/// A native iOS protocol. Have your Mapbox UIViewController conform to this 
/// and feed state changes back into your SwiftUI `UserLocationMarker` or Overlays!
public protocol KozmosMapSyncDelegate: AnyObject {
    func onCameraChanged(state: KozmosCameraState)
    func getIsometricTransform(state: KozmosCameraState) -> CATransform3D
}

public extension KozmosMapSyncDelegate {
    func getIsometricTransform(state: KozmosCameraState) -> CATransform3D {
        var transform = CATransform3DIdentity
        transform.m34 = -1.0 / 500.0 // Perspective projection
        // Reverses the bearing so the physical marker always faces "North" regardless of camera yaw
        transform = CATransform3DRotate(transform, CGFloat(-state.bearing * .pi / 180.0), 0, 0, 1)
        transform = CATransform3DRotate(transform, CGFloat(state.pitch * .pi / 180.0), 1, 0, 0)
        return transform
    }
}
