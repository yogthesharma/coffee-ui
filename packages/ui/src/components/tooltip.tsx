import * as React from "react";
import { createPortal } from "react-dom";
import { mergeRefs } from "../lib/merge-refs";
import {
  computePopoverPosition,
  type PopoverAlign,
  type PopoverSide,
} from "../lib/popover-position";
import { cn } from "../lib/utils";

function tooltipArrowClass(placement: PopoverSide) {
  const base =
    "pointer-events-none absolute z-[1] box-border size-2 rotate-45 border-border bg-popover";
  switch (placement) {
    case "top":
      return cn(
        base,
        "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-b border-r"
      );
    case "bottom":
      return cn(
        base,
        "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 border-l border-t"
      );
    case "left":
      return cn(
        base,
        "right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-b border-l"
      );
    case "right":
      return cn(
        base,
        "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-r border-t"
      );
  }
}

type TooltipContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  delayDuration: number;
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

function useTooltipContext(component: string) {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) throw new Error(`${component} must be used within <Tooltip>`);
  return ctx;
}

export type TooltipProps = {
  children?: React.ReactNode;
  /** Delay before showing (ms). */
  delayDuration?: number;
  /** Disable the tooltip. */
  disabled?: boolean;
};

function Tooltip({
  children,
  delayDuration = 300,
  disabled = false,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentId = React.useId();

  const setOpenStable = React.useCallback(
    (next: boolean) => {
      if (disabled) return;
      setOpen(next);
    },
    [disabled]
  );

  const context = React.useMemo(
    () => ({
      open: disabled ? false : open,
      setOpen: setOpenStable,
      triggerRef,
      contentId,
      delayDuration,
    }),
    [open, setOpenStable, contentId, delayDuration, disabled]
  );

  return (
    <TooltipContext.Provider value={context}>{children}</TooltipContext.Provider>
  );
}

export type TooltipTriggerProps = {
  asChild?: boolean;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  (
    {
      asChild = false,
      children,
      type = "button",
      className,
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const { setOpen, delayDuration, triggerRef, contentId, open: tipOpen } =
      useTooltipContext("TooltipTrigger");
    const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimers = React.useCallback(() => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      showTimer.current = null;
      hideTimer.current = null;
    }, []);

    const scheduleShow = React.useCallback(() => {
      clearTimers();
      showTimer.current = setTimeout(() => {
        setOpen(true);
      }, delayDuration);
    }, [clearTimers, setOpen, delayDuration]);

    const scheduleHide = React.useCallback(() => {
      clearTimers();
      hideTimer.current = setTimeout(() => {
        setOpen(false);
      }, 0);
    }, [clearTimers, setOpen]);

    React.useEffect(() => () => clearTimers(), [clearTimers]);

    const handlers = {
      onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
        onPointerEnter?.(e as React.PointerEvent<HTMLButtonElement>);
        if (!e.defaultPrevented) scheduleShow();
      },
      onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
        onPointerLeave?.(e as React.PointerEvent<HTMLButtonElement>);
        if (!e.defaultPrevented) scheduleHide();
      },
      onFocus: (e: React.FocusEvent<HTMLElement>) => {
        onFocus?.(e as React.FocusEvent<HTMLButtonElement>);
        if (!e.defaultPrevented) {
          clearTimers();
          setOpen(true);
        }
      },
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        onBlur?.(e as React.FocusEvent<HTMLButtonElement>);
        if (!e.defaultPrevented) scheduleHide();
      },
    };

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        ref?: React.Ref<unknown>;
        onPointerEnter?: React.PointerEventHandler;
        onPointerLeave?: React.PointerEventHandler;
        onFocus?: React.FocusEventHandler;
        onBlur?: React.FocusEventHandler;
        className?: string;
      }>;
      return React.cloneElement(child, {
        ref: mergeRefs(
          child.props.ref as React.Ref<HTMLElement> | undefined,
          triggerRef,
          ref as React.Ref<HTMLElement>
        ),
        className: cn(className, child.props.className),
        "aria-describedby": tipOpen ? contentId : undefined,
        ...handlers,
        onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
          child.props.onPointerEnter?.(e);
          handlers.onPointerEnter(e);
        },
        onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
          child.props.onPointerLeave?.(e);
          handlers.onPointerLeave(e);
        },
        onFocus: (e: React.FocusEvent<HTMLElement>) => {
          child.props.onFocus?.(e);
          handlers.onFocus(e);
        },
        onBlur: (e: React.FocusEvent<HTMLElement>) => {
          child.props.onBlur?.(e);
          handlers.onBlur(e);
        },
      } as Record<string, unknown>);
    }

    return (
      <button
        ref={mergeRefs(ref, triggerRef as React.Ref<HTMLButtonElement>)}
        type={type}
        className={className}
        aria-describedby={tipOpen ? contentId : undefined}
        {...handlers}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TooltipTrigger.displayName = "TooltipTrigger";

export type TooltipContentProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: PopoverSide;
  align?: PopoverAlign;
  sideOffset?: number;
  alignOffset?: number;
};

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      className,
      children,
      side = "top",
      align = "center",
      sideOffset = 6,
      alignOffset = 0,
      style,
      ...props
    },
    ref
  ) => {
    const { open, triggerRef, contentId } = useTooltipContext("TooltipContent");
    const tipRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = mergeRefs(ref, tipRef);
    const [mounted, setMounted] = React.useState(false);
    const [position, setPosition] = React.useState<{
      top: number;
      left: number;
      placement: PopoverSide;
    }>({ top: 0, left: 0, placement: side });

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const updatePosition = React.useCallback(() => {
      const trigger = triggerRef.current;
      const el = tipRef.current;
      if (!trigger || !el) return;

      const anchorRect = trigger.getBoundingClientRect();
      const cw = el.offsetWidth || 1;
      const ch = el.offsetHeight || 1;
      const { top, left, placement } = computePopoverPosition({
        anchorRect,
        contentWidth: cw,
        contentHeight: ch,
        side,
        align,
        sideOffset,
        alignOffset,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
      setPosition({ top, left, placement });
    }, [triggerRef, side, align, sideOffset, alignOffset]);

    React.useLayoutEffect(() => {
      if (!open) return;
      updatePosition();
      const raf = requestAnimationFrame(() => updatePosition());
      const ro =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => updatePosition())
          : null;
      if (ro && tipRef.current) ro.observe(tipRef.current);
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        cancelAnimationFrame(raf);
        ro?.disconnect();
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, [open, updatePosition]);

    if (!mounted || typeof document === "undefined" || !open) return null;

    return createPortal(
      <div
        ref={mergedRef}
        id={contentId}
        role="tooltip"
        className={cn(
          "relative z-50 max-w-xs overflow-visible rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md",
          className
        )}
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          ...style,
        }}
        {...props}
      >
        <span aria-hidden className={tooltipArrowClass(position.placement)} />
        {children}
      </div>,
      document.body
    );
  }
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent };
