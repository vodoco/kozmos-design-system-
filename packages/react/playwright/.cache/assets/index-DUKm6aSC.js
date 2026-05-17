import { j as jsxRuntimeExports, c as cn } from './utils-C6Yw6kaM.js';
import { R as React } from './index-BQAR1rgm.js';
import { c as cva } from './index-DaJnwoz7.js';
import { L as LoaderCircle } from './lucide-react-Pfj_YwyJ.js';
import { u as useKozmosAnalytics } from './analytics-CojABnHF.js';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent/10 hover:text-accent",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "glass glass-spotlight glass-bevel text-foreground hover:bg-white/10 active:scale-[0.98]"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, isLoading, children, onClick, ...props }, ref) => {
    const { trackEvent } = useKozmosAnalytics();
    const handleClick = (e) => {
      trackEvent("Button", "button_clicked", { variant: variant || "default", disabled: props.disabled });
      onClick?.(e);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: cn(buttonVariants({ variant, size }), className),
        ref,
        disabled: isLoading || props.disabled,
        onClick: handleClick,
        ...props,
        children: [
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          children
        ]
      }
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
//# sourceMappingURL=index-DUKm6aSC.js.map
