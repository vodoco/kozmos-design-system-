import * as React from "react";
import { ThemeProviderContext } from "./theme-context";

type PortalProps = {
  children?: React.ReactNode;
  container?: Element | DocumentFragment | null;
  forceMount?: true;
};

/** Keep Radix presence/focus behavior; only choose the default destination. */
export function createThemePortal(Primitive: React.ComponentType<PortalProps>) {
  function ThemePortal(props: PortalProps) {
    const theme = React.useContext(ThemeProviderContext);
    // Do not mount in body briefly and then remount once the owned root exists.
    if (props.container === undefined && theme && !theme.portalContainer)
      return null;
    return (
      <Primitive
        {...props}
        container={
          props.container === undefined
            ? theme?.portalContainer
            : props.container
        }
      />
    );
  }
  ThemePortal.displayName = "KozmosThemePortal";
  return ThemePortal;
}
