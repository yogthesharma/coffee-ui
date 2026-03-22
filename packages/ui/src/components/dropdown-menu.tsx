import * as React from "react";
import { createPortal } from "react-dom";
import { mergeRefs } from "../lib/merge-refs";
import {
  computePopoverPosition,
  type PopoverAlign,
  type PopoverSide,
} from "../lib/popover-position";
import { cn } from "../lib/utils";

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  contentId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
};

const DropdownMenuContext =
  React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext(component: string) {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) throw new Error(`${component} must be used within <DropdownMenu>`);
  return ctx;
}

export type DropdownMenuSelectEvent = {
  defaultPrevented: boolean;
  preventDefault(): void;
};

function createSelectEvent(): DropdownMenuSelectEvent {
  let prevented = false;
  return {
    get defaultPrevented() {
      return prevented;
    },
    preventDefault() {
      prevented = true;
    },
  };
}

export type DropdownMenuProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

function DropdownMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(!!defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? !!openProp : uncontrolledOpen;
  const contentId = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const context = React.useMemo(
    () => ({ open, setOpen, contentId, triggerRef }),
    [open, setOpen, contentId]
  );

  return (
    <DropdownMenuContext.Provider value={context}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

export type DropdownMenuTriggerProps = {
  asChild?: boolean;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(
  (
    { asChild = false, children, type = "button", onClick, className, ...props },
    ref
  ) => {
    const ctx = useDropdownMenuContext("DropdownMenuTrigger");

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
        "aria-haspopup": "menu" as const,
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
        aria-haspopup="menu"
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
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export type DropdownMenuContentProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: PopoverSide;
  align?: PopoverAlign;
  sideOffset?: number;
  alignOffset?: number;
};

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(
  (
    {
      className,
      side = "bottom",
      align = "start",
      sideOffset = 4,
      alignOffset = 0,
      style,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const { open, setOpen, contentId, triggerRef } = useDropdownMenuContext(
      "DropdownMenuContent"
    );
    const menuRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = mergeRefs(ref, menuRef);
    const [mounted, setMounted] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const [minWidth, setMinWidth] = React.useState<number | undefined>(undefined);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const updatePosition = React.useCallback(() => {
      const trigger = triggerRef.current;
      const el = menuRef.current;
      if (!trigger || !el) return;

      const anchorRect = trigger.getBoundingClientRect();
      const cw = el.offsetWidth || 192;
      const ch = el.offsetHeight || 1;
      const { top, left } = computePopoverPosition({
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
      setPosition({ top, left });
      setMinWidth(Math.max(anchorRect.width, 128));
    }, [triggerRef, side, align, sideOffset, alignOffset]);

    React.useLayoutEffect(() => {
      if (!open) return;
      updatePosition();
      const raf = requestAnimationFrame(() => updatePosition());
      const ro =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => updatePosition())
          : null;
      if (ro && menuRef.current) ro.observe(menuRef.current);
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        cancelAnimationFrame(raf);
        ro?.disconnect();
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, [open, updatePosition]);

    React.useLayoutEffect(() => {
      if (!open || !menuRef.current) return;
      const id = requestAnimationFrame(() => {
        const items = menuRef.current?.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not([data-disabled])'
        );
        items?.[0]?.focus();
      });
      return () => cancelAnimationFrame(id);
    }, [open]);

    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: PointerEvent) => {
        const t = e.target as Node;
        if (menuRef.current?.contains(t)) return;
        if (triggerRef.current?.contains(t)) return;
        setOpen(false);
      };
      document.addEventListener("pointerdown", onPointerDown, true);
      return () =>
        document.removeEventListener("pointerdown", onPointerDown, true);
    }, [open, setOpen, triggerRef]);

    React.useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open, setOpen]);

    const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      const menu = menuRef.current;
      if (!menu) return;

      const items = Array.from(
        menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([data-disabled])')
      );
      if (items.length === 0) return;

      const i = items.indexOf(document.activeElement as HTMLElement);

      if (e.key === "Tab") {
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = items[(i + 1) % items.length];
        next?.focus();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = items[(i - 1 + items.length) % items.length];
        next?.focus();
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        items[0]?.focus();
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        items[items.length - 1]?.focus();
      }
    };

    if (!mounted || typeof document === "undefined" || !open) return null;

    return createPortal(
      <div
        ref={mergedRef}
        id={contentId}
        role="menu"
        tabIndex={-1}
        className={cn(
          "z-50 max-h-[min(24rem,calc(100vh-2rem))] overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none",
          className
        )}
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          minWidth,
          ...style,
        }}
        onKeyDown={handleMenuKeyDown}
        {...props}
      />,
      document.body
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export type DropdownMenuItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onSelect"
> & {
  onSelect?: (event: DropdownMenuSelectEvent) => void;
  inset?: boolean;
  variant?: "default" | "destructive";
};

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  (
    {
      className,
      disabled,
      inset,
      variant = "default",
      onClick,
      onSelect,
      type = "button",
      ...props
    },
    ref
  ) => {
    const { setOpen } = useDropdownMenuContext("DropdownMenuItem");

    return (
      <button
        ref={ref}
        type={type}
        role="menuitem"
        tabIndex={-1}
        disabled={disabled}
        data-disabled={disabled ? "" : undefined}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors duration-150 ease-out",
          "focus:bg-accent focus:text-accent-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          inset && "pl-8",
          variant === "destructive" &&
            "text-destructive focus:bg-destructive/10 focus:text-destructive",
          className
        )}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented || disabled) return;
          const ev = createSelectEvent();
          onSelect?.(ev);
          if (!ev.defaultPrevented) setOpen(false);
        }}
        {...props}
      />
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export type DropdownMenuLabelProps = React.HTMLAttributes<HTMLDivElement> & {
  inset?: boolean;
};

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, inset, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export type DropdownMenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    aria-orientation="horizontal"
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export type DropdownMenuGroupProps = React.HTMLAttributes<HTMLDivElement>;

const DropdownMenuGroup = React.forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="group" className={className} {...props} />
  )
);
DropdownMenuGroup.displayName = "DropdownMenuGroup";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
};
