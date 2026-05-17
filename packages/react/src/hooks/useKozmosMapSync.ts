import { useEffect, useState } from 'react';

export interface KozmosMapCameraState {
    pitch: number;
    bearing: number;
    zoom: number;
    isMoving: boolean;
}

export interface MapSyncEngineAdapter {
    onCameraMove: (callback: (state: KozmosMapCameraState) => void) => () => void;
    getCurrentState: () => KozmosMapCameraState;
}

/**
 * A bridge hook uniting the Kozmos mathematical DOM overlays with WebGL camera pipelines (Mapbox/MapLibre).
 * Extrapolates rotation and pitch transforms to automatically skew DOM markers into 3D isometric space 
 * tracking the underlying base map engine seamlessly.
 */
export function useKozmosMapSync(adapter?: MapSyncEngineAdapter) {
    const [cameraState, setCameraState] = useState<KozmosMapCameraState>({
        pitch: 0,
        bearing: 0,
        zoom: 1,
        isMoving: false
    });

    useEffect(() => {
        if (!adapter) return;
        
        // Initial sync
        setCameraState(adapter.getCurrentState());
        
        // Listener hook
        const cleanup = adapter.onCameraMove((state) => {
            setCameraState(state);
        });

        return cleanup;
    }, [adapter]);

    // Derived CSS transforms representing the true mapping viewport scaling.
    const isometricTransform = `rotateX(${cameraState.pitch}deg) rotateZ(${-cameraState.bearing}deg)`;
    const elevationScale = Math.max(0.5, Math.min(cameraState.zoom / 18, 1.5));

    return {
        ...cameraState,
        deriveTransform: () => isometricTransform,
        scale: elevationScale
    };
}
