import * as React from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { mergeRefs } from "../lib/merge-refs";
import { cn } from "../lib/utils";
import { useFocusTrap } from "../lib/use-focus-trap";

type SheetContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  titleId: string;
  descriptionId: string;
  descriptionRegistered: boolean;
  setDescriptionRegistered: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetContext(component: string) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error(`${component} must be used within <Sheet>`);
  return ctx;
}

export type SheetProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

function Sheet({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(!!defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? !!openProp : uncontrolledOpen;
  const [descriptionRegistered, setDescriptionRegistered] = React.useState(false);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const context = React.useMemo(
    () => ({
      open,
      setOpen,
      titleId,
      descriptionId,
      descriptionRegistered,
      setDescriptionRegistered,
      triggerRef,
    }),
    [open, setOpen, titleId, descriptionId, descriptionRegistered]
  );

  return (
    <SheetContext.Provider value={context}>{children}</SheetContext.Provider>
  );
}

export type SheetTriggerProps = {
  asChild?: boolean;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ asChild = false, children, type = "button", onClick, className, ...props }, ref) => {
    const ctx = useSheetContext("SheetTrigger");

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        ref?: React.Ref<unknown>;
        onClick?: React.MouseEventHandler;
        className?: string;
      }>;
      return React.cloneElement(child, {
        ref: mergeRefs(
          child.props.ref as React.Ref<HTMLElement> | undefined,
          ctx.triggerRef,
          ref as React.Ref<HTMLElement>
        ),
        className: cn(className, child.props.className),
        onClick: (e: React.MouseEvent) => {
          child.props.onClick?.(e);
          if (!e.defaultPrevented) ctx.setOpen(true);
        },
      } as Record<string, unknown>);
    }

    return (
      <button
        ref={mergeRefs(ref, ctx.triggerRef as React.Ref<HTMLButtonElement>)}
        type={type}
        className={className}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) ctx.setOpen(true);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SheetTrigger.displayName = "SheetTrigger";

function SheetPortal({ children }: { children?: React.ReactNode }) {
  const { open } = useSheetContext("SheetPortal");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined" || !open) return null;
  return createPortal(children, document.body);
}

const SheetOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, onPointerDown, ...props }, ref) => {
  const { setOpen } = useSheetContext("SheetOverlay");
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-[1px]",
        className
      )}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        if (!e.defaultPrevented) setOpen(false);
      }}
      {...props}
    />
  );
});
SheetOverlay.displayName = "SheetOverlay";

const sheetContentVariants = cva(
  "fixed z-50 flex flex-col gap-4 border border-border bg-popover p-6 text-popover-foreground shadow-lg outline-none transition-transform duration-300 ease-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 max-h-[90vh] overflow-y-auto border-b rounded-b-md",
        bottom:
          "inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto border-t rounded-t-md",
        left: "inset-y-0 left-0 h-full w-full max-w-sm border-r rounded-r-md",
        right: "inset-y-0 right-0 h-full w-full max-w-sm border-l rounded-l-md",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

export type SheetContentProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof sheetContentVariants>;

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, side = "right", children, onPointerDown, ...props }, ref) => {
    const ctx = useSheetContext("SheetContent");
    const { open, setOpen, titleId, descriptionId, descriptionRegistered, triggerRef } =
      ctx;
    const contentRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = mergeRefs(ref, contentRef);

    useFocusTrap(contentRef, {
      active: open,
      restoreTo: triggerRef,
    });

    React.useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open, setOpen]);

    React.useEffect(() => {
      if (!open) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }, [open]);

    return (
      <SheetPortal>
        <SheetOverlay />
        <div
          ref={mergedRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionRegistered ? descriptionId : undefined}
          className={cn(sheetContentVariants({ side }), className)}
          onPointerDown={(e) => {
            onPointerDown?.(e);
            e.stopPropagation();
          }}
          {...props}
        >
          {children}
        </div>
      </SheetPortal>
    );
  }
);
SheetContent.displayName = "SheetContent";

const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 text-left", className)}
    {...props}
  />
));
SheetHeader.displayName = "SheetHeader";

const SheetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
));
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { titleId } = useSheetContext("SheetTitle");
  return (
    <h2
      ref={ref}
      id={titleId}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
});
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { descriptionId, setDescriptionRegistered } = useSheetContext(
    "SheetDescription"
  );

  React.useLayoutEffect(() => {
    setDescriptionRegistered(true);
    return () => setDescriptionRegistered(false);
  }, [setDescriptionRegistered]);

  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
SheetDescription.displayName = "SheetDescription";

export type SheetCloseProps = {
  asChild?: boolean;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
  ({ asChild = false, children, type = "button", onClick, className, ...props }, ref) => {
    const { setOpen } = useSheetContext("SheetClose");

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        ref?: React.Ref<unknown>;
        onClick?: React.MouseEventHandler;
        className?: string;
      }>;
      return React.cloneElement(child, {
        ref: mergeRefs(
          child.props.ref as React.Ref<HTMLElement> | undefined,
          ref as React.Ref<HTMLElement>
        ),
        className: cn(className, child.props.className),
        onClick: (e: React.MouseEvent) => {
          child.props.onClick?.(e);
          if (!e.defaultPrevented) setOpen(false);
        },
      } as Record<string, unknown>);
    }

    return (
      <button
        ref={ref}
        type={type}
        className={className}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setOpen(false);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SheetClose.displayName = "SheetClose";

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
};
