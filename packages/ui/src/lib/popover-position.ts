export type PopoverSide = "top" | "right" | "bottom" | "left";
export type PopoverAlign = "start" | "center" | "end";

const VIEWPORT_PAD = 8;

function place(
  anchor: DOMRect,
  cw: number,
  ch: number,
  side: PopoverSide,
  align: PopoverAlign,
  sideOffset: number,
  alignOffset: number
): { top: number; left: number } {
  let top = 0;
  let left = 0;

  if (side === "bottom") {
    top = anchor.bottom + sideOffset;
    if (align === "start") left = anchor.left + alignOffset;
    else if (align === "center")
      left = anchor.left + anchor.width / 2 - cw / 2 + alignOffset;
    else left = anchor.right - cw + alignOffset;
  } else if (side === "top") {
    top = anchor.top - ch - sideOffset;
    if (align === "start") left = anchor.left + alignOffset;
    else if (align === "center")
      left = anchor.left + anchor.width / 2 - cw / 2 + alignOffset;
    else left = anchor.right - cw + alignOffset;
  } else if (side === "right") {
    left = anchor.right + sideOffset;
    if (align === "start") top = anchor.top + alignOffset;
    else if (align === "center")
      top = anchor.top + anchor.height / 2 - ch / 2 + alignOffset;
    else top = anchor.bottom - ch + alignOffset;
  } else {
    left = anchor.left - cw - sideOffset;
    if (align === "start") top = anchor.top + alignOffset;
    else if (align === "center")
      top = anchor.top + anchor.height / 2 - ch / 2 + alignOffset;
    else top = anchor.bottom - ch + alignOffset;
  }

  return { top, left };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(min, n), max);
}

/**
 * Radix-like placement: prefer `side` + `align`, flip main axis when overflowing viewport, then clamp.
 */
export function computePopoverPosition(options: {
  anchorRect: DOMRect;
  contentWidth: number;
  contentHeight: number;
  side: PopoverSide;
  align: PopoverAlign;
  sideOffset: number;
  alignOffset: number;
  viewportWidth: number;
  viewportHeight: number;
}): { top: number; left: number; placement: PopoverSide } {
  const {
    anchorRect,
    contentWidth: cw,
    contentHeight: ch,
    side,
    align,
    sideOffset,
    alignOffset,
    viewportWidth: vw,
    viewportHeight: vh,
  } = options;

  let placement: PopoverSide = side;
  let { top, left } = place(anchorRect, cw, ch, placement, align, sideOffset, alignOffset);

  const overflowBottom = top + ch > vh - VIEWPORT_PAD;
  const overflowTop = top < VIEWPORT_PAD;
  const overflowRight = left + cw > vw - VIEWPORT_PAD;
  const overflowLeft = left < VIEWPORT_PAD;

  if (placement === "bottom" && overflowBottom && !overflowTop) {
    placement = "top";
    ({ top, left } = place(anchorRect, cw, ch, placement, align, sideOffset, alignOffset));
  } else if (placement === "top" && overflowTop && !overflowBottom) {
    placement = "bottom";
    ({ top, left } = place(anchorRect, cw, ch, placement, align, sideOffset, alignOffset));
  } else if (placement === "right" && overflowRight && !overflowLeft) {
    placement = "left";
    ({ top, left } = place(anchorRect, cw, ch, placement, align, sideOffset, alignOffset));
  } else if (placement === "left" && overflowLeft && !overflowRight) {
    placement = "right";
    ({ top, left } = place(anchorRect, cw, ch, placement, align, sideOffset, alignOffset));
  }

  left = clamp(left, VIEWPORT_PAD, vw - cw - VIEWPORT_PAD);
  top = clamp(top, VIEWPORT_PAD, vh - ch - VIEWPORT_PAD);

  return { top, left, placement };
}
