import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

/**
 * E-commerce UI Professional Suite
 * 
 * Strategy:
 * - Uses 'domcontentloaded' for faster navigation.
 * - Employs "Sniper Clicks" (offset positions) to bypass button interception.
 * - Implements web-first assertions to avoid flaky hard-coded timeouts.
 */
test.describe('E-commerce UI Professional Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // 1. Navigation & Active State
  test('Navbar links should navigate correctly and show active states', async ({ page }) => {
    const header = page.locator('header');
    const navLinks = [
      { name: 'HOME', path: '/' },
      { name: 'COLLECTION', path: '/collection' },
      { name: 'ABOUT', path: '/about' },
      { name: 'CONTACT', path: '/contact' }
    ];

    for (const link of navLinks) {
      const navItem = header.getByRole('link', { name: link.name, exact: true });
      await navItem.click();

      await page.waitForURL(link.path === '/' ? BASE_URL + '/' : new RegExp(link.path), { 
        waitUntil: 'domcontentloaded' 
      });

      await expect(navItem).toHaveClass(/text-black/);
    }
  });

  // 2. Search Persistence & Route Teleportation
  test('Search bar should persist query and teleport to collection', async ({ page }) => {
    await page.locator('header').locator('button:has(svg.lucide-search)').click();
    await page.waitForURL(/.*collection/, { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Cotton');
    await expect(searchInput).toHaveValue('Cotton');
  });

  // 3. Mobile Menu Responsiveness (Shadcn/UI Sheet)
  test('Mobile menu should toggle visibility on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload(); 

    await page.getByRole('button').filter({ has: page.locator('svg.lucide-menu') }).click();

    const mobileMenu = page.getByRole('dialog');
    await expect(mobileMenu).toBeVisible();

    const collectionLink = mobileMenu.getByRole('link', { name: 'Collection', exact: true });
    await expect(collectionLink).toBeVisible();
    await collectionLink.click();

    await expect(mobileMenu).not.toBeVisible();
  });

  // 4. Product Image Gallery Interaction
  test('Clicking thumbnails should update the main product image', async ({ page }) => {
    await page.goto(`${BASE_URL}/collection`);

    const firstProductCard = page.locator('a[href^="/product/"]').first();
    await expect(firstProductCard).toBeVisible({ timeout: 10000 });

    // Position offset avoids Quick View button interception
    await firstProductCard.click({ position: { x: 10, y: 10 } });
    await page.waitForURL(/\/product\/.+/, { waitUntil: 'domcontentloaded' });

    const mainImage = page.locator('main img').first();
    const thumbnails = page.locator('img').filter({ hasNot: page.locator('h3') });

    if (await thumbnails.count() > 1) {
      const secondThumb = thumbnails.nth(1);
      const thumbSrc = await secondThumb.getAttribute('src');

      // Extract raw filename to handle Next.js image optimization strings
      const fileName = decodeURIComponent(thumbSrc || '')
        .split('url=')[1]?.split('&')[0].split('/').pop()?.split('?')[0];

      await secondThumb.click();
      await expect(mainImage).toHaveAttribute('src', new RegExp(fileName!));
    }
  });

  // 5. Quick View State Validation
  test('Quick View button should open the selection modal', async ({ page }) => {
    await page.goto(`${BASE_URL}/collection`);

    const firstProductCard = page.locator('a[href^="/product/"]').first();
    await expect(firstProductCard).toBeVisible();
    const productName = await firstProductCard.locator('h3').innerText();

    await firstProductCard.locator('img').first().hover();
    await firstProductCard.getByRole('button', { name: /quick view/i }).click();

    // Locates modal via content to handle Portals/Teleports
    const modalContent = page.locator('div').filter({ hasText: productName }).last();
    await expect(modalContent).toBeVisible({ timeout: 10000 });
    await expect(modalContent.getByRole('button', { name: /add to/i })).toBeVisible();
  });

  // 6. Mandatory Size Selection (Toast Validation)
  test('Should show error toast when adding to cart without size', async ({ page }) => {
    await page.goto(`${BASE_URL}/collection`);

    const firstProductLink = page.locator('a[href^="/product/"]').first();
    await expect(firstProductLink).toBeVisible();
    await firstProductLink.click({ position: { x: 10, y: 10 } });

    await page.waitForURL(/\/product\/.+/, { waitUntil: 'domcontentloaded' });

    await page.getByRole('button', { name: /add to (cart|bag)/i }).click();
    await expect(page.getByText(/select size/i)).toBeVisible();
  });

  // 7. Filter Application & Result Synchronization
  test('Filtering by category should update count and visible items', async ({ page }) => {
    await page.goto(`${BASE_URL}/collection`);

    const countLocator = page.locator('span.text-zinc-400');
    const initialCountText = await countLocator.innerText();

    // Use exact matching to distinguish "Men" from "Women"
    await page.getByRole('checkbox', { name: 'Men', exact: true }).check();

    // Smart wait: Ensure count text updates before proceeding
    await expect(countLocator).not.toHaveText(initialCountText);

    const finalCount = parseInt(await countLocator.innerText());
    const visibleProducts = page.locator('a[href^="/product/"]');
    await expect(visibleProducts).toHaveCount(finalCount);
  });

  // 8. Empty State Logic (Search-based)
  test('Should show empty state when search returns no results', async ({ page }) => {
    await page.goto(`${BASE_URL}/collection`);

    await page.locator('header').locator('button:has(svg.lucide-search)').click();
    await page.getByPlaceholder(/search/i).fill('nonexistent_product_search_query');

    await expect(page.getByText(/no products match your criteria/i)).toBeVisible();
    await expect(page.locator('span.text-zinc-400')).toHaveText('0');
    await expect(page.getByRole('button', { name: /clear all filters/i })).toBeVisible();
  });

  // 9. Sorting Logic
  test('Sorting by Price: High to Low should change product order', async ({ page }) => {
    await page.goto(`${BASE_URL}/collection`);

    const firstProduct = page.locator('h3').first();
    const initialName = await firstProduct.innerText();

    await page.selectOption('select', 'high-low');
    
    // Assertion acts as a smart-wait for the sorting re-render
    await expect(firstProduct).not.toHaveText(initialName);
  });

  // 10. Cart Persistence
  test('Added item should persist in cart summary', async ({ page }) => {
    await page.goto(`${BASE_URL}/collection`);

    const firstProductLink = page.locator('a[href^="/product/"]').first();
    await firstProductLink.click({ position: { x: 10, y: 10 } });
    await page.waitForURL(/\/product\/.+/, { waitUntil: 'domcontentloaded' });

    await page.getByRole('button', { name: 'M', exact: true }).click();
    await page.getByRole('button', { name: /add to (cart|bag)/i }).click();

    // Locator targets the absolute positioned badge in the header
    const cartBadge = page.locator('header').locator('p.absolute, .rounded-full').first();
    await expect(cartBadge).toHaveText(/1/);
  });

  // 11. Auth Validation
  test('Login should show error for invalid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[type="email"]', 'unauthorized@example.com');
    await page.fill('input[type="password"]', 'invalid_password');
    await page.getByRole('button', { name: /sign in/i }).click();

    const errorMessage = page.getByText(/error/i).or(page.getByText(/invalid/i));
    await expect(errorMessage).toBeVisible();
  });

});