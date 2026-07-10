import type { Page, TestInfo } from "@playwright/test"
import { expect } from "./fixtures"

export interface TestAccount {
  email: string
  password: string
  displayName: string
  ownerSlug: string
}

export function createTestAccount(testInfo: TestInfo, label: string): TestAccount {
  const suffix = `${testInfo.workerIndex}-${testInfo.retry}-${Date.now().toString(36)}`
  return {
    email: `${label}-${suffix}@example.com`,
    password: "Playwright-password-123!",
    displayName: `${label} ${suffix}`,
    ownerSlug: `${label}-${suffix}`.toLowerCase(),
  }
}

export async function signUpAndOnboard(page: Page, account: TestAccount) {
  await page.goto("/auth/sign-up")
  await expect(page.getByRole("heading", { name: "Start your journey" })).toBeVisible()
  await page.getByLabel("Email", { exact: true }).fill(account.email)
  await page.getByLabel("Password", { exact: true }).fill(account.password)
  await page.getByLabel("Confirm Password").fill(account.password)
  await page.getByRole("button", { name: "Create Account" }).click()

  await expect(page).toHaveURL(/\/auth\/onboarding$/)
  await page.getByLabel("Display Name").fill(account.displayName)
  await page.getByLabel("Your Handle").fill(account.ownerSlug)
  await expect(page.getByRole("button", { name: "Continue to Dashboard" })).toBeEnabled()
  await page.getByRole("button", { name: "Continue to Dashboard" }).click()

  await expect(page).toHaveURL(/\/admin$/)
  await expect(page.getByRole("heading", { name: /Welcome back!/ })).toBeVisible()
}
