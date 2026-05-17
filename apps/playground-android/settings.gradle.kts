pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "Kozmos Android Playground"
include(":app")
// Include the local sibling package
include(":kozmos-android")
project(":kozmos-android").projectDir = file("../../packages/android")
