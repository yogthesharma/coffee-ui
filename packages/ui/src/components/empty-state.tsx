import * as React from "react";
import { cn } from "../lib/utils";

export type EmptyStateProps = React.HTMLAttributes<HTMLDivElement>;

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/40 px-6 py-10 text-center",
        className
      )}
      {...props}
    />
  )
);
EmptyState.displayName = "EmptyState";

const EmptyStateIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6",
      className
    )}
    aria-hidden
    {...props}
  />
));
EmptyStateIcon.displayName = "EmptyStateIcon";

const EmptyStateTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-balance text-base font-semibold text-foreground", className)}
    {...props}
  />
));
EmptyStateTitle.displayName = "EmptyStateTitle";

const EmptyStateDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground",
      className
    )}
    {...props}
  />
));
EmptyStateDescription.displayName = "EmptyStateDescription";

const EmptyStateActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-1 flex flex-wrap items-center justify-center gap-2", className)}
    {...props}
  />
));
EmptyStateActions.displayName = "EmptyStateActions";

export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
};
