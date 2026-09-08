import SwiftUI

/// Layout of the floor selector, mirroring the React `FloorSelector.variant`.
public enum KozmosFloorSelectorVariant: String, CaseIterable, Sendable {
    case verticalList = "vertical-list"
    case horizontalList = "horizontal-list"
    case compactStepper = "compact-stepper"
}

/// Switches the active level of a venue.
///
/// Mirrors the React `FloorSelector` API. `selectedFloor` is the canonical
/// floor ID, never a display label, and the component reports selection rather
/// than deriving it.
///
/// Pass `[KozmosFloorPresentation]` so the button shows the level's
/// `shortLabel` while selection and analytics stay keyed on its `id`, and so
/// assistive technology hears the full `label`. The `[String]` initializer is
/// for venues whose IDs are already the labels — it shows each ID as-is.
public struct KozmosFloorSelector: View {
    let floors: [KozmosFloorPresentation]
    @Binding var selectedFloor: String
    let variant: KozmosFloorSelectorVariant
    let label: String
    @Environment(\.kozmosAnalytics) private var trackEvent

    public init(
        floors: [KozmosFloorPresentation],
        selectedFloor: Binding<String>,
        variant: KozmosFloorSelectorVariant = .verticalList,
        label: String = "Floor selector"
    ) {
        self.floors = floors
        self._selectedFloor = selectedFloor
        self.variant = variant
        self.label = label
    }

    /// For venues with no separate display label: the ID is rendered verbatim.
    public init(
        floors: [String],
        selectedFloor: Binding<String>,
        variant: KozmosFloorSelectorVariant = .verticalList,
        label: String = "Floor selector"
    ) {
        self.init(
            floors: floors.map {
                KozmosFloorPresentation(id: $0, label: $0, shortLabel: $0)
            },
            selectedFloor: selectedFloor,
            variant: variant,
            label: label
        )
    }

    private func select(_ floor: KozmosFloorPresentation) {
        guard !floor.disabled else { return }
        trackEvent(
            KozmosAnalyticsEvent(
                eventName: "floor_selected",
                component: "FloorSelector",
                properties: ["floor": floor.id]
            )
        )
        withAnimation { selectedFloor = floor.id }
    }

    var selectedIndex: Int {
        floors.firstIndex { $0.id == selectedFloor } ?? 0
    }

    private var selectedPresentation: KozmosFloorPresentation? {
        floors.first { $0.id == selectedFloor } ?? floors.first
    }

    public var body: some View {
        container
            .padding(KozmosDimensions.primitivesLayoutSpacing75)
            .background(KozmosColors.primitivesColorsBackground0.opacity(0.9))
            .cornerRadius(KozmosDimensions.semanticsRadiusPanel)
            .kozmosElevation(KozmosShadows.semanticsElevationFloating)
            .accessibilityElement(children: .contain)
            .accessibilityLabel(label)
    }

    @ViewBuilder
    private var container: some View {
        switch variant {
        case .verticalList:
            VStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                ForEach(floors) { floor in
                    floorButton(floor)
                }
            }
        case .horizontalList:
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                ForEach(floors) { floor in
                    floorButton(floor)
                }
            }
        case .compactStepper:
            VStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                stepperButton(systemImage: "chevron.up", step: -1, label: "Floor up")
                if let selectedPresentation {
                    floorButton(selectedPresentation)
                }
                stepperButton(systemImage: "chevron.down", step: 1, label: "Floor down")
            }
        }
    }

    private func floorButton(_ floor: KozmosFloorPresentation) -> some View {
        let isSelected = floor.id == selectedFloor
        return Button {
            select(floor)
        } label: {
            Text(floor.shortLabel)
                .font(KozmosTypography.subheadline)
                .bold()
                .frame(
                    width: KozmosDimensions.primitivesLayoutSizing500,
                    height: KozmosDimensions.primitivesLayoutSizing500
                )
                .background(isSelected ? KozmosColors.primitivesColorsTheme500 : Color.clear)
                .foregroundColor(
                    isSelected
                        ? KozmosColors.primitivesColorsBackground0
                        : KozmosColors.primitivesColorsForeground100
                )
                .cornerRadius(KozmosDimensions.semanticsRadiusPanel)
                // An unselected button is transparent, so without an explicit
                // hit shape only the glyph itself would accept a tap.
                .contentShape(
                    RoundedRectangle(
                        cornerRadius: KozmosDimensions.semanticsRadiusPanel,
                        style: .continuous
                    )
                )
        }
        .buttonStyle(.plain)
        .disabled(floor.disabled)
        .opacity(floor.disabled ? 0.4 : 1)
        // The button shows the short label; assistive technology gets the full
        // one, which is the only place the level is spelled out.
        .accessibilityLabel(floor.label)
        .accessibilityAddTraits(isSelected ? [.isButton, .isSelected] : .isButton)
    }

    /// The next selectable floor in list order, skipping any that are closed.
    func reachableIndex(step: Int) -> Int? {
        guard !floors.isEmpty else { return nil }
        var candidate = selectedIndex + step
        while floors.indices.contains(candidate) {
            if !floors[candidate].disabled { return candidate }
            candidate += step
        }
        return nil
    }

    /// Steps through the floor list. `step` is in list order, so -1 is the
    /// entry above the current one.
    private func stepperButton(systemImage: String, step: Int, label: String) -> some View {
        let target = reachableIndex(step: step)

        return Button {
            if let target { select(floors[target]) }
        } label: {
            Image(systemName: systemImage)
                .font(.system(size: 14, weight: .bold))
                .frame(
                    width: KozmosDimensions.primitivesLayoutSizing500,
                    height: KozmosDimensions.primitivesLayoutSizing500
                )
                .foregroundColor(KozmosColors.primitivesColorsForeground500)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .disabled(target == nil)
        .opacity(target == nil ? 0.4 : 1)
        .accessibilityLabel(label)
    }
}
