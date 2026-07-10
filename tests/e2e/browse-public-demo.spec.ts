import { expect, test } from "./fixtures"

test.describe("Public Demo", () => {
  test("browse-public-demo", async ({ page }) => {
    // 1. Open the Acme App demo changelog.
    const response = await page.goto("/demo/acme-app")
    expect(response?.ok()).toBe(true)
    await expect(page.getByRole("heading", { name: "Acme App" }).first()).toBeVisible()
    await expect(page.getByRole("heading", { name: "January 2026" })).toBeVisible()

    // 2. Open the Bug Fixes & Stability release.
    await page.getByRole("link", { name: /View Bug Fixes & Stability/ }).click()
    await expect(page).toHaveURL(/\/demo\/acme-app\/v1-9-5-bug-fixes$/)
    await expect(page.getByRole("heading", { name: "Bug Fixes & Stability" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Bug Fixes", exact: true })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Known Issue" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Note" })).toBeVisible()
  })
})
