import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const textareaVariants = cva(
  "flex w-full resize-y rounded-md border border-input bg-card text-sm text-card-foreground shadow-sm transition-[color,box-shadow] duration-200 ease-out selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive",
  {
    variants: {
      size: {
        default: "min-h-[60px] px-3 py-2",
        sm: "min-h-[52px] px-2.5 py-2 text-xs",
        lg: "min-h-[72px] px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, ...props }, ref) => (
    <textarea
      className={cn(textareaVariants({ size }), className)}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
