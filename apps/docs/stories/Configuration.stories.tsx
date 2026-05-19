import type { Meta, StoryObj } from "@storybook/react";
import {
  DesignConfigProvider,
  Button,
  GlassSettingsPanel,
  useDesignConfig,
} from "@kozmos/react";

const DemoContent = () => {
  const { config } = useDesignConfig();

  return (
    <div className="p-8 space-y-12 min-h-[800px] w-full bg-background text-foreground transition-all duration-300 relative overflow-hidden">
      {/* Dynamic Background to show off glass refraction */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[20px] border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-[40px] border-white/5 rounded-full" />
      </div>

      <section className="space-y-4 relative z-10">
        <h2 className="text-2xl font-bold font-sans">Glass Engine</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Premium Card - The Star of the Show */}
          <div className="glass glass-bevel glass-spotlight glass-edge-spotlight p-10 rounded-2xl flex flex-col justify-between h-80 relative group">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold tracking-tighter">
                Liquid Glass
              </h3>
              <p className="opacity-80 text-lg leading-relaxed">
                Experience true refraction and dispersion. The background blurs
                and warps behind this card.
              </p>
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/10" />
                <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/5" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Button variant="glass" size="lg">
                Explore
              </Button>
              <div className="text-xs font-mono opacity-50">
                R{config.glass.refraction} / D{config.glass.dispersion}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass glass-bevel glass-spotlight p-8 rounded-xl flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 shadow-lg" />
              <div>
                <h3 className="text-xl font-bold">Standard Glass</h3>
                <p className="opacity-70 text-sm">
                  Compare this side-by-side with the premium liquid effect.
                </p>
              </div>
              <Button variant="outline" className="ml-auto">
                Action
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-6 rounded-lg text-center space-y-2">
                <div className="text-4xl font-bold">98%</div>
                <div className="text-xs uppercase tracking-widest opacity-60">
                  Clarity
                </div>
              </div>
              <div className="glass p-6 rounded-lg text-center space-y-2">
                <div className="text-4xl font-bold">
                  <span className="text-primary">&lt;</span>0.1s
                </div>
                <div className="text-xs uppercase tracking-widest opacity-60">
                  Latency
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 relative z-10">
        <h2 className="text-2xl font-bold font-sans">Controls & Inputs</h2>
        <div
          className="flex flex-wrap gap-4 items-center p-8 border border-white/10 rounded-xl bg-black/5"
          style={{ backdropFilter: "none" }}
        >
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="glass">Glass Variant</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <GlassSettingsPanel />
    </div>
  );
};

// Meta Definition
const meta: Meta<typeof DesignConfigProvider> = {
  title: "Design System/Configuration",
  component: DesignConfigProvider,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    // We leave these here for Storybook controls,
    // but real manipulation happens in the panel.
  },
};

export default meta;

type Story = StoryObj<typeof DesignConfigProvider>;

export const AdvancedPlayground: Story = {
  render: () => (
    <DesignConfigProvider persistKey="storybook-config-advanced-v2">
      <DemoContent />
    </DesignConfigProvider>
  ),
};
