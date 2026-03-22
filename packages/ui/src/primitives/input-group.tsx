import * as React from "react";
import { cn } from "../lib/utils";
import { inputVariants, type InputProps } from "./input";

export type InputGroupProps = React.HTMLAttributes<HTMLDivElement>;

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex w-full items-stretch overflow-hidden rounded-md border border-input bg-card shadow-sm transition-[color,box-shadow] duration-200 ease-out",
        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        className
      )}
      {...props}
    />
  )
);
InputGroup.displayName = "InputGroup";

export type InputGroupAddonProps = React.HTMLAttributes<HTMLSpanElement> & {
  align?: "inline-start" | "inline-end";
};

const InputGroupAddon = React.forwardRef<HTMLSpanElement, InputGroupAddonProps>(
  ({ className, align = "inline-start", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "flex shrink-0 items-center border-border bg-muted px-3 text-sm text-muted-foreground select-none",
        align === "inline-end" && "border-l",
        align === "inline-start" && "border-r",
        className
      )}
      {...props}
    />
  )
);
InputGroupAddon.displayName = "InputGroupAddon";

export type InputGroupInputProps = InputProps;

const InputGroupInput = React.forwardRef<HTMLInputElement, InputGroupInputProps>(
  ({ className, size, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        inputVariants({ size }),
        "min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none",
        "focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
        "aria-invalid:border-transparent aria-invalid:ring-0",
        className
      )}
      {...props}
    />
  )
);
InputGroupInput.displayName = "InputGroupInput";

export { InputGroup, InputGroupAddon, InputGroupInput };
