import { test, expect } from "@playwright/test";

test("Accès + modal si présent", async ({ page }) => {
  await page.goto("http://localhost/todos");
  await page.waitForTimeout(500); // attente courte pour chargement

  const modal = page.locator("#userNameModal");

  if (await modal.isVisible()) {
    await page
      .locator('xpath=//input[@placeholder="Enter your name"]')
      .fill("NomTest");
    await page.locator('xpath=//button[text()="Save"]').click();
  }

  // Tu peux ensuite continuer avec tes tests, exemple :
  await expect(page.locator("text=My TO-DO LIST")).toBeVisible();
});
