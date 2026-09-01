import SwiftUI

/// Controlled state for a single POI action button.
public struct KozmosPOIActionState: Sendable, Hashable {
    public enum MessageTone: Sendable, Hashable {
        case status
        case error
    }

    public let disabled: Bool
    public let loading: Bool
    public let pressed: Bool
    public let message: String?
    public let messageTone: MessageTone

    public init(
        disabled: Bool = false,
        loading: Bool = false,
        pressed: Bool = false,
        message: String? = nil,
        messageTone: MessageTone = .status
    ) {
        self.disabled = disabled
        self.loading = loading
        self.pressed = pressed
        self.message = message
        self.messageTone = messageTone
    }
}

/// Full POI detail surface with media, actions, restrictions, and services.
///
/// Mirrors the React `POIDetailPanel`. Only the actions listed by
/// `poi.actions` are rendered, and every label is supplied already localized.
public struct KozmosPOIDetailPanel: View {
    public enum Presentation {
        case inline
        case sheet
        case panel
    }

    /// Heading rank of the POI name, mirroring the web `titleLevel` prop.
    /// Nesting the panel inside another titled surface should demote it to
    /// `.h3` so assistive technology reads a coherent outline.
    public enum TitleLevel {
        case h2
        case h3

        var accessibilityHeadingLevel: AccessibilityHeadingLevel {
            switch self {
            case .h2: return .h2
            case .h3: return .h3
            }
        }
    }

    private let poi: KozmosPOIPresentation
    private let actionLabels: [KozmosPOIAction: String]
    private let actionStates: [KozmosPOIAction: KozmosPOIActionState]
    private let closeLabel: String
    private let mediaLabel: String
    private let mediaPositionLabel: (Int, Int) -> String
    private let accessRestrictionsHeading: String
    private let servicesHeading: String
    private let presentation: Presentation
    private let titleLevel: TitleLevel
    private let onAction: (KozmosPOIAction, String) -> Void
    private let onClose: (() -> Void)?

    public init(
        poi: KozmosPOIPresentation,
        actionLabels: [KozmosPOIAction: String],
        onAction: @escaping (KozmosPOIAction, String) -> Void,
        actionStates: [KozmosPOIAction: KozmosPOIActionState] = [:],
        onClose: (() -> Void)? = nil,
        closeLabel: String = "Close details",
        mediaLabel: String? = nil,
        mediaPositionLabel: @escaping (Int, Int) -> String = { current, total in
            "Image \(current) of \(total)"
        },
        accessRestrictionsHeading: String = "Access restrictions",
        servicesHeading: String = "Service options",
        presentation: Presentation = .inline,
        titleLevel: TitleLevel = .h2
    ) {
        self.poi = poi
        self.actionLabels = actionLabels
        self.onAction = onAction
        self.actionStates = actionStates
        self.onClose = onClose
        self.closeLabel = closeLabel
        self.mediaLabel = mediaLabel ?? "\(poi.name) photos"
        self.mediaPositionLabel = mediaPositionLabel
        self.accessRestrictionsHeading = accessRestrictionsHeading
        self.servicesHeading = servicesHeading
        self.presentation = presentation
        self.titleLevel = titleLevel
    }

    private static func systemImage(for action: KozmosPOIAction) -> String {
        switch action {
        case .navigate: return "location.north.fill"
        case .favourite: return "heart"
        case .bookmark: return "bookmark"
        case .share: return "square.and.arrow.up"
        case .order: return "bag"
        }
    }

    private var showsAccessRestrictions: Bool {
        guard let accessRestrictions = poi.accessRestrictions else { return false }
        return accessRestrictions != KozmosPOIAccessRestrictions.none
            && poi.accessRestrictionsLabel != nil
    }

    public var body: some View {
        VStack(spacing: 0) {
            header

            Divider().overlay(KozmosColors.primitivesColorsForeground300)

            ScrollView {
                VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing200) {
                    if let description = poi.description {
                        Text(description)
                            .font(KozmosTypography.subheadline)
                            .foregroundColor(KozmosColors.primitivesColorsForeground500)
                            .fixedSize(horizontal: false, vertical: true)
                    }

                    if !poi.actions.isEmpty {
                        actionButtons
                    }

                    actionMessages

                    if showsAccessRestrictions, let accessRestrictionsLabel = poi.accessRestrictionsLabel {
                        Text(accessRestrictionsLabel)
                            .font(KozmosTypography.subheadline)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(KozmosDimensions.primitivesLayoutSpacing150)
                            .background(KozmosColors.primitivesColorsBackground100.opacity(0.4))
                            .clipShape(
                                RoundedRectangle(
                                    cornerRadius: KozmosDimensions.semanticsRadiusControl,
                                    style: .continuous
                                )
                            )
                            .overlay(
                                RoundedRectangle(
                                    cornerRadius: KozmosDimensions.semanticsRadiusControl,
                                    style: .continuous
                                )
                                .stroke(KozmosColors.primitivesColorsForeground300, lineWidth: 1)
                            )
                            .accessibilityElement(children: .combine)
                            .accessibilityLabel("\(accessRestrictionsHeading), \(accessRestrictionsLabel)")
                    }

                    KozmosPOIMediaGallery(
                        media: poi.media,
                        label: mediaLabel,
                        positionLabel: mediaPositionLabel
                    )

                    if let services = poi.services, !services.isEmpty {
                        services_(services)
                    }
                }
                .padding(KozmosDimensions.primitivesLayoutSpacing200)
            }
        }
        .frame(maxWidth: .infinity)
        .background(KozmosColors.primitivesColorsBackground0)
        .clipShape(panelShape)
        .overlay(
            panelShape.stroke(
                presentation == .sheet ? Color.clear : KozmosColors.primitivesColorsForeground300,
                lineWidth: 1
            )
        )
        .shadow(
            color: KozmosColors.primitivesColorsForeground900.opacity(presentation == .sheet ? 0 : 0.14),
            radius: presentation == .panel ? 20 : 12,
            x: 0,
            y: 8
        )
        .accessibilityElement(children: .contain)
        .accessibilityLabel(poi.name)
    }

    private var panelShape: KozmosPanelShape {
        KozmosPanelShape(
            radius: KozmosDimensions.semanticsRadiusPanel,
            roundsBottom: presentation != .sheet
        )
    }

    private var header: some View {
        HStack(alignment: .top, spacing: KozmosDimensions.primitivesLayoutSpacing150) {
            logo

            VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing50) {
                Text(poi.name)
                    .font(.title3.weight(.semibold))
                    .foregroundColor(KozmosColors.primitivesColorsForeground100)
                    .lineLimit(1)
                    .accessibilityAddTraits(.isHeader)
                    .accessibilityHeading(titleLevel.accessibilityHeadingLevel)

                HStack(spacing: KozmosDimensions.primitivesLayoutSpacing50) {
                    Image(systemName: "mappin.and.ellipse")
                        .font(KozmosTypography.footnote)
                        .accessibilityHidden(true)
                    Text(poi.locationLabel)
                        .font(KozmosTypography.subheadline)
                        .lineLimit(1)
                }
                .foregroundColor(KozmosColors.primitivesColorsForeground500)

                if let availabilityLabel = poi.availabilityLabel {
                    Text(availabilityLabel)
                        .font(.caption.weight(.semibold))
                        .foregroundColor(
                            poi.availability == .open
                                ? KozmosColors.componentsPrimaryButtonsSuccessButtonBackgroundIdle
                                : KozmosColors.primitivesColorsForeground500
                        )
                        .accessibilityLabel("Availability: \(availabilityLabel)")
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            if let onClose {
                KozmosIconButton(iconName: "xmark", action: onClose)
                    .accessibilityLabel(closeLabel)
            }
        }
        .padding(KozmosDimensions.primitivesLayoutSpacing200)
    }

    private var actionButtons: some View {
        // A wrapping row keeps long localized action names readable at large text sizes.
        FlowLayout(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
            ForEach(poi.actions, id: \.self) { action in
                let state = actionStates[action]
                let isToggle = action == .favourite || action == .bookmark

                KozmosButton(
                    actionLabels[action] ?? action.rawValue,
                    variant: action == .navigate ? .default : .outline,
                    isDisabled: state?.disabled ?? false,
                    isLoading: state?.loading ?? false
                ) {
                    onAction(action, poi.id)
                }
                .accessibilityLabel(actionLabels[action] ?? action.rawValue)
                .accessibilityAddTraits(
                    isToggle && (state?.pressed ?? false) ? [.isButton, .isSelected] : .isButton
                )
            }
        }
    }

    @ViewBuilder
    private var actionMessages: some View {
        ForEach(poi.actions.filter { actionStates[$0]?.message != nil }, id: \.self) { action in
            if let state = actionStates[action], let message = state.message {
                Text(message)
                    .font(KozmosTypography.subheadline)
                    .foregroundColor(
                        state.messageTone == .error
                            ? KozmosColors.primitivesColorsEmotionalDanger600
                            : KozmosColors.primitivesColorsForeground100
                    )
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing150)
                    .padding(.vertical, KozmosDimensions.primitivesLayoutSpacing100)
                    .background(KozmosColors.primitivesColorsBackground100)
                    .clipShape(
                        RoundedRectangle(
                            cornerRadius: KozmosDimensions.semanticsRadiusControl,
                            style: .continuous
                        )
                    )
                    .accessibilityAddTraits(.updatesFrequently)
            }
        }
    }

    private func services_(_ services: [KozmosPOIServicePresentation]) -> some View {
        VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing100) {
            Text(servicesHeading)
                .font(.subheadline.weight(.semibold))
                .accessibilityAddTraits(.isHeader)

            FlowLayout(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                ForEach(services) { service in
                    Text(service.label)
                        .font(KozmosTypography.subheadline)
                        .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing150)
                        .padding(.vertical, KozmosDimensions.primitivesLayoutSpacing100)
                        .background(KozmosColors.primitivesColorsBackground0)
                        .clipShape(Capsule())
                        .overlay(
                            Capsule().stroke(KozmosColors.primitivesColorsForeground300, lineWidth: 1)
                        )
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .contain)
        .accessibilityLabel(servicesHeading)
    }

    @ViewBuilder
    private var logo: some View {
        if let logo = poi.logo, let url = URL(string: logo.src) {
            AsyncImage(url: url) { image in
                image.resizable().aspectRatio(contentMode: .fit)
            } placeholder: {
                KozmosColors.primitivesColorsBackground100
            }
            .frame(width: 48, height: 48)
            .clipShape(
                RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous)
            )
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous)
                    .stroke(KozmosColors.primitivesColorsForeground300, lineWidth: 1)
            )
            .accessibilityLabel(logo.alt)
        } else {
            Text(poi.logoFallbackInitial)
                .font(.body.weight(.bold))
                .foregroundColor(KozmosColors.primitivesColorsForeground500)
                .frame(width: 48, height: 48)
                .background(KozmosColors.primitivesColorsBackground100)
                .clipShape(
                    RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous)
                )
                .accessibilityHidden(true)
        }
    }
}

/// Panel outline that can drop its bottom corners for sheet presentation.
///
/// `UnevenRoundedRectangle` would express this directly but is iOS 17+, and the
/// package deploys to iOS 16.
struct KozmosPanelShape: Shape {
    var radius: CGFloat
    var roundsBottom: Bool

    func path(in rect: CGRect) -> Path {
        let r = min(radius, min(rect.width, rect.height) / 2)
        let bottomR = roundsBottom ? r : 0

        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY + r))
        path.addArc(
            center: CGPoint(x: rect.minX + r, y: rect.minY + r),
            radius: r,
            startAngle: .degrees(180),
            endAngle: .degrees(270),
            clockwise: false
        )
        path.addLine(to: CGPoint(x: rect.maxX - r, y: rect.minY))
        path.addArc(
            center: CGPoint(x: rect.maxX - r, y: rect.minY + r),
            radius: r,
            startAngle: .degrees(270),
            endAngle: .degrees(0),
            clockwise: false
        )
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY - bottomR))

        if bottomR > 0 {
            path.addArc(
                center: CGPoint(x: rect.maxX - bottomR, y: rect.maxY - bottomR),
                radius: bottomR,
                startAngle: .degrees(0),
                endAngle: .degrees(90),
                clockwise: false
            )
        }

        path.addLine(to: CGPoint(x: rect.minX + bottomR, y: rect.maxY))

        if bottomR > 0 {
            path.addArc(
                center: CGPoint(x: rect.minX + bottomR, y: rect.maxY - bottomR),
                radius: bottomR,
                startAngle: .degrees(90),
                endAngle: .degrees(180),
                clockwise: false
            )
        }

        path.closeSubpath()
        return path
    }
}

/// Minimal wrapping layout used for action and service chips.
///
/// SwiftUI has no built-in flow container, and these rows must wrap rather than
/// clip when localized labels or Dynamic Type make them wide.
struct FlowLayout: Layout {
    var spacing: CGFloat

    init(spacing: CGFloat = 8) {
        self.spacing = spacing
    }

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? .infinity
        let rows = layoutRows(maxWidth: maxWidth, subviews: subviews)
        let height = rows.reduce(into: CGFloat.zero) { total, row in
            total += row.height
        } + spacing * CGFloat(max(rows.count - 1, 0))
        let width = rows.map(\.width).max() ?? 0
        return CGSize(width: min(width, maxWidth), height: height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let rows = layoutRows(maxWidth: bounds.width, subviews: subviews)
        var y = bounds.minY

        for row in rows {
            var x = bounds.minX
            for index in row.indices {
                let size = subviews[index].sizeThatFits(.unspecified)
                subviews[index].place(
                    at: CGPoint(x: x, y: y),
                    proposal: ProposedViewSize(size)
                )
                x += size.width + spacing
            }
            y += row.height + spacing
        }
    }

    private struct Row {
        var indices: [Int] = []
        var width: CGFloat = 0
        var height: CGFloat = 0
    }

    private func layoutRows(maxWidth: CGFloat, subviews: Subviews) -> [Row] {
        var rows: [Row] = []
        var current = Row()

        for index in subviews.indices {
            let size = subviews[index].sizeThatFits(.unspecified)
            let projected = current.indices.isEmpty ? size.width : current.width + spacing + size.width

            if projected > maxWidth, !current.indices.isEmpty {
                rows.append(current)
                current = Row()
                current.indices = [index]
                current.width = size.width
                current.height = size.height
            } else {
                current.indices.append(index)
                current.width = projected
                current.height = max(current.height, size.height)
            }
        }

        if !current.indices.isEmpty { rows.append(current) }
        return rows
    }
}
