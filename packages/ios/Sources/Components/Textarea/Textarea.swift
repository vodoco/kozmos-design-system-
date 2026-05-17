import SwiftUI

public struct KozmosTextarea: View {
    @Binding var text: String
    let placeholder: String
    
    public init(text: Binding<String>, placeholder: String = "") {
        self._text = text
        self.placeholder = placeholder
    }
    
    public var body: some View {
        ZStack(alignment: .topLeading) {
            if text.isEmpty {
                Text(placeholder)
                    .foregroundColor(KozmosColors.primitivesColorsForeground500)
                    .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing100)
                    .padding(.vertical, KozmosDimensions.primitivesLayoutSpacing150)
            }
            
            TextEditor(text: $text)
                .frame(minHeight: 100)
                .padding(KozmosDimensions.primitivesLayoutSpacing50)
                .overlay(
                    RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100)
                        .stroke(KozmosColors.primitivesColorsForeground300, lineWidth: 1)
                )
        }
    }
}
