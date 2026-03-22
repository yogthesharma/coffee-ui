import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const toggleVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-transparent hover:bg-muted data-[state=on]:hover:bg-primary/90",
        outline:
          "border border-input bg-card shadow-sm hover:bg-muted data-[state=on]:border-primary",
      },
      size: {
        default: "h-10 min-w-10 px-3",
        sm: "h-9 min-w-9 px-2 text-xs",
        lg: "h-11 min-w-11 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ToggleProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> &
  VariantProps<typeof toggleVariants> & {
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
  };

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      variant,
      size,
      pressed: pressedProp,
      defaultPressed = false,
      disabled,
      onPressedChange,
      type = "button",
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState(!!defaultPressed);
    const isControlled = pressedProp !== undefined;
    const pressed = isControlled ? !!pressedProp : internal;

    const setPressed = (next: boolean) => {
      if (!isControlled) setInternal(next);
      onPressedChange?.(next);
    };

    return (
      <button
        type={type}
        ref={ref}
        aria-pressed={pressed}
        disabled={disabled}
        data-state={pressed ? "on" : "off"}
        className={cn(toggleVariants({ variant, size }), className)}
        onClick={() => !disabled && setPressed(!pressed)}
        {...props}
      />
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
