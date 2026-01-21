import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { Toaster } from 'sonner'
import { buildOgImages, getBaseUrl, pickDailyOgImage, SITE_DESCRIPTION, SITE_TITLE } from '@/lib/site'

const inter = Inter({ subsets: ['latin'] })

export function generateMetadata(): Metadata {
  const ogImage = pickDailyOgImage()
  const title = SITE_TITLE
  const description = SITE_DESCRIPTION
  const baseUrl = getBaseUrl()
  const ogImages = buildOgImages(ogImage, title)

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
      images: ogImages,
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
    name: SITE_TITLE,
    url: baseUrl,
    logo: `${baseUrl.replace(/\/$/, '')}/logo-only.png`,
    sameAs: [
      'https://www.instagram.com/creatives_for_ukraine/',
      'https://www.linkedin.com/company/creatives-for-ukraine',
      'https://www.facebook.com/profile.php?id=61568282291002',
      'https://lu.ma/CreativesForUkraine',
    ],
  }
  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_TITLE,
    url: baseUrl,
    publisher: {
      '@type': 'Organization',
      name: SITE_TITLE,
      url: baseUrl,
    },
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
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
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