import SwiftUI

public struct KozmosText: View {
    let text: String
    
    public init(_ text: String) {
        self.text = text
    }
    
    public var body: some View {
        Text(text)
            .font(KozmosTypography.body)
    }
}
