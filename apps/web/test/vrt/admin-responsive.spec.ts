import { test, expect } from '@playwright/test';

test.describe('Admin Section Responsive Audit', () => {
  test.beforeEach(async ({ page }) => {
    // We navigate to /admin/products to test both the layout and the table/card switch
    // Note: We're assuming the user is already logged in or there's no auth in this environment
    await page.goto('/admin/products');
  });

  test('Mobile: Main padding and card view visibility', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const mainElement = page.locator('main.admin-main-p');
    const padding = await mainElement.evaluate((el) => window.getComputedStyle(el).padding);
    // 16px is 1rem
    expect(padding).toBe('16px');

    // Check that table is hidden and card view is visible
    const table = page.locator('table');
    await expect(table).toBeHidden();

    const mobileCards = page.locator('.lg\\:hidden > div');
    await expect(mobileCards.first()).toBeVisible();

    // Verify touch target (48px height)
    const editBtn = page.locator('a[title="Editar"]').first();
    const box = await editBtn.boundingBox();
    expect(box?.height).toBe(48);
  });

  test('Desktop: Main padding and table view visibility', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const mainElement = page.locator('main.admin-main-p');
    const padding = await mainElement.evaluate((el) => window.getComputedStyle(el).padding);
    // 40px is 2.5rem
    expect(padding).toBe('40px');

    // Check that table is visible and card view is hidden
    const table = page.locator('table');
    await expect(table).toBeVisible();

    const mobileCards = page.locator('.lg\\:hidden');
    await expect(mobileCards).toBeHidden();

    // Verify touch target (48px height) in desktop table view as well
    const editBtn = page.locator('a[title="Editar"]').first();
    const box = await editBtn.boundingBox();
    expect(box?.height).toBe(48);
  });
});
