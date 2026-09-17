import {
  DesignConfigProvider,
  type DesignConfigProviderProps,
} from "../context/DesignConfigContext";

export type KozmosThemeProps = DesignConfigProviderProps;

/**
 * Compatibility name for the unified scoped configuration provider.
 * Use config/onConfigChange for controlled values, or initialConfig for defaults.
 */
export function KozmosTheme(props: KozmosThemeProps) {
  return <DesignConfigProvider {...props} />;
}
