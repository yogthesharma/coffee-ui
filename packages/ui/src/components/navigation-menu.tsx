import * as React from "react";
import { createPortal } from "react-dom";
import { IconChevronDown } from "@tabler/icons-react";
import { mergeRefs } from "../lib/merge-refs";
import {
  computePopoverPosition,
  type PopoverAlign,
  type PopoverSide,
} from "../lib/popover-position";
import { cn } from "../lib/utils";

type NavigationMenuRootContextValue = {
  value: string | null;
  setValue: (next: string | null) => void;
  rootRef: React.RefObject<HTMLElement | null>;
  contentContainerRef: React.MutableRefObject<HTMLElement | null>;
  viewportNode: HTMLDivElement | null;
  setViewportNode: (el: HTMLDivElement | null) => void;
  openOnHover: boolean;
  cancelHoverTimers: () => void;
  beginHoverOpen: (itemValue: string) => void;
  beginHoverClose: () => void;
};

const NavigationMenuRootContext =
  React.createContext<NavigationMenuRootContextValue | null>(null);

function useNavigationMenuRoot(component: string) {
  const ctx = React.useContext(NavigationMenuRootContext);
  if (!ctx) throw new Error(`${component} must be used within <NavigationMenu>`);
  return ctx;
}

type NavigationMenuItemContextValue = {
  value: string;
  open: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
};

const NavigationMenuItemContext =
  React.createContext<NavigationMenuItemContextValue | null>(null);

function useNavigationMenuItem(component: string) {
  const ctx = React.useContext(NavigationMenuItemContext);
  if (!ctx) throw new Error(`${component} must be used within <NavigationMenuItem>`);
  return ctx;
}

export type NavigationMenuProps = React.ComponentProps<"nav"> & {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Open panels on pointer enter (with delay). Click still toggles. */
  openOnHover?: boolean;
  /** ms before opening on hover */
  openDelay?: number;
  /** ms before closing after leaving trigger/content */
  closeDelay?: number;
};

const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      children,
      onKeyDown,
      onPointerLeave,
      openOnHover = false,
      openDelay = 120,
      closeDelay = 200,
      ...props
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState<string | null>(
      defaultValue
    );
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp! : uncontrolled;

    const setValue = React.useCallback(
      (next: string | null) => {
        if (!isControlled) setUncontrolled(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange]
    );

    const rootRef = React.useRef<HTMLElement | null>(null);
    const contentContainerRef = React.useRef<HTMLElement | null>(null);
    const mergedRootRef = mergeRefs(ref, rootRef);
    const [viewportNode, setViewportNode] = React.useState<HTMLDivElement | null>(
      null
    );

    const openTimerRef = React.useRef<ReturnType<typeof setTimeout>>();
    const closeTimerRef = React.useRef<ReturnType<typeof setTimeout>>();

    const cancelHoverTimers = React.useCallback(() => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      openTimerRef.current = undefined;
      closeTimerRef.current = undefined;
    }, []);

    const beginHoverOpen = React.useCallback(
      (itemValue: string) => {
        if (!openOnHover) return;
        cancelHoverTimers();
        openTimerRef.current = setTimeout(() => {
          setValue(itemValue);
        }, openDelay);
      },
      [openOnHover, openDelay, setValue, cancelHoverTimers]
    );

    const beginHoverClose = React.useCallback(() => {
      if (!openOnHover) return;
      cancelHoverTimers();
      closeTimerRef.current = setTimeout(() => {
        setValue(null);
      }, closeDelay);
    }, [openOnHover, closeDelay, setValue, cancelHoverTimers]);

    React.useEffect(() => () => cancelHoverTimers(), [cancelHoverTimers]);

    React.useEffect(() => {
      if (value == null) return;
      const onPointerDown = (e: PointerEvent) => {
        const t = e.target as Node;
        if (rootRef.current?.contains(t)) return;
        if (contentContainerRef.current?.contains(t)) return;
        setValue(null);
      };
      document.addEventListener("pointerdown", onPointerDown, true);
      return () =>
        document.removeEventListener("pointerdown", onPointerDown, true);
    }, [value, setValue]);

    React.useEffect(() => {
      if (value == null) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setValue(null);
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [value, setValue]);

    const ctx = React.useMemo(
      () => ({
        value,
        setValue,
        rootRef,
        contentContainerRef,
        viewportNode,
        setViewportNode,
        openOnHover,
        cancelHoverTimers,
        beginHoverOpen,
        beginHoverClose,
      }),
      [
        value,
        setValue,
        viewportNode,
        openOnHover,
        cancelHoverTimers,
        beginHoverOpen,
        beginHoverClose,
      ]
    );

    const focusTriggers = React.useCallback(() => {
      const root = rootRef.current;
      if (!root) return [] as HTMLElement[];
      return Array.from(
        root.querySelectorAll<HTMLElement>("[data-navigation-menu-trigger]")
      );
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      const triggers = focusTriggers();
      if (triggers.length === 0) return;

      const active = document.activeElement as HTMLElement;
      const fromTrigger = triggers.includes(active);

      if (fromTrigger) {
        const i = triggers.indexOf(active);
        if (e.key === "ArrowRight") {
          e.preventDefault();
          triggers[(i + 1) % triggers.length]?.focus();
          return;
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          triggers[(i - 1 + triggers.length) % triggers.length]?.focus();
          return;
        }
        if (e.key === "Home") {
          e.preventDefault();
          triggers[0]?.focus();
          return;
        }
        if (e.key === "End") {
          e.preventDefault();
          triggers[triggers.length - 1]?.focus();
          return;
        }
        if (e.key === "ArrowDown") {
          const itemValue = active.getAttribute("data-navigation-menu-item-value");
          if (itemValue && value === itemValue) {
            e.preventDefault();
            const panel = contentContainerRef.current;
            const first = panel?.querySelector<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            first?.focus();
          }
        }
      }
    };

    const handleNavPointerLeave = (e: React.PointerEvent<HTMLElement>) => {
      onPointerLeave?.(e);
      if (e.defaultPrevented || !openOnHover) return;
      const next = e.relatedTarget as Node | null;
      if (next && rootRef.current?.contains(next)) return;
      if (next && contentContainerRef.current?.contains(next)) return;
      beginHoverClose();
    };

    return (
      <NavigationMenuRootContext.Provider value={ctx}>
        <nav
          ref={mergedRootRef}
          className={cn("relative z-50 flex max-w-max flex-1 flex-col", className)}
          onKeyDown={handleKeyDown}
          onPointerLeave={handleNavPointerLeave}
          {...props}
        >
          {children}
        </nav>
      </NavigationMenuRootContext.Provider>
    );
  }
);
NavigationMenu.displayName = "NavigationMenu";

export type NavigationMenuListProps = React.ComponentProps<"ul">;

const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  NavigationMenuListProps
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center gap-1",
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

export type NavigationMenuViewportProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Optional Radix-style mount: panels portal into this wrapper (centered under the nav).
 * Place after `NavigationMenuList`. Omit to keep portaling to `document.body` with fixed position.
 */
const NavigationMenuViewport = React.forwardRef<
  HTMLDivElement,
  NavigationMenuViewportProps
>(({ className, ...props }, ref) => {
  const { value, setViewportNode } = useNavigationMenuRoot(
    "NavigationMenuViewport"
  );
  const innerRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const el = innerRef.current;
    setViewportNode(el);
    return () => setViewportNode(null);
  }, [setViewportNode]);

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none absolute left-0 right-0 top-full z-50 flex justify-center pt-1.5",
        className
      )}
      {...props}
    >
      <div
        ref={innerRef}
        data-navigation-menu-viewport=""
        data-state={value ? "open" : "closed"}
        className={cn(
          "pointer-events-auto relative min-h-0 w-max max-w-[min(100vw-2rem,42rem)] origin-top transition-[opacity,transform] duration-200 ease-out",
          value
            ? "opacity-100 scale-100"
            : "pointer-events-none scale-[0.98] opacity-0"
        )}
      />
    </div>
  );
});
NavigationMenuViewport.displayName = "NavigationMenuViewport";

export type NavigationMenuIndicatorProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Optional underline aligned to the active trigger. Place inside `NavigationMenu` (e.g. after the list).
 */
const NavigationMenuIndicator = React.forwardRef<
  HTMLDivElement,
  NavigationMenuIndicatorProps
>(({ className, style, ...props }, ref) => {
  const { value, rootRef } = useNavigationMenuRoot("NavigationMenuIndicator");
  const [metrics, setMetrics] = React.useState<{
    left: number;
    width: number;
  } | null>(null);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!value || !root) {
      setMetrics(null);
      return;
    }
    const triggers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-navigation-menu-trigger]")
    );
    const trigger = triggers.find(
      (el) => el.getAttribute("data-navigation-menu-item-value") === value
    );
    if (!trigger) {
      setMetrics(null);
      return;
    }
    const rootRect = root.getBoundingClientRect();
    const tr = trigger.getBoundingClientRect();
    setMetrics({ left: tr.left - rootRect.left, width: tr.width });
  }, [value, rootRef]);

  if (!metrics) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-primary transition-[left,width,opacity] duration-200 ease-out",
        className
      )}
      style={{
        ...style,
        left: metrics.left,
        width: metrics.width,
      }}
      {...props}
    />
  );
});
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

export type NavigationMenuItemProps = React.ComponentProps<"li"> & {
  value: string;
};

const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  NavigationMenuItemProps
>(({ className, value, children, ...props }, ref) => {
  const { value: openValue } = useNavigationMenuRoot("NavigationMenuItem");
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentId = React.useId();
  const open = openValue === value;

  const itemCtx = React.useMemo(
    () => ({
      value,
      open,
      triggerRef,
      contentId,
    }),
    [value, open, contentId]
  );

  return (
    <NavigationMenuItemContext.Provider value={itemCtx}>
      <li ref={ref} className={cn("relative", className)} {...props}>
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
});
NavigationMenuItem.displayName = "NavigationMenuItem";

export type NavigationMenuTriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> & {
  asChild?: boolean;
  type?: "button" | "submit" | "reset";
};

const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  NavigationMenuTriggerProps
>(
  (
    {
      asChild = false,
      className,
      children,
      type = "button",
      onClick,
      onKeyDown,
      onPointerEnter,
      onPointerLeave,
      ...props
    },
    ref
  ) => {
    const {
      setValue,
      openOnHover,
      cancelHoverTimers,
      beginHoverOpen,
      beginHoverClose,
    } = useNavigationMenuRoot("NavigationMenuTrigger");
    const { value, open, triggerRef, contentId } = useNavigationMenuItem(
      "NavigationMenuTrigger"
    );

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      cancelHoverTimers();
      onClick?.(e as React.MouseEvent<HTMLButtonElement>);
      if (e.defaultPrevented) return;
      setValue(open ? null : value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(e as React.KeyboardEvent<HTMLButtonElement>);
      if (e.defaultPrevented) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        cancelHoverTimers();
        setValue(open ? null : value);
      }
    };

    const hoverEnter = (e: React.PointerEvent<HTMLElement>) => {
      onPointerEnter?.(e as React.PointerEvent<HTMLButtonElement>);
      if (e.defaultPrevented || !openOnHover) return;
      cancelHoverTimers();
      beginHoverOpen(value);
    };

    const hoverLeave = (e: React.PointerEvent<HTMLElement>) => {
      onPointerLeave?.(e as React.PointerEvent<HTMLButtonElement>);
      if (e.defaultPrevented || !openOnHover) return;
      beginHoverClose();
    };

    const triggerClassName = cn(
      "group inline-flex h-10 items-center justify-center gap-1 rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
      open && "bg-muted/80",
      className
    );

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        ref?: React.Ref<unknown>;
        className?: string;
        onClick?: React.MouseEventHandler;
        onKeyDown?: React.KeyboardEventHandler;
        onPointerEnter?: React.PointerEventHandler;
        onPointerLeave?: React.PointerEventHandler;
      }>;
      return React.cloneElement(child, {
        ref: mergeRefs(
          child.props.ref as React.Ref<HTMLElement> | undefined,
          triggerRef,
          ref as React.Ref<HTMLElement>
        ),
        "data-navigation-menu-trigger": "",
        "data-navigation-menu-item-value": value,
        "aria-expanded": open,
        "aria-controls": open ? contentId : undefined,
        "aria-haspopup": "true" as const,
        className: cn(triggerClassName, child.props.className),
        onClick: (e: React.MouseEvent) => {
          child.props.onClick?.(e);
          handleClick(e as React.MouseEvent<HTMLElement>);
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          child.props.onKeyDown?.(e);
          handleKeyDown(e as React.KeyboardEvent<HTMLElement>);
        },
        onPointerEnter: (e: React.PointerEvent) => {
          child.props.onPointerEnter?.(e);
          hoverEnter(e as React.PointerEvent<HTMLElement>);
        },
        onPointerLeave: (e: React.PointerEvent) => {
          child.props.onPointerLeave?.(e);
          hoverLeave(e as React.PointerEvent<HTMLElement>);
        },
      } as Record<string, unknown>);
    }

    return (
      <button
        ref={mergeRefs(ref, triggerRef as React.Ref<HTMLButtonElement>)}
        type={type}
        data-navigation-menu-trigger=""
        data-navigation-menu-item-value={value}
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        aria-haspopup="true"
        className={triggerClassName}
        onClick={(e) => {
          onClick?.(e);
          handleClick(e);
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          handleKeyDown(e);
        }}
        onPointerEnter={(e) => {
          onPointerEnter?.(e);
          hoverEnter(e);
        }}
        onPointerLeave={(e) => {
          onPointerLeave?.(e);
          hoverLeave(e);
        }}
        {...props}
      >
        {children}
        <IconChevronDown
          className={cn(
            "size-4 shrink-0 opacity-70 transition-transform duration-200",
            open && "rotate-180"
          )}
          stroke={1.75}
          aria-hidden
        />
      </button>
    );
  }
);
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

export type NavigationMenuContentProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: PopoverSide;
  align?: PopoverAlign;
  sideOffset?: number;
  alignOffset?: number;
};

const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  NavigationMenuContentProps
>(
  (
    {
      className,
      side = "bottom",
      align = "start",
      sideOffset = 8,
      alignOffset = 0,
      style,
      onKeyDown,
      onPointerEnter,
      onPointerLeave,
      children,
      ...props
    },
    ref
  ) => {
    const {
      contentContainerRef,
      setValue,
      viewportNode,
      openOnHover,
      cancelHoverTimers,
      beginHoverClose,
    } = useNavigationMenuRoot("NavigationMenuContent");
    const { open, triggerRef, contentId, value } = useNavigationMenuItem(
      "NavigationMenuContent"
    );
    const panelRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = mergeRefs(ref, panelRef);
    const [mounted, setMounted] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const [minWidth, setMinWidth] = React.useState<number | undefined>(undefined);

    const useViewport = Boolean(viewportNode);
    const portalTarget = useViewport ? viewportNode! : document.body;

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const updatePosition = React.useCallback(() => {
      if (useViewport) return;
      const trigger = triggerRef.current;
      const el = panelRef.current;
      if (!trigger || !el) return;

      const anchorRect = trigger.getBoundingClientRect();
      const cw = el.offsetWidth || Math.max(anchorRect.width, 280);
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
      setMinWidth(Math.max(anchorRect.width, 200));
    }, [
      triggerRef,
      side,
      align,
      sideOffset,
      alignOffset,
      useViewport,
    ]);

    React.useLayoutEffect(() => {
      if (!open) return;
      const el = panelRef.current;
      contentContainerRef.current = el;
      return () => {
        if (contentContainerRef.current === el) contentContainerRef.current = null;
      };
    }, [open, contentContainerRef]);

    React.useLayoutEffect(() => {
      if (!open || useViewport) return;
      updatePosition();
      const raf = requestAnimationFrame(() => updatePosition());
      const ro =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => updatePosition())
          : null;
      if (ro && panelRef.current) ro.observe(panelRef.current);
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        cancelAnimationFrame(raf);
        ro?.disconnect();
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, [open, updatePosition, useViewport]);

    const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      if (e.key === "Tab") {
        setValue(null);
        return;
      }

      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href]:not([aria-disabled="true"]), button:not([disabled])'
        )
      ).filter((el) => panel.contains(el) && el.tabIndex !== -1);
      const focusables =
        items.length > 0
          ? items
          : Array.from(
              panel.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled])'
              )
            );

      if (focusables.length === 0) return;

      const i = focusables.indexOf(document.activeElement as HTMLElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = focusables[(i + 1) % focusables.length];
        next?.focus();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = focusables[(i - 1 + focusables.length) % focusables.length];
        next?.focus();
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        focusables[0]?.focus();
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        focusables[focusables.length - 1]?.focus();
      }
    };

    const panelPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerEnter?.(e);
      if (e.defaultPrevented || !openOnHover) return;
      cancelHoverTimers();
    };

    const panelPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(e);
      if (e.defaultPrevented || !openOnHover) return;
      beginHoverClose();
    };

    if (!mounted || typeof document === "undefined" || !open) return null;

    const panel = (
      <div
        ref={mergedRef}
        id={contentId}
        role="region"
        data-navigation-menu-content=""
        key={value}
        className={cn(
          "z-50 max-h-[min(24rem,calc(100vh-2rem))] overflow-y-auto rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none coffee-nav-menu-panel-enter",
          useViewport ? "relative" : "fixed",
          className
        )}
        style={
          useViewport
            ? { ...style }
            : {
                position: "fixed",
                top: position.top,
                left: position.left,
                minWidth,
                ...style,
              }
        }
        tabIndex={-1}
        onKeyDown={handlePanelKeyDown}
        onPointerEnter={panelPointerEnter}
        onPointerLeave={panelPointerLeave}
        {...props}
      >
        {children}
      </div>
    );

    return createPortal(panel, portalTarget);
  }
);
NavigationMenuContent.displayName = "NavigationMenuContent";

export type NavigationMenuLinkProps = React.ComponentProps<"a"> & {
  asChild?: boolean;
};

const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(({ className, asChild, children, onClick, ...props }, ref) => {
  const { setValue } = useNavigationMenuRoot("NavigationMenuLink");

  const classes = cn(
    "block select-none rounded-md px-3 py-2 text-sm text-popover-foreground no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
    className
  );

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) setValue(null);
  };

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{
      ref?: React.Ref<unknown>;
      className?: string;
      onClick?: React.MouseEventHandler;
    }>;
    return React.cloneElement(child, {
      ref: mergeRefs(
        child.props.ref as React.Ref<HTMLElement> | undefined,
        ref as React.Ref<HTMLElement>
      ),
      className: cn(classes, child.props.className),
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        handleClick(e as React.MouseEvent<HTMLAnchorElement>);
      },
    } as Record<string, unknown>);
  }

  return (
    <a ref={ref} className={classes} onClick={handleClick} {...props}>
      {children}
    </a>
  );
});
NavigationMenuLink.displayName = "NavigationMenuLink";

export type NavigationMenuSeparatorProps = React.ComponentProps<"li">;

const NavigationMenuSeparator = React.forwardRef<
  HTMLLIElement,
  NavigationMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    aria-hidden
    role="presentation"
    className={cn("flex list-none items-center self-stretch py-2", className)}
    {...props}
  >
    <span className="h-full min-h-[1.5rem] w-px bg-border" />
  </li>
));
NavigationMenuSeparator.displayName = "NavigationMenuSeparator";

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuSeparator,
  NavigationMenuViewport,
  NavigationMenuIndicator,
};
