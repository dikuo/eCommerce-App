import { test, expect } from '@playwright/test';

const LOCALHOST_URL = 'http://localhost:5173';

test.describe('Shopping Cart Flow', () => {
  
  // Test 1: Baseline UI Check
  test('should load the homepage and display the refined headings', async ({ page }) => {
    await page.goto(LOCALHOST_URL);
    await expect(page.getByRole('heading', { name: /bestsellers/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /latest arrivals/i })).toBeVisible();
  });

  // Test 2: Navigation and Cart Addition
  test('should navigate to a product from the collection and add to cart', async ({ page }) => {
    await page.goto(`${LOCALHOST_URL}/collection`);

    const firstProduct = page.getByRole('link').filter({ hasText: '$' }).first();
    await firstProduct.click();

    await expect(page).toHaveURL(/.*product.*/);

    const sizeButton = page.getByRole('button', { name: 'M', exact: true }).or(page.getByText('M', { exact: true }));
    if (await sizeButton.isVisible()) {
      await sizeButton.click();
    }

    const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
    await expect(addToCartBtn).toBeEnabled();
    await addToCartBtn.click();

    const toastMessage = page.locator('.Toastify__toast-body').or(page.getByRole('alert'));
    await expect(toastMessage).toBeVisible();
  });

  // Test 3: Filtering Logic
  test('should filter products by category', async ({ page }) => {
    await page.goto(`${LOCALHOST_URL}/collection`);

    // 🟢 ADD THIS: Wait for at least one product to load before filtering
    await expect(page.getByRole('link').filter({ hasText: '$' }).first()).toBeVisible({ timeout: 10000 });

    const menCheckbox = page.getByRole('checkbox', { name: /men/i }).or(page.getByText('Men', { exact: true }));
    await menCheckbox.click();

    // 🟢 ADD THIS: Give the filter a moment to react
    await page.waitForTimeout(1000); 

    const filteredProduct = page.getByRole('link').filter({ hasText: '$' }).first();
    await expect(filteredProduct).toContainText(/Men/i);
  });

  // Test 4: Search UI and Results
  test('should search for a specific product', async ({ page }) => {
    await page.goto(`${LOCALHOST_URL}/collection`);

    // Click the search icon in the Navbar (usually the first button in your banner)
    await page.getByRole('banner').getByRole('button').first().click();

    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('Cotton Top');
    await searchInput.press('Enter');

    // Verify the results heading or a specific product name appears
    await expect(page.getByRole('heading', { name: /cotton top/i }).first()).toBeVisible();
  });

});