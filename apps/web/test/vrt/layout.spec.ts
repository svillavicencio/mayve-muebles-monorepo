import { test, expect } from '@playwright/test';

test.describe('Layout Audit: fix-frontend-spacing', () => {
  const pages = ['/', '/catalog'];

  for (const pagePath of pages) {
    test(`Page "${pagePath}" should not have redundant classes on containers`, async ({ page }) => {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      const redundantClasses = ['mx-auto', 'px-8'];
      
      const violations = await page.evaluate((redundants) => {
        const containers = document.querySelectorAll('.container');
        const results: string[] = [];
        
        containers.forEach((container, index) => {
          redundants.forEach(cls => {
            if (container.classList.contains(cls)) {
              results.push(`Container[${index}] has redundant class: ${cls}`);
            }
          });
        });
        
        return results;
      }, redundantClasses);

      expect(violations, `Redundant classes found on "${pagePath}"`).toHaveLength(0);
    });

    test(`Page "${pagePath}" should have consistent section padding (py-24)`, async ({ page }) => {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      const violations = await page.evaluate(() => {
        const sections = document.querySelectorAll('section, main > header');
        const results: string[] = [];
        
        sections.forEach((section, index) => {
          const style = window.getComputedStyle(section);
          const paddingTop = style.paddingTop;
          const paddingBottom = style.paddingBottom;
          
          // Skip Hero sections or sections with min-h-[90vh]
          if (section.classList.contains('min-h-[90vh]')) {
            return;
          }

          // py-24 is 96px
          if (paddingTop !== '96px' || paddingBottom !== '96px') {
            // Some sections might be exceptions (Hero), but most should follow this.
            // Let's identify the element.
            const id = section.id || section.className || section.tagName;
            results.push(`Section[${index}] (${id}) has inconsistent padding: top=${paddingTop}, bottom=${paddingBottom}`);
          }
        });
        
        return results;
      });

      // Initially, we expect many violations as we haven't implemented the fix.
      expect(violations, `Inconsistent section padding found on "${pagePath}"`).toHaveLength(0);
    });
  }
});
