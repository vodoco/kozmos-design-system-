import SwiftUI

public enum KozmosMapControlButtonPresentation {
    case iconOnly
    case labelled
}

/// How an active map control reads.
///
/// `tinted` keeps the map surface and colours the icon and the edge, which is
/// what the SDK draws — a control over a map has to stay legible against the
/// tiles behind it, and a solid fill hides the very thing it sits on.
/// `filled` is the inverted treatment this component shipped before
/// 2026-09-15, kept for callers that want the heavier emphasis.
public enum KozmosMapControlButtonEmphasis {
    case tinted
    case filled
}

/// Where a control's state sits relative to its label.
///
/// `inline` runs them along one line. `stacked` sets the state under the
/// label, which is how a map pill fits a two-word state into a control that
/// has to stay thumb-sized.
public enum KozmosMapControlButtonLabelPlacement {
    case inline
    case stacked
}

/// What a map control's state resolves to, before any colour is chosen.
///
/// Kept apart from the view because this decision is the part a design ruling
/// changes — tinted became the default on 2026-09-15 — and it can be tested
/// without rendering anything.
struct KozmosMapControlButtonAppearance: Equatable {
    enum Surface: Equatable { case chrome, filled }
    enum Tone: Equatable { case ink, muted, theme, onFill }
    enum Edge: Equatable { case subtle, theme }

    let surface: Surface
    let icon: Tone
    let label: Tone
    /// The small line above a stacked state. Muted on the map's surface, but on
    /// a filled one a muted grey would sit at about 1.9:1 against the theme.
    let caption: Tone
    let edge: Edge

    init(pressed: Bool, emphasis: KozmosMapControlButtonEmphasis) {
        switch (pressed, emphasis) {
        case (true, .filled):
            surface = .filled
            icon = .onFill
            label = .onFill
            caption = .onFill
            edge = .subtle
        case (true, .tinted):
            // Only the glyph and the edge take the theme, so the label keeps
            // its contrast against a surface that stays the map's.
            surface = .chrome
            icon = .theme
            label = .ink
            caption = .muted
            edge = .theme
        case (false, _):
            surface = .chrome
            icon = .ink
            label = .ink
            caption = .muted
            edge = .subtle
        }
    }
}

/// A single floating map control.
///
/// Mirrors the React `MapControlButton`. `label` is the localized action name
/// and always becomes the accessible name; `stateLabel` is appended so screen
/// reader users hear the current state without relying on visual styling.
public struct KozmosMapControlButton<Icon: View>: View {
    private let icon: Icon
    private let label: String
    private let stateLabel: String?
    private let presentation: KozmosMapControlButtonPresentation
    private let emphasis: KozmosMapControlButtonEmphasis
    private let labelPlacement: KozmosMapControlButtonLabelPlacement
    private let pressed: Bool
    private let isDisabled: Bool
    private let action: () -> Void

    /// Someone who has asked iOS to reduce motion still needs to read the new
    /// state; they just should not watch the control grow to show it.
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    public init(
        label: String,
        stateLabel: String? = nil,
        presentation: KozmosMapControlButtonPresentation = .iconOnly,
        emphasis: KozmosMapControlButtonEmphasis = .tinted,
        labelPlacement: KozmosMapControlButtonLabelPlacement = .inline,
        pressed: Bool = false,
        isDisabled: Bool = false,
        action: @escaping () -> Void,
        @ViewBuilder icon: () -> Icon
    ) {
        self.label = label
        self.stateLabel = stateLabel
        self.presentation = presentation
        self.emphasis = emphasis
        self.labelPlacement = labelPlacement
        self.pressed = pressed
        self.isDisabled = isDisabled
        self.action = action
        self.icon = icon()
    }

    private var accessibleLabel: String {
        guard let stateLabel else { return label }
        return "\(label), \(stateLabel)"
    }

    var appearance: KozmosMapControlButtonAppearance {
        KozmosMapControlButtonAppearance(pressed: pressed, emphasis: emphasis)
    }

    private func color(_ tone: KozmosMapControlButtonAppearance.Tone) -> Color {
        switch tone {
        case .ink:
            return KozmosColors.primitivesColorsForeground100
        case .muted:
            return KozmosColors.primitivesColorsForeground400
        case .theme:
            return KozmosColors.primitivesColorsTheme600
        case .onFill:
            return KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle
        }
    }

    private var backgroundColor: Color {
        appearance.surface == .filled
            ? KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle
            : KozmosColors.primitivesColorsBackground0.opacity(0.9)
    }

    private var borderColor: Color {
        appearance.edge == .theme
            ? KozmosColors.primitivesColorsTheme600
            : KozmosColors.primitivesColorsForeground300
    }

    @ViewBuilder
    private var labelContent: some View {
        if presentation == .labelled {
            if labelPlacement == .stacked {
                VStack(alignment: .leading, spacing: 0) {
                    // The SDK sets these at 11pt over 13pt semibold. The type
                    // scale has no role at either size yet, so this reaches for
                    // the nearest roles and the deviation is recorded in the
                    // gap list rather than hard-coded here.
                    Text(label)
                        .font(KozmosTypography.caption)
                        .foregroundColor(color(appearance.caption))
                        .lineLimit(1)
                        .truncationMode(.tail)

                    if let stateLabel {
                        Text(stateLabel)
                            .font(KozmosTypography.footnote)
                            .fontWeight(.semibold)
                            .lineLimit(1)
                    }
                }
            } else {
                Text(label)
                    .font(KozmosTypography.subheadline)
                    .fontWeight(.medium)
                    .lineLimit(1)
                    .truncationMode(.tail)

                if let stateLabel {
                    Text(stateLabel)
                        .font(KozmosTypography.subheadline)
                        .fontWeight(.semibold)
                        .lineLimit(1)
                }
            }
        }
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                icon
                    .foregroundColor(color(appearance.icon))
                    .accessibilityHidden(true)

                labelContent
            }
            .foregroundColor(color(appearance.label))
            .frame(
                width: presentation == .iconOnly ? 44 : nil,
                height: 44
            )
            .frame(maxWidth: presentation == .labelled ? 256 : nil)
            .padding(.horizontal, presentation == .labelled ? KozmosDimensions.primitivesLayoutSpacing150 : 0)
            .background(backgroundColor)
            .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous)
                    .stroke(borderColor, lineWidth: 1)
            )
            .kozmosElevation(
                pressed
                    ? KozmosShadows.semanticsElevationRaised
                    : KozmosShadows.semanticsElevationFloating
            )
        }
        .buttonStyle(.plain)
        .disabled(isDisabled)
        .opacity(isDisabled ? 0.5 : 1)
        .animation(reduceMotion ? nil : .easeInOut(duration: 0.3), value: presentation == .labelled)
        .accessibilityLabel(accessibleLabel)
        .accessibilityAddTraits(pressed ? [.isButton, .isSelected] : .isButton)
    }
}

public extension KozmosMapControlButton where Icon == Image {
    /// Convenience initializer for SF Symbol artwork.
    init(
        label: String,
        systemImage: String,
        stateLabel: String? = nil,
        presentation: KozmosMapControlButtonPresentation = .iconOnly,
        emphasis: KozmosMapControlButtonEmphasis = .tinted,
        labelPlacement: KozmosMapControlButtonLabelPlacement = .inline,
        pressed: Bool = false,
        isDisabled: Bool = false,
        action: @escaping () -> Void
    ) {
        self.init(
            label: label,
            stateLabel: stateLabel,
            presentation: presentation,
            emphasis: emphasis,
            labelPlacement: labelPlacement,
            pressed: pressed,
            isDisabled: isDisabled,
            action: action
        ) {
            Image(systemName: systemImage)
        }
    }
}
