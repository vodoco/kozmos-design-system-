import { useState } from 'react';
import { useDesignConfig } from '../../context/DesignConfigContext';
import { Button } from '../Button/Button';
import { Minimize2, Maximize2, RotateCcw, Monitor, Eye, Layers, Sun } from 'lucide-react';

export const GlassSettingsPanel = () => {
    const { config, updateConfig, updateGlassConfig, resetConfig } = useDesignConfig();
    const [isMinimized, setIsMinimized] = useState(false);

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <Button
                    variant="glass"
                    size="icon"
                    onClick={() => setIsMinimized(false)}
                    className="rounded-full w-12 h-12 shadow-lg"
                >
                    <Maximize2 className="w-5 h-5" />
                </Button>
            </div>
        );
    }

    const Slider = ({ label, value, onChange, min = 0, max = 100, step = 1 }: { label: string, value: number, onChange: (val: number) => void, min?: number, max?: number, step?: number }) => (
        <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{label}</span>
                <span className="font-mono">{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
        </div>
    );

    const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) => (
        <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-xs group-hover:text-primary transition-colors">{label}</span>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${checked ? 'bg-primary' : 'bg-secondary'}`}>
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-background rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </label>
    );

    return (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary/80 animate-pulse" />
                    <span className="font-semibold text-sm tracking-tight text-foreground">Glass Engine</span>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={resetConfig}
                        className="p-1.5 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-foreground"
                        title="Reset Default"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-1.5 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <Minimize2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Global Toggles */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                        <Monitor className="w-3 h-3" /> System
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <Toggle label="Enable Glass" checked={config.glass.enabled} onChange={(v) => updateGlassConfig({ enabled: v })} />
                        <Toggle label="Noise Texture" checked={config.noise} onChange={(v) => updateConfig({ noise: v })} />
                        <Toggle label="Spotlight" checked={config.spotlight} onChange={(v) => updateConfig({ spotlight: v })} />
                        <Toggle label="A11y: Reduce Motion" checked={config.accessibility.reduceMotion} onChange={(v) => updateConfig(prev => ({ ...prev, accessibility: { ...prev.accessibility, reduceMotion: v } }))} />
                        <Toggle label="A11y: Reduce Transp." checked={config.accessibility.reduceTransparency} onChange={(v) => updateConfig(prev => ({ ...prev, accessibility: { ...prev.accessibility, reduceTransparency: v } }))} />
                    </div>
                </div>

                <hr className="border-border/50" />

                {/* Glass Physics */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                        <Layers className="w-3 h-3" /> Physics
                    </div>

                    <Slider
                        label="Refraction (Displacement)"
                        value={config.glass.refraction}
                        onChange={(v) => updateGlassConfig({ refraction: v })}
                        max={100}
                    />
                    <Slider
                        label="Surface Scale (Roughness)"
                        value={config.glass.surfaceScale}
                        onChange={(v) => updateGlassConfig({ surfaceScale: v })}
                        max={20}
                    />
                    <Slider
                        label="Frost (Blur)"
                        value={config.glass.frost}
                        onChange={(v) => updateGlassConfig({ frost: v })}
                        max={50}
                    />
                </div>

                <hr className="border-border/50" />

                {/* Optics */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                        <Eye className="w-3 h-3" /> Optics
                    </div>

                    <Slider
                        label="Dispersion (Chromatic)"
                        value={config.glass.dispersion}
                        onChange={(v) => updateGlassConfig({ dispersion: v })}
                    />
                    <Slider
                        label="Specular (Shininess)"
                        value={config.glass.specular}
                        onChange={(v) => updateGlassConfig({ specular: v })}
                        max={100}
                    />
                    <Slider
                        label="Depth (Light Distance)"
                        value={config.glass.depth}
                        onChange={(v) => updateGlassConfig({ depth: v })}
                        max={50}
                    />
                </div>

                <hr className="border-border/50" />

                {/* Shape */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                        <Sun className="w-3 h-3" /> Geometry
                    </div>

                    <Slider
                        label="Global Roundness"
                        value={config.roundness}
                        onChange={(v) => updateConfig({ roundness: v })}
                        max={2}
                        step={0.1}
                    />
                </div>

            </div>
        </div>
    );
};
