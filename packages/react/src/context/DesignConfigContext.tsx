'use client';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';

export interface GlassConfig {
    enabled: boolean;
    refraction: number; // 0-100 (Displacement scaling - feDisplacementMap)
    dispersion: number; // 0-100 (Chromatic aberration - feOffset)
    depth: number;      // 0-100 (Filter stack thickness/shadows)
    frost: number;      // 0-100 (Blur/Noise mix - feGaussianBlur)
    splay: number;      // 0-100 (Spread of dispersion)
    specular: number;   // 0-100 (Surface shininess - feSpecularLighting)
    surfaceScale: number; // 0-100 (Bump map height)
}

export interface DesignConfig {
    roundness: number;      // 0 - 2x
    glass: GlassConfig;     // Advanced glass settings
    noise: boolean;         // Enable subtle grain
    spotlight: boolean;     // Enable mouse-tracking light
    shadow: 'soft' | 'hard' | 'none';
    motion: 'fluid' | 'snappy' | 'reduced';
    preset?: 'apple' | 'geometric' | 'corporate';
    accessibility: {
        reduceMotion: boolean;
        reduceTransparency: boolean;
    };
}

const DEFAULT_CONFIG: DesignConfig = {
    roundness: 1,
    glass: {
        enabled: true,
        refraction: 40,
        dispersion: 20,
        depth: 10,
        frost: 10,
        splay: 15,
        specular: 30,
        surfaceScale: 5,
    },
    noise: true,
    spotlight: true,
    shadow: 'soft',
    motion: 'fluid',
    preset: 'apple',
    accessibility: {
        reduceMotion: false,
        reduceTransparency: false,
    },
};

interface DesignConfigContextType {
    config: DesignConfig;
    updateConfig: (newConfig: Partial<DesignConfig> | ((prev: DesignConfig) => Partial<DesignConfig>)) => void;
    updateGlassConfig: (newGlassConfig: Partial<GlassConfig>) => void;
    resetConfig: () => void;
    injectRuntimeTokens: (tokens: Record<string, string>) => void;
}

const DesignConfigContext = createContext<DesignConfigContextType | undefined>(undefined);

export const useDesignConfig = () => {
    const context = useContext(DesignConfigContext);
    if (!context) {
        throw new Error('useDesignConfig must be used within a DesignConfigProvider');
    }
    return context;
};

interface DesignConfigProviderProps {
    children: ReactNode;
    initialConfig?: Partial<DesignConfig>;
    persistKey?: string;
}

export const DesignConfigProvider = ({
    children,
    initialConfig,
    persistKey = 'kozmos-design-config'
}: DesignConfigProviderProps) => {
    // Load persisted config or use default
    const [config, setConfig] = useState<DesignConfig>(() => {
        if (typeof window !== 'undefined' && persistKey) {
            const saved = localStorage.getItem(persistKey);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Merge deeply to ensure new keys exist
                    return {
                        ...DEFAULT_CONFIG,
                        ...parsed,
                        glass: { ...DEFAULT_CONFIG.glass, ...parsed.glass },
                        accessibility: { ...DEFAULT_CONFIG.accessibility, ...parsed.accessibility },
                        ...initialConfig
                    };
                } catch (e) {
                    console.error('Failed to parse persistent design config:', e);
                }
            }
        }
        return { ...DEFAULT_CONFIG, ...initialConfig };
    });

    const containerRef = useRef<HTMLDivElement>(null);

    // Persistence Effect
    useEffect(() => {
        if (typeof window !== 'undefined' && persistKey) {
            localStorage.setItem(persistKey, JSON.stringify(config));
        }
    }, [config, persistKey]);

    // Generate monochrome noise texture via Canvas (fixes rainbow static)
    const [noiseUrl, setNoiseUrl] = useState('');

    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const imageData = ctx.createImageData(128, 128);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    // Strictly monochrome noise
                    const val = Math.random() * 255;
                    data[i] = val;     // R
                    data[i + 1] = val; // G
                    data[i + 2] = val; // B
                    data[i + 3] = 255; // Alpha (controlled via CSS opacity)
                }
                ctx.putImageData(imageData, 0, 0);
                setNoiseUrl(canvas.toDataURL());
            }
        } catch (e) {
            console.warn('Failed to generate noise texture', e);
        }
    }, []);

    // CSS Variables Effect
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const root = containerRef.current || document.documentElement;

        // Roundness
        root.style.setProperty('--roundness', config.roundness.toString());
        // Map conceptual radius vars to dynamic vars
        root.style.setProperty('--radius-sm', `calc(var(--primitives-radius-sm) * var(--roundness))`);
        root.style.setProperty('--radius-md', `calc(var(--primitives-radius-default) * var(--roundness))`);
        root.style.setProperty('--radius-lg', `calc(var(--primitives-radius-md) * var(--roundness))`);
        root.style.setProperty('--radius-xl', `calc(var(--primitives-radius-xl) * var(--roundness))`);
        root.style.setProperty('--radius-2xl', `calc(var(--primitives-radius-2xl) * var(--roundness))`);
        root.style.setProperty('--radius-full', `calc(var(--primitives-radius-full) * var(--roundness))`);

        // Glass
        const glassEnabled = config.glass.enabled && !config.accessibility.reduceTransparency;
        const reduceMotion = config.accessibility.reduceMotion;

        // Hardened Logic: Direct Calculations (Bypassing potentially missing tokens)

        // 1. Opacity
        // Default glass opacity is usually 0.7 (70%).
        const opacityVal = reduceMotion ? 1 : (glassEnabled ? 0.7 : 1);
        root.style.setProperty('--glass-opacity', opacityVal.toString());

        // 2. Blur / Refraction
        // Map refraction (0-100) to blur px.
        const baseBlur = config.glass.refraction > 0 ? config.glass.refraction / 2 : 0;
        const frostBlur = config.glass.frost > 0 ? config.glass.frost / 5 : 0;
        const totalBlur = glassEnabled ? (baseBlur + frostBlur) : 0;
        root.style.setProperty('--glass-blur', `${totalBlur}px`);

        // FAKE REFRACTION (Magnification)
        // Scale content slightly to simulate lensing. 0-100 -> 1.00 - 1.05
        const scaleVal = glassEnabled ? (1 + (config.glass.refraction / 100) * 0.05) : 1;
        root.style.setProperty('--glass-scale', scaleVal.toString());

        // ... (Saturation section skipped for brevity if unchanged, but included in replace if context requires)

        // 3. Saturation (Frost/Vibrancy)
        const saturationVal = glassEnabled ? 1.8 : 1;
        root.style.setProperty('--glass-saturation', saturationVal.toString());

        // 4. Main Filter
        root.style.setProperty('--glass-filter', `blur(var(--glass-blur)) saturate(${saturationVal})`);

        // 5. Specular / Bevel (Border)
        const borderOpacity = glassEnabled ? (config.glass.specular / 100) : 0;
        root.style.setProperty('--glass-bevel-opacity', borderOpacity.toString());

        // THICK GLASS DEPTH (Inner Shadows)
        // 0-100 -> Deep dark inner shadow + Bright Rim
        const depthVal = config.glass.depth;
        const depthOpacity = glassEnabled ? (depthVal / 100) * 0.6 : 0; // Dark shadow up to 60%
        const rimOpacity = glassEnabled ? (depthVal / 100) * 0.8 : 0;   // Bright rim up to 80%

        // Complex Shadow Stack:
        // 1. Bright top/left rim (1px)
        // 2. Dark bottom/right volume (10-20px)
        // 3. Subtle internal caustic gradient (color-dodge style simulation via overlay)
        const innerShadow = glassEnabled ? `
            inset 0 1px 1px 0 rgba(255, 255, 255, ${rimOpacity}),
            inset 0 -10px 20px -10px rgba(0, 0, 0, ${depthOpacity})
        ` : 'none';
        root.style.setProperty('--glass-inner-shadow', innerShadow);


        // 6. Dispersion (Color Shift)
        const dispersionOpacity = glassEnabled ? (config.glass.dispersion / 100) : 0;
        root.style.setProperty('--glass-dispersion-opacity', dispersionOpacity.toString());

        // 7. Surface Texture (Boosted)
        // Logic: Scale 0-10 -> Opacity 0-0.3 (More visible)
        const surfaceOpacity = (glassEnabled && config.glass.surfaceScale > 0) ? (config.glass.surfaceScale / 10 * 0.3) : 0;
        root.style.setProperty('--glass-surface-opacity', surfaceOpacity.toString());
        const surfaceFilter = (glassEnabled && config.glass.surfaceScale > 0) ? 'url(#glass-surface)' : 'none';
        root.style.setProperty('--glass-surface-filter', surfaceFilter);

        // 8. Noise Overlay
        // Hardcode "Standard" noise opacity to 0.03 (3%) or 0.015 (1.5%)
        const noiseOpacity = config.noise ? 0.015 : 0;
        root.style.setProperty('--glass-noise-opacity', noiseOpacity.toString());


        // Shadows
        if (config.shadow === 'none') {
            root.style.setProperty('--shadow-sm', 'none');
            root.style.setProperty('--shadow-md', 'none');
            root.style.setProperty('--shadow-lg', 'none');
        } else if (config.shadow === 'hard') {
            root.style.setProperty('--shadow-sm', '2px 2px 0px rgba(0,0,0,0.15)');
            root.style.setProperty('--shadow-md', '4px 4px 0px rgba(0,0,0,0.15)');
            root.style.setProperty('--shadow-lg', '8px 8px 0px rgba(0,0,0,0.15)');
        } else {
            // Restore defaults (soft)
            // We can fallback to hardcoded soft shadows if tokens fail, but usually shadows are fine.
            root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgba(0, 0, 0, 0.05)');
            root.style.setProperty('--shadow-md', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)');
            root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)');
        }

        // Motion
        let motionScale = 1;
        if (config.accessibility.reduceMotion) motionScale = 0.001;
        else if (config.motion === 'snappy') motionScale = 0.5;
        else if (config.motion === 'reduced') motionScale = 0.001;

        root.style.setProperty('--motion-scale', motionScale.toString());
        root.style.setProperty('--motion-duration-scale', motionScale.toString());

    }, [config]);


    // Mouse Tracking Effect (Spotlight)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!config.spotlight || config.accessibility.reduceMotion) return;

        const handleMouseMove = (e: MouseEvent) => {
            const root = containerRef.current || document.documentElement;
            root.style.setProperty('--spotlight-x', `${e.clientX}px`);
            root.style.setProperty('--spotlight-y', `${e.clientY}px`);

            // For SVG PointLight
            const svgPointLight = document.getElementById('glass-spotlight-source');
            if (svgPointLight) {
                // We need to map client coordinates to SVG localized coordinates if strictly needed,
                // but usually fixed viewport SVG works with client coords.
                svgPointLight.setAttribute('x', `${e.clientX}`);
                svgPointLight.setAttribute('y', `${e.clientY}`);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [config.spotlight, config.accessibility.reduceMotion]);

    const updateConfig = (newConfig: Partial<DesignConfig> | ((prev: DesignConfig) => Partial<DesignConfig>)) => {
        if (typeof newConfig === 'function') {
            setConfig(prev => ({ ...prev, ...newConfig(prev) }));
        } else {
            setConfig(prev => ({ ...prev, ...newConfig }));
        }
    };

    const updateGlassConfig = (newGlassConfig: Partial<GlassConfig>) => {
        setConfig(prev => ({
            ...prev,
            glass: { ...prev.glass, ...newGlassConfig }
        }));
    };

    const resetConfig = () => setConfig(DEFAULT_CONFIG);

    const injectRuntimeTokens = (tokens: Record<string, string>) => {
        if (typeof window === 'undefined') return;
        const root = containerRef.current || document.documentElement;
        Object.entries(tokens).forEach(([key, value]) => {
            const cssVar = key.startsWith('--') ? key : `--primitives-${key}`;
            root.style.setProperty(cssVar, value);
        });
    };

    return (
        <DesignConfigContext.Provider value={{ config, updateConfig, updateGlassConfig, resetConfig, injectRuntimeTokens }}>
            <div ref={containerRef} style={{ display: 'contents' }}>
                {children}
            </div>

            {/* Global Noise Overlay */}
            {config.noise && !config.accessibility.reduceTransparency && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: -1, // Behind all content
                        pointerEvents: 'none',
                        opacity: 'var(--glass-noise-opacity, 0.015)', // Fallback to prevents 100% opacity flash
                        backgroundImage: noiseUrl ? `url(${noiseUrl})` : 'none',
                        backgroundRepeat: 'repeat',
                        mixBlendMode: 'soft-light',
                    }}
                />
            )}

            {/* Advanced Glass SVG Filters - Kept for specific 'liquid' variants if we add them later, 
                but main glass now uses robust CSS filters. 
                We can still use this for a 'surface' texture if we map it to a pseudo-element.
            */}
            {config.glass.enabled && !config.accessibility.reduceTransparency && (
                <svg
                    style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none', visibility: 'hidden' }}
                    aria-hidden="true"
                >
                    <defs>
                        <filter id="glass-surface" x="0%" y="0%" width="100%" height="100%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" result="noise" />
                            <feColorMatrix type="saturate" values="0" in="noise" result="monoNoise" />
                            <feComponentTransfer in="monoNoise" result="smoothNoise">
                                <feFuncA type="linear" slope="0.1" />
                            </feComponentTransfer>
                        </filter>

                        <filter id="glass-filter" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                            {/* Legacy/Experimental Displacement - can be re-enabled for specific 'liquid' variant */}
                            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" result="turbulence" />
                            <feDisplacementMap in2="turbulence" in="SourceGraphic" scale={config.glass.surfaceScale} xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                    </defs>
                </svg>
            )}
        </DesignConfigContext.Provider>
    );
};
