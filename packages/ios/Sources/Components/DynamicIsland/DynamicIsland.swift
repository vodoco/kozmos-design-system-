import SwiftUI

/// Abstract shape bridging the native ActivityKit Dynamic Island constraints.
public struct KozmosDynamicIsland<Expanded: View, CompactLeading: View, CompactTrailing: View, Minimal: View>: View {
    public enum IslandState {
        case compact
        case expanded
        case minimal
    }
    
    public let state: IslandState
    public let expandedContent: () -> Expanded
    public let compactLeading: () -> CompactLeading
    public let compactTrailing: () -> CompactTrailing
    public let minimalContent: () -> Minimal
    
    public init(
        state: IslandState = .compact,
        @ViewBuilder expandedContent: @escaping () -> Expanded,
        @ViewBuilder compactLeading: @escaping () -> CompactLeading,
        @ViewBuilder compactTrailing: @escaping () -> CompactTrailing,
        @ViewBuilder minimalContent: @escaping () -> Minimal
    ) {
        self.state = state
        self.expandedContent = expandedContent
        self.compactLeading = compactLeading
        self.compactTrailing = compactTrailing
        self.minimalContent = minimalContent
    }
    
    public var body: some View {
        ZStack {
            // Expanded
            if state == .expanded {
                expandedContent()
                    .padding()
                    .frame(width: 360, height: 160)
                    .background(Color.black)
                    .clipShape(RoundedRectangle(cornerRadius: 32, style: .continuous))
                    .transition(.scale.combined(with: .opacity))
            }
            
            // Compact Mode: a 240 × 44 capsule, as React and Compose draw it.
            // It was 36 high and as wide as its container until 2026-09-22.
            if state == .compact {
                HStack(spacing: 8) {
                    compactLeading()
                    Spacer()
                    compactTrailing()
                }
                .padding(.horizontal, 16)
                .frame(width: 240, height: 44)
                .background(Color.black)
                .clipShape(Capsule())
                .transition(.scale.combined(with: .opacity))
            }
            
            // Minimal Mode: a 56 circle, as React and Compose draw it (48
            // until 2026-09-22).
            if state == .minimal {
                minimalContent()
                    .frame(width: 56, height: 56)
                    .background(Color.black)
                    .clipShape(Circle())
                    .transition(.scale.combined(with: .opacity))
            }
        }
        .animation(.spring(response: 0.3, dampingFraction: 0.7, blendDuration: 0), value: state)
        .preferredColorScheme(.dark)
    }
}
