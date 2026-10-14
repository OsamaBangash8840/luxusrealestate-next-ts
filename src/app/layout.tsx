'use client'
import localFont from 'next/font/local'
import './globals.css'
import { StoreProvider } from './StoreProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Navbar } from './components/layout/website'
import { usePathname } from 'next/navigation'

import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  // If it's an admin page, return only the children (no RootLayout applied)
  if (pathname.startsWith('/admin')) {
    return children
  }

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <StoreProvider>
          <Navbar />
          {children}
          <ToastContainer position="top-center" />
        </StoreProvider>
      </body>
    </html>
  )
}
