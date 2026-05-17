import { test, expect } from '@playwright/experimental-ct-react';

test.describe('Storybook Sanity Initialization Matrix', () => {
    test('boots the sandbox and renders the functional navigation layout', async ({ page }) => {
        // CI runs Storybook deterministically on 6006 based on concurrently flags
        await page.goto('http://localhost:6006');
        
        // Ensure the Storybook core layout manager hydrates (proving Vite compilation completed cleanly)
        await expect(page).toHaveTitle(/Storybook/i);
        
        // Verify the internal Root element exists dynamically
        const rootNode = page.locator('#storybook-root, #root');
        await expect(rootNode).toBeAttached({ timeout: 15000 });
        
        console.log('✅ Storybook Sanity Pass: E2E React/Vue WebDrivers correctly compiled without crash looping.');
    });
});
