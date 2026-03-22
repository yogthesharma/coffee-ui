import * as React from "react";
import { cn } from "../lib/utils";

export type KbdProps = React.HTMLAttributes<HTMLElement>;

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-[1.25rem] select-none items-center justify-center gap-1 rounded border border-border bg-muted px-1 font-mono text-[0.6875rem] font-medium text-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Kbd.displayName = "Kbd";

export { Kbd };
