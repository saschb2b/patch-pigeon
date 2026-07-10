const DEFAULT_SITE_URL = "http://localhost:3000"

export function getSiteUrl() {
  const configured = process.env.APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
  return configured.replace(/\/$/, "")
}
