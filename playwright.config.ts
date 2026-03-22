import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  snapshotPathTemplate: "{testDir}/snapshots/{testFileName}-snapshots/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:9988",
    ...devices["Desktop Chrome"],
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.08,
      animations: "disabled",
    },
  },
  webServer: {
    command: "pnpm exec serve apps/playground/storybook-static --listen 9988",
    url: "http://127.0.0.1:9988",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
