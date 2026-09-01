import SwiftUI

public struct KozmosCard<Content: View>: View {
    let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing0) {
            content
        }
        .background(KozmosColors.primitivesColorsBackground0)
        .cornerRadius(KozmosDimensions.semanticsRadiusContainer)
        .shadow(color: KozmosColors.primitivesColorsBackground900.opacity(0.1), radius: 4, x: 0, y: 2)
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusContainer)
                .stroke(KozmosColors.primitivesColorsBackground200, lineWidth: 1)
        )
    }
}

public struct KozmosCardHeader<Content: View>: View {
    let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing100) {
            content
        }
        .padding(KozmosDimensions.primitivesLayoutSpacing300)
    }
}

public struct KozmosCardTitle: View {
    let title: String
    
    public init(_ title: String) {
        self.title = title
    }
    
    public var body: some View {
        Text(title)
            .font(KozmosTypography.title3)
            .fontWeight(.semibold)
            .foregroundColor(KozmosColors.primitivesColorsForeground100)
    }
}

public struct KozmosCardDescription: View {
    let description: String
    
    public init(_ description: String) {
        self.description = description
    }
    
    public var body: some View {
        Text(description)
            .font(KozmosTypography.subheadline)
            .foregroundColor(KozmosColors.primitivesColorsForeground400)
    }
}

public struct KozmosCardContent<Content: View>: View {
    let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing0) {
            content
        }
        .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing300)
        .padding(.bottom, KozmosDimensions.primitivesLayoutSpacing300)
    }
}

public struct KozmosCardFooter<Content: View>: View {
    let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        HStack(alignment: .center, spacing: KozmosDimensions.primitivesLayoutSpacing0) {
            content
        }
        .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing300)
        .padding(.bottom, KozmosDimensions.primitivesLayoutSpacing300)
    }
}
