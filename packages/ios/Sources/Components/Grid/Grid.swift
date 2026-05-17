import SwiftUI

public struct Grid<Content: View>: View {
    let cols: Int
    let spacing: CGFloat
    let content: Content
    
    public init(
        cols: Int = 2,
        spacing: CGFloat = 16,
        @ViewBuilder content: () -> Content
    ) {
        self.cols = cols
        self.spacing = spacing
        self.content = content()
    }
    
    public var body: some View {
        let columns = Array(repeating: GridItem(.flexible(), spacing: spacing), count: cols)
        
        LazyVGrid(columns: columns, spacing: spacing) {
            content
        }
    }
}
