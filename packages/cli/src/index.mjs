#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { Command } from "commander";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Registry layout: `<root>/components/<name>/manifest.json` */
async function resolveRegistryRoot() {
  if (process.env.COFFEE_UI_REGISTRY) {
    const p = resolve(process.env.COFFEE_UI_REGISTRY);
    if (await pathExists(join(p, "components"))) {
      return p;
    }
    console.warn(
      `COFFEE_UI_REGISTRY is set but not a valid registry (missing components/): ${p}`
    );
  }
  const candidates = [
    resolve(__dirname, "../../registry"),
    resolve(__dirname, "../registry"),
  ];
  for (const c of candidates) {
    if (await pathExists(join(c, "components"))) {
      return c;
    }
  }
  throw new Error(
    "Coffee UI: could not find the component registry (need a folder containing `components/`). " +
      "Reinstall the `coffee-ui` package, or set COFFEE_UI_REGISTRY to an absolute path to your registry."
  );
}

function readCliVersion() {
  try {
    const raw = readFileSync(resolve(__dirname, "../package.json"), "utf8");
    return JSON.parse(raw).version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

async function pathExists(p) {
  try {
    await access(p, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function loadComponentsJson(cwd) {
  const p = join(cwd, "components.json");
  if (!(await pathExists(p))) {
    throw new Error(
      "No components.json found. Run `coffee-ui init` in your app root first."
    );
  }
  const raw = await readFile(p, "utf8");
  return { path: p, config: JSON.parse(raw) };
}

function resolveTargetDir(cwd, config) {
  const dir = config.componentsDir ?? "src/components/ui";
  return resolve(cwd, dir);
}

const DEFAULT_UTILS_TS = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

const program = new Command();

program
  .name("coffee-ui")
  .description("Copy UI components from the Coffee UI registry into your app")
  .version(readCliVersion());

program
  .command("init")
  .description("Create components.json in the current project")
  .option("--components-dir <path>", "Where components are installed", "src/components/ui")
  .option("--utils-import <specifier>", "Import path for cn() helper", "@/lib/utils")
  .option("--utils-file <path>", "Where to write cn() helper", "src/lib/utils.ts")
  .option("--no-utils", "Skip creating the utils file")
  .action(async (opts) => {
    const cwd = process.cwd();
    const out = join(cwd, "components.json");
    if (await pathExists(out)) {
      console.error("components.json already exists. Remove it first or edit manually.");
      process.exitCode = 1;
      return;
    }
    const config = {
      $schema: "https://coffee-ui.local/schema/components.json",
      componentsDir: opts.componentsDir,
      utilsImport: opts.utilsImport,
      utilsFile: opts.utilsFile,
    };
    await writeFile(out, `${JSON.stringify(config, null, 2)}\n`, "utf8");
    console.log(`Wrote ${out}`);

    // Commander maps --no-utils to opts.utils === false (default true when omitted).
    if (opts.utils !== false) {
      const utilsPath = resolve(cwd, opts.utilsFile);
      if (await pathExists(utilsPath)) {
        console.log(`Utils file already exists: ${utilsPath}`);
      } else {
        await mkdir(dirname(utilsPath), { recursive: true });
        await writeFile(utilsPath, DEFAULT_UTILS_TS, "utf8");
        console.log(`Wrote ${utilsPath}`);
      }
      console.log("\nIn your app: npm install clsx tailwind-merge");
    }

    console.log("\nNext: point your TS path alias at src/* (e.g. @/*), then run:");
    console.log(
      "  npx coffee-ui add <name> — e.g. button, input, field, input-group, spinner, …"
    );
    console.log(
      "  See your UI kit docs for component names (this repo: packages/ui/TAXONOMY.md)."
    );
  });

program
  .command("add")
  .argument("<name>", "Component name, e.g. button")
  .description("Install a component from the registry")
  .action(async (name) => {
    const cwd = process.cwd();
    const REGISTRY_ROOT = await resolveRegistryRoot();
    const { config } = await loadComponentsJson(cwd);
    const key = String(name).toLowerCase();
    const manifestPath = join(REGISTRY_ROOT, "components", key, "manifest.json");
    if (!(await pathExists(manifestPath))) {
      console.error(`Unknown component "${name}".`);
      process.exitCode = 1;
      return;
    }
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    const componentDir = dirname(manifestPath);
    const install = manifest.install;
    const files = manifest.files ?? [];
    const targetRoot = resolveTargetDir(cwd, config);
    await mkdir(targetRoot, { recursive: true });

    const utilsImport = config.utilsImport ?? "@/lib/utils";

    if (install?.length) {
      for (const item of install) {
        const relFrom = item.from ?? item.path;
        if (!relFrom) {
          console.error(`Invalid install entry in manifest for "${name}" (missing from/path).`);
          process.exitCode = 1;
          return;
        }
        const from = resolve(REGISTRY_ROOT, relFrom);
        if (!(await pathExists(from))) {
          console.error(`Source missing for "${name}": ${from}`);
          process.exitCode = 1;
          return;
        }
        const destName =
          item.filename ?? item.to ?? relFrom.split("/").pop() ?? "component.tsx";
        const to = join(targetRoot, destName);
        await mkdir(dirname(to), { recursive: true });
        let body = await readFile(from, "utf8");
        body = body
          .replace(
            /from\s+["']\.\.\/primitives\/button["']/g,
            `from "./button"`
          )
          .replace(
            /from\s+["']\.\.\/primitives\/toggle["']/g,
            `from "./toggle"`
          )
          .replace(
            /from\s+["']\.\.\/components\/popover["']/g,
            `from "./popover"`
          )
          .replace(
            /from\s+["']\.\.\/components\/command["']/g,
            `from "./command"`
          )
          .replace(
            /from\s+["']\.\/lib\/utils["']/g,
            `from "${utilsImport}"`
          )
          .replace(
            /from\s+["']\.\.\/lib\/utils["']/g,
            `from "${utilsImport}"`
          )
          .replace(
            /from\s+["']\.\.\/lib\/use-focus-trap["']/g,
            `from "./use-focus-trap"`
          )
          .replace(
            /from\s+["']\.\.\/lib\/popover-position["']/g,
            `from "./popover-position"`
          )
          .replace(
            /from\s+["']\.\.\/lib\/merge-refs["']/g,
            `from "./merge-refs"`
          )
          .replace(
            /from\s+["']\.\.\/lib\/clamp-point-menu["']/g,
            `from "./clamp-point-menu"`
          );
        await writeFile(to, body, "utf8");
        console.log(`+ ${to}`);
      }
    } else if (files.length) {
      for (const rel of files) {
        const from = join(REGISTRY_ROOT, "components", key, rel);
        const destName = rel.endsWith(".tpl") ? rel.slice(0, -4) : rel;
        const to = join(targetRoot, destName);
        await mkdir(dirname(to), { recursive: true });
        let body = await readFile(from, "utf8");
        if (rel.endsWith(".tpl")) {
          body = body.replaceAll("{{UTILS_IMPORT}}", utilsImport);
        }
        await writeFile(to, body, "utf8");
        console.log(`+ ${to}`);
      }
    } else {
      console.error(`Component "${name}" has no install or files in manifest.`);
      process.exitCode = 1;
      return;
    }

    const peers = manifest.peerDependencies ?? {};
    const peerList = Object.entries(peers);
    if (peerList.length) {
      console.log("\nPeer dependencies to install in your app:");
      const spec = peerList
        .map(([k, v]) => `${k}@${/[\\s|]/.test(String(v)) ? `"${v}"` : v}`)
        .join(" ");
      console.log(`  npm install ${spec}`);
    }
  });

program.parse();
