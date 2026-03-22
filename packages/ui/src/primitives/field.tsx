import * as React from "react";
import { cn } from "../lib/utils";

export type FieldProps = React.HTMLAttributes<HTMLDivElement>;

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
);
Field.displayName = "Field";

export type FieldLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-snug text-foreground",
        className
      )}
      {...props}
    />
  )
);
FieldLabel.displayName = "FieldLabel";

export type FieldDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
FieldDescription.displayName = "FieldDescription";

export type FieldErrorProps = React.HTMLAttributes<HTMLParagraphElement>;

const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      role="alert"
      className={cn(
        "text-sm font-medium text-destructive",
        className
      )}
      {...props}
    />
  )
);
FieldError.displayName = "FieldError";

export { Field, FieldLabel, FieldDescription, FieldError };
