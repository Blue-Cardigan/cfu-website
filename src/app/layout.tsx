import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

const OG_IMAGES = ['/og-image.png', '/og-image-2.png', '/og-image-3.png', '/og-image-4.png'] as const

const CANONICAL_BASE_URL = 'https://creativesforukraine.uk'

function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim()
  if (!raw) return CANONICAL_BASE_URL
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  return `https://${raw}`
}

function pickDailyOgImage() {
  // Deterministic rotation (changes daily, stable within a day) to play nicely with crawlers/caches.
  const day = Math.floor(Date.now() / 86_400_000)
  return OG_IMAGES[day % OG_IMAGES.length]
}

export function generateMetadata(): Metadata {
  const ogImage = pickDailyOgImage()
  const title = 'Creatives for Ukraine'
  const description = 'Make a positive impact on the lives of Ukrainians.'
  const baseUrl = getBaseUrl()
  const ogImages = OG_IMAGES.map((img) => ({
    url: img,
    width: 1200,
    height: 630,
    alt: title,
    type: 'image/png',
  }))

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
    },
    icons: {
      icon: [
        { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicons/favicon.ico' },
      ],
      apple: [{ url: '/favicons/apple-touch-icon.png', sizes: '180x180' }],
      other: [{ rel: 'manifest', url: '/favicons/site.webmanifest' }],
    },
    openGraph: {
      title,
      description,
      url: '/',
      siteName: title,
      locale: 'en_GB',
      type: 'website',
      // Provide multiple images as fallbacks; most platforms take the first, but this improves robustness.
      images: [
        ogImages.find((i) => i.url === ogImage) ?? ogImages[0],
        ...ogImages.filter((i) => i.url !== ogImage),
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      // Prefer a single image for Twitter (most reliable)
      images: [ogImage],
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const baseUrl = getBaseUrl()
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Creatives for Ukraine',
    url: baseUrl,
    logo: `${baseUrl.replace(/\/$/, '')}/logo-only.png`,
    sameAs: [
      'https://www.instagram.com/creatives_for_ukraine/',
      'https://www.linkedin.com/company/creatives-for-ukraine',
      'https://www.facebook.com/profile.php?id=61568282291002',
      'https://lu.ma/CreativesForUkraine',
    ],
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
          />
          <main className="min-h-screen bg-background">
            {children}
          </main>
          <Toaster position="top-center" />
        </CartProvider>
      </body>
    </html>
  )
} 