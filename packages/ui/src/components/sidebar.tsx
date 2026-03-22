import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { IconChevronLeft, IconMenu2 } from "@tabler/icons-react";
import { mergeRefs } from "../lib/merge-refs";
import { cn } from "../lib/utils";
import { Sheet, SheetContent, SheetTitle } from "./sheet";

type SidebarContextValue = {
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within <SidebarProvider>");
  }
  return ctx;
}

export type SidebarProviderProps = {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
};

function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [openMobile, setOpenMobile] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  const value = React.useMemo(
    () => ({
      openMobile,
      setOpenMobile,
      collapsed,
      setCollapsed,
      toggleCollapsed,
    }),
    [openMobile, collapsed, toggleCollapsed]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export type SidebarProps = React.ComponentProps<"aside">;

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, ...props }, ref) => {
    const { collapsed } = useSidebar();
    return (
      <aside
        ref={ref}
        data-sidebar="desktop"
        data-collapsed={collapsed ? "" : undefined}
        className={cn(
          "flex h-full min-h-0 w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out",
          collapsed && "w-14",
          className
        )}
        {...props}
      />
    );
  }
);
Sidebar.displayName = "Sidebar";

export type SidebarInsetProps = React.ComponentProps<"main">;

const SidebarInset = React.forwardRef<HTMLElement, SidebarInsetProps>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col bg-background text-foreground",
        className
      )}
      {...props}
    />
  )
);
SidebarInset.displayName = "SidebarInset";

export type SidebarMobileProps = { children?: React.ReactNode };

function SidebarMobile({ children }: SidebarMobileProps) {
  const { openMobile, setOpenMobile } = useSidebar();
  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent
        side="left"
        className={cn(
          "flex w-[min(100%,20rem)] max-w-[min(100vw-1rem,20rem)] flex-col gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
        )}
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div
          data-sidebar="mobile"
          className="flex h-full min-h-0 flex-col overflow-hidden"
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export type SidebarTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(({ className, children, type = "button", onClick, ...props }, ref) => {
  const { setOpenMobile } = useSidebar();
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden",
        className
      )}
      aria-label="Open navigation menu"
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) setOpenMobile(true);
      }}
      {...props}
    >
      {children ?? <IconMenu2 className="size-5" stroke={1.75} aria-hidden />}
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export type SidebarCollapseTriggerProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const SidebarCollapseTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarCollapseTriggerProps
>(({ className, children, type = "button", onClick, ...props }, ref) => {
  const { collapsed, toggleCollapsed } = useSidebar();
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "hidden h-9 w-9 shrink-0 items-center justify-center rounded-md text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:inline-flex",
        className
      )}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-pressed={collapsed}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) toggleCollapsed();
      }}
      {...props}
    >
      {children ?? (
        <IconChevronLeft
          className={cn("size-5 transition-transform", collapsed && "rotate-180")}
          stroke={1.75}
          aria-hidden
        />
      )}
    </button>
  );
});
SidebarCollapseTrigger.displayName = "SidebarCollapseTrigger";

export type SidebarHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex shrink-0 flex-col gap-2 border-b border-sidebar-border p-2",
        className
      )}
      {...props}
    />
  )
);
SidebarHeader.displayName = "SidebarHeader";

export type SidebarFooterProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mt-auto flex shrink-0 flex-col gap-2 border-t border-sidebar-border p-2",
        className
      )}
      {...props}
    />
  )
);
SidebarFooter.displayName = "SidebarFooter";

export type SidebarContentProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden p-2",
        className
      )}
      {...props}
    />
  )
);
SidebarContent.displayName = "SidebarContent";

export type SidebarSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  SidebarSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn("mx-2 h-px shrink-0 bg-sidebar-border", className)}
    {...props}
  />
));
SidebarSeparator.displayName = "SidebarSeparator";

export type SidebarGroupProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
);
SidebarGroup.displayName = "SidebarGroup";

export type SidebarGroupLabelProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  SidebarGroupLabelProps
>(({ className, ...props }, ref) => {
  const { collapsed } = useSidebar();
  return (
    <div
      ref={ref}
      className={cn(
        "px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/70",
        collapsed && "sr-only",
        className
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export type SidebarMenuProps = React.HTMLAttributes<HTMLUListElement>;

const SidebarMenu = React.forwardRef<HTMLUListElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      role="list"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
);
SidebarMenu.displayName = "SidebarMenu";

export type SidebarMenuItemProps = React.HTMLAttributes<HTMLLIElement>;

const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("list-none", className)} {...props} />
  )
);
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "border border-sidebar-border bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      },
      isActive: {
        true: "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      isActive: false,
    },
  }
);

export type SidebarMenuButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> &
  VariantProps<typeof sidebarMenuButtonVariants> & {
    asChild?: boolean;
    type?: "button" | "submit" | "reset";
  };

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    {
      asChild = false,
      className,
      variant,
      isActive,
      type = "button",
      children,
      ...rest
    },
    ref
  ) => {
    const { collapsed } = useSidebar();

    const classes = cn(
      sidebarMenuButtonVariants({ variant, isActive }),
      collapsed && "justify-center px-0",
      className
    );

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        ref?: React.Ref<unknown>;
        className?: string;
      }>;
      return React.cloneElement(child, {
        ref: mergeRefs(
          child.props.ref as React.Ref<HTMLElement> | undefined,
          ref as React.Ref<HTMLElement>
        ),
        className: cn(classes, child.props.className),
        "data-active": isActive ? "" : undefined,
        ...rest,
      } as Record<string, unknown>);
    }

    return (
      <button
        ref={ref}
        type={type}
        data-active={isActive ? "" : undefined}
        className={classes}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarMobile,
  SidebarTrigger,
  SidebarCollapseTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  sidebarMenuButtonVariants,
};
