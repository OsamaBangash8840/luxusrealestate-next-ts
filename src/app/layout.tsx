'use client'
import localFont from 'next/font/local'
import './globals.css'
import { StoreProvider } from './StoreProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Navbar } from './components/layout/website'
import { usePathname } from 'next/navigation'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <Navbar />
          {children}
          <ToastContainer position="top-center" />
        </StoreProvider>
      </body>
    </html>
  )
}
