import SwiftUI

public struct KozmosSearch: View {
    @Binding var text: String
    let placeholder: String
    
    public init(text: Binding<String>, placeholder: String = "Search") {
        self._text = text
        self.placeholder = placeholder
    }
    
    public var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(KozmosColors.primitivesColorsForeground400)
            
            TextField(placeholder, text: $text)
        }
        .padding(EdgeInsets(top: KozmosDimensions.primitivesLayoutSpacing100, leading: KozmosDimensions.primitivesLayoutSpacing150, bottom: KozmosDimensions.primitivesLayoutSpacing100, trailing: KozmosDimensions.primitivesLayoutSpacing150))
        .background(KozmosColors.primitivesColorsBackground0)
        .cornerRadius(KozmosDimensions.primitivesLayoutRadius100)
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100)
                .stroke(KozmosColors.primitivesColorsForeground300, lineWidth: 1)
        )
    }
}
