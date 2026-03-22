import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDots,
} from "@tabler/icons-react";
import { buttonVariants } from "../primitives/button";
import { cn } from "../lib/utils";

const Pagination = ({
  className,
  "aria-label": ariaLabel = "Pagination",
  ...props
}: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label={ariaLabel}
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row flex-wrap items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={className} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  isActive?: boolean;
  size?: VariantProps<typeof buttonVariants>["size"];
};

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, size = "icon", ...props }, ref) => (
    <a
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
);
PaginationLink.displayName = "PaginationLink";

type PaginationPrevNextProps = Omit<
  PaginationLinkProps,
  "size" | "children"
> & {
  text?: string;
};

const PaginationPrevious = ({
  className,
  text = "Previous",
  ...props
}: PaginationPrevNextProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5 pr-2 sm:pr-2.5", className)}
    {...props}
  >
    <IconChevronLeft stroke={1.75} className="size-4" />
    <span className="hidden sm:inline">{text}</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  text = "Next",
  ...props
}: PaginationPrevNextProps) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5 pl-2 sm:pl-2.5", className)}
    {...props}
  >
    <span className="hidden sm:inline">{text}</span>
    <IconChevronRight stroke={1.75} className="size-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn(
      "flex size-9 items-center justify-center text-muted-foreground",
      className
    )}
    {...props}
  >
    <IconDots className="size-4" stroke={1.75} />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
