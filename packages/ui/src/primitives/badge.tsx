import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex shrink-0 items-center rounded-full border font-semibold transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border bg-card text-card-foreground",
        destructive:
          "border-transparent bg-destructive text-primary-foreground",
        success:
          "border-transparent bg-chart-2/15 text-chart-2 dark:bg-chart-2/20",
        warning:
          "border-transparent bg-chart-5/15 text-chart-5 dark:bg-chart-5/25",
        info: "border-transparent bg-chart-3/15 text-chart-3 dark:bg-chart-3/25",
        muted:
          "border-transparent bg-muted text-muted-foreground",
        accent:
          "border-transparent bg-accent text-accent-foreground",
        "success-solid":
          "border-transparent bg-chart-2 text-primary-foreground",
        "warning-solid":
          "border-transparent bg-chart-5 text-primary-foreground",
        "info-solid":
          "border-transparent bg-chart-3 text-primary-foreground",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-1.5 py-0 text-[0.625rem] leading-tight",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
