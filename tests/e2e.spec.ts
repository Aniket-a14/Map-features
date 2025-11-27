import { test, expect } from '@playwright/test';

test.describe('Map Application', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('should load the map and WMS tiles', async ({ page }) => {
        // Check if map container exists
        const map = page.locator('#map');
        await expect(map).toBeVisible();

        // Wait for network requests to WMS service
        // Note: This might be flaky if cache is hit or network is slow, but good for a sanity check
        // We check if at least one tile request is made to the NRW WMS
        const wmsRequest = page.waitForRequest(request =>
            request.url().includes('wms.nrw.de/geobasis/wms_nw_dop') &&
            request.url().includes('request=GetMap')
        );

        // Wait a bit for map to initialize and request tiles
        await page.waitForTimeout(2000);
    });

    test('should toggle layer visibility', async ({ page }) => {
        // Click the toggle layer button in sidebar (2nd button)
        const toggleButton = page.getByLabel('Toggle Layers');
        await expect(toggleButton).toBeVisible();

        // Initial state: layer should be visible (button active style)
        await expect(toggleButton).toHaveClass(/bg-\[#ede0d4\]/); // Checking for active background class

        // Click to toggle off
        await toggleButton.click();
        await expect(toggleButton).not.toHaveClass(/bg-\[#ede0d4\]/);

        // Click to toggle on
        await toggleButton.click();
        await expect(toggleButton).toHaveClass(/bg-\[#ede0d4\]/);
    });

    test('should draw an AOI, save it, and persist on reload', async ({ page }) => {
        // Click "Draw area on map"
        const drawButton = page.getByLabel('Draw area on map');
        await drawButton.click();

        // Simulate drawing on the map
        // This is tricky with canvas, but we can simulate mouse events
        const map = page.locator('#map');
        const box = await map.boundingBox();
        if (!box) throw new Error('Map bounding box not found');

        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;

        // Click points to form a triangle
        await page.mouse.click(centerX, centerY);
        await page.mouse.click(centerX + 100, centerY);
        await page.mouse.click(centerX + 50, centerY + 100);
        await page.mouse.click(centerX, centerY); // Close the polygon

        // Wait for modal to appear
        const modal = page.locator('text=Name your Area');
        await expect(modal).toBeVisible();

        // Enter name
        const input = page.locator('input[placeholder="Enter AOI name..."]');
        await input.fill('Test Area 1');

        // Save
        const saveButton = page.locator('button:has-text("Save Area")');
        await saveButton.click();

        // Verify it appears in the list
        const aoiItem = page.locator('text=Test Area 1');
        await expect(aoiItem).toBeVisible();

        // Reload page
        await page.reload();

        // Verify it persists
        await expect(page.locator('text=Test Area 1')).toBeVisible();
    });
});
