import { test, expect } from '@playwright/test';

test.describe('Admin Mobile S Audit (320px)', () => {
  test.use({ viewport: { width: 320, height: 600 } });

  const adminRoutes = [
    '/admin',
    '/admin/login',
    '/admin/products',
    '/admin/categories',
    '/admin/config',
  ];

  for (const route of adminRoutes) {
    test(`Audit ${route} at 320px`, async ({ page }) => {
      // For authenticated routes, we might need to bypass login if possible or use a state
      // But let's first see if they load at all or redirect
      await page.goto(route);
      
      // Basic check: No horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      // We don't fail yet, just collect info
      console.log(`Route ${route} - Horizontal Scroll: ${hasHorizontalScroll}`);
      
      // Take snapshot for visual audit
      await page.screenshot({ path: `test-results/mobile-s-audit-${route.replace(/\//g, '-')}.png`, fullPage: true });
      
      // Check for overlapping elements or overflow
      const overflowElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const results: string[] = [];
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.overflowX === 'visible' && el.scrollWidth > el.clientWidth && el.clientWidth > 0) {
            results.push(el.tagName + '.' + el.className);
          }
        });
        return results;
      });
      
      if (overflowElements.length > 0) {
        console.log(`Route ${route} - Potential Overflows:`, overflowElements);
      }
    });
  }
});
