import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const switchVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent p-0.5 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-muted data-[state=checked]:bg-primary",
  {
    variants: {
      size: {
        sm: "h-4 w-7",
        default: "h-5 w-9",
        lg: "h-6 w-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-card shadow-sm ring-0 transition-[margin] duration-200 ease-out",
  {
    variants: {
      size: {
        sm: "h-3 w-3",
        default: "h-4 w-4",
        lg: "h-5 w-5",
      },
      checked: {
        true: "ml-auto",
        false: "ml-0",
      },
    },
    defaultVariants: {
      size: "default",
      checked: false,
    },
  }
);

export type SwitchProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "role" | "onClick"
> &
  VariantProps<typeof switchVariants> & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  };

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      size = "default",
      checked: checkedProp,
      defaultChecked = false,
      disabled,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState(!!defaultChecked);
    const isControlled = checkedProp !== undefined;
    const checked = isControlled ? !!checkedProp : internal;

    const setChecked = (next: boolean) => {
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    };

    const sz = size ?? "default";

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        ref={ref}
        data-state={checked ? "checked" : "unchecked"}
        className={cn(switchVariants({ size }), className)}
        onClick={() => !disabled && setChecked(!checked)}
        {...props}
      >
        <span
          className={switchThumbVariants({ size: sz, checked })}
          aria-hidden
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch, switchVariants, switchThumbVariants };
