'use client'

import localFont from 'next/font/local'
import { usePathname } from 'next/navigation'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import { StoreProvider } from './StoreProvider'
import { ThemeProvider } from './providers/ThemeProvider'
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-body flex flex-col min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
            />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}