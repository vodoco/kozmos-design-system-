import SwiftUI

public struct KozmosContainer<Content: View>: View {
    let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        content
            .padding()
            .frame(maxWidth: .infinity, alignment: .topLeading)
    }
}
