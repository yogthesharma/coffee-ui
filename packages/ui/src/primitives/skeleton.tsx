import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const skeletonVariants = cva(
  "animate-pulse bg-muted",
  {
    variants: {
      variant: {
        default: "rounded-md",
        text: "h-4 w-full rounded-sm",
        circular: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof skeletonVariants>;

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Skeleton, skeletonVariants };
