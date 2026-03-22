import * as React from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "../lib/utils";

export type CollapsibleProps = React.DetailsHTMLAttributes<HTMLDetailsElement>;

const Collapsible = React.forwardRef<HTMLDetailsElement, CollapsibleProps>(
  ({ className, ...props }, ref) => (
    <details ref={ref} className={cn("group", className)} {...props} />
  )
);
Collapsible.displayName = "Collapsible";

export type CollapsibleTriggerProps =
  React.ComponentPropsWithoutRef<"summary"> & {
    hideChevron?: boolean;
  };

const CollapsibleTrigger = React.forwardRef<
  HTMLElement,
  CollapsibleTriggerProps
>(({ className, children, hideChevron, ...props }, ref) => (
  <summary
    ref={ref}
    className={cn(
      "flex w-full cursor-pointer list-none items-center gap-2 text-sm font-medium text-foreground outline-none [&::-webkit-details-marker]:hidden",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      !hideChevron && "justify-between",
      className
    )}
    {...props}
  >
    {hideChevron ? (
      children
    ) : (
      <>
        <span className="min-w-0 flex-1 text-left">{children}</span>
        <IconChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-open:rotate-180"
          stroke={1.75}
          aria-hidden
        />
      </>
    )}
  </summary>
));
CollapsibleTrigger.displayName = "CollapsibleTrigger";

export type CollapsibleContentProps = React.HTMLAttributes<HTMLDivElement>;

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-2 border-t border-border-subtle pt-2 text-sm text-foreground/80",
      className
    )}
    {...props}
  />
));
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
