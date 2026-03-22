import * as React from "react";
import { createPortal } from "react-dom";
import { mergeRefs } from "../lib/merge-refs";
import { cn } from "../lib/utils";
import { useFocusTrap } from "../lib/use-focus-trap";

type DialogContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  titleId: string;
  descriptionId: string;
  descriptionRegistered: boolean;
  setDescriptionRegistered: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(component: string) {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error(`${component} must be used within <Dialog>`);
  return ctx;
}

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

function Dialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
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
    <DialogContext.Provider value={context}>{children}</DialogContext.Provider>
  );
}

export type DialogTriggerProps = {
  asChild?: boolean;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild = false, children, type = "button", onClick, className, ...props }, ref) => {
    const ctx = useDialogContext("DialogTrigger");

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
DialogTrigger.displayName = "DialogTrigger";

export type DialogPortalProps = { children?: React.ReactNode };

function DialogPortal({ children }: DialogPortalProps) {
  const { open } = useDialogContext("DialogPortal");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined" || !open) return null;
  return createPortal(children, document.body);
}

export type DialogOverlayProps = React.HTMLAttributes<HTMLDivElement>;

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, onPointerDown, ...props }, ref) => {
    const { setOpen } = useDialogContext("DialogOverlay");

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
  }
);
DialogOverlay.displayName = "DialogOverlay";

export type DialogContentProps = React.HTMLAttributes<HTMLDivElement>;

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, onPointerDown, ...props }, ref) => {
    const ctx = useDialogContext("DialogContent");
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
      <DialogPortal>
        <DialogOverlay />
        <div
          ref={mergedRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionRegistered ? descriptionId : undefined}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-md border border-border bg-popover p-6 text-popover-foreground shadow-lg outline-none duration-200 ease-out",
            className
          )}
          onPointerDown={(e) => {
            onPointerDown?.(e);
            e.stopPropagation();
          }}
          {...props}
        >
          {children}
        </div>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = "DialogContent";

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-2 text-left sm:text-left",
        className
      )}
      {...props}
    />
  )
);
DialogHeader.displayName = "DialogHeader";

export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
);
DialogFooter.displayName = "DialogFooter";

export type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => {
    const { titleId } = useDialogContext("DialogTitle");
    return (
      <h2
        ref={ref}
        id={titleId}
        className={cn("text-lg font-semibold leading-none tracking-tight", className)}
        {...props}
      />
    );
  }
);
DialogTitle.displayName = "DialogTitle";

export type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(({ className, ...props }, ref) => {
  const { descriptionId, setDescriptionRegistered } = useDialogContext(
    "DialogDescription"
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
DialogDescription.displayName = "DialogDescription";

export type DialogCloseProps = {
  asChild?: boolean;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ asChild = false, children, type = "button", onClick, className, ...props }, ref) => {
    const { setOpen } = useDialogContext("DialogClose");

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
DialogClose.displayName = "DialogClose";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
