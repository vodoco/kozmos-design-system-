import { j as jsxRuntimeExports, c as cn } from './utils-C6Yw6kaM.js';
import { R as React } from './index-BQAR1rgm.js';
import { L as Label } from './index-BYid5BO6.js';

const FieldWrapper = React.forwardRef(
  ({ className, error, errorId, label, inputId, children, ...props }, ref) => {
    const isStringError = typeof error === "string";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, className: cn("relative w-full flex flex-col gap-1.5", className), ...props, children: [
      label && /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: inputId, className: "text-sm font-semibold text-foreground", children: label }),
      children,
      isStringError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: errorId, className: "text-sm text-destructive", children: error })
    ] });
  }
);
FieldWrapper.displayName = "FieldWrapper";

export { FieldWrapper as F };
//# sourceMappingURL=index-De-onb09.js.map
