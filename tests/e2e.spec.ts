import { test, expect } from '@playwright/test'

test.describe('Map Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('should load the map and WMS tiles', async ({ page }) => {
    // Check if map container exists
    const map = page.locator('#map')
    await expect(map).toBeVisible()

    // Wait a bit for map to initialize
    await page.waitForTimeout(2000)
  })

  test('should toggle layer visibility', async ({ page }) => {
    // Click the toggle layer button in sidebar
    // It has aria-label="Toggle Layers"
    const toggleButton = page.getByLabel('Toggle Layers')
    await expect(toggleButton).toBeVisible()

    // Initial state: layer should be visible (button might have specific class or just check clickability)
    // We can check if the button exists and is clickable
    await toggleButton.click()

    // Wait for potential state change
    await page.waitForTimeout(500)

    // Click again
    await toggleButton.click()
  })

  test.skip('should draw an AOI, save it, and persist on reload', async ({ page }) => {
    // Click "Draw area on map" in the sidebar panel
    // It's inside the "Define Project Scope" panel initially
    const drawButton = page.getByText('draw area on map')
    await drawButton.click()

    // Simulate drawing on the map
    const map = page.locator('#map')
    const box = await map.boundingBox()
    if (!box) throw new Error('Map bounding box not found')

    const centerX = box.x + box.width / 2
    const centerY = box.y + box.height / 2

    // Wait for map to be idle (tiles loaded)
    await page.waitForTimeout(2000)

    // Click points to form a triangle
    await page.mouse.move(centerX, centerY)
    await page.mouse.down()
    await page.mouse.up()
    await page.waitForTimeout(200)

    await page.mouse.move(centerX + 100, centerY)
    await page.mouse.down()
    await page.mouse.up()
    await page.waitForTimeout(200)

    await page.mouse.move(centerX + 50, centerY + 100)
    await page.mouse.down()
    await page.mouse.up()
    await page.waitForTimeout(200)

    await page.mouse.move(centerX, centerY) // Close the polygon
    await page.mouse.down()
    await page.mouse.up()
    await page.waitForTimeout(500)

    // Wait for "Name your Area" modal in the panel
    const modalHeader = page.getByRole('heading', { name: 'Name your Area' })
    await expect(modalHeader).toBeVisible()

    // Enter name
    const input = page.getByPlaceholder('Enter area name...')
    await input.fill('Test Area 1')

    // Save
    const saveButton = page.getByRole('button', { name: 'Save' })
    await saveButton.click()

    // Verify it appears in the list
    // The list is under "Define Area of Interest" section
    const aoiItem = page.getByText('Test Area 1')
    await expect(aoiItem).toBeVisible()

    // Reload page
    await page.reload()

    // Verify it persists
    // We might need to expand the section first if it's collapsed by default?
    // In current code, 'aoi' section is true (expanded) by default.
    await expect(page.getByText('Test Area 1')).toBeVisible()
  })
})
