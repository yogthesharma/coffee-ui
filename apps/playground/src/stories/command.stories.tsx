import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@coffee-ui/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  useCommandPaletteShortcut,
} from "@coffee-ui/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@coffee-ui/ui/dialog";

const meta = {
  title: "Components/Command",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const FILE_ITEMS = [
  { value: "readme", label: "README.md" },
  { value: "changelog", label: "CHANGELOG.md" },
  { value: "package json", label: "package.json" },
  { value: "tsconfig", label: "tsconfig.json" },
  { value: "tailwind config", label: "tailwind.config.js" },
  { value: "button component", label: "button.tsx" },
  { value: "dialog component", label: "dialog.tsx" },
  { value: "command component", label: "command.tsx" },
  { value: "styles", label: "index.css" },
  { value: "preview", label: "preview.tsx" },
] as const;

export const CommandPalette: Story = {
  render: function CommandPaletteDemo() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    useCommandPaletteShortcut({ open, setOpen, keys: ["k"], withMod: true });

    React.useEffect(() => {
      if (!open) {
        setQuery("");
        return;
      }
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }, [open]);

    return (
      <div className="space-y-4">
        <p className="max-w-lg text-sm text-muted-foreground">
          Shortcut uses{" "}
          <code className="text-foreground">useCommandPaletteShortcut</code> from{" "}
          <code className="text-foreground">@coffee-ui/ui/command</code> (
          <strong className="font-medium text-foreground">⌘K</strong> /{" "}
          <strong className="font-medium text-foreground">Ctrl+K</strong>). Dialog
          height stays fixed; only the list below the search scrolls.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>
            Controlled <code className="text-foreground">open</code>:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
              {String(open)}
            </code>
          </span>
          <span>
            <code className="text-foreground">query</code>:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
              {query ? JSON.stringify(query) : "''"}
            </code>
          </span>
        </div>
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          Open palette (button)
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="flex h-[min(28rem,85vh)] max-h-[85vh] w-full max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
            <DialogTitle className="sr-only">Command palette</DialogTitle>
            <Command className="h-full min-h-0 rounded-lg border-0 bg-popover">
              <CommandInput
                ref={inputRef}
                placeholder="Search actions and files…"
                value={query}
                onValueChange={setQuery}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem
                    value="new document"
                    onSelect={() => setOpen(false)}
                  >
                    New document
                    <CommandShortcut>⌘N</CommandShortcut>
                  </CommandItem>
                  <CommandItem
                    value="search palette"
                    keywords="command find"
                    onSelect={() => setOpen(false)}
                  >
                    Open command palette
                    <CommandShortcut>⌘K</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                  <CommandItem
                    value="profile"
                    onSelect={() => setOpen(false)}
                  >
                    Profile
                  </CommandItem>
                  <CommandItem
                    value="billing"
                    onSelect={() => setOpen(false)}
                  >
                    Billing
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Files">
                  {FILE_ITEMS.map(({ value, label }) => (
                    <CommandItem
                      key={value}
                      value={value}
                      keywords={label}
                      onSelect={() => setOpen(false)}
                    >
                      {label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

export const AsyncAndRecent: Story = {
  render: function CommandAsyncRecentDemo() {
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
      const t = window.setTimeout(() => setLoading(false), 1000);
      return () => window.clearTimeout(t);
    }, []);

    const recent = ["Quarterly report.pdf", "Design system.fig"];

    return (
      <div className="space-y-3">
        <p className="max-w-md text-xs text-muted-foreground">
          Pattern for <strong className="text-foreground">async</strong> groups: show
          a disabled row or skeleton while loading, then render items.{" "}
          <strong className="text-foreground">Recent</strong> is static data or
          restored from <code className="text-foreground">localStorage</code> in your
          app.
        </p>
        <div className="h-72 w-full max-w-md overflow-hidden rounded-lg border border-border shadow-sm">
          <Command className="h-full min-h-0 rounded-lg border-0">
            <CommandInput placeholder="Search files…" />
            <CommandList>
              <CommandEmpty>No matches.</CommandEmpty>
              <CommandGroup heading="Recent">
                {recent.map((label, i) => (
                  <CommandItem
                    key={label}
                    value={`recent-${i}`}
                    keywords={label}
                  >
                    {label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Library">
                {loading ? (
                  <CommandItem value="loading" disabled>
                    Loading library…
                  </CommandItem>
                ) : (
                  <>
                    <CommandItem value="readme">README.md</CommandItem>
                    <CommandItem value="license">LICENSE</CommandItem>
                    <CommandItem value="contributing">CONTRIBUTING.md</CommandItem>
                  </>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
    );
  },
};

export const Inline: Story = {
  render: function CommandInlineDemo() {
    const [query, setQuery] = React.useState("");
    return (
      <div className="space-y-3">
        <p className="max-w-md text-xs text-muted-foreground">
          Fixed shell height (<code className="text-foreground">h-72</code>) so the
          list area scrolls internally; search row stays put.
        </p>
        <div className="h-72 w-full max-w-md overflow-hidden rounded-lg border border-border shadow-sm">
          <Command className="h-full min-h-0 rounded-lg border-0">
            <CommandInput
              placeholder="Filter fruits…"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>Nothing matches.</CommandEmpty>
              <CommandGroup>
                <CommandItem value="apple">Apple</CommandItem>
                <CommandItem value="banana">Banana</CommandItem>
                <CommandItem value="cherry">Cherry</CommandItem>
                <CommandItem value="date">Date</CommandItem>
                <CommandItem value="elderberry">Elderberry</CommandItem>
                <CommandItem value="fig">Fig</CommandItem>
                <CommandItem value="grape">Grape</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
    );
  },
};
