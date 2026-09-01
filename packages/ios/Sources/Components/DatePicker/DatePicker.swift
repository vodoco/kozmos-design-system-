import SwiftUI

public struct KozmosDatePicker: View {
    @Binding var selection: Date
    let label: String
    
    public init(selection: Binding<Date>, label: String = "") {
        self._selection = selection
        self.label = label
    }
    
    public var body: some View {
        DatePicker(label, selection: $selection, displayedComponents: .date)
            .datePickerStyle(.compact)
            .labelsHidden() // Often used inline
            .padding(KozmosDimensions.primitivesLayoutSpacing100)
            .background(KozmosColors.primitivesColorsBackground100)
            .cornerRadius(KozmosDimensions.semanticsRadiusControl)
    }
}
