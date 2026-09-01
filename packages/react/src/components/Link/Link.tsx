import React from "react";
import { cn } from "../../utils";
import { useKozmosAnalytics } from "../../utils/analytics";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "default" | "subtle";
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = "default", onClick, href, ...props }, ref) => {
    const { trackEvent } = useKozmosAnalytics();
    return (
      <a
        ref={ref}
        href={href}
        onClick={(e) => {
          trackEvent("Link", "link_clicked", { href });
          onClick?.(e);
        }}
        className={cn(
          "font-medium hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-marker",
          variant === "default" && "text-primary",
          variant === "subtle" && "text-muted-foreground hover:text-foreground",
          className,
        )}
        {...props}
      />
    );
  },
);
Link.displayName = "Link";

export { Link };
