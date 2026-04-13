import { test, expect } from '@playwright/test';

/**
 * Smoke tests — every route must resolve without an Astro/Vite error.
 *
 * Checks:
 *   1. HTTP status < 500  (no SSR crash)
 *   2. No vite-error-overlay in the DOM  (no build/import error in dev mode)
 *   3. No Astro error text visible on the page
 *
 * Admin pages that redirect to /admin/login are acceptable (401/302/200 on
 * the login page) — what we're guarding against is a 500 or an overlay.
 */

const PUBLIC_ROUTES = ['/', '/about', '/contact', '/products'];

// Admin routes — may redirect to login, that's fine.
// Edit route uses a real product id=1 as a representative fixture.
const ADMIN_ROUTES = [
  '/admin/login',
  '/admin',
  '/admin/products',
  '/admin/products/new',
  '/admin/products/edit/1',
  '/admin/categories',
  '/admin/config',
];

const ALL_ROUTES = [...PUBLIC_ROUTES, ...ADMIN_ROUTES];

async function assertNoAstroError(page: import('@playwright/test').Page, route: string) {
  // 1. No vite error overlay (shown when a module fails to load in dev mode)
  const overlay = page.locator('vite-error-overlay');
  await expect(overlay, `Vite error overlay found on "${route}"`).toHaveCount(0);

  // 2. No Astro-rendered error page text
  const bodyText = await page.evaluate(() => document.body?.innerText ?? '');
  expect(bodyText, `Astro error text found on "${route}"`).not.toContain('Failed to load url');
  expect(bodyText, `Astro 500 error text found on "${route}"`).not.toContain('Internal server error');
}

test.describe('Smoke: all routes resolve without Astro errors', () => {
  for (const route of ALL_ROUTES) {
    test(`GET ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

      // Allow any non-5xx status (redirects, 401, 403 are fine)
      expect(
        response?.status() ?? 0,
        `Route "${route}" returned a 5xx status`,
      ).toBeLessThan(500);

      await assertNoAstroError(page, route);
    });
  }
});
