import { createTestAccount, signUpAndOnboard } from "./helpers"
import { expect, test } from "./fixtures"

test.describe("Publishing", () => {
  test("publish-release-and-feeds", async ({ page, request }, testInfo) => {
    const account = createTestAccount(testInfo, "publisher")
    const productName = `Flight Deck ${testInfo.retry}`
    const productSlug = `flight-deck-${testInfo.retry}`
    const releaseTitle = `Reliable Launch ${testInfo.retry}`

    // 1. Create a unique owner account.
    await signUpAndOnboard(page, account)

    // 2. Create a product.
    await page.getByRole("link", { name: "New Product" }).click()
    await page.getByLabel("Product Name").fill(productName)
    await page.getByLabel("URL Slug").fill(productSlug)
    await page.getByLabel("Description").fill("A product created by the critical E2E publishing journey.")
    await page.getByRole("button", { name: "Create Product" }).click()
    await expect(page).toHaveURL(/\/admin\/products\/[0-9a-f-]+$/)

    // 3. Create and publish a release with one feature.
    await page.getByRole("link", { name: "New Entry" }).click()
    await page.getByLabel("Title *").fill(releaseTitle)
    await page.getByLabel("Version").fill("1.0.0")
    await page.getByLabel("Summary (optional)").fill("A release verified from editor to public feeds.")
    const releaseSlug = await page.getByLabel("URL Slug").inputValue()
    await page.getByRole("button", { name: "Add feature" }).click()
    await page.getByLabel("Change title").fill("Added resilient publishing")
    await page.getByRole("switch", { name: "Draft" }).check()
    await page.getByRole("button", { name: "Save", exact: true }).click()
    await expect(page).toHaveURL(/\/admin\/products\/[0-9a-f-]+$/)
    await expect(page.getByText(releaseTitle, { exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: "Unpublish" })).toBeVisible()

    // 4. Open the public product and release pages.
    await page.goto(`/${account.ownerSlug}/${productSlug}`)
    await expect(page.getByRole("heading", { name: productName }).first()).toBeVisible()
    await page.getByRole("link", { name: new RegExp(`View ${releaseTitle}`) }).click()
    await expect(page.getByRole("heading", { name: releaseTitle })).toBeVisible()
    await expect(page.getByText("Added resilient publishing")).toBeVisible()

    // 5. Request the public JSON feed.
    const jsonResponse = await request.get(`/api/${account.ownerSlug}/${productSlug}/changelog.json`)
    expect(jsonResponse.ok()).toBe(true)
    expect(jsonResponse.headers()["content-type"]).toContain("application/json")
    const jsonFeed = await jsonResponse.json()
    expect(jsonFeed.product.slug).toBe(productSlug)
    expect(jsonFeed.entries).toHaveLength(1)
    expect(jsonFeed.entries[0]).toMatchObject({
      title: releaseTitle,
      slug: releaseSlug,
      version: "1.0.0",
    })
    expect(jsonFeed.entries[0].items[0].title).toBe("Added resilient publishing")

    // 6. Request the public RSS feed.
    const rssResponse = await request.get(`/api/${account.ownerSlug}/${productSlug}/changelog.rss`)
    expect(rssResponse.ok()).toBe(true)
    expect(rssResponse.headers()["content-type"]).toContain("application/rss+xml")
    const rssFeed = await rssResponse.text()
    expect(rssFeed).toContain(`<title>${releaseTitle}</title>`)
    expect(rssFeed).toContain(`/${account.ownerSlug}/${productSlug}/${releaseSlug}`)
  })
})
