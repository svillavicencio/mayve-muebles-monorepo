import { test, expect } from '@playwright/test';

test.describe('Layout Audit: Vertical Spacing and Centering', () => {
  test('Home page should match visual snapshot', async ({ page }) => {
    await page.goto('/');
    // Wait for content to stabilize
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-layout.png', { fullPage: true });
  });

  test('Catalog page should match visual snapshot', async ({ page }) => {
    await page.goto('/catalog');
    // Wait for content to stabilize
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('catalog-layout.png', { fullPage: true });
  });
});
