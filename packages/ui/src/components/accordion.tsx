import * as React from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "../lib/utils";

type AccordionRootContextValue = {
  type: "single" | "multiple";
  collapsible: boolean;
  isOpen: (itemValue: string) => boolean;
  toggle: (itemValue: string) => void;
  baseId: string;
};

const AccordionRootContext = React.createContext<AccordionRootContextValue | null>(
  null
);

type AccordionItemContextValue = {
  value: string;
  triggerId: string;
  contentId: string;
};

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(
  null
);

function useAccordionRoot(component: string) {
  const ctx = React.useContext(AccordionRootContext);
  if (!ctx) throw new Error(`${component} must be used within <Accordion>`);
  return ctx;
}

function useAccordionItem(component: string) {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) throw new Error(`${component} must be used within <AccordionItem>`);
  return ctx;
}

export type AccordionProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
};

function Accordion({
  type = "single",
  collapsible = false,
  defaultValue,
  value: valueProp,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const baseId = React.useId();
  const isControlled = valueProp !== undefined;

  const [singleUncontrolled, setSingleUncontrolled] = React.useState<string>(() => {
    if (type === "multiple") return "";
    if (Array.isArray(defaultValue)) return defaultValue[0] ?? "";
    return (defaultValue as string | undefined) ?? "";
  });

  const [multiUncontrolled, setMultiUncontrolled] = React.useState<string[]>(() => {
    if (type !== "multiple") return [];
    if (Array.isArray(defaultValue)) return defaultValue;
    return defaultValue ? [defaultValue as string] : [];
  });

  const singleValue = React.useMemo(() => {
    if (type === "multiple") return "";
    if (isControlled) {
      return typeof valueProp === "string" ? valueProp : "";
    }
    return singleUncontrolled;
  }, [type, isControlled, valueProp, singleUncontrolled]);

  const multiValue = React.useMemo(() => {
    if (type !== "multiple") return [];
    if (isControlled) {
      return Array.isArray(valueProp) ? valueProp : [];
    }
    return multiUncontrolled;
  }, [type, isControlled, valueProp, multiUncontrolled]);

  const setSingle = React.useCallback(
    (next: string) => {
      if (!isControlled) setSingleUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const setMulti = React.useCallback(
    (next: string[]) => {
      if (!isControlled) setMultiUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const isOpen = React.useCallback(
    (itemValue: string) => {
      if (type === "multiple") return multiValue.includes(itemValue);
      return singleValue === itemValue;
    },
    [type, singleValue, multiValue]
  );

  const toggle = React.useCallback(
    (itemValue: string) => {
      if (type === "multiple") {
        const has = multiValue.includes(itemValue);
        const next = has
          ? multiValue.filter((v) => v !== itemValue)
          : [...multiValue, itemValue];
        setMulti(next);
        return;
      }
      if (singleValue === itemValue) {
        if (collapsible) setSingle("");
        return;
      }
      setSingle(itemValue);
    },
    [type, singleValue, multiValue, collapsible, setSingle, setMulti]
  );

  const context = React.useMemo(
    () => ({ type, collapsible, isOpen, toggle, baseId }),
    [type, collapsible, isOpen, toggle, baseId]
  );

  return (
    <AccordionRootContext.Provider value={context}>
      <div className={cn("w-full", className)} data-orientation="vertical" {...props}>
        {children}
      </div>
    </AccordionRootContext.Provider>
  );
}

export type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { baseId, isOpen } = useAccordionRoot("AccordionItem");
    const safe = value.replace(/\s+/g, "-");
    const itemCtx = React.useMemo(
      () => ({
        value,
        triggerId: `${baseId}-${safe}-trigger`,
        contentId: `${baseId}-${safe}-content`,
      }),
      [baseId, value, safe]
    );

    return (
      <AccordionItemContext.Provider value={itemCtx}>
        <div
          ref={ref}
          className={cn("border-b border-border last:border-b-0", className)}
          data-state={isOpen(value) ? "open" : "closed"}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const root = useAccordionRoot("AccordionTrigger");
    const item = useAccordionItem("AccordionTrigger");
    const open = root.isOpen(item.value);

    return (
      <h3 className="flex">
        <button
          ref={ref}
          type="button"
          id={item.triggerId}
          aria-expanded={open}
          aria-controls={item.contentId}
          className={cn(
            "flex flex-1 items-center justify-between gap-2 py-4 text-left text-sm font-medium text-foreground outline-none transition-all duration-200 ease-out",
            "hover:underline hover:decoration-muted-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            className
          )}
          onClick={() => root.toggle(item.value)}
          {...props}
        >
          <span className="min-w-0 flex-1">{children}</span>
          <IconChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out",
              open && "rotate-180"
            )}
            stroke={1.75}
            aria-hidden
          />
        </button>
      </h3>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const root = useAccordionRoot("AccordionContent");
    const item = useAccordionItem("AccordionContent");
    const open = root.isOpen(item.value);

    if (!open) return null;

    return (
      <div
        ref={ref}
        id={item.contentId}
        role="region"
        aria-labelledby={item.triggerId}
        className={cn("overflow-hidden pb-4 text-sm text-muted-foreground", className)}
        data-state="open"
        {...props}
      >
        {children}
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
