import { expect, test } from "./fixtures"

test("seed", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Your users deserve to know what's new" })).toBeVisible()
})
