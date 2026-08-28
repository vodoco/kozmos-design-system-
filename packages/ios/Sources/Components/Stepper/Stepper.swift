import SwiftUI

public struct KozmosStepper: View {
    let steps: [String]
    let currentStep: Int
    
    public init(steps: [String], currentStep: Int) {
        self.steps = steps
        self.currentStep = currentStep
    }
    
    public var body: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing0) {
            ForEach(0..<steps.count, id: \.self) { index in
                VStack(spacing: KozmosDimensions.primitivesLayoutSpacing50) {
                    ZStack {
                        Circle()
                            .stroke(index <= currentStep ? KozmosColors.primitivesColorsTheme500 : KozmosColors.primitivesColorsForeground400, lineWidth: 2)
                            .background(Circle().fill(index < currentStep ? KozmosColors.primitivesColorsTheme500 : Color.clear))
                            .frame(width: KozmosDimensions.primitivesLayoutSizing300, height: KozmosDimensions.primitivesLayoutSizing300)
                        
                        if index < currentStep {
                            Image(systemName: "checkmark")
                                .font(KozmosTypography.caption)
                                .fontWeight(.bold)
                                .foregroundColor(KozmosColors.primitivesColorsBackground0)
                        } else {
                            Text("\(index + 1)")
                                .font(KozmosTypography.caption)
                                .foregroundColor(index == currentStep ? KozmosColors.primitivesColorsTheme500 : KozmosColors.primitivesColorsForeground400)
                        }
                    }
                    
                    Text(steps[index])
                        .font(KozmosTypography.caption)
                        .foregroundColor(index == currentStep ? KozmosColors.primitivesColorsForeground100 : KozmosColors.primitivesColorsForeground500)
                }
                
                if index < steps.count - 1 {
                    Rectangle()
                        .fill(index < currentStep ? KozmosColors.primitivesColorsTheme500 : KozmosColors.primitivesColorsForeground300)
                        .frame(height: 1)
                        .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing50)
                }
            }
        }
    }
}
