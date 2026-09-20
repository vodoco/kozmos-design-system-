import SwiftUI

public enum DirectionType: Sendable {
    case straight, left, right, destination
    
    var iconName: String {
        switch self {
        case .straight: return "arrow.up"
        case .left: return "arrow.turn.up.left"
        case .right: return "arrow.turn.up.right"
        case .destination: return "mappin.and.ellipse"
        }
    }
}

public struct KozmosDirectionStep: View {
    let type: DirectionType
    let instruction: String
    let distance: String?
    let duration: String?
    
    public init(type: DirectionType, instruction: String, distance: String? = nil, duration: String? = nil) {
        self.type = type
        self.instruction = instruction
        self.distance = distance
        self.duration = duration
    }

    /// What VoiceOver reads for a step: the instruction, then the distance
    /// and the duration, as one element. The arrow says nothing the
    /// instruction does not, and a system symbol left audible reads its own
    /// description — "Up", or "Remove Map Pin" for the destination.
    static func accessibilityDescription(instruction: String, distance: String?, duration: String?) -> String {
        [instruction, distance, duration].compactMap { $0 }.filter { !$0.isEmpty }.joined(separator: ", ")
    }
    
    public var body: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing150) {
            Circle()
                .fill(KozmosColors.primitivesColorsTheme500.opacity(0.1))
                .frame(width: KozmosDimensions.primitivesLayoutSizing500, height: KozmosDimensions.primitivesLayoutSizing500)
                .overlay(
                    Image(systemName: type.iconName)
                        .foregroundColor(KozmosColors.primitivesColorsTheme500)
                )
                .accessibilityHidden(true)
            
            VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing25) {
                Text(instruction)
                    .font(KozmosTypography.body)
                    .fontWeight(.medium)
                
                if let dist = distance {
                    Text(dist + (duration != nil ? " • \(duration!)" : ""))
                        .font(KozmosTypography.caption)
                        .foregroundColor(KozmosColors.primitivesColorsForeground500)
                }
            }
            Spacer()
        }
        .padding()
        .background(KozmosColors.primitivesColorsBackground0)
        .cornerRadius(KozmosDimensions.primitivesLayoutSpacing150)
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutSpacing150)
                .stroke(KozmosColors.primitivesColorsBackground300, lineWidth: 1)
        )
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Self.accessibilityDescription(instruction: instruction, distance: distance, duration: duration))
    }
}
