# Kozmos Android UI Library

This is the Android side of the Kozmos Design System, built with **Jetpack Compose**.

## Performance & Memory Leak Tracking

Since this is an Android Library (`com.android.library`), we cannot run memory leak detection natively within this package on its own. 

**Consumer Requirement:**
Any host application (e.g., the Pointr SDK consumer app, or a future `playground-android` app) MUST include `LeakCanary` to detect Composable retention leaks during development. 

Add the following to your application's `app/build.gradle.kts`:
```kotlin
dependencies {
    // Detects memory leaks automatically in debug builds
    debugImplementation("com.squareup.leakcanary:leakcanary-android:2.12")
}
```
LeakCanary will automatically install itself and notify you of any retained Kozmos Composables.
