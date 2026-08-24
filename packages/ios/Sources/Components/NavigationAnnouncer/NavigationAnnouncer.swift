import SwiftUI

#if canImport(UIKit)
import UIKit
#endif

public struct KozmosNavigationAnnouncer: View {
    private let message: String
    private let isActive: Bool

    public init(message: String, isActive: Bool = true) {
        self.message = message
        self.isActive = isActive
    }

    public var body: some View {
        Group {
            #if canImport(UIKit)
            AccessibilityAnnouncementPoster(message: message, isActive: isActive)
                .frame(width: 0, height: 0)
                .accessibilityHidden(true)
            #else
            Text(isActive ? message : "")
                .frame(width: 0, height: 0)
                .opacity(0)
                .accessibilityHidden(!isActive || message.isEmpty)
            #endif
        }
    }
}

#if canImport(UIKit)
private struct AccessibilityAnnouncementPoster: UIViewRepresentable {
    let message: String
    let isActive: Bool

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: .zero)
        view.isAccessibilityElement = false
        return view
    }

    func updateUIView(_ uiView: UIView, context: Context) {
        guard isActive, !message.isEmpty else {
            context.coordinator.lastMessage = ""
            return
        }

        guard context.coordinator.lastMessage != message else {
            return
        }

        context.coordinator.lastMessage = message
        UIAccessibility.post(notification: .announcement, argument: message)
    }

    final class Coordinator {
        var lastMessage = ""
    }
}
#endif
