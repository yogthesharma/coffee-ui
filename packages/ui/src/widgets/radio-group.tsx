import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const radioGroupItemVariants = cva(
  "shrink-0 rounded-full border border-input bg-card text-primary accent-primary transition-[color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive",
  {
    variants: {
      size: {
        sm: "h-3.5 w-3.5",
        default: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

type RadioGroupContextValue = {
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  size: NonNullable<VariantProps<typeof radioGroupItemVariants>["size"]>;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null
);

function useRadioGroupContext(component: string) {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <RadioGroup>`);
  }
  return ctx;
}

export type RadioGroupProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: VariantProps<typeof radioGroupItemVariants>["size"];
};

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
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
    const name = React.useId();
    const [internal, setInternal] = React.useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? (valueProp ?? "") : internal;

    const setValue = React.useCallback(
      (next: string) => {
        if (!isControlled) setInternal(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange]
    );

    const ctx = React.useMemo<RadioGroupContextValue>(
      () => ({
        name,
        value,
        onValueChange: setValue,
        disabled,
        size: size ?? "default",
      }),
      [name, value, setValue, disabled, size]
    );

    return (
      <RadioGroupContext.Provider value={ctx}>
        <div
          ref={ref}
          role="radiogroup"
          className={cn("grid gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export type RadioGroupItemProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "checked" | "defaultChecked"
> &
  VariantProps<typeof radioGroupItemVariants> & {
    value: string;
  };

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  (
    {
      className,
      size: sizeProp,
      value,
      disabled: itemDisabled,
      onChange,
      ...props
    },
    ref
  ) => {
    const ctx = useRadioGroupContext("RadioGroupItem");
    const size = sizeProp ?? ctx.size;
    const checked = ctx.value === value;

    return (
      <input
        type="radio"
        ref={ref}
        name={ctx.name}
        value={value}
        checked={checked}
        disabled={ctx.disabled || itemDisabled}
        className={cn(radioGroupItemVariants({ size }), className)}
        onChange={(e) => {
          ctx.onValueChange(value);
          onChange?.(e);
        }}
        {...props}
      />
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem, radioGroupItemVariants };
