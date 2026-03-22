import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const checkboxVariants = cva(
  "shrink-0 rounded border border-input bg-card text-primary accent-primary transition-[color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive",
  {
    variants: {
      size: {
        default: "size-4",
        sm: "size-3.5",
        lg: "size-[1.125rem]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  /** Visual size (not the HTML `size` attribute). */
  size?: "default" | "sm" | "lg";
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size, type = "checkbox", ...props }, ref) => (
    <input
      type={type}
      className={cn(checkboxVariants({ size }), className)}
      ref={ref}
      {...props}
    />
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
