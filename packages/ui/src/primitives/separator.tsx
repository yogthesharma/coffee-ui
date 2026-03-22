import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const separatorVariants = cva("shrink-0 bg-border", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-auto min-h-6 w-px self-stretch",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export type SeparatorProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof separatorVariants> & {
    decorative?: boolean;
  };

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={
        decorative ? undefined : orientation === "vertical" ? "vertical" : "horizontal"
      }
      aria-hidden={decorative ? true : undefined}
      className={cn(separatorVariants({ orientation }), className)}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

export { Separator, separatorVariants };
