import { expect, test } from "@playwright/test";

function storyPath(id: string) {
  return `/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`;
}

test.describe("Storybook canvas screenshots", () => {
  test("primitives / button / default", async ({ page }) => {
    await page.goto(storyPath("primitives-button--default"));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot({ fullPage: true });
  });

  test("components / pagination / default", async ({ page }) => {
    await page.goto(storyPath("components-pagination--default"));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot({ fullPage: true });
  });

  test("widgets / combobox / default", async ({ page }) => {
    await page.goto(storyPath("widgets-combobox--default"));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot({ fullPage: true });
  });
});
