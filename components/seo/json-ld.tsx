import type { Product, Profile, EntryWithItems } from "@/lib/types"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://patchpigeon.com"

interface OrganizationJsonLdProps {
  profile: Profile
}

export function OrganizationJsonLd({ profile }: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: profile.display_name || profile.owner_slug,
    url: `${siteUrl}/${profile.owner_slug}`,
    ...(profile.avatar_url && { logo: profile.avatar_url }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface SoftwareApplicationJsonLdProps {
  product: Product
  profile: Profile
}

export function SoftwareApplicationJsonLd({ product, profile }: SoftwareApplicationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.description,
    url: `${siteUrl}/${profile.owner_slug}/${product.slug}`,
    ...(product.logo_url && { image: product.logo_url }),
    author: {
      "@type": "Organization",
      name: profile.display_name || profile.owner_slug,
      url: `${siteUrl}/${profile.owner_slug}`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface ChangelogJsonLdProps {
  product: Product
  profile: Profile
  entries: EntryWithItems[]
}

export function ChangelogJsonLd({ product, profile, entries }: ChangelogJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${product.name} Changelog`,
    description: `Release notes and updates for ${product.name}`,
    url: `${siteUrl}/${profile.owner_slug}/${product.slug}`,
    numberOfItems: entries.length,
    itemListElement: entries.slice(0, 10).map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        headline: entry.title,
        description: entry.summary || `${entry.title} release for ${product.name}`,
        url: `${siteUrl}/${profile.owner_slug}/${product.slug}/${entry.slug}`,
        datePublished: entry.publish_date || entry.created_at,
        dateModified: entry.updated_at,
        ...(entry.version && { version: entry.version }),
        author: {
          "@type": "Organization",
          name: profile.display_name || profile.owner_slug,
        },
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface ArticleJsonLdProps {
  entry: EntryWithItems
  product: Product
  profile: Profile
}

export function ArticleJsonLd({ entry, product, profile }: ArticleJsonLdProps) {
  const items = entry.entry_items || []
  const featureCount = items.filter(i => i.type === "FEATURE").length
  const fixCount = items.filter(i => i.type === "FIX").length
  const improvementCount = items.filter(i => i.type === "IMPROVEMENT").length

  const articleBody = [
    entry.summary,
    featureCount > 0 ? `${featureCount} new feature${featureCount > 1 ? 's' : ''}` : null,
    improvementCount > 0 ? `${improvementCount} improvement${improvementCount > 1 ? 's' : ''}` : null,
    fixCount > 0 ? `${fixCount} bug fix${fixCount > 1 ? 'es' : ''}` : null,
  ].filter(Boolean).join('. ')

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.summary || `${entry.title} - Release notes for ${product.name}`,
    articleBody,
    url: `${siteUrl}/${profile.owner_slug}/${product.slug}/${entry.slug}`,
    datePublished: entry.publish_date || entry.created_at,
    dateModified: entry.updated_at,
    ...(entry.version && { version: entry.version }),
    author: {
      "@type": "Organization",
      name: profile.display_name || profile.owner_slug,
      url: `${siteUrl}/${profile.owner_slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "PatchPigeon",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon.svg`,
      },
    },
    isPartOf: {
      "@type": "WebSite",
      name: `${product.name} Changelog`,
      url: `${siteUrl}/${profile.owner_slug}/${product.slug}`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/${profile.owner_slug}/${product.slug}/${entry.slug}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface WebsiteJsonLdProps {
  name?: string
  description?: string
}

export function WebsiteJsonLd({ name = "PatchPigeon", description }: WebsiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description: description || "Beautiful changelogs for indie developers",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface FAQJsonLdProps {
  faqs: { question: string; answer: string }[]
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
