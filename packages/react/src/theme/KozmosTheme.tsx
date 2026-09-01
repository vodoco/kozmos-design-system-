import React, { useEffect } from "react";
import {
  DesignConfigProvider,
  useDesignConfig,
} from "../context/DesignConfigContext";
import type { DesignConfig } from "../context/DesignConfigContext";

export interface KozmosThemeProps {
  children: React.ReactNode;
  config?: Partial<DesignConfig>;
  tokens?: Record<string, string>;
}

/**
 * Internal hook to parse and apply token strings onto the root CSSOM context.
 */
function ThemeInjector({ tokens }: { tokens?: Record<string, string> }) {
  const { injectRuntimeTokens } = useDesignConfig();

  useEffect(() => {
    if (tokens && Object.keys(tokens).length > 0) {
      injectRuntimeTokens(tokens);
    }
  }, [tokens, injectRuntimeTokens]);

  return null;
}

/**
 * Enterprise white-label Root Provider for Kozmos Applications.
 * Dynamically binds raw CSS variables into the active DOM bypassing compile constraints.
 */
export const KozmosTheme: React.FC<KozmosThemeProps> = ({
  children,
  config,
  tokens,
}) => {
  return (
    <DesignConfigProvider initialConfig={config}>
      {tokens && <ThemeInjector tokens={tokens} />}
      {children}
    </DesignConfigProvider>
  );
};
