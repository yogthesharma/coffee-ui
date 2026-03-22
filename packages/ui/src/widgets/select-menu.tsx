import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "../lib/utils";
import { selectVariants } from "./select";

type SelectSize = NonNullable<VariantProps<typeof selectVariants>["size"]>;

type MenuOption = {
  value: string;
  id: string;
  label: React.ReactNode;
  disabled?: boolean;
};

type SelectMenuContextValue = {
  value: string;
  setValue: (v: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  disabled?: boolean;
  size: SelectSize;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
  listboxId: string;
  options: MenuOption[];
  addOption: (o: MenuOption) => void;
  removeOption: (value: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>;
};

const SelectMenuContext = React.createContext<SelectMenuContextValue | null>(
  null
);

function useSelectMenu(component: string) {
  const ctx = React.useContext(SelectMenuContext);
  if (!ctx) throw new Error(`${component} must be used within <SelectMenu>`);
  return ctx;
}

export type SelectMenuProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: SelectSize | null;
};

const SelectMenu = React.forwardRef<HTMLDivElement, SelectMenuProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      disabled,
      size = "default",
      children,
      ...props
    },
    ref
  ) => {
    const listboxId = React.useId();
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = React.useState(false);
    const [internal, setInternal] = React.useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? (valueProp ?? "") : internal;
    const setValue = React.useCallback(
      (v: string) => {
        if (!isControlled) setInternal(v);
        onValueChange?.(v);
      },
      [isControlled, onValueChange]
    );

    const [options, setOptions] = React.useState<MenuOption[]>([]);
    const addOption = React.useCallback((o: MenuOption) => {
      setOptions((prev) => {
        if (prev.some((x) => x.value === o.value)) {
          return prev.map((x) => (x.value === o.value ? o : x));
        }
        return [...prev, o];
      });
    }, []);
    const removeOption = React.useCallback((v: string) => {
      setOptions((prev) => prev.filter((x) => x.value !== v));
    }, []);

    const [highlightedIndex, setHighlightedIndex] = React.useState(0);

    React.useLayoutEffect(() => {
      if (!open) return;
      const enabled = options
        .map((o, i) => (!o.disabled ? i : -1))
        .filter((i) => i >= 0);
      if (!enabled.length) return;
      const selectedIdx = options.findIndex(
        (o) => o.value === value && !o.disabled
      );
      const pick =
        selectedIdx >= 0 && !options[selectedIdx]?.disabled
          ? selectedIdx
          : enabled[0];
      setHighlightedIndex(pick);
    }, [open, value, options]);

    const ctx = React.useMemo<SelectMenuContextValue>(
      () => ({
        value,
        setValue,
        open,
        setOpen,
        disabled,
        size: size ?? "default",
        triggerRef,
        listboxId,
        options,
        addOption,
        removeOption,
        highlightedIndex,
        setHighlightedIndex,
      }),
      [
        value,
        setValue,
        open,
        disabled,
        size,
        listboxId,
        options,
        addOption,
        removeOption,
        highlightedIndex,
      ]
    );

    React.useEffect(() => {
      if (!open) return;
      const onPointer = (e: MouseEvent) => {
        const t = e.target as Node;
        if (
          triggerRef.current?.contains(t) ||
          document.getElementById(listboxId)?.contains(t)
        ) {
          return;
        }
        setOpen(false);
      };
      document.addEventListener("mousedown", onPointer);
      return () => document.removeEventListener("mousedown", onPointer);
    }, [open, listboxId]);

    return (
      <SelectMenuContext.Provider value={ctx}>
        <div
          ref={ref}
          className={cn("relative w-full", className)}
          {...props}
        >
          {children}
        </div>
      </SelectMenuContext.Provider>
    );
  }
);
SelectMenu.displayName = "SelectMenu";

export type SelectMenuTriggerProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    placeholder?: string;
  };

const chevronClass: Record<SelectSize, string> = {
  sm: "size-3.5",
  default: "size-4",
  lg: "size-[1.125rem]",
};

const SelectMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectMenuTriggerProps
>(
  (
    {
      className,
      placeholder = "Choose an option",
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const {
      value,
      open,
      setOpen,
      disabled,
      size,
      triggerRef,
      listboxId,
      options,
    } = useSelectMenu("SelectMenuTrigger");

    const mergedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref, triggerRef]
    );

    const selected = options.find((o) => o.value === value);
    const label = children ?? selected?.label ?? placeholder;

    const sz = size ?? "default";

    return (
      <button
        {...props}
        type="button"
        ref={mergedRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        disabled={disabled}
        className={cn(
          selectVariants({ size: sz }),
          "inline-flex items-center justify-between gap-2 text-left font-normal",
          className
        )}
        onClick={(e) => {
          onClick?.(e);
          if (!disabled) setOpen(!open);
        }}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            setOpen(true);
          }
          onKeyDown?.(e);
        }}
      >
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <IconChevronDown
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-200 ease-out",
            chevronClass[sz],
            open && "rotate-180"
          )}
          stroke={1.75}
          aria-hidden
        />
      </button>
    );
  }
);
SelectMenuTrigger.displayName = "SelectMenuTrigger";

export type SelectMenuContentProps = React.HTMLAttributes<HTMLUListElement>;

const SelectMenuContent = React.forwardRef<
  HTMLUListElement,
  SelectMenuContentProps
>(({ className, children, onKeyDown: onKeyDownProp, ...rest }, ref) => {
  const {
    open,
    setOpen,
    listboxId,
    triggerRef,
    options,
    highlightedIndex,
    setHighlightedIndex,
    setValue,
  } = useSelectMenu("SelectMenuContent");

  const listRef = React.useRef<HTMLUListElement | null>(null);

  const setRefs = React.useCallback(
    (node: HTMLUListElement | null) => {
      listRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  React.useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => listRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  const pickHighlighted = React.useCallback(() => {
    const opt = options[highlightedIndex];
    if (!opt || opt.disabled) return;
    setValue(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  }, [options, highlightedIndex, setValue, setOpen, triggerRef]);

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const enabledIndices = options
      .map((o, i) => (!o.disabled ? i : -1))
      .filter((i) => i >= 0);
    if (!enabledIndices.length) return;

    const pos = enabledIndices.indexOf(highlightedIndex);

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const nextSlot =
          pos < 0 ? 0 : Math.min(pos + 1, enabledIndices.length - 1);
        setHighlightedIndex(enabledIndices[nextSlot]);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const nextSlot = pos <= 0 ? 0 : pos - 1;
        setHighlightedIndex(enabledIndices[nextSlot]);
        break;
      }
      case "Home":
        e.preventDefault();
        setHighlightedIndex(enabledIndices[0]);
        break;
      case "End":
        e.preventDefault();
        setHighlightedIndex(enabledIndices[enabledIndices.length - 1]);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        pickHighlighted();
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      default:
        break;
    }
  };

  const activeId = options[highlightedIndex]?.id;

  return (
    <ul
      ref={setRefs}
      id={listboxId}
      role="listbox"
      tabIndex={-1}
      aria-activedescendant={activeId}
      {...rest}
      className={cn(
        "absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border border-border bg-card py-1 text-sm text-card-foreground shadow-md outline-none transition-shadow duration-200 ease-out focus-visible:outline-none",
        !open && "hidden",
        className
      )}
      onKeyDown={(e) => {
        handleListKeyDown(e);
        onKeyDownProp?.(e);
      }}
    >
      {children}
    </ul>
  );
});
SelectMenuContent.displayName = "SelectMenuContent";

export type SelectMenuItemProps = Omit<
  React.LiHTMLAttributes<HTMLLIElement>,
  "value"
> & {
  value: string;
  disabled?: boolean;
};

const SelectMenuItem = React.forwardRef<HTMLLIElement, SelectMenuItemProps>(
  ({ className, value, disabled: itemDisabled, children, ...props }, ref) => {
    const id = React.useId();
    const {
      addOption,
      removeOption,
      value: groupValue,
      setValue,
      setOpen,
      triggerRef,
      highlightedIndex,
      options,
      setHighlightedIndex,
    } = useSelectMenu("SelectMenuItem");

    React.useLayoutEffect(() => {
      addOption({ value, id, label: children, disabled: itemDisabled });
      return () => removeOption(value);
    }, [value, id, children, itemDisabled, addOption, removeOption]);

    const idx = options.findIndex((o) => o.value === value);
    const highlighted = idx === highlightedIndex;
    const isSelected = groupValue === value;

    return (
      <li
        ref={ref}
        id={id}
        role="option"
        aria-selected={isSelected}
        aria-disabled={itemDisabled}
        data-highlighted={highlighted ? "" : undefined}
        className={cn(
          "relative cursor-pointer select-none px-3 py-2 text-card-foreground outline-none",
          "data-[highlighted]:bg-muted",
          isSelected && "bg-muted/80 font-medium",
          itemDisabled && "cursor-not-allowed opacity-50",
          className
        )}
        onMouseEnter={() => {
          if (!itemDisabled && idx >= 0) setHighlightedIndex(idx);
        }}
        onClick={() => {
          if (itemDisabled) return;
          setValue(value);
          setOpen(false);
          triggerRef.current?.focus();
        }}
        {...props}
      >
        {children}
      </li>
    );
  }
);
SelectMenuItem.displayName = "SelectMenuItem";

export {
  SelectMenu,
  SelectMenuTrigger,
  SelectMenuContent,
  SelectMenuItem,
};
