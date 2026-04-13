import { test, expect } from '@playwright/test';

test.describe('CFX-01: Typography — leading-tight replaces leading-[0.85]', () => {
  test('about.astro h1 uses leading-tight', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    const h1 = page.locator('main h1').first();
    const lineHeight = await h1.evaluate((el) => getComputedStyle(el).lineHeight);
    const fontSize = await h1.evaluate((el) => getComputedStyle(el).fontSize);
    const ratio = parseFloat(lineHeight) / parseFloat(fontSize);
    expect(ratio).toBeGreaterThanOrEqual(1.2);
    expect(ratio).toBeLessThanOrEqual(1.4);
  });

  test('contact.astro h1 uses leading-tight', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    const h1 = page.locator('main h1').first();
    const classAttr = await h1.getAttribute('class');
    expect(classAttr).toContain('leading-tight');
    expect(classAttr).not.toContain('leading-[0.85]');
  });

  test('Hero.astro h1 uses leading-tight', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const h1 = page.locator('section h1').first();
    const classAttr = await h1.getAttribute('class');
    expect(classAttr).toContain('leading-tight');
    expect(classAttr).not.toContain('leading-[0.85]');
  });
});

test.describe('CFX-02: ConfigForm — Tailwind-only, no BEM styles', () => {
  test('ConfigForm has no inline <style> BEM block', async ({ page }) => {
    await page.goto('/admin/config');
    await page.waitForLoadState('networkidle');
    const styleContent = await page.evaluate(() => {
      const styles = Array.from(document.querySelectorAll('style'));
      return styles.map(s => s.textContent).join('');
    });
    expect(styleContent).not.toContain('.admin-form');
    expect(styleContent).not.toContain('.form-grid');
    expect(styleContent).not.toContain('.btn-save');
  });

  test('ConfigForm save button uses btn-primary class', async ({ page }) => {
    await page.goto('/admin/config');
    await page.waitForLoadState('networkidle');
    const btn = page.locator('form button[type="submit"]');
    const classAttr = await btn.getAttribute('class');
    expect(classAttr).toContain('btn-primary');
  });
});

test.describe('CFX-03: AdminLayout — mobile header h2 truncates', () => {
  test('admin header h2 has min-w-0 and truncate', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const h2 = page.locator('header h2').first();
    const classAttr = await h2.getAttribute('class');
    expect(classAttr).toContain('truncate');
    expect(classAttr).toContain('min-w-0');
  });
});

test.describe('CFX-04: admin/index.astro — stats grid is explicit Tailwind', () => {
  test('stats grid div has explicit grid classes', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const grid = page.locator('.grid.grid-cols-1.md\\:grid-cols-3').first();
    await expect(grid).toBeVisible();
  });
});

test.describe('CFX-05: AdminLayout — sidebar has transition-transform', () => {
  test('sidebar aside has transition-transform class', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const sidebar = page.locator('#admin-sidebar');
    const classAttr = await sidebar.getAttribute('class');
    expect(classAttr).toContain('transition-transform');
    expect(classAttr).toContain('duration-300');
  });
});

test.describe('CFX-06: admin/index.astro — no border-radius override on btn-primary', () => {
  test('inline styles do not override btn-primary border-radius', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const styleContent = await page.evaluate(() => {
      const styles = Array.from(document.querySelectorAll('style'));
      return styles.map(s => s.textContent).join('');
    });
    expect(styleContent).not.toMatch(/\.btn-primary\s*\{[^}]*border-radius/);
  });
});

test.describe('CFX-07: ProductTable — Nuevo Producto uses btn-primary', () => {
  test('"Nuevo Producto" link has btn-primary class', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    const link = page.locator('a', { hasText: 'Nuevo Producto' }).first();
    const classAttr = await link.getAttribute('class');
    expect(classAttr).toContain('btn-primary');
  });
});

test.describe('CFX-08: ProductForm — textarea uses border-b only', () => {
  test('description textarea has border-b not border on all sides', async ({ page }) => {
    await page.goto('/admin/products/new');
    await page.waitForLoadState('networkidle');
    const textarea = page.locator('textarea[name="description"]');
    const classAttr = await textarea.getAttribute('class');
    expect(classAttr).toContain('border-b');
    expect(classAttr).not.toMatch(/(?<!\-)border(?!\-[a-z])/);
  });
});

test.describe('CFX-09: ProductForm — checkboxes have accent-secondary', () => {
  test('inStock checkbox has accent-secondary', async ({ page }) => {
    await page.goto('/admin/products/new');
    await page.waitForLoadState('networkidle');
    const checkbox = page.locator('input[name="inStock"]');
    const classAttr = await checkbox.getAttribute('class');
    expect(classAttr).toContain('accent-secondary');
  });

  test('isFeatured checkbox has accent-secondary', async ({ page }) => {
    await page.goto('/admin/products/new');
    await page.waitForLoadState('networkidle');
    const checkbox = page.locator('input[name="isFeatured"]');
    const classAttr = await checkbox.getAttribute('class');
    expect(classAttr).toContain('accent-secondary');
  });
});

test.describe('CFX-10: ProductTable — Sin imagen fallback has text-[10px]', () => {
  test('Sin imagen fallback div class is updated', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    const fallbacks = page.locator('td div.w-12 div').filter({ hasText: 'Sin imagen' });
    const count = await fallbacks.count();
    if (count > 0) {
      const classAttr = await fallbacks.first().getAttribute('class');
      expect(classAttr).toContain('text-[10px]');
    } else {
      test.info().annotations.push({ type: 'note', description: 'No products without images found — class assertion skipped' });
    }
  });
});

test.describe('CFX-11: admin/login.astro — page title is correct', () => {
  test('login page title is "Iniciar Sesión | Mayve Muebles"', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Iniciar Sesión/);
    const title = await page.title();
    expect(title).not.toContain('Admin Login');
  });
});

test.describe('CFX-12: AdminLayout — no min-h-[calc] on content card', () => {
  test('main content card does not have min-height calc', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const card = page.locator('.bg-white.shadow-ambient').first();
    const style = await card.evaluate((el) => getComputedStyle(el).minHeight);
    expect(style).toBe('0px');
  });
});

test.describe('CFX-13: LoginForm — inputs have focus-visible outline', () => {
  test('email input has focus-visible outline classes', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    const input = page.locator('input[type="email"]');
    const classAttr = await input.getAttribute('class');
    expect(classAttr).toContain('focus-visible:outline');
    expect(classAttr).not.toContain('outline-none');
  });
});

test.describe('CFX-14: CategoryManager — Eliminar button is text-red-600', () => {
  test('Eliminar button has text-red-600', async ({ page }) => {
    await page.goto('/admin/categories');
    await page.waitForLoadState('networkidle');
    const btn = page.locator('button', { hasText: 'Eliminar' }).first();
    const count = await btn.count();
    if (count > 0) {
      const classAttr = await btn.getAttribute('class');
      expect(classAttr).toContain('text-red-600');
      expect(classAttr).not.toContain('text-red-400');
    } else {
      test.info().annotations.push({ type: 'note', description: 'No categories found — skipping class check' });
    }
  });
});

test.describe('CFX-15: CategoryManager — slug span has min-w-0 truncate', () => {
  test('slug span has truncate class', async ({ page }) => {
    await page.goto('/admin/categories');
    await page.waitForLoadState('networkidle');
    const slugSpan = page.locator('span.font-mono').first();
    const count = await slugSpan.count();
    if (count > 0) {
      const classAttr = await slugSpan.getAttribute('class');
      expect(classAttr).toContain('truncate');
      expect(classAttr).toContain('min-w-0');
    } else {
      test.info().annotations.push({ type: 'note', description: 'No categories found — skipping truncate check' });
    }
  });
});

test.describe('CFX-16: Hero — Consultanos CTA uses border-white', () => {
  test('"Consultanos" link has border-white not border-primary', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const link = page.locator('a', { hasText: 'Consultanos' }).first();
    const classAttr = await link.getAttribute('class');
    expect(classAttr).toContain('border-white');
    expect(classAttr).not.toContain('border-primary');
  });
});

test.describe('CFX-17: Hero — gradient covers full width', () => {
  test('gradient overlay uses surface/30 stop (not transparent)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const overlay = page.locator('section .absolute.inset-0').last();
    const classAttr = await overlay.getAttribute('class');
    expect(classAttr).toContain('to-surface/30');
    expect(classAttr).not.toContain('to-transparent');
  });
});

test.describe('CFX-18: [slug].astro — sticky panel uses md:top-28', () => {
  test('sticky panel div has md:top-28', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const productLinks = page.locator('a[href^="/products/"]');
    const count = await productLinks.count();
    if (count > 0) {
      const href = await productLinks.first().getAttribute('href');
      await page.goto(href!);
      await page.waitForLoadState('networkidle');
      const sticky = page.locator('.md\\:sticky').first();
      const classAttr = await sticky.getAttribute('class');
      expect(classAttr).toContain('md:top-28');
      expect(classAttr).not.toContain('md:top-24');
    } else {
      test.info().annotations.push({ type: 'note', description: 'No products found for slug test' });
    }
  });
});

test.describe('CFX-19: ProductTable — scroll gradient fade exists', () => {
  test('overflow-x-auto wrapper is relative and has gradient child', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    const wrapper = page.locator('.overflow-x-auto.relative').first();
    await expect(wrapper).toBeVisible();
    const gradient = wrapper.locator('.bg-gradient-to-l.from-white').first();
    await expect(gradient).toBeAttached();
  });
});

test.describe('CFX-20: about.astro — CTA hover uses important modifier', () => {
  test('About CTA has hover:!bg-on-primary and hover:!text-primary', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    const cta = page.locator('a[href*="wa.me"]').last();
    const classAttr = await cta.getAttribute('class');
    expect(classAttr).toContain('hover:!bg-on-primary');
    expect(classAttr).toContain('hover:!text-primary');
  });
});

test.describe('CFX-21: Footer — uses lg:mt-16 not lg:mt-32', () => {
  test('footer has lg:mt-16', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const footer = page.locator('footer');
    const classAttr = await footer.getAttribute('class');
    expect(classAttr).toContain('lg:mt-16');
    expect(classAttr).not.toContain('lg:mt-32');
  });
});
