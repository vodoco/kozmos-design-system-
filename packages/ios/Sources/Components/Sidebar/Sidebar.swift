import SwiftUI

public enum KozmosSidebarVariant {
    case expanded
    case rail
}

public struct KozmosSidebar<Content: View>: View {
    let variant: KozmosSidebarVariant
    let header: AnyView?
    let content: Content
    let tools: AnyView?
    let footer: AnyView?

    public init(
        variant: KozmosSidebarVariant = .expanded,
        @ViewBuilder content: () -> Content
    ) {
        self.variant = variant
        self.header = nil
        self.content = content()
        self.tools = nil
        self.footer = nil
    }

    public init<Header: View, Tools: View, Footer: View>(
        variant: KozmosSidebarVariant = .expanded,
        @ViewBuilder header: () -> Header,
        @ViewBuilder navigation: () -> Content,
        @ViewBuilder tools: () -> Tools,
        @ViewBuilder footer: () -> Footer
    ) {
        self.variant = variant
        self.header = AnyView(header())
        self.content = navigation()
        self.tools = AnyView(tools())
        self.footer = AnyView(footer())
    }

    public var body: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing0) {
            VStack(alignment: stackAlignment, spacing: KozmosDimensions.primitivesLayoutSpacing200) {
                if let header = header {
                    header
                        .frame(maxWidth: .infinity, alignment: contentAlignment)
                }

                ScrollView {
                    content
                        .frame(maxWidth: .infinity, alignment: contentAlignment)
                }
                .frame(maxHeight: .infinity)

                if let tools = tools {
                    tools
                        .frame(maxWidth: .infinity, alignment: contentAlignment)
                }

                if let footer = footer {
                    footer
                        .frame(maxWidth: .infinity, alignment: contentAlignment)
                }
            }
            .padding(.horizontal, horizontalPadding)
            .padding(.vertical, KozmosDimensions.primitivesLayoutSpacing300)
            .frame(width: width)
            .frame(maxHeight: .infinity)
            .background(KozmosColors.primitivesColorsBackground0)
            .overlay(
                Rectangle()
                    .frame(width: 1)
                    .foregroundColor(KozmosColors.primitivesColorsBackground300),
                alignment: .trailing
            )

            Spacer()
        }
    }

    private var width: CGFloat {
        variant == .rail ? 80 : 256
    }

    private var horizontalPadding: CGFloat {
        variant == .rail ? KozmosDimensions.primitivesLayoutSpacing100 : KozmosDimensions.primitivesLayoutSpacing200
    }

    private var stackAlignment: HorizontalAlignment {
        variant == .rail ? .center : .leading
    }

    private var contentAlignment: Alignment {
        variant == .rail ? .center : .leading
    }
}
