import SwiftUI

public struct KozmosLink: View {
    let label: String
    let destination: URL
    
    public init(_ label: String, destination: URL) {
        self.label = label
        self.destination = destination
    }
    
    public var body: some View {
        Link(label, destination: destination)
            .foregroundColor(KozmosColors.primitivesColorsTheme500)
    }
}
