import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Car Wash Booking - Connect with Local Car Wash Services',
  description: 'Book professional car wash services near you. Connect car owners with trusted shop owners for convenient vehicle cleaning.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark bg-gray-900 text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}