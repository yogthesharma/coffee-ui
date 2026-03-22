# coffee-ui (CLI)

Copy [Coffee UI](https://github.com/your-org/coffee-ui) components into your app—similar to shadcn/ui: `init` writes `components.json`, `add` copies source files and rewrites imports.

## Use without publishing (this monorepo)

From the repo root:

```bash
pnpm coffee-ui init
pnpm coffee-ui add button
```

Or:

```bash
node packages/cli/src/index.mjs init
```

## Publish to npm

1. Set `repository.url` in this `package.json` to your real Git remote.
2. From **`packages/cli`**:

   ```bash
   pnpm prepack   # copies ../registry → ./registry (not committed)
   npm publish    # tarball includes registry/
   ```

3. **Versioning:** bump `"version"` here whenever registry manifests or CLI behavior changes so installs stay in sync.

## Consumers

```bash
npx coffee-ui@latest init
npx coffee-ui@latest add button
```

Peers depend on the component (see each `manifest.json` `peerDependencies`). Typical app installs:

```bash
npm install react react-dom clsx tailwind-merge class-variance-authority @tabler/icons-react
```

Copy **theme CSS variables** and **Tailwind `theme.extend`** from the Coffee UI playground (`apps/playground`) so tokens match.

## Private or custom registry

Point the CLI at any folder that contains a `components/` tree (same shape as this repo’s `packages/registry`):

```bash
export COFFEE_UI_REGISTRY=/absolute/path/to/registry
npx coffee-ui add button
```

## `components.json`

- `componentsDir` — where files are written (default `src/components/ui`)
- `utilsImport` — import specifier for `cn()` (default `@/lib/utils`)
- `utilsFile` — path for generated `cn()` helper when using `init` without `--no-utils`

Optional `$schema` in generated file is a placeholder until you host a JSON Schema.
