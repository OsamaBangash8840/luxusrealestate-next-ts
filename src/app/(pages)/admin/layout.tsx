'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Sidebar from '@/app/components/admin/dashboard/sidebar'
import Header from '@/app/components/admin/dashboard/header'
import { StoreProvider } from '@/app/StoreProvider'
import { getCookie } from 'cookies-next'
import { routes } from '@/app/base/utils/constants'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const token = getCookie('token')

  // Redirect to login if token is missing
  useEffect(() => {
    if (!token) {
      router.push(routes.login)
    }
  }, [token, router])

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const sidebarRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  // const router = useRouter()
  const pathname = usePathname()
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLinkClick = (path: string) => {
    setIsDropdownOpen(false)
    setIsSidebarOpen(false)
    router.push(path)
  }
  const isActive = (path: string) => pathname === path
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false)
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isDropdownOpen
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSidebarOpen, isDropdownOpen])

  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <div
            className="relative overflow-x-hidden flex items-start justify-start h-screen bg-[#FBFBFB] "
            style={{ scrollbarWidth: 'none' }}
          >
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              ></div>
            )}

            <Sidebar
              isActive={isActive}
              handleLinkClick={handleLinkClick}
              sidebarRef={sidebarRef}
              isSidebarOpen={isSidebarOpen}
            />

            {/* Content */}
            <div className="flex-1 w-[70%] flex flex-col">
              <Header
                toggleSidebar={toggleSidebar}
                dropdownRef={dropdownRef}
                toggleDropdown={toggleDropdown}
                isDropdownOpen={isDropdownOpen}
                handleLinkClick={handleLinkClick}
              />

              <main
                className="p-4  md:max-h-[85vh] text-nowrap overflow-y-auto  bg-gray-50  flex-1 overflow-auto"
                style={{ scrollbarWidth: 'none' }}
              >
                {children}
              </main>
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  )
}
