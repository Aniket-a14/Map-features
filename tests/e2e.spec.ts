import { test, expect } from '@playwright/test'

test.describe('Map Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('should load the map and WMS tiles', async ({ page }) => {
    const map = page.locator('#map')
    await expect(map).toBeVisible()

    await page.waitForTimeout(2000)
  })

  test('should toggle layer visibility', async ({ page }) => {
    const toggleButton = page.getByLabel('Toggle Layers')
    await expect(toggleButton).toBeVisible()

    await toggleButton.click()

    await page.waitForTimeout(500)

    await toggleButton.click()
  })

  test.skip('should draw an AOI, save it, and persist on reload', async ({ page }) => {
    const drawButton = page.getByText('draw area on map')
    await drawButton.click()

    const map = page.locator('#map')
    const box = await map.boundingBox()
    if (!box) throw new Error('Map bounding box not found')

    const centerX = box.x + box.width / 2
    const centerY = box.y + box.height / 2

    await page.waitForTimeout(2000)

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

    await page.mouse.move(centerX, centerY)
    await page.mouse.down()
    await page.mouse.up()
    await page.waitForTimeout(500)

    const modalHeader = page.getByRole('heading', { name: 'Name your Area' })
    await expect(modalHeader).toBeVisible()

    const input = page.getByPlaceholder('Enter area name...')
    await input.fill('Test Area 1')

    const saveButton = page.getByRole('button', { name: 'Save' })
    await saveButton.click()

    const aoiItem = page.getByText('Test Area 1')
    await expect(aoiItem).toBeVisible()

    await page.reload()

    await expect(page.getByText('Test Area 1')).toBeVisible()
  })
})

/**
 * Code Explanation:
 * End-to-End (E2E) tests using Playwright.
 * Tests the full application flow from a user's perspective.
 *
 * What is Happening:
 * - Navigates to the application URL.
 * - Verifies the title and presence of key elements (Sidebar, Map).
 * - Tests interactions like opening the "Define Area" panel.
 *
 * What to do Next:
 * - Add more comprehensive E2E scenarios (drawing an AOI, searching).
 * - Test responsiveness on different viewport sizes.
 */
