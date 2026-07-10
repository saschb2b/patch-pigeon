import { expect, test as base } from "@playwright/test"

export const test = base.extend<{ browserHealth: void }>({
  browserHealth: [
    async ({ page }, use, testInfo) => {
      const errors: string[] = []

      page.on("pageerror", (error) => errors.push(`Page error at ${page.url()}: ${error.message}`))
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(`Console error at ${page.url()}: ${message.text()}`)
      })
      page.on("response", (response) => {
        if (response.status() >= 500) {
          errors.push(`HTTP ${response.status()}: ${response.url()}`)
        }
      })

      await use()

      if (errors.length > 0) {
        await testInfo.attach("browser-errors", {
          body: errors.join("\n"),
          contentType: "text/plain",
        })
      }
      expect(errors, "browser console, page, and HTTP 5xx errors").toEqual([])
    },
    { auto: true },
  ],
})

export { expect } from "@playwright/test"
