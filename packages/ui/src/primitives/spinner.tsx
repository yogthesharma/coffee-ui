import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { IconLoader2 } from "@tabler/icons-react";
import { cn } from "../lib/utils";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "size-3.5",
      default: "size-4",
      lg: "size-5",
    },
    tone: {
      default: "text-muted-foreground",
      onPrimary: "text-primary-foreground/85",
      inherit: "text-current",
    },
  },
  defaultVariants: {
    size: "default",
    tone: "default",
  },
});

export type SpinnerProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof spinnerVariants> & {
    label?: string;
  };

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, tone, label = "Loading", ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      aria-live="polite"
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      {...props}
    >
      <IconLoader2 className={cn(spinnerVariants({ size, tone }))} aria-hidden />
    </span>
  )
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
