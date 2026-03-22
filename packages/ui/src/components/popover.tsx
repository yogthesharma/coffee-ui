import * as React from "react";
import { createPortal } from "react-dom";
import { mergeRefs } from "../lib/merge-refs";
import { cn } from "../lib/utils";
import {
  computePopoverPosition,
  type PopoverAlign,
  type PopoverSide,
} from "../lib/popover-position";

type PopoverContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  contentId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  anchorRef: React.RefObject<HTMLElement | null>;
};

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopoverContext(component: string) {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) throw new Error(`${component} must be used within <Popover>`);
  return ctx;
}

export type PopoverProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

function Popover({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(!!defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? !!openProp : uncontrolledOpen;
  const contentId = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const anchorRef = React.useRef<HTMLElement | null>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const context = React.useMemo(
    () => ({ open, setOpen, contentId, triggerRef, anchorRef }),
    [open, setOpen, contentId]
  );

  return (
    <PopoverContext.Provider value={context}>{children}</PopoverContext.Provider>
  );
}

export type PopoverTriggerProps = {
  asChild?: boolean;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild = false, children, type = "button", onClick, className, ...props }, ref) => {
    const ctx = usePopoverContext("PopoverTrigger");

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
        "aria-expanded": ctx.open,
        "aria-haspopup": "dialog" as const,
        "aria-controls": ctx.contentId,
        onClick: (e: React.MouseEvent) => {
          child.props.onClick?.(e);
          if (!e.defaultPrevented) ctx.setOpen(!ctx.open);
        },
      } as Record<string, unknown>);
    }

    return (
      <button
        ref={mergeRefs(ref, ctx.triggerRef as React.Ref<HTMLButtonElement>)}
        type={type}
        className={className}
        aria-expanded={ctx.open}
        aria-haspopup="dialog"
        aria-controls={ctx.contentId}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) ctx.setOpen(!ctx.open);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
PopoverTrigger.displayName = "PopoverTrigger";

export type PopoverAnchorProps = {
  asChild?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const PopoverAnchor = React.forwardRef<HTMLDivElement, PopoverAnchorProps>(
  ({ asChild = false, children, className, ...props }, ref) => {
    const ctx = usePopoverContext("PopoverAnchor");

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        ref?: React.Ref<unknown>;
        className?: string;
      }>;
      return React.cloneElement(child, {
        ref: mergeRefs(
          child.props.ref as React.Ref<HTMLElement> | undefined,
          ctx.anchorRef,
          ref as React.Ref<HTMLElement>
        ),
        className: cn(className, child.props.className),
      } as Record<string, unknown>);
    }

    return (
      <div
        ref={mergeRefs(ref, ctx.anchorRef as React.Ref<HTMLDivElement>)}
        className={cn("inline-flex", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PopoverAnchor.displayName = "PopoverAnchor";

export type PopoverContentProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: PopoverSide;
  align?: PopoverAlign;
  sideOffset?: number;
  alignOffset?: number;
};

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      className,
      side = "bottom",
      align = "center",
      sideOffset = 4,
      alignOffset = 0,
      style,
      onPointerDown,
      ...props
    },
    ref
  ) => {
    const { open, setOpen, contentId, triggerRef, anchorRef } = usePopoverContext(
      "PopoverContent"
    );
    const contentRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = mergeRefs(ref, contentRef);
    const [mounted, setMounted] = React.useState(false);

    const [position, setPosition] = React.useState<{
      top: number;
      left: number;
    }>({ top: 0, left: 0 });

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const updatePosition = React.useCallback(() => {
      const anchorEl = anchorRef.current ?? triggerRef.current;
      const contentEl = contentRef.current;
      if (!anchorEl || !contentEl) return;

      const anchorRect = anchorEl.getBoundingClientRect();
      const cw = contentEl.offsetWidth;
      const ch = contentEl.offsetHeight;
      const { top, left } = computePopoverPosition({
        anchorRect,
        contentWidth: cw || 288,
        contentHeight: ch || 1,
        side,
        align,
        sideOffset,
        alignOffset,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
      setPosition({ top, left });
    }, [anchorRef, triggerRef, side, align, sideOffset, alignOffset]);

    React.useLayoutEffect(() => {
      if (!open) return;
      updatePosition();
      const raf = requestAnimationFrame(() => updatePosition());
      const ro =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => updatePosition())
          : null;
      if (ro && contentRef.current) ro.observe(contentRef.current);
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        cancelAnimationFrame(raf);
        ro?.disconnect();
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, [open, updatePosition]);

    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: PointerEvent) => {
        const t = e.target as Node;
        if (contentRef.current?.contains(t)) return;
        if (triggerRef.current?.contains(t)) return;
        if (anchorRef.current?.contains(t)) return;
        setOpen(false);
      };
      document.addEventListener("pointerdown", onPointerDown, true);
      return () =>
        document.removeEventListener("pointerdown", onPointerDown, true);
    }, [open, setOpen, triggerRef, anchorRef]);

    React.useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open, setOpen]);

    if (!mounted || typeof document === "undefined" || !open) return null;

    return createPortal(
      <div
        ref={mergedRef}
        id={contentId}
        role="dialog"
        className={cn(
          "z-50 w-72 max-w-[calc(100vw-1rem)] rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          className
        )}
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          ...style,
        }}
        onPointerDown={(e) => {
          onPointerDown?.(e);
          e.stopPropagation();
        }}
        {...props}
      />,
      document.body
    );
  }
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
