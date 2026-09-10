import SwiftUI

public enum KozmosMapControlButtonPresentation {
    case iconOnly
    case labelled
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
    private let pressed: Bool
    private let isDisabled: Bool
    private let action: () -> Void

    public init(
        label: String,
        stateLabel: String? = nil,
        presentation: KozmosMapControlButtonPresentation = .iconOnly,
        pressed: Bool = false,
        isDisabled: Bool = false,
        action: @escaping () -> Void,
        @ViewBuilder icon: () -> Icon
    ) {
        self.label = label
        self.stateLabel = stateLabel
        self.presentation = presentation
        self.pressed = pressed
        self.isDisabled = isDisabled
        self.action = action
        self.icon = icon()
    }

    private var accessibleLabel: String {
        guard let stateLabel else { return label }
        return "\(label), \(stateLabel)"
    }

    private var foregroundColor: Color {
        pressed
            ? KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle
            : KozmosColors.primitivesColorsForeground100
    }

    private var backgroundColor: Color {
        pressed
            ? KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle
            : KozmosColors.primitivesColorsBackground0.opacity(0.9)
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                icon
                    .accessibilityHidden(true)

                if presentation == .labelled {
                    Text(label)
                        .font(.subheadline.weight(.medium))
                        .lineLimit(1)
                        .truncationMode(.tail)

                    if let stateLabel {
                        Text(stateLabel)
                            .font(.subheadline.weight(.semibold))
                            .lineLimit(1)
                    }
                }
            }
            .foregroundColor(foregroundColor)
            .frame(
                width: presentation == .iconOnly ? 44 : nil,
                height: 44
            )
            .frame(maxWidth: presentation == .labelled ? 256 : nil)
            .padding(.horizontal, presentation == .labelled ? KozmosDimensions.primitivesLayoutSpacing150 : 0)
            .background(backgroundColor)
            .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous)
                    .stroke(KozmosColors.primitivesColorsForeground300, lineWidth: 1)
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
        pressed: Bool = false,
        isDisabled: Bool = false,
        action: @escaping () -> Void
    ) {
        self.init(
            label: label,
            stateLabel: stateLabel,
            presentation: presentation,
            pressed: pressed,
            isDisabled: isDisabled,
            action: action
        ) {
            Image(systemName: systemImage)
        }
    }
}
