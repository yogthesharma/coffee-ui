import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-card text-sm text-card-foreground shadow-sm transition-[color,box-shadow] duration-200 ease-out selection:bg-primary selection:text-primary-foreground file:mr-3 file:inline-flex file:h-8 file:shrink-0 file:cursor-pointer file:items-center file:rounded-sm file:border-0 file:bg-muted file:px-3 file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive",
  {
    variants: {
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5 text-xs file:h-7 file:px-2.5 file:text-[0.6875rem]",
        lg: "h-11 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  size?: "default" | "sm" | "lg";
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", size, ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants({ size }), className)}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input, inputVariants };
