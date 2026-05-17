import SwiftUI

public struct KozmosProgress: View {
    let value: Double
    let total: Double
    
    public init(value: Double, total: Double = 1.0) {
        self.value = value
        self.total = total
    }
    
    public var body: some View {
        ProgressView(value: value, total: total)
            .progressViewStyle(LinearProgressViewStyle(tint: .blue))
    }
}
