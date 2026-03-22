const VIEWPORT_PAD = 8;

/** Clamp a fixed menu so it stays inside the viewport (e.g. context menu at cursor). */
export function clampPointMenuPosition(
  x: number,
  y: number,
  contentWidth: number,
  contentHeight: number
): { top: number; left: number } {
  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  const left = Math.min(
    Math.max(VIEWPORT_PAD, x),
    Math.max(VIEWPORT_PAD, vw - contentWidth - VIEWPORT_PAD)
  );
  const top = Math.min(
    Math.max(VIEWPORT_PAD, y),
    Math.max(VIEWPORT_PAD, vh - contentHeight - VIEWPORT_PAD)
  );
  return { left, top };
}
