import { test, expect } from '@playwright/test';

test('Storybook UI Matrix Bootup Verification', async ({ page }) => {
    // Navigate strictly to the React Storybook Primary Hub
    await page.goto('http://localhost:6006');
    
    // Explicitly assert the core Layout UI boots successfully
    await expect(page).toHaveTitle(/Storybook/);
    
    // Ensure the Sidebar component locator doesn't throw (meaning AST correctly populated)
    const sidebar = page.locator('#storybook-explorer-tree');
    await expect(sidebar).toBeVisible({ timeout: 15000 });
});
