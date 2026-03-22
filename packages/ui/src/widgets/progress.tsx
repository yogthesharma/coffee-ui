import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const progressVariants = cva(
  "relative block w-full min-w-[8rem] overflow-hidden rounded-full bg-muted",
  {
    variants: {
      size: {
        sm: "h-1.5",
        default: "h-2",
        lg: "h-2.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const fillClass =
  "h-full rounded-full bg-primary transition-[width] duration-300 ease-out";

export type ProgressProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "role" | "children"
> &
  VariantProps<typeof progressVariants> & {
    value?: number;
    max?: number;
  };

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, size, value, max = 100, ...props }, ref) => {
    const indeterminate = value === undefined;
    const numericValue = Number(value);
    const numericMax = Number(max);
    const pct =
      !indeterminate && numericMax > 0
        ? Math.min(100, Math.max(0, (numericValue / numericMax) * 100))
        : 0;

    return (
      <div
        ref={ref}
        {...props}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={numericMax}
        aria-valuenow={indeterminate ? undefined : numericValue}
        data-state={indeterminate ? "indeterminate" : "determinate"}
        className={cn(progressVariants({ size }), className)}
      >
        {indeterminate ? (
          <div
            className="h-full w-full rounded-full bg-primary/35 animate-pulse"
            aria-hidden
          />
        ) : (
          <div className={fillClass} style={{ width: `${pct}%` }} />
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress, progressVariants };
