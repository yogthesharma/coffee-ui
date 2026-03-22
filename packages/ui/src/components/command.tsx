import * as React from "react";
import { mergeRefs } from "../lib/merge-refs";
import { cn } from "../lib/utils";

type CommandContextValue = {
  search: string;
  setSearch: (value: string) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  listId: string;
  inputId: string;
  shouldFilter: boolean;
  filter: (value: string, keywords: string, query: string) => boolean;
};

const CommandContext = React.createContext<CommandContextValue | null>(null);

function useCommandContext(name: string) {
  const ctx = React.useContext(CommandContext);
  if (!ctx) throw new Error(`${name} must be used within <Command>`);
  return ctx;
}

function defaultFilter(value: string, keywords: string, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const v = value.toLowerCase();
  const k = keywords.toLowerCase();
  return v.includes(q) || (k.length > 0 && k.includes(q));
}

export type CommandProps = React.HTMLAttributes<HTMLDivElement> & {
  /** When false, all items stay visible regardless of search. */
  shouldFilter?: boolean;
  /** Override substring matching on `value` + `keywords`. */
  filter?: (value: string, keywords: string, query: string) => boolean;
};

function Command({
  className,
  shouldFilter = true,
  filter = defaultFilter,
  children,
  onKeyDown,
  ...props
}: CommandProps) {
  const [search, setSearch] = React.useState("");
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listId = React.useId();
  const inputId = React.useId();

  const ctx = React.useMemo(
    () => ({
      search,
      setSearch,
      listRef,
      inputRef,
      listId,
      inputId,
      shouldFilter,
      filter,
    }),
    [search, listId, inputId, shouldFilter, filter]
  );

  const visibleItems = React.useCallback(() => {
    const root = listRef.current;
    if (!root) return [] as HTMLElement[];
    return Array.from(
      root.querySelectorAll<HTMLElement>("[data-command-item]:not([data-hidden])")
    );
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    const target = e.target as HTMLElement;
    const list = listRef.current;
    if (!list) return;

    const visible = visibleItems();
    if (visible.length === 0) return;

    const fromInput = target.matches("[data-command-input]");
    const itemEl = target.closest<HTMLElement>("[data-command-item]");
    const fromItem = itemEl && visible.includes(itemEl);

    if (fromInput) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        visible[0]?.focus();
      }
      return;
    }

    if (!fromItem || !itemEl) return;

    const idx = visible.indexOf(itemEl);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      visible[(idx + 1) % visible.length]?.focus();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (idx <= 0) {
        inputRef.current?.focus();
      } else {
        visible[idx - 1]?.focus();
      }
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      visible[0]?.focus();
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      visible[visible.length - 1]?.focus();
    }
  };

  return (
    <CommandContext.Provider value={ctx}>
      <div
        data-command-root
        className={cn(
          "flex h-full min-h-0 w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
          className
        )}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
}

export type CommandInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      id,
      ...props
    },
    ref
  ) => {
    const { search, setSearch, listId, inputId, inputRef } =
      useCommandContext("CommandInput");
    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const value = isControlled ? valueProp! : uncontrolled;

    React.useEffect(() => {
      if (isControlled) setSearch(valueProp!);
    }, [isControlled, valueProp, setSearch]);

    React.useLayoutEffect(() => {
      if (!isControlled && defaultValue) setSearch(defaultValue);
    }, [isControlled, defaultValue, setSearch]);

    const mergedRef = mergeRefs(ref, inputRef);

    return (
      <div className="flex shrink-0 items-center border-b border-border px-3">
        <input
          ref={mergedRef}
          id={id ?? inputId}
          type="text"
          data-command-input
          role="combobox"
          aria-expanded
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={cn(
            "flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          value={value}
          onChange={(e) => {
            const next = e.target.value;
            if (!isControlled) setUncontrolled(next);
            setSearch(next);
            onValueChange?.(next);
          }}
          {...props}
        />
      </div>
    );
  }
);
CommandInput.displayName = "CommandInput";

function runSyncFilter(root: HTMLDivElement, ctx: CommandContextValue) {
  const q = ctx.search;
  const items = root.querySelectorAll<HTMLElement>("[data-command-item]");
  let anyVisible = false;

  items.forEach((el) => {
    if (!ctx.shouldFilter) {
      el.removeAttribute("data-hidden");
      anyVisible = true;
      return;
    }
    const val = el.getAttribute("data-value") || "";
    const keywords = el.getAttribute("data-keywords") || "";
    const match = ctx.filter(val, keywords, q);
    if (match) {
      el.removeAttribute("data-hidden");
      anyVisible = true;
    } else {
      el.setAttribute("data-hidden", "");
    }
  });

  root.querySelectorAll<HTMLElement>("[data-command-group]").forEach((group) => {
    const hasVisible = group.querySelector("[data-command-item]:not([data-hidden])");
    if (hasVisible) group.removeAttribute("data-hidden");
    else group.setAttribute("data-hidden", "");
  });

  if (anyVisible) root.removeAttribute("data-empty");
  else root.setAttribute("data-empty", "");
}

export type CommandListProps = React.HTMLAttributes<HTMLDivElement>;

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = useCommandContext("CommandList");
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    const mergedRef = mergeRefs(ref, innerRef, ctx.listRef);

    const sync = React.useCallback(() => {
      const root = innerRef.current;
      if (root) runSyncFilter(root, ctx);
    }, [ctx]);

    React.useLayoutEffect(() => {
      sync();
    }, [sync]);

    React.useEffect(() => {
      const root = innerRef.current;
      if (!root || typeof MutationObserver === "undefined") return;
      const mo = new MutationObserver(() => sync());
      mo.observe(root, { childList: true, subtree: true });
      return () => mo.disconnect();
    }, [sync]);

    return (
      <div
        ref={mergedRef}
        id={ctx.listId}
        role="listbox"
        aria-label="Commands"
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CommandList.displayName = "CommandList";

export type CommandEmptyProps = React.HTMLAttributes<HTMLDivElement>;

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className, ...props }, ref) => {
    const { listRef, search } = useCommandContext("CommandEmpty");
    const [empty, setEmpty] = React.useState(false);

    React.useLayoutEffect(() => {
      const list = listRef.current;
      setEmpty(list?.hasAttribute("data-empty") ?? false);
    }, [listRef, search]);

    if (!empty) return null;

    return (
      <div
        ref={ref}
        role="presentation"
        className={cn("py-6 text-center text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  }
);
CommandEmpty.displayName = "CommandEmpty";

export type CommandGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  heading?: string;
};

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => (
    <div
      ref={ref}
      data-command-group
      className={cn(
        "overflow-hidden p-1 text-foreground data-[hidden]:hidden",
        className
      )}
      {...props}
    >
      {heading ? (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
      ) : null}
      <div className="space-y-0.5">{children}</div>
    </div>
  )
);
CommandGroup.displayName = "CommandGroup";

export type CommandSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

const CommandSeparator = React.forwardRef<HTMLDivElement, CommandSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
);
CommandSeparator.displayName = "CommandSeparator";

export type CommandItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onSelect"
> & {
  value: string;
  keywords?: string;
  onSelect?: () => void;
};

const CommandItem = React.forwardRef<HTMLButtonElement, CommandItemProps>(
  (
    {
      className,
      value,
      keywords,
      disabled,
      onClick,
      onSelect,
      type = "button",
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      role="option"
      tabIndex={-1}
      disabled={disabled}
      data-command-item
      data-value={value}
      data-keywords={keywords ?? undefined}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors duration-150 ease-out",
        "focus:bg-accent focus:text-accent-foreground data-[hidden]:hidden",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled) return;
        onSelect?.();
      }}
      {...props}
    >
      {children}
    </button>
  )
);
CommandItem.displayName = "CommandItem";

export type CommandShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

const CommandShortcut = React.forwardRef<HTMLSpanElement, CommandShortcutProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
CommandShortcut.displayName = "CommandShortcut";

export type UseCommandPaletteShortcutOptions = {
  open: boolean;
  setOpen: (next: boolean) => void;
  /** Key characters to listen for (default `["k"]`). */
  keys?: string[];
  /** Require ⌘ (macOS) or Ctrl (default `true`). */
  withMod?: boolean;
  enabled?: boolean;
};

/**
 * Toggle a command surface with ⌘K / Ctrl+K (or custom keys). Ignores shortcuts while
 * focus is in text fields or `[data-command-input]`.
 */
export function useCommandPaletteShortcut({
  open,
  setOpen,
  keys = ["k"],
  withMod = true,
  enabled = true,
}: UseCommandPaletteShortcutOptions) {
  const keysKey = keys.join("\0");

  React.useEffect(() => {
    if (!enabled) return;
    const lowered = keys.map((k) => k.toLowerCase());
    const onKey = (e: KeyboardEvent) => {
      if (withMod && !(e.metaKey || e.ctrlKey)) return;
      if (!lowered.includes(e.key.toLowerCase())) return;
      const t = e.target as HTMLElement | null;
      if (
        t?.closest(
          "input, textarea, select, [contenteditable], [data-command-input]"
        )
      ) {
        return;
      }
      e.preventDefault();
      setOpen(!open);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, setOpen, keysKey, withMod, enabled]);
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
  CommandItem,
  CommandShortcut,
};
