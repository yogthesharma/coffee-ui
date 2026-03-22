# Coffee UI — internal component taxonomy

End users still install with a **flat** name: `npx coffee-ui add <name>` (e.g. `button`, `select-menu`).  
This document maps those names to how we organize **source** under `src/`.

| Tier           | Folder            | Members |
|----------------|-------------------|---------|
| **Foundation** | `foundation/`     | `icons` (plus `lib/utils` at `lib/`) |
| **Primitives** | `primitives/`     | `aspect-ratio`, `badge`, `button`, `checkbox`, `collapsible`, `field`, `input`, `input-group`, `kbd`, `label`, `link`, `scroll-area`, `separator`, `skeleton`, `spinner`, `switch`, `textarea`, `toggle`, `typography`, `visually-hidden` |
| **Widgets**    | `widgets/`        | `select`, `select-menu`, `radio-group`, `slider`, `progress`, `avatar` |
| **Components** | `components/`     | `card`, `alert`, `tabs`, `empty-state`, `dialog`, `popover`, `dropdown-menu`, `navigation-menu`, `pagination`, `tooltip`, `sheet`, `sidebar`, `accordion`, `breadcrumb`, `table`, `context-menu`, `toast`, `command` (layout / overlays / content; portals where noted, no Radix) |

Package exports stay stable: `@coffee-ui/ui/button`, `@coffee-ui/ui/icons`, etc.

### `input-group`

`input-group.tsx` imports `./input` (shared `inputVariants`). Install **`input`** into the same components directory before or with **`input-group`**, or the relative import will break.

### Theming (OKLCH + Tailwind 3)

Canonical tokens live in **`apps/playground/src/index.css`**:

- **`:root`** — light theme: `--radius`, `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--border`, `--border-subtle`, `--input`, `--ring`, `--chart-1` … `--chart-5`, and full **`--sidebar-*`** set.
- **`.dark`** — dark overrides for the same names.

**Tailwind** (`apps/playground/tailwind.config.js`): `darkMode: ["class"]`, semantic colors map to **`var(--token)`** (full `oklch(...)` strings in CSS). Utilities include:

- Core: `bg-background`, `text-foreground`, `border-border`, `border-border-subtle`, `bg-card`, `text-muted-foreground`, `bg-primary`, `ring-ring`, …
- **Popover** (for future overlays): `bg-popover`, `text-popover-foreground`
- **Accent**: `bg-accent`, `text-accent-foreground`
- **Destructive**: `bg-destructive`, `text-destructive`
- **Charts**: `bg-chart-1` … `bg-chart-5` (and `text-chart-*`, `border-chart-*`, etc.)
- **Sidebar**: `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-primary`, `text-sidebar-primary-foreground`, `bg-sidebar-accent`, `text-sidebar-accent-foreground`, `border-sidebar-border`, `ring-sidebar-ring`

Consumer apps should copy **both** the CSS variable blocks and **`theme.extend`** from the playground config.

### Components roadmap (not built yet)

*None — extend as needed (e.g. **hover intent**, **navigation viewport** animation).*

### `navigation-menu`

**`NavigationMenu`** (`value` / **`onValueChange`**, **`defaultValue`**, optional **`openOnHover`**, **`openDelay`**, **`closeDelay`**) wraps **`NavigationMenuList`** → **`NavigationMenuItem`** → **`NavigationMenuTrigger`** + **`NavigationMenuContent`**. Without **`NavigationMenuViewport`**, content portaled to **`document.body`** with fixed position. With **`NavigationMenuViewport`** (place under the list), panels share one centered mount + opacity/scale motion; add class **`coffee-nav-menu-panel-enter`** in app CSS for the keyframed enter (see playground **`index.css`**). **`NavigationMenuIndicator`** = optional active-trigger underline. **`NavigationMenuLink`**, **`NavigationMenuSeparator`**, keyboard and outside-dismiss as before.

### `sidebar`

**`SidebarProvider`** holds **`collapsed`** (desktop rail) and **`openMobile`** (sheet). **`Sidebar`** is the desktop **`aside`** (hidden on small screens in typical layouts); **`SidebarMobile`** wraps the same nav in **`Sheet`**. **`SidebarTrigger`** / **`SidebarCollapseTrigger`** for menu + icon-only toggle. Compose **`SidebarHeader`**, **`SidebarContent`**, **`SidebarFooter`**, **`SidebarGroup`**, **`SidebarMenu`**, **`SidebarMenuButton`** (`isActive`, **`asChild`** for links). Main column: **`SidebarInset`**. Registry install includes **`sheet`** (peer for **`SidebarMobile`**).

### `command`

**`Command`** wraps **`CommandInput`**, **`CommandList`**, **`CommandEmpty`**, **`CommandGroup`**, **`CommandItem`** (`value` + optional `keywords` for filtering), **`CommandSeparator`**, **`CommandShortcut`**. Arrow keys move between visible items; **`shouldFilter`** / **`filter`** on **`Command`** customize matching. **`CommandList`** is **`flex-1 min-h-0`** so it fills space and scrolls: give the root a fixed height (e.g. dialog content **`h-[min(28rem,85vh)] flex flex-col`**) and **`Command`** **`h-full min-h-0`** so the shell does not jump when the filter changes. **`useCommandPaletteShortcut({ open, setOpen, keys?, withMod? })`** toggles a palette with **⌘/Ctrl+K** (skips when focus is in inputs / **`[data-command-input]`**).

### `toast`

Wrap the app (or Storybook preview) with **`ToastProvider`**, then call **`useToast().toast({ title, description, variant, duration, action })`**. The viewport is portaled with **`aria-live="polite"`**.

### `context-menu`

**`ContextMenuTrigger`** opens on **`contextmenu`** (right-click) at the pointer; content is positioned with **`clamp-point-menu`**. Same keyboard behavior as **dropdown-menu** (arrows, Home/End, Tab/Escape dismiss).

### `accordion`

Use a **unique `value`** on each `AccordionItem` (ids are derived from it for `aria-controls` / `aria-labelledby`).

### `dialog` / `popover`

Peer dependency: **`react-dom`** (for portals). Behavior aims to match common Radix-style expectations: **modal** dialog with overlay click, **Escape**, **focus trap** + restore to trigger, **body scroll lock**; popover with **anchored position** (flip + clamp), **outside pointer** + **Escape** dismiss, **`aria-expanded` / `aria-controls`** on trigger.

### Dark mode in apps

Toggle the **`dark`** class on **`<html>`** (see Storybook `.storybook/preview.tsx`). Optional: sync with `prefers-color-scheme` and `localStorage`.

### Opacity modifiers

Semantic colors use **`var(--token)`** with full OKLCH values. Utilities like `bg-primary/90` rely on Tailwind’s handling of CSS variables; if a browser or edge case mis-renders, prefer **`color-mix`** in custom CSS or avoid `/opacity` on that token.
