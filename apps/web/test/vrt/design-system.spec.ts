import { test, expect } from '@playwright/test';

test.describe('Design System: The Curated Gallery', () => {
  test('No-Line Rule: Should NOT have 1px borders in components', async ({ page }) => {
    // Navigate to the catalog page where most components are visible
    await page.goto('/catalog');

    // Wait for the grid to load
    await page.waitForSelector('.grid');

    // Scan the DOM for 1px borders
    const violatingElements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const violations: string[] = [];
      
      allElements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const hasBorder = 
          (style.borderTopWidth === '1px') ||
          (style.borderRightWidth === '1px') ||
          (style.borderBottomWidth === '1px') ||
          (style.borderLeftWidth === '1px');
          
        if (hasBorder) {
          // Identify the element (class or tag)
          const identifier = el.className ? `.${el.className.split(' ').join('.')}` : el.tagName.toLowerCase();
          violations.push(identifier);
        }
      });
      
      return Array.from(new Set(violations)); // Deduplicate
    });

    console.log('Detected 1px borders in:', violatingElements);
    
    // We expect ZERO violations of the No-Line rule
    // Note: Some native browser elements or specific intentional borders might need exclusion later
    expect(violatingElements).toHaveLength(0);
  });
});
