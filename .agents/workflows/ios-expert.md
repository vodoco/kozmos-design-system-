---
description: iOS SDK Development Expert Rules
---
# iOS Expert Rules (Kozmos Design System)

When operating on the `packages/ios` Swift package, strictly adhere to the following architectural guidelines to prevent catastrophic build failures:

1. **Target Destination Sanity**: 
   - Never assume the build target is exclusively an iOS simulator. 
   - **Rule**: If referencing `UIKit` (which Xcode naturally rejects when building for "My Mac" or cross-platform targets), you MUST gate it using `#if canImport(UIKit)` or strictly configure `platforms: [.iOS(.v16)]` ensuring cross-platform exclusions.

2. **Package Dependency Integrity**: 
   - Tools like Figma Code Connect automatically generate files containing `import Figma`. 
   - **Rule**: You cannot `import` a namespace unless it is explicitly declared in `Package.swift` `dependencies: []` and strictly linked within the `.target(dependencies: [])` array. Failing to do this throws "Unable to find module dependency" exceptions.

3. **Design Token Generator Safety**: 
   - Automated token-to-code generators (`KozmosColors.swift`) often emit syntax errors like "unexpected second identifier" due to line-break mapping bugs.
   - **Rule**: Always review generated Swift syntax. Ensure properties follow absolute deterministic shapes: `public static let tokenName = Color(...)`.

4. **Memory Management**:
   - SwiftUI closures (like `Timer` or `@escaping` event handlers) inherently capture strong references.
   - **Rule**: Always map `[weak self]` in closures traversing the `EnvironmentObject` bounds to prevent memory retention cycles.
