import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconBell,
  IconCircleCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import { cn } from "../lib/utils";

const alertVariants = cva(
  "relative w-full rounded-md border px-4 py-3 text-sm transition-colors duration-200 ease-out [&_p]:leading-relaxed",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-foreground",
        destructive:
          "border-destructive/35 bg-destructive/10 text-foreground dark:border-destructive/40 dark:bg-destructive/15",
        success:
          "border-chart-2/40 bg-chart-2/10 text-foreground dark:border-chart-2/35 dark:bg-chart-2/15",
        warning:
          "border-chart-5/40 bg-chart-5/10 text-foreground dark:border-chart-5/35 dark:bg-chart-5/20",
        info:
          "border-chart-3/40 bg-chart-3/10 text-foreground dark:border-chart-3/35 dark:bg-chart-3/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>;

const alertTablerIcons = {
  default: IconBell,
  destructive: IconAlertCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  info: IconInfoCircle,
} as const;

const alertIconColor: Record<AlertVariant, string> = {
  default: "text-muted-foreground",
  destructive: "text-destructive",
  success: "text-chart-2",
  warning: "text-chart-5",
  info: "text-chart-3",
};

export type AlertProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    /** Hide the variant icon. */
    showIcon?: boolean;
    /** Replace the default Tabler icon for this variant. */
    icon?: React.ReactNode;
  };

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant: variantProp,
      showIcon = true,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const variant = variantProp ?? "default";
    const IconComponent = alertTablerIcons[variant];
    const iconTone = alertIconColor[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), "flex gap-3", className)}
        {...props}
      >
        {showIcon ? (
          <span
            className={cn(
              "flex shrink-0 pt-0.5 [&_svg]:size-[1.125rem]",
              iconTone
            )}
            aria-hidden
          >
            {icon ?? <IconComponent stroke={1.75} />}
          </span>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-1">{children}</div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90 [&_p+&]:mt-2", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants, alertTablerIcons };
