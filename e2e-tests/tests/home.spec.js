import { test, expect } from "@playwright/test";

test("Vérification complète de la gestion des membres", async ({ page }) => {
  await page.goto("http://frontend:4200/todos");
  await page.waitForTimeout(2000); // Chargement initial

  const modal = page.locator("#userNameModal");
  const backdrop = page.locator(".modal-backdrop");

  // 🛡️ Gestion du modal de nom d’utilisateur
  if (await modal.isVisible()) {
    const input = page.locator('xpath=//input[@placeholder="Enter your name"]');
    const saveButton = page.locator('xpath=//button[text()="Save"]');

    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill("NomTest");
    await input.press("Tab"); // Forcer validation Angular

    await expect(saveButton).toBeEnabled({ timeout: 10000 });
    await saveButton.click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(backdrop).toHaveCount(0, { timeout: 15000 });

    // Attente de la disparition des classes Bootstrap "show"
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

    await page.waitForTimeout(1000);
  }

  // Vérification de la page d'accueil
  await expect(page.locator("text=My TO-DO LIST")).toBeVisible({
    timeout: 10000,
  });

  // 📂 Accès à la page "Gestion des membres"
  const gestionMembresLink = page.getByRole("link", {
    name: /gestion des membres/i,
  });

  await expect(gestionMembresLink).toBeVisible();
  await expect(gestionMembresLink).toBeEnabled();

  // 🔍 S'assurer qu'aucun élément ne bloque le clic
  await page.waitForFunction(
    () => {
      const link = document.querySelector('a[href="/members"]');
      if (!link) return false;
      const rect = link.getBoundingClientRect();
      const el = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
      return link.contains(el);
    },
    null,
    { timeout: 10000 }
  );

  await gestionMembresLink.click();
  await expect(page).toHaveURL(/.*members/, { timeout: 10000 });
  await expect(page.getByText("Liste des membres")).toBeVisible({
    timeout: 10000,
  });
  await page.waitForTimeout(1000);

  // 🧼 Supprimer le membre test existant si besoin
  const existingRow = page.locator("table.custom-dark-table tr", {
    hasText: /NomAutoTest|NomModif/,
  });

  if ((await existingRow.count()) > 0) {
    await existingRow.getByRole("button", { name: /supprimer/i }).click();
    await expect(page.locator("table.custom-dark-table")).not.toContainText(
      "NomAutoTest",
      {
        timeout: 10000,
      }
    );
    await page.waitForTimeout(500);
  }

  // ➕ Ajouter un membre
  await page.getByRole("button", { name: /ajouter un membre/i }).click();
  await expect(page).toHaveURL(/.*members\/add/, { timeout: 10000 });
  await expect(page.locator('[formcontrolname="nom"]')).toBeVisible({
    timeout: 10000,
  });

  await page.locator('[formcontrolname="nom"]').fill("NomAutoTest");
  await page.locator('[formcontrolname="prenom"]').fill("PrénomAuto");
  await page.locator('[formcontrolname="email"]').fill("auto@test.com");
  await page.waitForTimeout(500);

  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/.*members/, { timeout: 10000 });
  await page.waitForTimeout(2000);

  // Vérifier ajout
  await expect(page.locator("table.custom-dark-table")).toBeVisible({
    timeout: 10000,
  });
  await expect(page.locator("table.custom-dark-table")).toContainText(
    "NomAutoTest",
    {
      timeout: 10000,
    }
  );

  // ✏️ Modifier le membre
  await page
    .locator(
      'table.custom-dark-table tr:has-text("NomAutoTest") >> text=Modifier'
    )
    .click();
  await expect(page).toHaveURL(/.*members\/edit/, { timeout: 10000 });
  await expect(page.locator('[formcontrolname="nom"]')).toBeVisible();

  await page.locator('[formcontrolname="nom"]').clear();
  await page.locator('[formcontrolname="nom"]').fill("NomModif");
  await page.waitForTimeout(500);
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/.*members/, { timeout: 10000 });
  await page.waitForTimeout(2000);
  await expect(page.locator("table.custom-dark-table")).toContainText(
    "NomModif",
    {
      timeout: 10000,
    }
  );

  // ❌ Supprimer le membre modifié
  await page
    .locator(
      'table.custom-dark-table tr:has-text("NomModif") >> text=Supprimer'
    )
    .click();
  await page.waitForTimeout(1000);
  await expect(page.locator("table.custom-dark-table")).not.toContainText(
    "NomModif",
    {
      timeout: 10000,
    }
  );
});
//test e2e voir
