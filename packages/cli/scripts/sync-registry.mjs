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
const sourceRegistry = resolve(cliRoot, "../registry");
const destRegistry = resolve(cliRoot, "registry");
const sourceUi = resolve(cliRoot, "../ui");
const destUi = resolve(cliRoot, "ui");

if (!existsSync(sourceRegistry)) {
  console.error(`sync-registry: registry missing: ${sourceRegistry}`);
  process.exit(1);
}
if (!existsSync(sourceUi)) {
  console.error(`sync-registry: ui package missing: ${sourceUi}`);
  process.exit(1);
}

if (existsSync(destRegistry)) {
  rmSync(destRegistry, { recursive: true });
}
if (existsSync(destUi)) {
  rmSync(destUi, { recursive: true });
}
cpSync(sourceRegistry, destRegistry, { recursive: true });
cpSync(sourceUi, destUi, { recursive: true });
console.log(`sync-registry: ${sourceRegistry} → ${destRegistry}`);
console.log(`sync-registry: ${sourceUi} → ${destUi}`);
