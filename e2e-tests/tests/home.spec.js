import { test, expect } from '@playwright/test';

test('Vérification complète de la gestion des membres', async ({ page }) => {
  // 🔧 Add debugging and better error handling
  console.log('Starting test...');

  try {
    // Navigate to the page
    await page.goto('http://frontend:4200/todos');
    console.log('Navigated to todos page');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    console.log('Page loaded');

    // 🔍 Debug: Take a screenshot to see what's on the page
    await page.screenshot({ path: 'debug-after-load.png' });

    // 🔍 Debug: Log the page content
    const pageContent = await page.content();
    console.log('Page content length:', pageContent.length);
    console.log('Page title:', await page.title());

    // 🔍 Étape 1 : gérer le modal si présent
    const modal = page.locator('#userNameModal');
    if (await modal.isVisible()) {
      console.log('Modal is visible, filling name');
      await page.getByPlaceholder('Enter your name').fill('NomTest');
      await page.getByRole('button', { name: /save/i }).click();
      await page.waitForLoadState('networkidle');
    }

    // ⏳ Attente que la page soit chargée - with multiple fallback selectors
    console.log('Looking for TO-DO LIST text...');

    // Try different variations of the text
    const todoListSelectors = [
      'text=My TO-DO LIST',
      'text="My TO-DO LIST"',
      'text=MY TO-DO LIST',
      'text=TO-DO LIST',
      'text=TODO LIST',
      'h1:has-text("TO-DO")',
      'h1:has-text("TODO")',
      '[data-testid="todo-title"]', // If you have test IDs
      '.title', // If there's a title class
    ];

    let foundElement = null;
    for (const selector of todoListSelectors) {
      try {
        const element = page.locator(selector);
        if (await element.isVisible({ timeout: 2000 })) {
          foundElement = element;
          console.log(`Found element with selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Selector ${selector} not found`);
      }
    }

    if (!foundElement) {
      // If we can't find the expected text, let's see what's actually on the page
      console.log('Could not find TO-DO LIST text. Dumping page content...');
      const bodyText = await page.locator('body').textContent();
      console.log('Body text:', bodyText);

      // Take another screenshot for debugging
      await page.screenshot({ path: 'debug-no-todo-found.png' });

      // Check if we're on the right page
      const currentUrl = page.url();
      console.log('Current URL:', currentUrl);

      // Wait a bit longer and try again
      await page.waitForTimeout(3000);
      await expect(page.locator('text=My TO-DO LIST')).toBeVisible({ timeout: 10000 });
    } else {
      await expect(foundElement).toBeVisible();
    }

    // 📂 Accès à la page Gestion des membres
    console.log('Navigating to members page...');

    // Try different ways to find the members link
    const membersLinkSelectors = [
      'text=Gestion des membres',
      'text=GESTION DES MEMBRES',
      'a:has-text("Gestion")',
      'a:has-text("membres")',
      '[href*="members"]',
      'nav a:has-text("Gestion")',
    ];

    let membersLink = null;
    for (const selector of membersLinkSelectors) {
      try {
        const link = page.locator(selector);
        if (await link.isVisible({ timeout: 2000 })) {
          membersLink = link;
          console.log(`Found members link with selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Members link selector ${selector} not found`);
      }
    }

    if (!membersLink) {
      // Debug: show all links on the page
      const allLinks = await page.locator('a').all();
      console.log('All links on page:');
      for (const link of allLinks) {
        const text = await link.textContent();
        const href = await link.getAttribute('href');
        console.log(`Link: "${text}" -> ${href}`);
      }
      throw new Error('Could not find members navigation link');
    }

    await membersLink.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*members/);
    await expect(page.getByText('Liste des membres')).toBeVisible({ timeout: 10000 });

    // 🧼 Supprimer le membre test s'il existe déjà
    console.log('Cleaning up existing test members...');
    const existingRow = page.locator('tr', { hasText: /NomAutoTest|NomModif/ });
    if (await existingRow.count() > 0) {
      await existingRow.getByRole('button', { name: /supprimer/i }).click();
      await expect(page.locator('table')).not.toContainText('NomAutoTest');
    }

    // ➕ Ajouter un membre
    console.log('Adding new member...');
    await page.getByRole('button', { name: /ajouter un membre/i }).click();
    await expect(page).toHaveURL(/.*members\/add/);

    await page.locator('[formcontrolname="nom"]').fill('NomAutoTest');
    await page.locator('[formcontrolname="prenom"]').fill('PrénomAuto');
    await page.locator('[formcontrolname="email"]').fill('auto@test.com');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/.*members/);
    await expect(page.locator('table')).toContainText('NomAutoTest');

    // ✏️ Modifier un membre
    console.log('Editing member...');
    await page.locator('tr:has-text("NomAutoTest") >> text=Modifier').click();
    await expect(page).toHaveURL(/.*members\/edit/);

    await page.locator('[formcontrolname="nom"]').fill('NomModif');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/.*members/);
    await expect(page.locator('table')).toContainText('NomModif');

    // ❌ Supprimer un membre
    console.log('Deleting member...');
    await page.locator('tr:has-text("NomModif") >> text=Supprimer').click();

    await expect(page.locator('table')).not.toContainText('NomModif');

    console.log('Test completed successfully!');

  } catch (error) {
    console.error('Test failed with error:', error);

    // Take a final screenshot on failure
    await page.screenshot({ path: 'debug-test-failure.png' });

    // Log final page state
    console.log('Final URL:', page.url());
    console.log('Final page title:', await page.title());

    throw error;
  }
});