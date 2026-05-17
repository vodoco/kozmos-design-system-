import SwiftUI

public struct Node: Identifiable, Hashable {
    public let id = UUID()
    public let value: String
    public let children: [Node]?
    
    public init(value: String, children: [Node]? = nil) {
        self.value = value
        self.children = children
    }
}

public struct KozmosTree: View {
    let nodes: [Node]
    
    public init(nodes: [Node]) {
        self.nodes = nodes
    }
    
    public var body: some View {
        List(nodes, children: \.children) { node in
            HStack {
                if node.children != nil {
                   Image(systemName: "folder")
                        .foregroundColor(KozmosColors.primitivesColorsTheme500)
                } else {
                    Image(systemName: "doc")
                        .foregroundColor(.gray)
                }
                Text(node.value)
            }
        }
    }
}
