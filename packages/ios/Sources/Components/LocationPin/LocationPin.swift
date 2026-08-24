import SwiftUI

/// Colour role of a map marker, mirroring the React `LocationPin.variant` prop.
public enum KozmosLocationPinVariant: String, CaseIterable, Sendable {
    case `default`
    case primary
    case secondary
    case accent
}

/// Marker footprint, mirroring the React `LocationPin.size` prop.
public enum KozmosLocationPinSize: String, CaseIterable, Sendable {
    case sm
    case md
    case lg

    var diameter: CGFloat {
        switch self {
        case .sm: return 24
        case .md: return 32
        case .lg: return 40
        }
    }
}

/// Where the marker's label sits relative to the marker.
public enum KozmosLocationPinLabelPlacement: String, CaseIterable, Sendable {
    case top
    case right
    case bottom
    case left
}

/// A map marker for a point of interest.
///
/// Mirrors the React `LocationPin` API. Selection, featured, off-floor, and
/// disabled are independent flags rather than one state axis, matching React,
/// so a pin can be both featured and selected. Placement on the map and
/// collision handling stay with the renderer.
public struct KozmosLocationPin: View {
    private let variant: KozmosLocationPinVariant
    private let size: KozmosLocationPinSize
    private let label: String?
    private let number: Int?
    private let labelPlacement: KozmosLocationPinLabelPlacement
    private let selected: Bool
    private let featured: Bool
    private let offFloor: Bool
    private let isDisabled: Bool
    private let onSelect: (() -> Void)?

    public init(
        variant: KozmosLocationPinVariant = .primary,
        size: KozmosLocationPinSize = .md,
        label: String? = nil,
        number: Int? = nil,
        labelPlacement: KozmosLocationPinLabelPlacement = .bottom,
        selected: Bool = false,
        featured: Bool = false,
        offFloor: Bool = false,
        isDisabled: Bool = false,
        onSelect: (() -> Void)? = nil
    ) {
        self.variant = variant
        self.size = size
        self.label = label
        self.number = number
        self.labelPlacement = labelPlacement
        self.selected = selected
        self.featured = featured
        self.offFloor = offFloor
        self.isDisabled = isDisabled
        self.onSelect = onSelect
    }

    private var markerColor: Color {
        if featured { return KozmosColors.primitivesColorsEmotionalAlert500 }
        switch variant {
        case .default: return KozmosColors.primitivesColorsForeground100
        case .primary: return KozmosColors.primitivesColorsTheme500
        case .secondary: return KozmosColors.primitivesColorsForeground400
        case .accent: return KozmosColors.primitivesColorsThemeVariant1500
        }
    }

    /// Selected pins grow as well as recolor, so selection is not colour-only.
    private var diameter: CGFloat {
        selected ? size.diameter + 8 : size.diameter
    }

    private var accessibilityDescription: String {
        [
            label,
            number.map { "\($0)" },
            featured ? "Featured" : nil,
            offFloor ? "On another floor" : nil
        ]
        .compactMap { $0 }
        .joined(separator: ", ")
    }

    public var body: some View {
        content
            .opacity(isDisabled ? 0.5 : 1)
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(accessibilityDescription)
            .accessibilityAddTraits(accessibilityTraits)
            .accessibilityAction { if !isDisabled { onSelect?() } }
    }

    private var accessibilityTraits: AccessibilityTraits {
        guard !isDisabled, onSelect != nil else { return [] }
        return selected ? [.isButton, .isSelected] : .isButton
    }

    @ViewBuilder
    private var content: some View {
        switch labelPlacement {
        case .top:
            VStack(spacing: KozmosDimensions.primitivesLayoutSpacing50) {
                labelView
                marker
            }
        case .bottom:
            VStack(spacing: KozmosDimensions.primitivesLayoutSpacing50) {
                marker
                labelView
            }
        case .left:
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing50) {
                labelView
                marker
            }
        case .right:
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing50) {
                marker
                labelView
            }
        }
    }

    private var marker: some View {
        ZStack {
            // Off-floor pins invert to a hollow ring: the fill drops out and
            // the marker colour moves to the stroke. Shape carries the state,
            // so it is never colour-only, and a dashed stroke at this diameter
            // would read as a cogwheel rather than a dashed ring.
            Circle()
                .fill(offFloor ? KozmosColors.primitivesColorsBackground0 : markerColor)
                .frame(width: diameter, height: diameter)

            Circle()
                .strokeBorder(
                    offFloor ? markerColor : KozmosColors.primitivesColorsForeground1000,
                    lineWidth: offFloor ? 3 : 2
                )
                .frame(width: diameter, height: diameter)

            if let number {
                Text("\(number)")
                    .font(.system(size: diameter * 0.44, weight: .bold))
                    .foregroundColor(
                        offFloor ? markerColor : KozmosColors.primitivesColorsForeground1000
                    )
            }
        }
        .shadow(color: KozmosColors.primitivesColorsForeground900.opacity(0.24), radius: 4, y: 2)
    }

    @ViewBuilder
    private var labelView: some View {
        if let label {
            Text(label)
                .font(.caption.weight(.semibold))
                .foregroundColor(KozmosColors.primitivesColorsForeground100)
                .lineLimit(1)
        }
    }
}
