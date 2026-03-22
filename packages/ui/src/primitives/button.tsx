import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-card shadow-sm hover:bg-muted hover:text-foreground",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        link: "text-foreground underline decoration-muted-foreground underline-offset-4 transition-colors hover:underline hover:decoration-foreground",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 gap-1.5 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        class:
          "h-auto min-h-0 rounded-sm bg-transparent px-0 py-1 font-medium shadow-none hover:bg-transparent",
      },
      {
        variant: "link",
        size: "sm",
        class: "text-xs py-0.5",
      },
      {
        variant: "link",
        size: "lg",
        class: "text-base py-1",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
