import SwiftUI

public struct KozmosSpinner: View {
    public init() {}
    
    public var body: some View {
        ProgressView()
            .progressViewStyle(CircularProgressViewStyle(tint: .blue))
    }
}
