import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const linkVariants = cva(
  "inline-flex items-center gap-1 rounded-sm underline-offset-4 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "text-foreground underline decoration-muted-foreground hover:decoration-foreground",
        muted:
          "text-muted-foreground no-underline hover:text-foreground hover:underline hover:decoration-muted-foreground",
        subtle:
          "text-foreground no-underline hover:underline hover:decoration-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof linkVariants>;

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, href, ...props }, ref) => (
    <a
      ref={ref}
      href={href}
      className={cn(linkVariants({ variant }), className)}
      {...props}
    />
  )
);
Link.displayName = "Link";

export { Link, linkVariants };
