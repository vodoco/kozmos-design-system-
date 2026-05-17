import SwiftUI

public struct KozmosList<Content: View>: View {
    let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        List {
            content
        }
        .listStyle(PlainListStyle())
    }
}

public struct KozmosListItem: View {
    let text: String
    
    public init(_ text: String) {
        self.text = text
    }
    
    public var body: some View {
        Text(text)
    }
}
