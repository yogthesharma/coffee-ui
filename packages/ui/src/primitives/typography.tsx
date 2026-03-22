import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const headingVariants = cva(
  "scroll-m-20 font-semibold tracking-tight text-foreground",
  {
    variants: {
      as: {
        h1: "text-4xl font-bold lg:text-5xl",
        h2: "text-3xl",
        h3: "text-2xl",
        h4: "text-xl",
      },
      appearance: {
        default: "",
        plain: "",
      },
    },
    compoundVariants: [
      {
        as: "h2",
        appearance: "default",
        class: "border-b border-border pb-2 first:mt-0",
      },
    ],
    defaultVariants: {
      as: "h2",
      appearance: "default",
    },
  }
);

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    as?: "h1" | "h2" | "h3" | "h4";
  };

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Comp = "h2", appearance, ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(headingVariants({ as: Comp, appearance }), className)}
      {...props}
    />
  )
);
Heading.displayName = "Heading";

/** @deprecated Prefer `<Heading as="h1" appearance="plain" className="..." />` or `headingVariants`. */
const h1Class =
  "scroll-m-20 text-4xl font-bold tracking-tight text-foreground lg:text-5xl";
/** @deprecated Prefer `<Heading as="h2" />` (section rule) or `appearance="plain"`. */
const h2Class =
  "scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight text-foreground first:mt-0";
const h3Class =
  "scroll-m-20 text-2xl font-semibold tracking-tight text-foreground";
const h4Class =
  "scroll-m-20 text-xl font-semibold tracking-tight text-foreground";

const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      p: "leading-7 [&:not(:first-child)]:mt-4",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

export type TextProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants> & {
    as?: "p" | "span" | "div";
  };

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant, as: Comp = "p", ...props }, ref) =>
    React.createElement(Comp, {
      ...props,
      ref,
      className: cn(textVariants({ variant }), className),
    })
);
Text.displayName = "Text";

const Blockquote = React.forwardRef<
  HTMLQuoteElement,
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn(
      "mt-6 border-l-2 border-border pl-6 italic text-foreground/80",
      className
    )}
    {...props}
  />
));
Blockquote.displayName = "Blockquote";

const InlineCode = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.1rem] font-mono text-sm font-medium text-foreground",
      className
    )}
    {...props}
  />
));
InlineCode.displayName = "InlineCode";

export {
  Heading,
  headingVariants,
  Text,
  textVariants,
  Blockquote,
  InlineCode,
  h1Class,
  h2Class,
  h3Class,
  h4Class,
};
