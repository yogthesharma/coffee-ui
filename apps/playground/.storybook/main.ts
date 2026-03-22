import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(dirname, "../..");

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    config.server ??= {};
    config.server.fs ??= {};
    const allow = new Set([
      ...(config.server.fs.allow ?? []),
      monorepoRoot,
    ]);
    config.server.fs.allow = [...allow];
    return config;
  },
};

export default config;
