import React from "react";
import { Check } from "lucide-react";
import { cn } from "../../utils";
import { type ComboboxOption } from "../Combobox";

export interface ListboxProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  defaultValue?: string | string[];
  disabled?: boolean;
  multiple?: boolean;
  onValueChange?: (value: string | string[], option: ComboboxOption) => void;
  options: ComboboxOption[];
  value?: string | string[];
}

function asValueArray(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function firstEnabledIndex(options: ComboboxOption[]) {
  return options.findIndex((option) => !option.disabled);
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

export const Listbox = React.forwardRef<HTMLDivElement, ListboxProps>(
  (
    {
      className,
      defaultValue,
      disabled,
      id,
      multiple,
      onKeyDown,
      onValueChange,
      options,
      value,
      ...props
    },
    ref,
  ) => {
    const defaultListboxId = React.useId();
    const listboxId = id || defaultListboxId;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<
      string | string[] | undefined
    >(defaultValue ?? (multiple ? [] : ""));
    const selectedValues = asValueArray(value ?? uncontrolledValue);
    const selectedSet = React.useMemo(
      () => new Set(selectedValues),
      [selectedValues],
    );
    const [activeIndex, setActiveIndex] = React.useState(() =>
      firstEnabledIndex(options),
    );
    const activeOptionId =
      activeIndex >= 0 && options[activeIndex]
        ? `${listboxId}-option-${activeIndex}`
        : undefined;

    React.useEffect(() => {
      setActiveIndex(firstEnabledIndex(options));
    }, [options]);

    const commitOption = (option: ComboboxOption) => {
      if (disabled || option.disabled) return;

      const nextValue = multiple
        ? selectedSet.has(option.value)
          ? selectedValues.filter(
              (selectedValue) => selectedValue !== option.value,
            )
          : [...selectedValues, option.value]
        : option.value;

      if (value === undefined) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue, option);
    };

    return (
      <div
        ref={ref}
        id={listboxId}
        role="listbox"
        aria-activedescendant={activeOptionId}
        aria-disabled={disabled || undefined}
        aria-multiselectable={multiple || undefined}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          "grid max-h-64 min-w-48 gap-1 overflow-auto rounded-control border bg-popover p-3 text-popover-foreground shadow-overlay ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          disabled && "cursor-not-allowed opacity-60",
          className,
        )}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((current) => nextEnabledIndex(options, current, 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((current) => nextEnabledIndex(options, current, -1));
          } else if (event.key === "Home") {
            event.preventDefault();
            setActiveIndex(firstEnabledIndex(options));
          } else if (event.key === "End") {
            event.preventDefault();
            setActiveIndex(nextEnabledIndex(options, 0, -1));
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const option = options[activeIndex];
            if (option) commitOption(option);
          }
          onKeyDown?.(event);
        }}
        {...props}
      >
        {options.map((option, index) => {
          const selected = selectedSet.has(option.value);
          const active = index === activeIndex;

          return (
            <div
              key={option.value}
              id={`${listboxId}-option-${index}`}
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
              onClick={() => commitOption(option)}
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
                <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

Listbox.displayName = "Listbox";
