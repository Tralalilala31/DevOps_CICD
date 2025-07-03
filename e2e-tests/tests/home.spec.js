import { test, expect } from "@playwright/test";

test("Vérification complète de la gestion des membres", async ({ page }) => {
  await page.goto("http://frontend:4200/todos");
  await page.waitForTimeout(500); // ou même 1000ms pour CI

  const modal = page.locator("#userNameModal");

  if (await modal.isVisible()) {
    await page
      .locator('xpath=//input[@placeholder="Enter your name"]')
      .fill("NomTest");

    await page.locator('xpath=//button[text()="Save"]').click();

    // ✅ Attendre que le modal disparaisse correctement
    await expect(modal).toHaveCount(0, { timeout: 10000 }); // ou toBeHidden()
  }

  await page.waitForTimeout(500); // ou même 1000ms pour CI

  // ⏳ Attente que la page soit chargée
  await expect(page.locator("text=My TO-DO LIST")).toBeVisible();

  // 📂 Accès à la page Gestion des membres
  await page.getByRole("link", { name: /gestion des membres/i }).click();
  await expect(page).toHaveURL(/.*members/);
  await expect(page.getByText("Liste des membres")).toBeVisible();
  await page.waitForTimeout(500); // ou même 1000ms pour CI

  // 🧼 Supprimer le membre test s’il existe déjà
  const existingRow = page.locator("tr", { hasText: /NomAutoTest|NomModif/ });
  if ((await existingRow.count()) > 0) {
    await existingRow.getByRole("button", { name: /supprimer/i }).click();
    await expect(page.locator("table")).not.toContainText("NomAutoTest");
  }
  // ➕ Ajouter un membre
  await page.getByRole("button", { name: /ajouter un membre/i }).click();
  await expect(page).toHaveURL(/.*members\/add/);

  await page.locator('[formcontrolname="nom"]').fill("NomAutoTest");
  await page.locator('[formcontrolname="prenom"]').fill("PrénomAuto");
  await page.locator('[formcontrolname="email"]').fill("auto@test.com");
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/.*members/);
  await page.waitForTimeout(500); // ou même 1000ms pour CI
  await expect(page.locator("table")).toContainText("NomAutoTest");

  // ✏️ Modifier un membre
  await page.locator('tr:has-text("NomAutoTest") >> text=Modifier').click();
  await expect(page).toHaveURL(/.*members\/edit/);

  await page.locator('[formcontrolname="nom"]').fill("NomModif");
  await page.waitForTimeout(500); // ou même 1000ms pour CI
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/.*members/);
  await page.waitForTimeout(500); // ou même 1000ms pour CI
  await expect(page.locator("table")).toContainText("NomModif");

  // ❌ Supprimer un membre
  await page.locator('tr:has-text("NomModif") >> text=Supprimer').click();

  await expect(page.locator("table")).not.toContainText("NomModif");
});
