import { j as jsxRuntimeExports, c as cn } from './utils-C6Yw6kaM.js';
import { R as React } from './index-BQAR1rgm.js';
import { c as cva } from './index-DaJnwoz7.js';
import { F as FieldWrapper } from './index-De-onb09.js';
import './index-BYid5BO6.js';
import './index-1HB4mRKF.js';

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      error: {
        true: "border-destructive text-destructive focus-visible:ring-destructive placeholder:text-destructive/60"
      }
    }
  }
);
const Input = React.forwardRef(
  ({ className, type, error, label, wrapperClassName, ...props }, ref) => {
    const errorId = React.useId();
    const hasError = !!error;
    const defaultInputId = React.useId();
    const inputId = props.id || defaultInputId;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FieldWrapper, { error, errorId, label, inputId, className: wrapperClassName, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        id: inputId,
        className: cn(
          inputVariants({ error: hasError }),
          className
        ),
        ref,
        "aria-invalid": hasError,
        "aria-describedby": hasError && typeof error === "string" ? errorId : void 0,
        ...props
      }
    ) });
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
//# sourceMappingURL=index-D2aixjYS.js.map
