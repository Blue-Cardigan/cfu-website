import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Creatives for Ukraine',
  description: 'Make a positive impact on the lives of Ukrainians.',
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