import React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "../../utils";
import { useKozmosAnalytics } from "../../utils/analytics";
import { FieldWrapper } from "../FieldWrapper";
import { inputVariants, type InputStatus } from "../Input/Input";

export interface ComboboxOption {
  description?: string;
  disabled?: boolean;
  label: string;
  value: string;
}

export interface ComboboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "children" | "defaultValue" | "onChange" | "value"
> {
  clearable?: boolean;
  defaultInputValue?: string;
  defaultValue?: string;
  emptyText?: string;
  error?: boolean | string;
  filterOption?: (option: ComboboxOption, inputValue: string) => boolean;
  helperText?: string;
  inputValue?: string;
  label?: string;
  onInputValueChange?: (value: string) => void;
  onValueChange?: (value: string, option?: ComboboxOption) => void;
  options: ComboboxOption[];
  status?: InputStatus;
  value?: string;
  wrapperClassName?: string;
}

function defaultFilterOption(option: ComboboxOption, inputValue: string) {
  const query = inputValue.trim().toLowerCase();
  if (!query) return true;
  return (
    option.label.toLowerCase().includes(query) ||
    option.value.toLowerCase().includes(query) ||
    option.description?.toLowerCase().includes(query)
  );
}

function nextEnabledIndex(
  options: ComboboxOption[],
  currentIndex: number,
  direction: 1 | -1,
) {
  if (options.length === 0) return -1;

  for (let offset = 1; offset <= options.length; offset += 1) {
    const index =
      (currentIndex + direction * offset + options.length) % options.length;
    if (!options[index]?.disabled) return index;
  }

  return -1;
}

function firstEnabledIndex(options: ComboboxOption[]) {
  return options.findIndex((option) => !option.disabled);
}

export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      className,
      clearable = true,
      defaultInputValue,
      defaultValue,
      disabled,
      emptyText = "No results found",
      error,
      filterOption = defaultFilterOption,
      helperText,
      id,
      inputValue,
      label,
      onBlur,
      onFocus,
      onInputValueChange,
      onKeyDown,
      onValueChange,
      options,
      placeholder = "Select option",
      readOnly,
      required,
      status = "default",
      value,
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const { trackEvent } = useKozmosAnalytics();
    const rootRef = React.useRef<HTMLDivElement>(null);
    const defaultInputId = React.useId();
    const errorId = React.useId();
    const helperId = React.useId();
    const listboxId = React.useId();
    const inputId = id || defaultInputId;
    const [open, setOpen] = React.useState(false);
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue || "",
    );
    const selectedValue = value ?? uncontrolledValue;
    const selectedOption = options.find(
      (option) => option.value === selectedValue,
    );
    const [uncontrolledInputValue, setUncontrolledInputValue] = React.useState(
      defaultInputValue ?? selectedOption?.label ?? "",
    );
    const visibleInputValue = inputValue ?? uncontrolledInputValue;
    const filteredOptions = React.useMemo(
      () => options.filter((option) => filterOption(option, visibleInputValue)),
      [filterOption, options, visibleInputValue],
    );
    const [activeIndex, setActiveIndex] = React.useState(() =>
      firstEnabledIndex(filteredOptions),
    );
    const resolvedStatus: InputStatus = error ? "error" : status;
    const describedBy =
      error && typeof error === "string"
        ? errorId
        : helperText
          ? helperId
          : undefined;
    const activeOption = activeIndex >= 0 ? filteredOptions[activeIndex] : null;
    const activeOptionId =
      open && activeOption ? `${inputId}-option-${activeIndex}` : undefined;
    const canClear =
      clearable && !disabled && !readOnly && Boolean(visibleInputValue);

    React.useEffect(() => {
      if (inputValue === undefined) {
        setUncontrolledInputValue(selectedOption?.label ?? "");
      }
    }, [inputValue, selectedOption?.label]);

    React.useEffect(() => {
      setActiveIndex(firstEnabledIndex(filteredOptions));
    }, [filteredOptions]);

    React.useEffect(() => {
      if (!open) return undefined;

      const handlePointerDown = (event: MouseEvent) => {
        if (!rootRef.current?.contains(event.target as Node)) {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handlePointerDown);
      return () => document.removeEventListener("mousedown", handlePointerDown);
    }, [open]);

    const setInputValue = (nextValue: string) => {
      if (inputValue === undefined) {
        setUncontrolledInputValue(nextValue);
      }
      onInputValueChange?.(nextValue);
    };

    const selectOption = (option: ComboboxOption | null) => {
      if (!option || option.disabled || disabled || readOnly) return;
      if (value === undefined) {
        setUncontrolledValue(option.value);
      }
      setInputValue(option.label);
      setOpen(false);
      trackEvent("Combobox", "option_selected", { value: option.value });
      onValueChange?.(option.value, option);
    };

    const clearSelection = () => {
      if (value === undefined) {
        setUncontrolledValue("");
      }
      setInputValue("");
      setOpen(false);
      trackEvent("Combobox", "selection_cleared", {});
      onValueChange?.("", undefined);
    };

    return (
      <FieldWrapper
        className={wrapperClassName}
        error={error}
        errorId={errorId}
        helperId={helperId}
        helperText={helperText}
        inputId={inputId}
        label={label}
        required={required}
        status={resolvedStatus}
      >
        <div ref={rootRef} className="relative">
          <input
            ref={ref}
            id={inputId}
            role="combobox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-activedescendant={open ? activeOptionId : undefined}
            aria-describedby={describedBy}
            aria-invalid={resolvedStatus === "error" || undefined}
            autoComplete="off"
            className={cn(
              inputVariants({ status: resolvedStatus }),
              "pr-20",
              className,
            )}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            required={required}
            value={visibleInputValue}
            onBlur={onBlur}
            onFocus={(event) => {
              if (!readOnly && !disabled) setOpen(true);
              onFocus?.(event);
            }}
            onChange={(event) => {
              setInputValue(event.target.value);
              if (!open) setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setOpen(true);
                setActiveIndex((current) =>
                  nextEnabledIndex(filteredOptions, current, 1),
                );
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setOpen(true);
                setActiveIndex((current) =>
                  nextEnabledIndex(filteredOptions, current, -1),
                );
              } else if (event.key === "Home") {
                setActiveIndex(firstEnabledIndex(filteredOptions));
              } else if (event.key === "End") {
                setActiveIndex(nextEnabledIndex(filteredOptions, 0, -1));
              } else if (event.key === "Enter" && open) {
                event.preventDefault();
                selectOption(activeOption);
              } else if (event.key === "Escape") {
                setOpen(false);
              }
              onKeyDown?.(event);
            }}
            {...props}
          />
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center gap-1">
            {canClear && (
              <button
                type="button"
                className="pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-control text-muted-foreground ring-offset-background hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Clear selection"
                onClick={clearSelection}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              className="pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-control text-muted-foreground ring-offset-background hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={open ? "Close options" : "Open options"}
              disabled={disabled || readOnly}
              onClick={() => setOpen((current) => !current)}
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  open && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>
          </div>
          {open && (
            <div
              id={listboxId}
              role="listbox"
              className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-control border bg-popover p-1 text-popover-foreground shadow-md"
            >
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {emptyText}
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const selected = option.value === selectedValue;
                  const active = index === activeIndex;

                  return (
                    <div
                      key={option.value}
                      id={`${inputId}-option-${index}`}
                      role="option"
                      aria-selected={selected}
                      aria-disabled={option.disabled || undefined}
                      className={cn(
                        "flex cursor-pointer items-start gap-2 rounded-marker px-3 py-2 text-sm outline-none",
                        active && "bg-accent text-accent-foreground",
                        option.disabled &&
                          "cursor-not-allowed text-muted-foreground opacity-60",
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectOption(option)}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="block truncate text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </span>
                      {selected && (
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </FieldWrapper>
    );
  },
);

Combobox.displayName = "Combobox";
