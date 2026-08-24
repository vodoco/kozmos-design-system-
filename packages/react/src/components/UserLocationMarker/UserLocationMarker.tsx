import * as React from "react";
import { cn } from "../../utils";

export interface UserLocationMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: number; // 0 to 360 degrees
  showHeading?: boolean;
}

const UserLocationMarker = React.forwardRef<
  HTMLDivElement,
  UserLocationMarkerProps
>(({ className, heading = 0, showHeading = true, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="img"
      aria-label="User location"
      className={cn(
        "relative flex items-center justify-center min-h-[48px] min-w-[48px]",
        className,
      )}
      {...props}
    >
      {/* Pulsing ring background */}
      <div className="absolute h-10 w-10 rounded-full bg-data-blue opacity-30 animate-pulse outline-none pointer-events-none" />
      <div className="absolute h-14 w-14 rounded-full bg-data-blue opacity-10 animate-ping outline-none pointer-events-none" />

      {/* Heading Cone (if active) */}
      {showHeading && (
        <div
          className="absolute h-24 w-24 pointer-events-none"
          style={{
            transform: `rotate(${heading}deg)`,
            transformOrigin: "center",
          }}
        >
          {/* Complex SVG cone representing view direction */}
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <path
              d="M50 50 L85 10 A 50 50 0 0 0 15 10 Z"
              fill="url(#coneGradient)"
              opacity="0.4"
            />
            <defs>
              <radialGradient id="coneGradient" cx="50%" cy="50%" r="50%">
                <stop
                  offset="0%"
                  stopColor="var(--semantics-data-blue)"
                  stopOpacity="1"
                />
                <stop
                  offset="100%"
                  stopColor="var(--semantics-data-blue)"
                  stopOpacity="0"
                />
              </radialGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Core Dot bordered with white */}
      <div className="relative h-[18px] w-[18px] rounded-full border-2 border-background bg-data-blue shadow-md z-10" />
    </div>
  );
});
UserLocationMarker.displayName = "UserLocationMarker";

export { UserLocationMarker };
