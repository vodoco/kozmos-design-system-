import SwiftUI

public struct KozmosCombobox: View {
    @Binding public var value: String
    @Binding public var inputValue: String
    public let options: [KozmosListboxOption]
    public let label: String?
    public let placeholder: String
    public let disabled: Bool
    public let readOnly: Bool
    public let status: KozmosInputStatus
    public let error: Bool
    public let helperText: String?
    public let errorMessage: String?
    public let emptyText: String
    public let clearable: Bool

    @State private var isOpen: Bool

    public init(
        value: Binding<String> = .constant(""),
        inputValue: Binding<String> = .constant(""),
        options: [KozmosListboxOption],
        label: String? = nil,
        placeholder: String = "Select option",
        disabled: Bool = false,
        readOnly: Bool = false,
        status: KozmosInputStatus = .default,
        error: Bool = false,
        helperText: String? = nil,
        errorMessage: String? = nil,
        emptyText: String = "No results found",
        clearable: Bool = true,
        defaultOpen: Bool = false
    ) {
        self._value = value
        self._inputValue = inputValue
        self.options = options
        self.label = label
        self.placeholder = placeholder
        self.disabled = disabled
        self.readOnly = readOnly
        self.status = status
        self.error = error
        self.helperText = helperText
        self.errorMessage = errorMessage
        self.emptyText = emptyText
        self.clearable = clearable
        self._isOpen = State(initialValue: defaultOpen)
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing75) {
            if let label = label {
                Text(label)
                    .font(.subheadline.weight(.semibold))
                    .foregroundColor(labelColor)
            }

            HStack(spacing: 0) {
                TextField(placeholder, text: $inputValue)
                    .disabled(disabled || readOnly)
                    .font(.subheadline)
                    .foregroundColor(textColor)
                    .padding(.leading, KozmosDimensions.primitivesLayoutSpacing150)
                    .frame(height: 44)
                    .onTapGesture {
                        if !disabled && !readOnly { isOpen = true }
                    }
                    .onChange(of: inputValue) { _ in
                        if !disabled && !readOnly { isOpen = true }
                    }

                if clearable && !inputValue.isEmpty && !disabled && !readOnly {
                    Button(action: clearSelection) {
                        Image(systemName: "xmark")
                            .font(.subheadline.weight(.semibold))
                            .frame(width: 36, height: 44)
                    }
                    .buttonStyle(.plain)
                    .foregroundColor(KozmosColors.primitivesColorsForeground500)
                    .accessibilityLabel("Clear selection")
                }

                Button(action: toggleOpen) {
                    Image(systemName: "chevron.down")
                        .font(.subheadline.weight(.semibold))
                        .rotationEffect(.degrees(isOpen ? 180 : 0))
                        .frame(width: 44, height: 44)
                }
                .buttonStyle(.plain)
                .disabled(disabled || readOnly)
                .foregroundColor(KozmosColors.primitivesColorsForeground500)
                .accessibilityLabel(isOpen ? "Close options" : "Open options")
            }
            .frame(maxWidth: .infinity, minHeight: 44, maxHeight: 44)
            .background(fieldBackgroundColor)
            .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100))
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100)
                    .stroke(fieldBorderColor, lineWidth: 1)
            )

            if isOpen {
                if filteredOptions.isEmpty {
                    Text(emptyText)
                        .font(.subheadline)
                        .foregroundColor(KozmosColors.primitivesColorsForeground500)
                        .padding(KozmosDimensions.primitivesLayoutSpacing150)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(KozmosColors.primitivesColorsBackground0)
                        .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100))
                        .overlay(
                            RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100)
                                .stroke(KozmosColors.primitivesColorsForeground500, lineWidth: 1)
                        )
                } else {
                    KozmosListbox(
                        options: filteredOptions,
                        selectedValues: listboxSelection,
                        multiple: false,
                        disabled: disabled,
                        maxHeight: 256
                    ) { nextValues, option in
                        value = nextValues.first ?? ""
                        inputValue = option.label
                        isOpen = false
                    }
                }
            }

            if let supportingText = supportingText, !supportingText.isEmpty {
                Text(supportingText)
                    .font(.subheadline)
                    .foregroundColor(supportingTextColor)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var filteredOptions: [KozmosListboxOption] {
        let query = inputValue.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        guard !query.isEmpty else { return options }
        return options.filter { option in
            option.label.lowercased().contains(query)
                || option.value.lowercased().contains(query)
                || (option.description?.lowercased().contains(query) ?? false)
        }
    }

    private var listboxSelection: Binding<[String]> {
        Binding(get: { value.isEmpty ? [] : [value] }, set: { value = $0.first ?? "" })
    }

    private func toggleOpen() {
        guard !disabled, !readOnly else { return }
        isOpen.toggle()
    }

    private func clearSelection() {
        value = ""
        inputValue = ""
        isOpen = false
    }

    private var effectiveStatus: KozmosInputStatus {
        error ? .error : status
    }

    private var supportingText: String? {
        errorMessage ?? helperText
    }

    private var fieldBackgroundColor: Color {
        (disabled || readOnly) ? KozmosColors.primitivesColorsBackground100 : KozmosColors.primitivesColorsBackground0
    }

    private var fieldBorderColor: Color {
        switch effectiveStatus {
        case .error:
            return KozmosColors.primitivesColorsEmotionalDanger600
        case .warning:
            return KozmosColors.primitivesColorsEmotionalAlert600
        case .success:
            return KozmosColors.primitivesColorsEmotionalSuccess600
        case .default:
            return KozmosColors.primitivesColorsForeground500
        }
    }

    private var labelColor: Color {
        if disabled { return KozmosColors.primitivesColorsForeground500 }
        switch effectiveStatus {
        case .error:
            return KozmosColors.primitivesColorsEmotionalDanger600
        case .warning:
            return KozmosColors.primitivesColorsEmotionalAlert600
        case .success:
            return KozmosColors.primitivesColorsEmotionalSuccess600
        case .default:
            return KozmosColors.primitivesColorsForeground100
        }
    }

    private var supportingTextColor: Color {
        if disabled { return KozmosColors.primitivesColorsForeground500 }
        switch effectiveStatus {
        case .error:
            return KozmosColors.primitivesColorsEmotionalDanger600
        case .warning:
            return KozmosColors.primitivesColorsEmotionalAlert600
        case .success:
            return KozmosColors.primitivesColorsEmotionalSuccess600
        case .default:
            return KozmosColors.primitivesColorsForeground500
        }
    }

    private var textColor: Color {
        if disabled { return KozmosColors.primitivesColorsForeground500 }
        if effectiveStatus == .error { return KozmosColors.primitivesColorsEmotionalDanger600 }
        return KozmosColors.primitivesColorsForeground0
    }
}
