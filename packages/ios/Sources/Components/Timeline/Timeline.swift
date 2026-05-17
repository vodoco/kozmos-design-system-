import SwiftUI

public struct TimelineItem: Identifiable {
    public let id = UUID()
    public let time: String
    public let title: String
    public let description: String
    
    public init(time: String, title: String, description: String) {
        self.time = time
        self.title = title
        self.description = description
    }
}

public struct KozmosTimeline<Content: View>: View {
    let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing0) {
            content
        }
        .padding()
    }
}

public struct KozmosTimelineItem<Content: View>: View {
    let content: Content
    let isLast: Bool
    
    public init(isLast: Bool = false, @ViewBuilder content: () -> Content) {
        self.isLast = isLast
        self.content = content()
    }
    
    public var body: some View {
        HStack(alignment: .top, spacing: KozmosDimensions.primitivesLayoutSpacing200) {
            VStack(spacing: KozmosDimensions.primitivesLayoutSpacing0) {
                Circle()
                    .fill(KozmosColors.primitivesColorsTheme500)
                    .frame(width: 12, height: 12)
                    .background(
                        Circle()
                            .fill(KozmosColors.primitivesColorsTheme500.opacity(0.2))
                            .frame(width: KozmosDimensions.primitivesLayoutSizing300, height: KozmosDimensions.primitivesLayoutSizing300)
                    )
                
                if !isLast {
                    Rectangle()
                        .fill(KozmosColors.primitivesColorsBackground300)
                        .frame(width: 2)
                        .frame(maxHeight: .infinity)
                        .padding(.top, KozmosDimensions.primitivesLayoutSpacing50)
                }
            }
            .frame(width: KozmosDimensions.primitivesLayoutSizing300)
            
            VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing50) {
                content
            }
            .padding(.bottom, !isLast ? KozmosDimensions.primitivesLayoutSpacing400 : KozmosDimensions.primitivesLayoutSpacing0)
        }
        .fixedSize(horizontal: false, vertical: true)
    }
}

public struct KozmosTimelineTime: View {
    let time: String
    
    public init(_ time: String) {
        self.time = time
    }
    
    public var body: some View {
        Text(time)
            .font(.caption)
            .foregroundColor(KozmosColors.primitivesColorsForeground500)
    }
}

public struct KozmosTimelineTitle: View {
    let title: String
    
    public init(_ title: String) {
        self.title = title
    }
    
    public var body: some View {
        Text(title)
            .font(.headline)
            .foregroundColor(KozmosColors.primitivesColorsForeground100)
    }
}

public struct KozmosTimelineDescription: View {
    let description: String
    
    public init(_ description: String) {
        self.description = description
    }
    
    public var body: some View {
        Text(description)
            .font(.body)
            .foregroundColor(KozmosColors.primitivesColorsForeground500)
            .fixedSize(horizontal: false, vertical: true)
    }
}
