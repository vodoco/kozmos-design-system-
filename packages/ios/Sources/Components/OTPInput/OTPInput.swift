import SwiftUI

public struct KozmosOTPInput: View {
    let length: Int
    @Binding var value: String
    @FocusState private var focusedField: Int?
    
    public init(length: Int = 6, value: Binding<String>) {
        self.length = length
        self._value = value
    }
    
    public var body: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
            ForEach(0..<length, id: \.self) { index in
                textField(for: index)
            }
        }
    }
    
    @ViewBuilder
    private func textField(for index: Int) -> some View {
        #if os(iOS) || os(tvOS)
        TextField("", text: binding(for: index))
            .keyboardType(.numberPad)
            .multilineTextAlignment(.center)
            .frame(width: 44, height: 50)
            .background(KozmosColors.primitivesColorsBackground100)
            .cornerRadius(KozmosDimensions.primitivesLayoutRadius100)
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100)
                    .stroke(focusedField == index ? KozmosColors.primitivesColorsTheme500 : KozmosColors.primitivesColorsForeground300, lineWidth: 1)
            )
            .focused($focusedField, equals: index)
            .onChange(of: value) { newValue in
                if newValue.count == index + 1 && index < length - 1 {
                     focusedField = index + 1
                }
            }
        #else
        TextField("", text: binding(for: index))
            .multilineTextAlignment(.center)
            .frame(width: 44, height: 50)
            .background(KozmosColors.primitivesColorsBackground100)
            .cornerRadius(KozmosDimensions.primitivesLayoutRadius100)
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100)
                    .stroke(focusedField == index ? KozmosColors.primitivesColorsTheme500 : KozmosColors.primitivesColorsForeground300, lineWidth: 1)
            )
            .focused($focusedField, equals: index)
            .onChange(of: value) { newValue in
                if newValue.count == index + 1 && index < length - 1 {
                     focusedField = index + 1
                }
            }
        #endif
    }
    
    private func binding(for index: Int) -> Binding<String> {
        return Binding<String>(
            get: {
                if index < value.count {
                    let stringIndex = value.index(value.startIndex, offsetBy: index)
                    return String(value[stringIndex])
                } else {
                    return ""
                }
            },
            set: { userChar in
                if value.count > index {
                     let stringIndex = value.index(value.startIndex, offsetBy: index)
                     value.replaceSubrange(stringIndex...stringIndex, with: userChar.prefix(1))
                } else if value.count == index {
                    value.append(String(userChar.prefix(1)))
                }
            }
        )
    }
}
