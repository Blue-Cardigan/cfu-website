import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

const OG_IMAGES = ['/og-image.png', '/og-image-2.png', '/og-image-3.png', '/og-image-4.png'] as const

function pickDailyOgImage() {
  // Deterministic rotation (changes daily, stable within a day) to play nicely with crawlers/caches.
  const day = Math.floor(Date.now() / 86_400_000)
  return OG_IMAGES[day % OG_IMAGES.length]
}

export function generateMetadata(): Metadata {
  const ogImage = pickDailyOgImage()
  const title = 'Creatives for Ukraine'
  const description = 'Make a positive impact on the lives of Ukrainians.'

  return {
    title,
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://creativesforukraine.vercel.app'),
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <main className="min-h-screen bg-background">
            {children}
          </main>
          <Toaster position="top-center" />
        </CartProvider>
      </body>
    </html>
  )
} 