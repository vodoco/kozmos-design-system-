import XCTest
import SwiftUI
import SnapshotTesting
@testable import Kozmos

/*
================================================================================
 SNAPSHOT GENERATION INSTRUCTIONS
================================================================================
 To record new baselines for the iOS Visual Engine, execute the following from
 the monorepo root:
 
 cd packages/ios && SNAPSHOT_TESTING_RECORD=true swift test --filter KozmosButtonSnapshotTests
 
 Ensure you commit the generated images in packages/ios/Tests/KozmosTests/__Snapshots__/
================================================================================
*/

final class KozmosButtonSnapshotTests: XCTestCase {
    func testButtonDefaultVariant() {
        let view = KozmosButton("Label Binding", action: {})
        
        // Assert the pure SwiftUI representation strictly matches the generated pixel layout
        assertSnapshot(matching: AnyView(view), as: .image)
    }

    func testButtonDestructiveVariant() {
        let view = KozmosButton("Delete Item", variant: .destructive, action: {})
        assertSnapshot(matching: AnyView(view), as: .image)
    }

    func testButtonDisabledState() {
        let view = KozmosButton("Cannot Execute", isDisabled: true, action: {})
        assertSnapshot(matching: AnyView(view), as: .image)
    }

    func testButtonLoadingState() {
        let view = KozmosButton("Processing...", isLoading: true, action: {})
        assertSnapshot(matching: AnyView(view), as: .image)
    }
}
