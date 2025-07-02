import { test, expect } from '@playwright/test';

test('la page d’accueil affiche le titre', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await expect(page).toHaveTitle(/todo/i); // Test
});

