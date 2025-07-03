import { test, expect } from "@playwright/test";

test("Création d'un membre", async ({ page }) => {
  // Aller sur la page de todo pour déclencher le front
  await page.goto("http://frontend:4200/todos");
  await page.waitForTimeout(500);

  // Gérer le modal d'accueil s'il apparaît
  const modal = page.locator("#userNameModal");
  try {
    await modal.waitFor({ state: "visible", timeout: 3000 });
    await page.getByPlaceholder("Enter your name").fill("NomTest");
    await page.getByRole("button", { name: /save/i }).click();
    await expect(modal).toBeHidden({ timeout: 3000 });
  } catch {
    // pas de modal, on continue
  }

  // Aller dans la gestion des membres
  await page.getByRole("link", { name: /gestion des membres/i }).click();
  await expect(page).toHaveURL(/.*members/);
  await expect(page.getByText("Liste des membres")).toBeVisible();

  // Cliquer sur "Ajouter un membre"
  await page.getByRole("button", { name: /ajouter un membre/i }).click();
  await expect(page).toHaveURL(/.*members\/add/);

  // Remplir le formulaire et soumettre
  await page.locator('[formcontrolname="nom"]').fill("NomAutoTest");
  await page.locator('[formcontrolname="prenom"]').fill("PrénomAuto");
  await page.locator('[formcontrolname="email"]').fill("auto@test.com");
  await page.locator('button[type="submit"]').click();

  // Attendre la fin des requêtes et vérifier que la table contient le nouveau membre
  await expect(page).toHaveURL(/.*members/);
  await page.waitForLoadState("networkidle");
  const table = page.locator("table");
  await table.waitFor({ state: "visible", timeout: 10_000 });
  await expect(table).toContainText("NomAutoTest");
});
