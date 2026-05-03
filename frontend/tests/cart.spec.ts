import { test, expect } from '@playwright/test';

// Adjust this if your Vite server runs on a different port
const LOCALHOST_URL = 'http://localhost:5173';

test.describe('Shopping Cart Flow', () => {
  test('should load the homepage and display Best Sellers', async ({ page }) => {
    await page.goto(LOCALHOST_URL);

    // Verify the page loaded correctly without TS/React crashes
    // We know from your BestSeller.tsx that this text should exist
    const bestSellerHeading = page.locator('text=BEST SELLERS');
    await expect(bestSellerHeading).toBeVisible();
  });

  test('should allow a user to navigate to a product and add it to the cart', async ({ page }) => {
    await page.goto(`${LOCALHOST_URL}/collection`);

    // 1. Click on the first product in the collection grid
    // (You may need to adjust this selector based on your exact CSS classes)
    const firstProduct = page.locator('.grid a').first();
    await firstProduct.click();

    // 2. Verify we are on the product detail page
    await expect(page).toHaveURL(/.*product.*/);

    // 3. Select a size (Assuming size buttons exist, e.g., 'M' or 'L')
    // Playwright will look for a button with exact text 'M'
    const sizeButton = page.getByText('M', { exact: true });
    if (await sizeButton.isVisible()) {
      await sizeButton.click();
    }

    // 4. Click the Add to Cart button
    await page.getByRole('button', { name: /add to cart/i }).click();

    // 5. Verify the ShopContext updated by checking if the toast appears or cart count changes
    // Toastify usually renders a div with the role of 'alert'
    const toastMessage = page.getByRole('alert');
    await expect(toastMessage).toBeVisible();
  });
});