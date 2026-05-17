---
description: Android SDK Development Expert Rules
---
# Android Expert Rules (Kozmos Design System)

When operating on the `packages/android` environment, rigidly adhere to the following native constraints:

1. **Modern UI Toolkits**: 
   - **Rule**: The SDK exclusively uses **Jetpack Compose**. Traditional XML Views are considered legacy tech debt and must not be authored unless implementing a strict bridging wrapper.

2. **Library vs. App Lifecycles**: 
   - **Rule**: `com.android.library` modules do NOT have execution lifecycles. They cannot host instance-level profilers (like LeakCanary) internally. 
   - All performance tracking libraries must either be explicitly routed to a `.testImplementation` environment or hoisted to a dedicated `com.android.application` consumer layer (e.g., `playground-android`).

3. **Gradle Synchronization**: 
   - **Rule**: When adding dependencies to `build.gradle.kts`, ensure you use modern catalog integrations or strictly conform to `.kts` string literals. Never mix Groovy syntax into Kotlin configuration files.

4. **Koltin Context Isolation**:
   - **Rule**: Component structures should be as detached from the Android `Context` API as possible. Rely on Kotlin data classes and `ViewModel` / `StateFlow` primitives for business logic mapping (such as Analytics).
