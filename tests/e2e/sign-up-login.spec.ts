import { createTestAccount, signUpAndOnboard } from "./helpers"
import { expect, test } from "./fixtures"

test.describe("Authentication", () => {
  test("sign-up-login", async ({ page }, testInfo) => {
    // 1. Create a unique account and complete owner onboarding.
    const account = createTestAccount(testInfo, "auth-owner")
    await signUpAndOnboard(page, account)

    // 2. Sign out.
    await page.getByRole("button", { name: "Sign Out" }).click()
    await expect(page).toHaveURL(/\/$/)

    // 3. Sign in with the new account.
    await page.goto("/auth/login")
    await page.getByLabel("Email", { exact: true }).fill(account.email)
    await page.getByLabel("Password", { exact: true }).fill(account.password)
    await page.getByRole("button", { name: "Sign In" }).click()
    await expect(page).toHaveURL(/\/admin$/)
    await expect(page.getByRole("heading", { name: /Welcome back!/ })).toBeVisible()
  })
})
