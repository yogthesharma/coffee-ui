import * as React from "react";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function getFocusableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export type UseFocusTrapOptions = {
  active: boolean;
  /** Return focus here when trap deactivates (e.g. trigger element). */
  restoreTo?: React.RefObject<HTMLElement | null>;
};

/**
 * Keeps keyboard focus inside `containerRef` while `active`. Handles Tab / Shift+Tab wrap.
 * Callers should handle Escape separately (e.g. close dialog).
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  { active, restoreTo }: UseFocusTrapOptions
) {
  const lastExternalFocus = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    if (!active) return;

    lastExternalFocus.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    if (!container) return;

    const focusInitial = () => {
      const list = getFocusableElements(container);
      const target = list[0] ?? container;
      if (!container.hasAttribute("tabindex") && list.length === 0) {
        container.setAttribute("tabindex", "-1");
      }
      target.focus();
    };

    const raf = requestAnimationFrame(focusInitial);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !containerRef.current) return;

      const list = getFocusableElements(containerRef.current);
      if (list.length === 0) return;

      const first = list[0];
      const last = list[list.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (activeEl === first || !containerRef.current.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else if (activeEl === last || !containerRef.current.contains(activeEl)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active, containerRef]);

  React.useLayoutEffect(() => {
    if (active) return;
    const target =
      restoreTo?.current && document.contains(restoreTo.current)
        ? restoreTo.current
        : lastExternalFocus.current && document.contains(lastExternalFocus.current)
          ? lastExternalFocus.current
          : null;
    target?.focus({ preventScroll: true });
    lastExternalFocus.current = null;
  }, [active, restoreTo]);
}
