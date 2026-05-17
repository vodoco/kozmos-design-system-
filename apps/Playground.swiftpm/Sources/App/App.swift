import SwiftUI
import Kozmos

@main
struct PlaygroundApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    @State private var islandState: KozmosDynamicIsland<Text, Image, Text, Image>.IslandState = .compact
    
    var body: some View {
        ZStack(alignment: .top) {
            // Background imitating map viewport
            Color(KozmosColors.backgroundBase)
                .edgesIgnoringSafeArea(.all)
                
            VStack(spacing: 24) {
               // Dynamic Island injection layer
               KozmosDynamicIsland(state: islandState) {
                   Text("Turn Right in 300ft")
                       .font(.headline)
                       .foregroundColor(.white)
               } compactLeading: {
                   Image(systemName: "location.north.line.fill")
                       .foregroundColor(.green)
               } compactTrailing: {
                   Text("1.2m").font(.caption).bold()
               } minimalContent: {
                   Image(systemName: "location.fill").foregroundColor(.green)
               }
               .padding(.top, 16)
               
               Spacer()
               
               // Interactive Controls
               KozmosCard {
                   VStack(alignment: .leading, spacing: 16) {
                       Text("ActivityKit Sandbox")
                           .font(.headline)
                           
                       HStack {
                           KozmosButton("Minimal", variant: .outline) {
                               islandState = .minimal
                           }
                           KozmosButton("Compact", variant: .default) {
                               islandState = .compact
                           }
                           KozmosButton("Expand", variant: .default) {
                               islandState = .expanded
                           }
                       }
                       
                       Divider()
                       
                       Text("Token Parity Validation")
                           .font(.subheadline)
                           .foregroundColor(KozmosColors.primitivesColorsForeground400)
                           
                       HStack {
                           Text("Depth Shadows")
                           Spacer()
                           // Testing the generated shadow tokens directly mapped from Phase 10
                           Circle()
                               .fill(Color(KozmosColors.semanticsColorsPrimaryBase))
                               .frame(width: 40, height: 40)
                               .shadow(color: KozmosShadows.shadowLgColor, radius: KozmosShadows.shadowLgRadius, x: KozmosShadows.shadowLgOffset.x, y: KozmosShadows.shadowLgOffset.y)
                       }
                   }
               }
               .padding(.bottom, 32)
            }
            .padding(.horizontal)
        }
    }
}
