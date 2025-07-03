import { test, expect } from "@playwright/test";

test("Vérification complète de la gestion des membres", async ({ page }) => {
  await page.goto("http://frontend:4200/todos");
  await page.waitForTimeout(2000); // Augmenté pour CI/CD

  const modal = page.locator("#userNameModal");
  const backdrop = page.locator(".modal-backdrop");

  // 🛡️ Gestion améliorée du modal
  if (await modal.isVisible()) {
    await page
      .locator('xpath=//input[@placeholder="Enter your name"]')
      .fill("NomTest");
    await page.locator('xpath=//button[text()="Save"]').click();

    // 🛡️ Attendre VRAIMENT que le modal soit complètement fermé
    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(backdrop).toHaveCount(0, { timeout: 15000 });

    // 🛡️ Attendre que toutes les animations soient terminées
    await page.waitForFunction(
      () => {
        const modal = document.querySelector("#userNameModal");
        const backdrop = document.querySelector(".modal-backdrop");
        return (
          (!modal || !modal.classList.contains("show")) &&
          (!backdrop || !backdrop.classList.contains("show"))
        );
      },
      null,
      { timeout: 15000 }
    );

    // 🛡️ Attendre supplémentaire pour s'assurer que les éléments sont bien disparus
    await page.waitForTimeout(1000);
  }

  // Vérifier que la page principale est bien chargée
  await expect(page.locator("text=My TO-DO LIST")).toBeVisible();

  // 📂 Accès à la page Gestion des membres avec gestion d'erreur
  const gestionMembresLink = page.getByRole("link", {
    name: /gestion des membres/i,
  });

  // 🛡️ S'assurer que le lien est cliquable (pas d'overlay)
  await expect(gestionMembresLink).toBeVisible();
  await expect(gestionMembresLink).toBeEnabled();

  // 🛡️ Vérifier qu'il n'y a pas d'éléments qui interceptent
  await page.waitForFunction(
    () => {
      const link = document.querySelector('a[href="/members"]');
      if (!link) return false;

      const rect = link.getBoundingClientRect();
      const elementAtPoint = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );

      return link.contains(elementAtPoint);
    },
    null,
    { timeout: 10000 }
  );

  // Cliquer sur le lien
  await gestionMembresLink.click();

  await expect(page).toHaveURL(/.*members/);
  await expect(page.getByText("Liste des membres")).toBeVisible();
  await page.waitForTimeout(1000); // Attendre le chargement complet

  // 🧼 Supprimer le membre test s'il existe déjà
  const existingRow = page.locator("tr", { hasText: /NomAutoTest|NomModif/ });
  if ((await existingRow.count()) > 0) {
    await existingRow.getByRole("button", { name: /supprimer/i }).click();
    await expect(page.locator("table")).not.toContainText("NomAutoTest");
    await page.waitForTimeout(500);
  }

  // ➕ Ajouter un membre
  await page.getByRole("button", { name: /ajouter un membre/i }).click();
  await expect(page).toHaveURL(/.*members\/add/);

  await page.locator('[formcontrolname="nom"]').fill("NomAutoTest");
  await page.locator('[formcontrolname="prenom"]').fill("PrénomAuto");
  await page.locator('[formcontrolname="email"]').fill("auto@test.com");
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/.*members/);
  await page.waitForTimeout(1000); // Attendre le rechargement
  await expect(page.locator("table")).toContainText("NomAutoTest");

  // ✏️ Modifier un membre
  await page.locator('tr:has-text("NomAutoTest") >> text=Modifier').click();
  await expect(page).toHaveURL(/.*members\/edit/);

  await page.locator('[formcontrolname="nom"]').fill("NomModif");
  await page.waitForTimeout(500);
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/.*members/);
  await page.waitForTimeout(1000); // Attendre le rechargement
  await expect(page.locator("table")).toContainText("NomModif");

  // ❌ Supprimer un membre
  await page.locator('tr:has-text("NomModif") >> text=Supprimer').click();

  await expect(page.locator("table")).not.toContainText("NomModif");
});
