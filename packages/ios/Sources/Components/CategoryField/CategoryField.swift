import SwiftUI

/// The search field's form once a quick-access category is chosen — the
/// prototype's, measured: a 48-tall, control-radius field in the category's
/// colour at 12 % with a 1-point border of it, the category's icon at 28 in
/// the colour, its name at 15 semibold in the foreground, a 22-tall count
/// pill filled with the colour, and a 32 clear at the trailing edge with its
/// cross in the foreground. It takes the field's place in the search row, so
/// its width is the row's to give. The name and the cross are in the
/// foreground because the category colour on its own wash fails 4.5:1 for
/// seven of the eight tints (Olcay, 2026-09-21); the icon is decorative, the
/// name says what it shows.
///
/// Mirrors the React `CategoryField`.
public struct KozmosCategoryField<Icon: View>: View {
    private let label: String
    private let count: Int?
    /// The count's spoken form; the host pluralises and localises it.
    private let countLabel: (Int) -> String
    private let tint: KozmosCategoryTint
    private let clearLabel: String
    private let onClear: () -> Void
    private let icon: Icon

    public init(
        label: String,
        count: Int? = nil,
        countLabel: @escaping (Int) -> String = { "\($0) places" },
        tint: KozmosCategoryTint = KozmosCategoryTint(accent: KozmosColors.primitivesColorsTheme500, fill: KozmosInkedFill(fill: KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle, ink: KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle)),
        clearLabel: String = "Clear category",
        onClear: @escaping () -> Void,
        @ViewBuilder icon: () -> Icon
    ) {
        self.label = label
        self.count = count
        self.countLabel = countLabel
        self.tint = tint
        self.clearLabel = clearLabel
        self.onClear = onClear
        self.icon = icon()
    }

    static var height: CGFloat { 48 }
    static var iconSize: CGFloat { 28 }
    static var pillHeight: CGFloat { 22 }
    static var clearSize: CGFloat { 32 }

    public var body: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
            icon
                .frame(width: Self.iconSize, height: Self.iconSize)
                .foregroundColor(tint.accent)
                .accessibilityHidden(true)
            Text(label)
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(KozmosColors.primitivesColorsForeground0)
                .lineLimit(1)
            if let count {
                Text("\(count)")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(tint.fill.ink)
                    .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing75)
                    .frame(minWidth: Self.pillHeight, minHeight: Self.pillHeight)
                    .background(Capsule().fill(tint.fill.fill))
                    .accessibilityLabel(countLabel(count))
            }
            Spacer(minLength: 0)
            Button(action: onClear) {
                Image(systemName: "xmark")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(KozmosColors.primitivesColorsForeground0)
                    .frame(width: Self.clearSize, height: Self.clearSize)
                    .contentShape(Circle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel(clearLabel)
        }
        .padding(.leading, KozmosDimensions.primitivesLayoutSpacing150)
        .padding(.trailing, KozmosDimensions.primitivesLayoutSpacing100)
        .frame(height: Self.height)
        .background(tint.accent.opacity(0.12))
        .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous)
                .strokeBorder(tint.accent, lineWidth: 1)
        )
        .accessibilityElement(children: .contain)
        .accessibilityLabel(count.map { "\(label), \(countLabel($0))" } ?? label)
    }
}
