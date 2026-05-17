import SwiftUI

public struct KozmosToast: View {
    @Binding var isPresented: Bool
    let message: String
    
    public init(isPresented: Binding<Bool>, message: String) {
        self._isPresented = isPresented
        self.message = message
    }
    
    public var body: some View {
        ZStack {
            if isPresented {
                VStack {
                    Spacer()
                    Text(message)
                        .font(.subheadline)
                        .foregroundColor(KozmosColors.primitivesColorsBackground0)
                        .padding()
                        .background(KozmosColors.primitivesColorsBackground800.opacity(0.8))
                        .cornerRadius(KozmosDimensions.primitivesLayoutRadius100)
                        .padding(.bottom, KozmosDimensions.primitivesLayoutSpacing600)
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                        .onAppear {
                            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                                withAnimation {
                                    isPresented = false
                                }
                            }
                        }
                }
                .edgesIgnoringSafeArea(.bottom)
                .zIndex(1)
            }
        }
    }
}
