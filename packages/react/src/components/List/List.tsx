import React from "react";
import { cn } from "../../utils";

export type ListDensity = "default" | "compact";

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  density?: ListDensity;
}

const listDensityClasses: Record<ListDensity, string> = {
  default: "[&>li]:min-h-12 [&>li]:px-4 [&>li]:py-3",
  compact: "[&>li]:min-h-10 [&>li]:px-4 [&>li]:py-2",
};

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, density = "default", ...props }, ref) => (
    <ul
      ref={ref}
      data-density={density}
      className={cn(
        "m-0 flex w-full list-none flex-col overflow-hidden rounded-md border bg-background p-0 text-sm text-foreground",
        listDensityClasses[density],
        className,
      )}
      {...props}
    />
  ),
);
List.displayName = "List";

const ListItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("flex items-center border-b last:border-b-0", className)}
    {...props}
  />
));
ListItem.displayName = "ListItem";

export { List, ListItem };
