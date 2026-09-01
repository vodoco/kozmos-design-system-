import SwiftUI

public struct KozmosRating: View {
    @Binding var value: Int
    let max: Int
    let readOnly: Bool
    
    public init(value: Binding<Int>, max: Int = 5, readOnly: Bool = false) {
        self._value = value
        self.max = max
        self.readOnly = readOnly
    }
    
    public var body: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing50) {
            ForEach(1...max, id: \.self) { index in
                Image(systemName: index <= value ? "star.fill" : "star")
                    .foregroundColor(index <= value ? KozmosColors.semanticsDataYellow : KozmosColors.primitivesColorsForeground400)
                    .font(KozmosTypography.title2)
                    .onTapGesture {
                        if !readOnly {
                            withAnimation {
                                value = index
                            }
                        }
                    }
            }
        }
    }
}
