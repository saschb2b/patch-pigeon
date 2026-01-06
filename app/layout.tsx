import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeRegistry } from "@/components/theme-registry"
import "./globals.css"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://patchpigeon.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PatchPigeon - Beautiful Changelogs for Indie Developers",
    template: "%s | PatchPigeon",
  },
  description:
    "Create beautiful, public changelogs in minutes. Keep your users informed with a dedicated changelog page. Free forever for indie developers.",
  keywords: [
    "changelog",
    "release notes",
    "product updates",
    "indie developers",
    "saas",
    "software updates",
    "version history",
    "product changelog",
    "changelog management",
    "changelog hosting",
  ],
  authors: [{ name: "PatchPigeon" }],
  creator: "PatchPigeon",
  publisher: "PatchPigeon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "PatchPigeon",
    title: "PatchPigeon - Beautiful Changelogs for Indie Developers",
    description:
      "Create beautiful, public changelogs in minutes. Keep your users informed with a dedicated changelog page. Free forever for indie developers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PatchPigeon - Your changelog, delivered.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PatchPigeon - Beautiful Changelogs for Indie Developers",
    description:
      "Create beautiful, public changelogs in minutes. Keep your users informed with a dedicated changelog page.",
    images: ["/og-image.png"],
    creator: "@patchpigeon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
        <Analytics />
      </body>
    </html>
  )
}
