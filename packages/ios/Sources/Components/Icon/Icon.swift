import SwiftUI

public struct Icon: View {
    let name: String
    
    public init(_ name: String) {
        self.name = name
    }
    
    public var body: some View {
        Image(systemName: name)
    }
}
