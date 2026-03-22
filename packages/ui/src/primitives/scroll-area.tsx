import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const scrollAreaVariants = cva(
  "overflow-auto overscroll-contain rounded-md border border-border bg-card",
  {
    variants: {
      size: {
        sm: "max-h-48",
        default: "max-h-72",
        lg: "max-h-[28rem]",
        none: "",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const scrollbarClass =
  "[scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent";

export type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof scrollAreaVariants>;

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(scrollAreaVariants({ size }), scrollbarClass, className)}
      {...props}
    />
  )
);
ScrollArea.displayName = "ScrollArea";

export { ScrollArea, scrollAreaVariants };
