import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { toggleVariants } from "../primitives/toggle";
import { cn } from "../lib/utils";

type ToggleVariant = VariantProps<typeof toggleVariants>["variant"];
type ToggleSize = VariantProps<typeof toggleVariants>["size"];

type ToggleGroupBaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> & {
  disabled?: boolean;
  variant?: ToggleVariant;
  size?: ToggleSize;
};

type ToggleGroupSingleProps = ToggleGroupBaseProps & {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type ToggleGroupMultipleProps = ToggleGroupBaseProps & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

type ToggleGroupContextValue = {
  type: "single" | "multiple";
  valueSingle: string;
  valueMultiple: string[];
  setSingle: (next: string) => void;
  setMultiple: (next: string[]) => void;
  disabled?: boolean;
  variant?: ToggleVariant;
  size: ToggleSize;
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(
  null
);

function useToggleGroup(component: string) {
  const ctx = React.useContext(ToggleGroupContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <ToggleGroup>`);
  }
  return ctx;
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (props, ref) => {
    const {
      className,
      type,
      value,
      defaultValue,
      onValueChange,
      disabled,
      variant,
      size = "default",
      children,
      ...domRest
    } = props;

    const onValueChangeSingle =
      type === "single" ? onValueChange : undefined;
    const onValueChangeMultiple =
      type === "multiple" ? onValueChange : undefined;

    const [internalSingle, setInternalSingle] = React.useState(
      type === "single" ? (defaultValue ?? "") : ""
    );
    const [internalMultiple, setInternalMultiple] = React.useState<string[]>(
      type === "multiple" ? (defaultValue ?? []) : []
    );

    const isSingle = type === "single";
    const isControlledSingle = isSingle && value !== undefined;
    const isControlledMultiple = !isSingle && value !== undefined;

    const valueSingle = isSingle
      ? isControlledSingle
        ? (value as string) ?? ""
        : internalSingle
      : "";

    const valueMultiple = !isSingle
      ? isControlledMultiple
        ? (value as string[]) ?? []
        : internalMultiple
      : [];

    const setSingle = React.useCallback(
      (next: string) => {
        if (!isControlledSingle) setInternalSingle(next);
        onValueChangeSingle?.(next);
      },
      [isControlledSingle, onValueChangeSingle]
    );

    const setMultiple = React.useCallback(
      (next: string[]) => {
        if (!isControlledMultiple) setInternalMultiple(next);
        onValueChangeMultiple?.(next);
      },
      [isControlledMultiple, onValueChangeMultiple]
    );

    const ctx = React.useMemo<ToggleGroupContextValue>(
      () => ({
        type,
        valueSingle,
        valueMultiple,
        setSingle,
        setMultiple,
        disabled,
        variant,
        size,
      }),
      [
        type,
        valueSingle,
        valueMultiple,
        setSingle,
        setMultiple,
        disabled,
        variant,
        size,
      ]
    );

    return (
      <ToggleGroupContext.Provider value={ctx}>
        <div
          ref={ref}
          role="group"
          className={cn("flex flex-wrap items-center gap-1", className)}
          {...domRest}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

export type ToggleGroupItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> &
  VariantProps<typeof toggleVariants> & {
    value: string;
  };

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>(
  (
    {
      className,
      value,
      variant: variantProp,
      size: sizeProp,
      disabled: itemDisabled,
      onClick,
      ...rest
    },
    ref
  ) => {
    const ctx = useToggleGroup("ToggleGroupItem");
    const variant = variantProp ?? ctx.variant;
    const size = sizeProp ?? ctx.size;

    const pressed =
      ctx.type === "single"
        ? ctx.valueSingle === value
        : ctx.valueMultiple.includes(value);

    const disabled = ctx.disabled || itemDisabled;

    return (
      <button
        type="button"
        ref={ref}
        aria-pressed={pressed}
        disabled={disabled}
        data-state={pressed ? "on" : "off"}
        data-slot="toggle-group-item"
        className={cn(toggleVariants({ variant, size }), className)}
        onClick={(e) => {
          if (disabled) return;
          if (ctx.type === "single") {
            const next = ctx.valueSingle === value ? "" : value;
            ctx.setSingle(next);
          } else {
            const has = ctx.valueMultiple.includes(value);
            const next = has
              ? ctx.valueMultiple.filter((v) => v !== value)
              : [...ctx.valueMultiple, value];
            ctx.setMultiple(next);
          }
          onClick?.(e);
        }}
        {...rest}
      />
    );
  }
);
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
