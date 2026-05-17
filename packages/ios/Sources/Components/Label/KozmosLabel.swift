import SwiftUI

public struct KozmosLabel: View {
    public init() {}
    
    public var body: some View {
        Text("Label")
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(8)
    }
}
