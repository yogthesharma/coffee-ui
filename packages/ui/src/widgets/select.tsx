import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "../lib/utils";

const selectVariants = cva(
  "flex w-full cursor-pointer appearance-none rounded-md border border-input bg-card text-sm text-card-foreground shadow-sm transition-[color,box-shadow] duration-200 ease-out focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive",
  {
    variants: {
      size: {
        default: "h-10 pl-3 pr-9",
        sm: "h-9 pl-2.5 pr-8 text-xs",
        lg: "h-11 pl-4 pr-10 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const chevronClass: Record<
  NonNullable<VariantProps<typeof selectVariants>["size"]>,
  string
> = {
  sm: "right-2 size-3.5",
  default: "right-2.5 size-4",
  lg: "right-3 size-[1.125rem]",
};

export type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> & {
  size?: "default" | "sm" | "lg";
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size, children, ...props }, ref) => {
    const sz = size ?? "default";
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(selectVariants({ size: sz }), className)}
          {...props}
        >
          {children}
        </select>
        <IconChevronDown
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground",
            chevronClass[sz]
          )}
          stroke={1.75}
          aria-hidden
        />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select, selectVariants };
