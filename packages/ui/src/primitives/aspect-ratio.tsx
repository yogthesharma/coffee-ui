import * as React from "react";
import { cn } from "../lib/utils";

export type AspectRatioProps = React.HTMLAttributes<HTMLDivElement> & {
  ratio?: number;
};

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, style, ratio = 16 / 9, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: ratio, ...style }}
      {...props}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  )
);
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
