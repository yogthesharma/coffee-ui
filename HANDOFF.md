# Coffee UI — session handoff

Quick snapshot of **what’s in place** and **sensible next steps**. Canonical component notes live in **`packages/ui/TAXONOMY.md`**.

---

## Done (high level)

### UI library (`packages/ui`)

- **Primitives, widgets, components** per **`TAXONOMY.md`** (e.g. button, field, combobox, calendar, date-picker, toggle-group, pagination, navigation-menu, command, sidebar, etc.).
- **Combobox**: popover + command, trigger sizes / `hideChevron`, **`ComboboxItem`** selected state via **`bg-accent`** + **`aria-selected`**.
- **Calendar**: **`mode="single"`** and **`mode="range"`** (`DateRange`), keyboard grid (arrows, Home/End, Page Up/Down, Enter/Space), **`weekStartsOn`**, **`disabled`** matcher.
- **DatePicker**: popover + single calendar; closes on select.
- **Reduced motion**: navigation-menu + command item transitions; **`coffee-nav-menu-panel-enter`** in playground CSS gated by **`prefers-reduced-motion`**.

### Registry & CLI (`packages/registry`, `packages/cli`)

- **`coffee-ui init`** / **`coffee-ui add <name>`** with import rewrites for utils, button, toggle, popover, command, lib helpers.
- Manifest **`from`** paths are **relative to the registry root** (`../ui/src/...`); CLI resolves with **`resolve(REGISTRY_ROOT, from)`**.
- **`resolveRegistryRoot()`**: env **`COFFEE_UI_REGISTRY`**, then monorepo **`../../registry`**, then published **`../registry`**.
- **Publishable package** `packages/cli` as **`coffee-ui`** (`0.1.0`): **`prepack`** syncs **`../registry` → ./registry`** and **`../ui` → ./ui`**; **`files`** includes `src`, `registry`, `ui`. See **`packages/cli/README.md`**.
- **`packages/cli/.gitignore`**: ignores generated **`registry/`** and **`ui/`** under the CLI package.

### Playground & CI

- Storybook stories for new widgets; **`@storybook/addon-a11y`** where configured.
- **`.github/workflows/ci.yml`**: typecheck UI + playground, build Storybook, Playwright Chromium, **`pnpm test:visual`**.
- **`playwright.config.ts`** + **`tests/visual/`** (snapshots under **`tests/visual/snapshots/`**); **`snapshotPathTemplate`** without OS in the filename; lenient **`maxDiffPixelRatio`** for cross-OS fonts.

### Repo layout

- Root workspace package renamed to **`@coffee-ui/workspace`** so the npm CLI can be named **`coffee-ui`** without a name clash.

---

## Pick up next

### Product / components

- **`DateRangePicker`**: popover + **`Calendar`** **`mode="range"`** (mirror **`DatePicker`** UX).
- **Combobox**: async / remote options, loading empty state.
- **Data table**: recipe or headless table helpers (sorting, column defs)—**`table`** exists; composition docs or examples help.
- **Calendar keyboard**: skip **disabled** days when moving focus (arrow/Page keys); optional roving tabindex audit.

### Publishing & DX

- Set **`repository.url`** in **`packages/cli/package.json`** (or remove) before **`npm publish`**.
- Confirm **`coffee-ui`** is available on npm or publish under a **scope** (then document `npx @scope/coffee-ui` or bin-only install).
- Host a real **`components.json` JSON Schema** (replace placeholder URL in **`init`** output).
- Optional: **Chromatic** or stricter Playwright thresholds if visual noise on Linux CI.

### Docs

- Public **README** at repo root (install, theme copy from playground, link to **`TAXONOMY.md`** / Storybook).
- MDX overview stories in Storybook if you want marketing-style docs in the sidebar.

---

## Useful commands

| Command | Purpose |
|--------|---------|
| `pnpm typecheck` | `tsc` UI + playground |
| `pnpm build-storybook` | Static Storybook into **`apps/playground/storybook-static`** |
| `pnpm test:visual` | Playwright screenshots (build Storybook first) |
| `pnpm test:visual:update` | Refresh baselines after intentional UI changes |
| `pnpm coffee-ui` | Run CLI from monorepo (same as **`node packages/cli/src/index.mjs`**) |
| `cd packages/cli && pnpm prepack` | Regenerate **`registry/`** + **`ui/`** before **`npm pack` / publish** |

---

*Update this file when you close a session so the next person (or future you) has context.*
