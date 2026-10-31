'use client'

import localFont from 'next/font/local'
import { usePathname } from 'next/navigation'
import { ToastContainer } from 'react-toastify'

import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { StoreProvider } from './StoreProvider'
import { Navbar, Footer } from './components/layout/website'

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
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-body flex flex-col min-h-screen`}>
        <StoreProvider>
          {!isAdminRoute && <Navbar />}
          <div className="flex-1">
            {children}
          </div>
          {!isAdminRoute && <Footer />}
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="light"
          />
        </StoreProvider>
      </body>
    </html>
  )
}