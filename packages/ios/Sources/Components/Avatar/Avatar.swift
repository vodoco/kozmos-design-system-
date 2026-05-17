import SwiftUI

public struct KozmosAvatar: View {
    let imageURL: URL?
    let fallbackText: String
    
    public init(imageURL: URL?, fallbackText: String) {
        self.imageURL = imageURL
        self.fallbackText = fallbackText
    }
    
    public var body: some View {
        Group {
            if let imageURL = imageURL {
                AsyncImage(url: imageURL) { image in
                    image.resizable()
                } placeholder: {
                    Text(fallbackText)
                        .font(.headline)
                        .foregroundColor(KozmosColors.primitivesColorsBackground0)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(KozmosColors.primitivesColorsBackground500)
                }
            } else {
                Text(fallbackText)
                    .font(.headline)
                    .foregroundColor(KozmosColors.primitivesColorsBackground0)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(KozmosColors.primitivesColorsBackground500)
            }
        }
        .frame(width: KozmosDimensions.primitivesLayoutSizing500, height: KozmosDimensions.primitivesLayoutSizing500)
        .clipShape(Circle())
    }
}
