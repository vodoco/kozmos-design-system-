import SwiftUI

public struct KozmosNavbar: View {
    let title: String
    let leading: AnyView?
    let trailing: AnyView?
    
    public init<L: View, T: View>(
        title: String,
        @ViewBuilder leading: () -> L,
        @ViewBuilder trailing: () -> T
    ) {
        self.title = title
        self.leading = AnyView(leading())
        self.trailing = AnyView(trailing())
    }
    
    public init(title: String) {
        self.title = title
        self.leading = nil
        self.trailing = nil
    }
    
    public var body: some View {
        HStack {
            if let leading = leading {
                leading
            }
            Spacer()
            Text(title)
                .font(.headline)
            Spacer()
            if let trailing = trailing {
                trailing
            }
        }
        .padding()
        .background(KozmosColors.primitivesColorsBackground0)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(KozmosColors.primitivesColorsBackground300),
            alignment: .bottom
        )
    }
}
