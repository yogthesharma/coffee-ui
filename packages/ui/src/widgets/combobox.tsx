import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { IconChevronDown } from "@tabler/icons-react";
import { buttonVariants } from "../primitives/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  type CommandItemProps,
  CommandList,
  CommandSeparator,
} from "../components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/popover";
import { cn } from "../lib/utils";

type ComboboxContextValue = {
  value: string;
  setValue: (v: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
};

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useCombobox(component: string) {
  const ctx = React.useContext(ComboboxContext);
  if (!ctx) throw new Error(`${component} must be used within <Combobox>`);
  return ctx;
}

export type ComboboxProps = {
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function Combobox({
  children,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: ComboboxProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isValueControlled = valueProp !== undefined;
  const value = isValueControlled ? valueProp! : internalValue;

  const setValue = React.useCallback(
    (v: string) => {
      if (!isValueControlled) setInternalValue(v);
      onValueChange?.(v);
    },
    [isValueControlled, onValueChange]
  );

  const [internalOpen, setInternalOpen] = React.useState(!!defaultOpen);
  const isOpenControlled = openProp !== undefined;
  const open = isOpenControlled ? !!openProp : internalOpen;

  const setOpen = React.useCallback(
    (o: boolean) => {
      if (!isOpenControlled) setInternalOpen(o);
      onOpenChange?.(o);
    },
    [isOpenControlled, onOpenChange]
  );

  const ctx = React.useMemo(
    () => ({ value, setValue, open, setOpen }),
    [value, setValue, open, setOpen]
  );

  return (
    <ComboboxContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  );
}

export type ComboboxTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Matches `Button` sizes (`icon` is not supported on combobox triggers). */
  size?: Exclude<VariantProps<typeof buttonVariants>["size"], "icon">;
  /** Hide the trailing chevron (e.g. paired with a separate affordance). */
  hideChevron?: boolean;
};

type ComboboxTriggerSize = NonNullable<ComboboxTriggerProps["size"]>;

const triggerMinWidth: Record<ComboboxTriggerSize, string> = {
  sm: "min-w-[10rem]",
  default: "min-w-[12rem]",
  lg: "min-w-[14rem]",
};

const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  ComboboxTriggerProps
>(
  (
    { className, children, size: sizeProp, hideChevron = false, ...props },
    ref
  ) => {
    useCombobox("ComboboxTrigger");
    const size: ComboboxTriggerSize = sizeProp ?? "default";
    const chevronClass =
      size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4";
    return (
      <PopoverTrigger
        ref={ref}
        type="button"
        role="combobox"
        className={cn(
          buttonVariants({ variant: "outline", size }),
          triggerMinWidth[size],
          "justify-between gap-2 font-normal",
          size === "sm" && "px-2.5",
          size === "default" && "px-3",
          size === "lg" && "px-4",
          className
        )}
        {...props}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-left">
          {children}
        </span>
        {!hideChevron ? (
          <IconChevronDown
            stroke={1.75}
            className={cn(chevronClass, "shrink-0 opacity-50")}
            aria-hidden
          />
        ) : null}
      </PopoverTrigger>
    );
  }
);
ComboboxTrigger.displayName = "ComboboxTrigger";

export type ComboboxContentProps = React.ComponentPropsWithoutRef<
  typeof PopoverContent
>;

const ComboboxContent = React.forwardRef<
  HTMLDivElement,
  ComboboxContentProps
>(({ className, align = "start", ...props }, ref) => (
  <PopoverContent
    ref={ref}
    align={align}
    className={cn("p-0 min-w-[12rem]", className)}
    {...props}
  />
));
ComboboxContent.displayName = "ComboboxContent";

export type ComboboxItemProps = CommandItemProps;

const ComboboxItem = React.forwardRef<HTMLButtonElement, ComboboxItemProps>(
  ({ onSelect, className, value, ...rest }, ref) => {
    const ctx = useCombobox("ComboboxItem");
    const selected = value !== "" && ctx.value === value;
    return (
      <CommandItem
        ref={ref}
        {...rest}
        value={value}
        aria-selected={selected}
        className={cn(
          selected &&
            "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
          className
        )}
        onSelect={() => {
          ctx.setValue(value);
          ctx.setOpen(false);
          onSelect?.();
        }}
      />
    );
  }
);
ComboboxItem.displayName = "ComboboxItem";

export {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
};
