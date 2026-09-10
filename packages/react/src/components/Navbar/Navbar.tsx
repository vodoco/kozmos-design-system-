import React from "react";
import { cn } from "../../utils";

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  context?: React.ReactNode;
  /** @deprecated Use context instead. */
  site?: React.ReactNode;
  navigation?: React.ReactNode;
  primaryAction?: React.ReactNode;
  actions?: React.ReactNode;
  utilities?: React.ReactNode;
  account?: React.ReactNode;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      context,
      logo,
      site,
      navigation,
      primaryAction,
      actions,
      utilities,
      account,
      children,
      ...props
    },
    ref,
  ) => {
    const navigationContent = navigation ?? children;
    const contextContent = context ?? site;
    const hasTrailing = actions || utilities || account;

    return (
      <header
        ref={ref}
        data-slot="navbar"
        className={cn(
          "sticky top-0 z-50 flex h-16 w-full items-center border-b bg-background px-4 shadow-raised",
          className,
        )}
        {...props}
      >
        <div
          data-slot="navbar-leading"
          className="flex min-w-0 flex-1 items-center gap-4"
        >
          {logo ? (
            <div data-slot="navbar-logo" className="shrink-0">
              {logo}
            </div>
          ) : null}
          {contextContent ? (
            <div
              data-slot="navbar-context"
              className="hidden min-w-0 shrink md:block"
            >
              {contextContent}
            </div>
          ) : null}
          {primaryAction ? (
            <div
              data-slot="navbar-primary-action"
              className="hidden shrink-0 md:flex"
            >
              {primaryAction}
            </div>
          ) : null}
          {navigationContent ? (
            <nav
              data-slot="navbar-navigation"
              className="hidden min-w-0 flex-1 items-center justify-center gap-4 md:flex"
            >
              {navigationContent}
            </nav>
          ) : null}
        </div>
        {hasTrailing ? (
          <div
            data-slot="navbar-trailing"
            className="flex shrink-0 items-center gap-2"
          >
            {actions ? (
              <div data-slot="navbar-actions" className="contents">
                {actions}
              </div>
            ) : null}
            {utilities ? (
              <div data-slot="navbar-utilities" className="contents">
                {utilities}
              </div>
            ) : null}
            {account ? (
              <div data-slot="navbar-account" className="contents">
                {account}
              </div>
            ) : null}
          </div>
        ) : null}
      </header>
    );
  },
);
Navbar.displayName = "Navbar";

export { Navbar };
