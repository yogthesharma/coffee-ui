import * as React from "react";
import { cn } from "../lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (next: string) => void;
  baseId: string;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(component: string) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <Tabs>`);
  }
  return ctx;
}

export type TabsProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      children,
      ...props
    },
    ref
  ) => {
    const baseId = React.useId();
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : uncontrolled;

    const setValue = React.useCallback(
      (next: string) => {
        if (!isControlled) setUncontrolled(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange]
    );

    const context = React.useMemo(
      () => ({ value: value ?? "", setValue, baseId }),
      [value, setValue, baseId]
    );

    return (
      <TabsContext.Provider value={context}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      const keys = ["ArrowRight", "ArrowLeft", "Home", "End"] as const;
      if (!keys.includes(e.key as (typeof keys)[number])) return;

      const list = e.currentTarget;
      const tabs = Array.from(
        list.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      );
      if (tabs.length === 0) return;

      const currentIndex = tabs.indexOf(
        document.activeElement as HTMLButtonElement
      );
      if (currentIndex < 0) return;

      e.preventDefault();
      let next = currentIndex;
      if (e.key === "ArrowRight") next = (currentIndex + 1) % tabs.length;
      if (e.key === "ArrowLeft")
        next = (currentIndex - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = tabs.length - 1;

      const tab = tabs[next];
      tab?.focus();
      tab?.click();
    };

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          "inline-flex h-10 items-center justify-center gap-1 rounded-md border border-border bg-muted p-1 text-muted-foreground",
          className
        )}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);
TabsList.displayName = "TabsList";

export type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value: triggerValue, type = "button", ...props }, ref) => {
    const { value, setValue, baseId } = useTabsContext("TabsTrigger");
    const isActive = value === triggerValue;
    const triggerId = `${baseId}-${triggerValue}-trigger`;
    const panelId = `${baseId}-${triggerValue}-content`;

    return (
      <button
        ref={ref}
        type={type}
        role="tab"
        id={triggerId}
        aria-selected={isActive}
        aria-controls={panelId}
        tabIndex={isActive ? 0 : -1}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          isActive
            ? "bg-card text-card-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => setValue(triggerValue)}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value: contentValue, ...props }, ref) => {
    const { value, baseId } = useTabsContext("TabsContent");
    const isActive = value === contentValue;
    const triggerId = `${baseId}-${contentValue}-trigger`;
    const panelId = `${baseId}-${contentValue}-content`;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={triggerId}
        hidden={!isActive}
        className={cn(
          "mt-3 min-h-[2rem] rounded-md border border-border-subtle bg-card/50 p-4 text-sm text-card-foreground outline-none",
          className
        )}
        tabIndex={0}
        {...props}
      />
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
