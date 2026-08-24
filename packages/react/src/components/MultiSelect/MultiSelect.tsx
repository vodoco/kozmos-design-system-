import React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "../../utils";
import { useKozmosAnalytics } from "../../utils/analytics";
import { Chip, ChipGroup } from "../Chip";
import { FieldWrapper } from "../FieldWrapper";
import { type ComboboxOption } from "../Combobox";
import { type InputStatus } from "../Input/Input";

export interface MultiSelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange"
> {
  clearable?: boolean;
  defaultSearchValue?: string;
  defaultValue?: string[];
  disabled?: boolean;
  emptyText?: string;
  error?: boolean | string;
  filterOption?: (option: ComboboxOption, inputValue: string) => boolean;
  helperText?: string;
  label?: string;
  maxSelected?: number;
  onSearchValueChange?: (value: string) => void;
  onValueChange?: (value: string[], options: ComboboxOption[]) => void;
  options: ComboboxOption[];
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  searchValue?: string;
  status?: InputStatus;
  value?: string[];
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

function enabledIndex(
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

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      className,
      clearable = true,
      defaultSearchValue = "",
      defaultValue = [],
      disabled,
      emptyText = "No results found",
      error,
      filterOption = defaultFilterOption,
      helperText,
      id,
      label,
      maxSelected,
      onSearchValueChange,
      onValueChange,
      options,
      placeholder = "Select options",
      readOnly,
      required,
      searchValue,
      status = "default",
      value,
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const { trackEvent } = useKozmosAnalytics();
    const rootRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const defaultInputId = React.useId();
    const errorId = React.useId();
    const helperId = React.useId();
    const listboxId = React.useId();
    const inputId = id || defaultInputId;
    const [open, setOpen] = React.useState(false);
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState<string[]>(defaultValue);
    const selectedValues = value ?? uncontrolledValue;
    const selectedOptions = selectedValues
      .map((selectedValue) =>
        options.find((option) => option.value === selectedValue),
      )
      .filter(Boolean) as ComboboxOption[];
    const [uncontrolledSearchValue, setUncontrolledSearchValue] =
      React.useState(defaultSearchValue);
    const visibleSearchValue = searchValue ?? uncontrolledSearchValue;
    const filteredOptions = React.useMemo(
      () =>
        options.filter((option) => filterOption(option, visibleSearchValue)),
      [filterOption, options, visibleSearchValue],
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
    const selectedSet = React.useMemo(
      () => new Set(selectedValues),
      [selectedValues],
    );
    const atSelectionLimit =
      typeof maxSelected === "number" && selectedValues.length >= maxSelected;
    const canClear =
      clearable && !disabled && !readOnly && selectedValues.length > 0;

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

    const setSearch = (nextValue: string) => {
      if (searchValue === undefined) {
        setUncontrolledSearchValue(nextValue);
      }
      onSearchValueChange?.(nextValue);
    };

    const commitValue = (nextValues: string[]) => {
      if (value === undefined) {
        setUncontrolledValue(nextValues);
      }

      const nextOptions = nextValues
        .map((nextValue) =>
          options.find((option) => option.value === nextValue),
        )
        .filter(Boolean) as ComboboxOption[];

      onValueChange?.(nextValues, nextOptions);
    };

    const toggleOption = (option: ComboboxOption | null) => {
      if (!option || option.disabled || disabled || readOnly) return;

      const exists = selectedSet.has(option.value);
      if (!exists && atSelectionLimit) return;

      const nextValues = exists
        ? selectedValues.filter(
            (selectedValue) => selectedValue !== option.value,
          )
        : [...selectedValues, option.value];

      commitValue(nextValues);
      setSearch("");
      setOpen(true);
      trackEvent("MultiSelect", exists ? "option_removed" : "option_selected", {
        value: option.value,
      });
    };

    const removeValue = (selectedValue: string) => {
      const option = options.find(
        (candidate) => candidate.value === selectedValue,
      );
      commitValue(
        selectedValues.filter((currentValue) => currentValue !== selectedValue),
      );
      trackEvent("MultiSelect", "option_removed", {
        value: selectedValue,
      });
      if (option) inputRef.current?.focus();
    };

    const clearSelection = () => {
      commitValue([]);
      setSearch("");
      setOpen(false);
      trackEvent("MultiSelect", "selection_cleared", {});
    };

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

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
          <div
            ref={setRefs}
            className={cn(
              "flex min-h-11 w-full items-center gap-2 rounded-md border border-[color:var(--primitives-colors-foreground-500)] bg-background px-2 py-1 ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              resolvedStatus === "error" &&
                "border-destructive focus-within:ring-destructive",
              resolvedStatus === "warning" &&
                "border-warning focus-within:ring-warning",
              resolvedStatus === "success" &&
                "border-success focus-within:ring-success",
              disabled &&
                "cursor-not-allowed bg-muted text-muted-foreground opacity-80",
              className,
            )}
            onClick={() => inputRef.current?.focus()}
            {...props}
          >
            <ChipGroup className="min-w-0 flex-1 gap-1.5">
              {selectedOptions.map((option) => (
                <Chip
                  key={option.value}
                  size="sm"
                  selected
                  disabled={disabled || readOnly}
                  onRemove={() => removeValue(option.value)}
                >
                  {option.label}
                </Chip>
              ))}
              <input
                ref={inputRef}
                id={inputId}
                role="combobox"
                aria-autocomplete="list"
                aria-controls={listboxId}
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-activedescendant={activeOptionId}
                aria-describedby={describedBy}
                aria-invalid={resolvedStatus === "error" || undefined}
                aria-required={required || undefined}
                autoComplete="off"
                className="h-8 min-w-24 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-muted-foreground"
                disabled={disabled}
                readOnly={readOnly}
                placeholder={selectedValues.length > 0 ? "" : placeholder}
                value={visibleSearchValue}
                onFocus={() => {
                  if (!disabled && !readOnly) setOpen(true);
                }}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setOpen(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !visibleSearchValue) {
                    const lastValue = selectedValues[selectedValues.length - 1];
                    if (lastValue) removeValue(lastValue);
                  } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setOpen(true);
                    setActiveIndex((current) =>
                      enabledIndex(filteredOptions, current, 1),
                    );
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setOpen(true);
                    setActiveIndex((current) =>
                      enabledIndex(filteredOptions, current, -1),
                    );
                  } else if (event.key === "Enter" && open) {
                    event.preventDefault();
                    toggleOption(activeOption);
                  } else if (event.key === "Escape") {
                    setOpen(false);
                  }
                }}
              />
            </ChipGroup>
            {canClear && (
              <button
                type="button"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground ring-offset-background hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Clear selected options"
                onClick={(event) => {
                  event.stopPropagation();
                  clearSelection();
                }}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground ring-offset-background hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={open ? "Close options" : "Open options"}
              disabled={disabled || readOnly}
              onClick={(event) => {
                event.stopPropagation();
                setOpen((current) => !current);
                inputRef.current?.focus();
              }}
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
              aria-multiselectable="true"
              className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            >
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {emptyText}
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const selected = selectedSet.has(option.value);
                  const disabledOption =
                    option.disabled || (!selected && atSelectionLimit);
                  const active = index === activeIndex;

                  return (
                    <div
                      key={option.value}
                      id={`${inputId}-option-${index}`}
                      role="option"
                      aria-selected={selected}
                      aria-disabled={disabledOption || undefined}
                      className={cn(
                        "flex cursor-pointer items-start gap-2 rounded-sm px-3 py-2 text-sm outline-none",
                        active && "bg-accent text-accent-foreground",
                        disabledOption &&
                          "cursor-not-allowed text-muted-foreground opacity-60",
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() =>
                        !disabledOption ? toggleOption(option) : undefined
                      }
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

MultiSelect.displayName = "MultiSelect";
