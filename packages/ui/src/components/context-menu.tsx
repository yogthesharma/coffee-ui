import * as React from "react";
import { createPortal } from "react-dom";
import { clampPointMenuPosition } from "../lib/clamp-point-menu";
import { mergeRefs } from "../lib/merge-refs";
import { cn } from "../lib/utils";

type ContextMenuContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  point: { x: number; y: number } | null;
  setPoint: (p: { x: number; y: number } | null) => void;
  contentId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
};

const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(
  null
);

function useContextMenuContext(component: string) {
  const ctx = React.useContext(ContextMenuContext);
  if (!ctx) throw new Error(`${component} must be used within <ContextMenu>`);
  return ctx;
}

export type ContextMenuSelectEvent = {
  defaultPrevented: boolean;
  preventDefault(): void;
};

function createSelectEvent(): ContextMenuSelectEvent {
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

export type ContextMenuProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

function ContextMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: ContextMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(!!defaultOpen);
  const [point, setPoint] = React.useState<{ x: number; y: number } | null>(null);
  const isControlled = openProp !== undefined;
  const open = isControlled ? !!openProp : uncontrolledOpen;
  const contentId = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!next) setPoint(null);
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const context = React.useMemo(
    () => ({ open, setOpen, point, setPoint, contentId, triggerRef }),
    [open, setOpen, point, contentId]
  );

  return (
    <ContextMenuContext.Provider value={context}>
      {children}
    </ContextMenuContext.Provider>
  );
}

export type ContextMenuTriggerProps = {
  asChild?: boolean;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

const ContextMenuTrigger = React.forwardRef<HTMLElement, ContextMenuTriggerProps>(
  ({ asChild = false, children, onContextMenu, className, ...props }, ref) => {
    const ctx = useContextMenuContext("ContextMenuTrigger");

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        ref?: React.Ref<unknown>;
        onContextMenu?: React.MouseEventHandler;
        className?: string;
      }>;
      return React.cloneElement(child, {
        ref: mergeRefs(
          child.props.ref as React.Ref<HTMLElement> | undefined,
          ctx.triggerRef,
          ref as React.Ref<HTMLElement>
        ),
        className: cn(className, child.props.className),
        onContextMenu: (e: React.MouseEvent) => {
          child.props.onContextMenu?.(e);
          if (e.defaultPrevented) return;
          e.preventDefault();
          ctx.setPoint({ x: e.clientX, y: e.clientY });
          ctx.setOpen(true);
        },
      } as Record<string, unknown>);
    }

    return (
      <div
        ref={mergeRefs(ref, ctx.triggerRef as React.Ref<HTMLDivElement>)}
        className={cn(className)}
        onContextMenu={(e) => {
          onContextMenu?.(e);
          if (e.defaultPrevented) return;
          e.preventDefault();
          ctx.setPoint({ x: e.clientX, y: e.clientY });
          ctx.setOpen(true);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ContextMenuTrigger.displayName = "ContextMenuTrigger";

export type ContextMenuContentProps = React.HTMLAttributes<HTMLDivElement>;

const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(({ className, style, onKeyDown, ...props }, ref) => {
  const { open, setOpen, point, contentId, triggerRef } = useContextMenuContext(
    "ContextMenuContent"
  );
  const menuRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = mergeRefs(ref, menuRef);
  const [mounted, setMounted] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = React.useCallback(() => {
    const el = menuRef.current;
    if (!el || !point) return;
    const cw = el.offsetWidth || 192;
    const ch = el.offsetHeight || 1;
    const { top, left } = clampPointMenuPosition(point.x, point.y, cw, ch);
    setPosition({ top, left });
  }, [point]);

  React.useLayoutEffect(() => {
    if (!open || !point) return;
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
  }, [open, point, updatePosition]);

  React.useLayoutEffect(() => {
    if (!open || !menuRef.current) return;
    const id = requestAnimationFrame(() => {
      const items = menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([data-disabled])'
      );
      items?.[0]?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open, point]);

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
      items[(i + 1) % items.length]?.focus();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
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

  if (!mounted || typeof document === "undefined" || !open || !point) return null;

  return createPortal(
    <div
      ref={mergedRef}
      id={contentId}
      role="menu"
      tabIndex={-1}
      className={cn(
        "z-50 min-w-[10rem] max-w-[min(20rem,calc(100vw-1rem))] max-h-[min(24rem,calc(100vh-2rem))] overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none",
        className
      )}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        ...style,
      }}
      onKeyDown={handleMenuKeyDown}
      {...props}
    />,
    document.body
  );
});
ContextMenuContent.displayName = "ContextMenuContent";

export type ContextMenuItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onSelect"
> & {
  onSelect?: (event: ContextMenuSelectEvent) => void;
  inset?: boolean;
  variant?: "default" | "destructive";
};

const ContextMenuItem = React.forwardRef<HTMLButtonElement, ContextMenuItemProps>(
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
    const { setOpen } = useContextMenuContext("ContextMenuItem");

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
ContextMenuItem.displayName = "ContextMenuItem";

export type ContextMenuLabelProps = React.HTMLAttributes<HTMLDivElement> & {
  inset?: boolean;
};

const ContextMenuLabel = React.forwardRef<HTMLDivElement, ContextMenuLabelProps>(
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
ContextMenuLabel.displayName = "ContextMenuLabel";

export type ContextMenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  ContextMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    aria-orientation="horizontal"
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

export type ContextMenuGroupProps = React.HTMLAttributes<HTMLDivElement>;

const ContextMenuGroup = React.forwardRef<HTMLDivElement, ContextMenuGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="group" className={className} {...props} />
  )
);
ContextMenuGroup.displayName = "ContextMenuGroup";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuGroup,
};
