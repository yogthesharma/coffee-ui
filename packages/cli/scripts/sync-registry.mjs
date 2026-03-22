#!/usr/bin/env node
/**
 * Copies packages/registry → packages/cli/registry before npm pack/publish.
 * Local dev resolves ../../registry when ./registry is absent.
 */
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliRoot = resolve(__dirname, "..");
const source = resolve(cliRoot, "../registry");
const dest = resolve(cliRoot, "registry");

if (!existsSync(source)) {
  console.error(`sync-registry: source missing: ${source}`);
  process.exit(1);
}

if (existsSync(dest)) {
  rmSync(dest, { recursive: true });
}
cpSync(source, dest, { recursive: true });
console.log(`sync-registry: ${source} → ${dest}`);
