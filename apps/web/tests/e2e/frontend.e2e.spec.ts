import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

test.describe('Frontend smoke', () => {
  test('homepage renders key CMS-driven sections', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('.hero__title')).toBeVisible()
    await expect(page.locator('.hero__title')).not.toBeEmpty()
    await expect(page.locator('.service-card').first()).toBeVisible()
    await expect(page.locator('a.project-card').first()).toBeVisible()
    await expect(page.locator('#contact')).toBeVisible()
  })

  test('can open a project detail page from the homepage', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('a.project-card').first().click()
    await expect(page).toHaveURL(/\/projects\/.+/)
    await expect(page.locator('.project__title')).toBeVisible()
  })

  test('contact form submits and shows a success message', async ({ page }) => {
    await page.goto(BASE)
    const form = page.locator('.contact__form')
    await form.locator('input').first().fill('Playwright Tester')
    await form.locator('input[type="email"]').fill('pw@example.com')
    await form.locator('textarea').fill('Automated smoke-test enquiry.')
    await form.locator('button[type="submit"]').click()
    await expect(page.locator('.contact__success')).toBeVisible()
  })

  test('unknown project slug shows the not-found page', async ({ page }) => {
    const res = await page.goto(`${BASE}/projects/definitely-not-real`)
    expect(res?.status()).toBe(404)
    await expect(page.getByText('Page not found')).toBeVisible()
  })

  test('mobile hamburger menu opens with nav links', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(BASE)
    await page.locator('.mobile-nav__toggle').click()
    const panel = page.locator('.mobile-nav__panel')
    await expect(panel).toBeVisible()
    await expect(panel.getByText('Services')).toBeVisible()
  })
})
