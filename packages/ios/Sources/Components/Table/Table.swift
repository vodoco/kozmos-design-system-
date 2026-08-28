import SwiftUI

public struct KozmosTable<Data: RandomAccessCollection, RowContent: View>: View where Data.Element: Identifiable {
    let data: Data
    let rowContent: (Data.Element) -> RowContent
    
    public init(_ data: Data, @ViewBuilder rowContent: @escaping (Data.Element) -> RowContent) {
        self.data = data
        self.rowContent = rowContent
    }
    
    public var body: some View {
        VStack(spacing: KozmosDimensions.primitivesLayoutSpacing0) {
            ForEach(data) { item in
                VStack(spacing: KozmosDimensions.primitivesLayoutSpacing0) {
                    rowContent(item)
                    Divider()
                }
            }
        }
        .background(KozmosColors.primitivesColorsBackground0)
        .cornerRadius(KozmosDimensions.semanticsRadiusControl)
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl)
                .stroke(KozmosColors.primitivesColorsBackground300, lineWidth: 1)
        )
    }
}

public struct KozmosTableRow<Content: View>: View {
    let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        HStack {
            content
        }
        .padding()
    }
}

public struct KozmosTableCell: View {
    let text: String
    
    public init(_ text: String) {
        self.text = text
    }
    
    public var body: some View {
        Text(text)
            .frame(maxWidth: .infinity, alignment: .leading)
    }
}
