import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuSeparator,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@coffee-ui/ui/navigation-menu";

const meta = {
  title: "Components/NavigationMenu",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function MenuBlocks({
  wideProducts,
}: {
  wideProducts?: boolean;
}) {
  return (
    <>
      <NavigationMenuItem value="products">
        <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        <NavigationMenuContent
          className={
            wideProducts
              ? "w-[min(calc(100vw-2rem),28rem)]"
              : undefined
          }
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Build
              </p>
              <ul className="space-y-0.5">
                <li>
                  <NavigationMenuLink href="#components">Components</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#themes">Themes</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#kits">Starter kits</NavigationMenuLink>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Learn
              </p>
              <ul className="space-y-0.5">
                <li>
                  <NavigationMenuLink href="#docs">Documentation</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#blog">Blog</NavigationMenuLink>
                </li>
              </ul>
            </div>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuSeparator />
      <NavigationMenuItem value="docs">
        <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-56 space-y-0.5">
            <li>
              <NavigationMenuLink href="#intro">Introduction</NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink href="#guides">Guides</NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink href="#api">API reference</NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="pricing">
        <NavigationMenuTrigger>Pricing</NavigationMenuTrigger>
        <NavigationMenuContent>
          <p className="max-w-xs text-sm text-muted-foreground">
            Short panel — resize the viewport to see flip/clamp behavior.
          </p>
          <NavigationMenuLink href="#plans" className="mt-3 inline-block">
            View plans
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </>
  );
}

/** Panels portal to `document.body` with fixed positioning (no `NavigationMenuViewport`). */
export const Default: Story = {
  render: function NavigationMenuDemo() {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div className="space-y-4">
        <p className="max-w-xl text-sm text-muted-foreground">
          Top-level triggers open a portaled panel. Use{" "}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            ←
          </kbd>
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            →
          </kbd>{" "}
          between triggers;{" "}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            ↓
          </kbd>{" "}
          from an open trigger moves into links.{" "}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            Esc
          </kbd>{" "}
          closes.
        </p>
        <p className="text-xs text-muted-foreground">
          Controlled <code className="text-foreground">value</code>:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
            {value === null ? "null" : JSON.stringify(value)}
          </code>
        </p>
        <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
          <NavigationMenu value={value} onValueChange={setValue}>
            <NavigationMenuList>
              <MenuBlocks wideProducts />
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    );
  },
};

/** Shared viewport (centered under nav), hover delays, indicator bar, and enter motion (`coffee-nav-menu-panel-enter` in app CSS). */
export const ViewportHoverAndIndicator: Story = {
  render: function NavigationMenuViewportDemo() {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div className="space-y-4">
        <p className="max-w-xl text-sm text-muted-foreground">
          Uses <code className="text-foreground">NavigationMenuViewport</code> so
          content mounts in one shared wrapper (Radix-style),{" "}
          <code className="text-foreground">openOnHover</code> with delays, and{" "}
          <code className="text-foreground">NavigationMenuIndicator</code> for the
          active trigger underline.
        </p>
        <p className="text-xs text-muted-foreground">
          value:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
            {value === null ? "null" : JSON.stringify(value)}
          </code>
        </p>
        <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
          <NavigationMenu
            value={value}
            onValueChange={setValue}
            openOnHover
            openDelay={100}
            closeDelay={220}
            className="pb-1"
          >
            <NavigationMenuList>
              <MenuBlocks />
            </NavigationMenuList>
            <NavigationMenuIndicator />
            <NavigationMenuViewport />
          </NavigationMenu>
        </div>
      </div>
    );
  },
};
