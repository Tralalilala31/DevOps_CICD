import { test, expect } from "@playwright/test";

test("Création d'un membre", async ({ page }) => {
  // → On va directement sur la liste des membres
  await page.goto("http://frontend:4200/members");
  await expect(page).toHaveURL(/\/members$/);

  // 🔍 Si le modal « Enter your name » apparaît (CI), on le ferme
  const modal = page.locator("#userNameModal");
  if (await modal.isVisible()) {
    await page.fill('input[placeholder="Enter your name"]', "NomTest");
    await page.click("button:has-text(\"Save\")");
    await expect(modal).toBeHidden();
  }

  // ⏳ On attend que le titre soit visible
  await expect(page.getByText("Liste des membres")).toBeVisible();

  // ➕ Cliquer sur « Ajouter un membre »
  await page.click("button:has-text(\"Ajouter un membre\")");
  await expect(page).toHaveURL(/\/members\/add$/);

  // 📝 Remplir le formulaire
  await page.fill('[formcontrolname="nom"]', "NomAutoTest");
  await page.fill('[formcontrolname="prenom"]', "PrénomAuto");
  await page.fill('[formcontrolname="email"]', "auto@test.com");

  // ✅ Soumettre
  await page.click('button[type="submit"]');

  // ⏳ Retour sur la liste et vérification que la ligne apparaît
  await expect(page).toHaveURL(/\/members$/);
  const newRow = page.locator('tr:has-text("NomAutoTest")');
  await expect(newRow).toBeVisible();
});
