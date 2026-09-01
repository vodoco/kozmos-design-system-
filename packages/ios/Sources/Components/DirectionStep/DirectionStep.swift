import SwiftUI

public enum DirectionType {
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
    
    public var body: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing150) {
            Circle()
                .fill(KozmosColors.primitivesColorsTheme500.opacity(0.1))
                .frame(width: KozmosDimensions.primitivesLayoutSizing500, height: KozmosDimensions.primitivesLayoutSizing500)
                .overlay(
                    Image(systemName: type.iconName)
                        .foregroundColor(KozmosColors.primitivesColorsTheme500)
                )
            
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
    }
}
