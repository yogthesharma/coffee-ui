import * as React from "react";
import { createPortal } from "react-dom";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { cn } from "../lib/utils";

export type ToastVariant =
  | "default"
  | "destructive"
  | "success"
  | "warning"
  | "info";

export type ToastSize = "sm" | "md" | "lg";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastInput = {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  /** Visual density */
  size?: ToastSize;
  /** Viewport corner / edge; falls back to `ToastProvider` default */
  position?: ToastPosition;
  /**
   * Icon: custom node, `null` to hide (including variant default),
   * or omit to use the built-in icon for semantic variants (`success`, `destructive`, `warning`, `info`).
   */
  icon?: React.ReactNode | null;
  /** ms; `0` disables auto-dismiss */
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type ToastRecord = {
  id: string;
  title?: string;
  description?: string;
  variant: ToastVariant;
  size: ToastSize;
  position: ToastPosition;
  icon: React.ReactNode | null;
  duration: number;
  action?: { label: string; onClick: () => void };
};

type ToastContextValue = {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
  toasts: ToastRecord[];
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

const anchorClass: Record<ToastPosition, string> = {
  "top-left":
    "left-0 top-0 items-start justify-start sm:left-4 sm:top-4",
  "top-center":
    "left-1/2 top-0 -translate-x-1/2 items-center justify-start sm:top-4",
  "top-right":
    "right-0 top-0 items-end justify-start sm:right-4 sm:top-4",
  "bottom-left":
    "left-0 bottom-0 items-start justify-end sm:left-4 sm:bottom-4",
  "bottom-center":
    "left-1/2 bottom-0 -translate-x-1/2 items-center justify-end sm:bottom-4",
  "bottom-right":
    "right-0 bottom-0 items-end justify-end sm:right-4 sm:bottom-4",
};

function defaultIconForVariant(
  variant: ToastVariant,
  iconClass: string
): React.ReactNode | null {
  const stroke = 1.75;
  switch (variant) {
    case "success":
      return (
        <IconCircleCheck className={iconClass} stroke={stroke} aria-hidden />
      );
    case "destructive":
      return (
        <IconAlertCircle className={iconClass} stroke={stroke} aria-hidden />
      );
    case "warning":
      return (
        <IconAlertTriangle className={iconClass} stroke={stroke} aria-hidden />
      );
    case "info":
      return <IconInfoCircle className={iconClass} stroke={stroke} aria-hidden />;
    default:
      return null;
  }
}

function resolveIcon(
  input: ToastInput,
  variant: ToastVariant,
  iconClass: string
): React.ReactNode | null {
  if (input.icon === null) return null;
  if (input.icon !== undefined) return input.icon;
  return defaultIconForVariant(variant, iconClass);
}

let toastId = 0;
function nextId() {
  toastId += 1;
  return `toast-${toastId}`;
}

function useToastState(defaults: {
  defaultPosition: ToastPosition;
  defaultSize: ToastSize;
}): ToastContextValue {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const timeouts = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const dismiss = React.useCallback((id: string) => {
    const t = timeouts.current.get(id);
    if (t) clearTimeout(t);
    timeouts.current.delete(id);
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const toast = React.useCallback(
    (input: ToastInput) => {
      const id = input.id ?? nextId();
      const duration = input.duration ?? 5000;
      const variant = input.variant ?? "default";
      const size = input.size ?? defaults.defaultSize;
      const position = input.position ?? defaults.defaultPosition;
      const iconClass =
        size === "sm"
          ? "size-4 shrink-0"
          : size === "lg"
            ? "size-6 shrink-0"
            : "size-5 shrink-0";

      const record: ToastRecord = {
        id,
        title: input.title,
        description: input.description,
        variant,
        size,
        position,
        icon: resolveIcon(input, variant, iconClass),
        duration,
        action: input.action,
      };

      setToasts((prev) => [...prev, record]);

      if (duration > 0) {
        const t = setTimeout(() => {
          dismiss(id);
        }, duration);
        timeouts.current.set(id, t);
      }

      return id;
    },
    [dismiss, defaults.defaultPosition, defaults.defaultSize]
  );

  React.useEffect(
    () => () => {
      timeouts.current.forEach((t) => clearTimeout(t));
      timeouts.current.clear();
    },
    []
  );

  return React.useMemo(
    () => ({ toast, dismiss, toasts }),
    [toast, dismiss, toasts]
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastRecord[];
  onDismiss: (id: string) => void;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <>
      {POSITIONS.map((position) => {
        const list = toasts.filter((t) => t.position === position);
        if (list.length === 0) return null;
        const isBottom = position.startsWith("bottom");
        return (
          <div
            key={position}
            className={cn(
              "pointer-events-none fixed z-[100] flex max-h-[100dvh] w-full max-w-[min(100vw-2rem,420px)] flex-col gap-2 p-4",
              anchorClass[position],
              isBottom ? "justify-end" : "justify-start"
            )}
            aria-live="polite"
            aria-relevant="additions"
          >
            {list.map((t) => (
              <ToastCard key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
            ))}
          </div>
        );
      })}
    </>,
    document.body
  );
}

function ToastCard({
  toast: t,
  onDismiss,
}: {
  toast: ToastRecord;
  onDismiss: () => void;
}) {
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-full items-start rounded-md shadow-xl transition-[opacity,box-shadow] duration-200 ease-out backdrop-blur-xl",
        t.size === "sm" && "gap-2 p-3",
        t.size === "md" && "gap-3 p-4",
        t.size === "lg" && "gap-3.5 p-5",
        t.variant === "default" &&
          "bg-popover/80 text-popover-foreground shadow-black/10 dark:bg-popover/75 dark:shadow-black/45",
        t.variant === "destructive" &&
          "bg-destructive/20 text-foreground shadow-destructive/25 dark:shadow-destructive/35",
        t.variant === "success" &&
          "bg-chart-2/20 text-foreground shadow-chart-2/25 dark:shadow-chart-2/35",
        t.variant === "warning" &&
          "bg-chart-4/20 text-foreground shadow-chart-4/25 dark:shadow-chart-4/35",
        t.variant === "info" &&
          "bg-primary/15 text-foreground shadow-primary/20 dark:shadow-primary/30"
      )}
    >
      {t.icon ? (
        <span className="mt-0.5 text-current [&>svg]:text-current">
          {t.icon}
        </span>
      ) : null}
      <div className="grid min-w-0 flex-1 gap-1">
        {t.title ? (
          <p
            className={cn(
              "font-semibold leading-tight",
              t.size === "sm" && "text-xs",
              t.size === "md" && "text-sm",
              t.size === "lg" && "text-base",
              t.variant === "default" && "text-popover-foreground",
              t.variant === "destructive" && "text-destructive",
              t.variant === "success" && "text-chart-2",
              t.variant === "warning" && "text-chart-4",
              t.variant === "info" && "text-primary"
            )}
          >
            {t.title}
          </p>
        ) : null}
        {t.description ? (
          <p
            className={cn(
              t.size === "sm" && "text-xs",
              t.size === "md" && "text-sm",
              t.size === "lg" && "text-sm leading-relaxed",
              t.variant === "default" && "text-muted-foreground",
              t.variant === "destructive" && "text-foreground/90",
              t.variant === "success" && "text-foreground/90",
              t.variant === "warning" && "text-foreground/90",
              t.variant === "info" && "text-foreground/90"
            )}
          >
            {t.description}
          </p>
        ) : null}
        {t.action ? (
          <button
            type="button"
            className={cn(
              "mt-1 w-fit text-left font-medium text-primary underline-offset-4 hover:underline",
              t.size === "sm" && "text-xs",
              t.size === "md" && "text-sm",
              t.size === "lg" && "text-sm"
            )}
            onClick={() => {
              t.action?.onClick();
              onDismiss();
            }}
          >
            {t.action.label}
          </button>
        ) : null}
      </div>
      <button
        type="button"
        className={cn(
          "shrink-0 rounded-sm opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          t.size === "sm" && "p-0.5",
          t.size === "md" && "p-1",
          t.size === "lg" && "p-1.5",
          t.variant === "default" && "text-muted-foreground",
          t.variant === "destructive" && "text-destructive/80 hover:text-destructive",
          t.variant === "success" && "text-chart-2/80 hover:text-chart-2",
          t.variant === "warning" && "text-chart-4/80 hover:text-chart-4",
          t.variant === "info" && "text-primary/80 hover:text-primary"
        )}
        aria-label="Dismiss"
        onClick={onDismiss}
      >
        <IconX
          className={t.size === "sm" ? "size-3.5" : t.size === "lg" ? "size-5" : "size-4"}
          stroke={1.75}
        />
      </button>
    </div>
  );
}

export function ToastProvider({
  children,
  defaultPosition = "bottom-right",
  defaultSize = "md",
}: {
  children: React.ReactNode;
  defaultPosition?: ToastPosition;
  defaultSize?: ToastSize;
}) {
  const value = useToastState({ defaultPosition, defaultSize });
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={value.toasts} onDismiss={value.dismiss} />
    </ToastContext.Provider>
  );
}
