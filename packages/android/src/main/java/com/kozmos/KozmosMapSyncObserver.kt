package com.kozmos

import android.graphics.Matrix

data class KozmosCameraState(
    val pitch: Double,
    val bearing: Double,
    val zoom: Double,
    val isMoving: Boolean
)

/**
 * A native Kotlin interface binding.
 * Implement this interface on your parent Map Fragment or Activity.
 * When the Android MapEngine triggers `onCameraMove`, pipe the variables here to synchronize Jetpack Compose geometries.
 */
interface KozmosMapSyncObserver {
    fun onCameraChanged(state: KozmosCameraState)

    /**
     * Optional utility to generate an Android Matrix mapping the 3D skew coordinates locally
     */
    fun computeIsometricMatrix(state: KozmosCameraState): Matrix {
        val matrix = Matrix()
        // Standard Android rotation pivot is derived differently than WebGL/Metal
        matrix.postRotate(-state.bearing.toFloat())
        // Pitch scaling simulated linearly
        val scaleY = Math.cos(Math.toRadians(state.pitch)).toFloat()
        matrix.postScale(1f, scaleY)
        return matrix
    }
}
