'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Header from '@/app/components/admin/dashboard/header'
import Sidebar from '@/app/components/admin/dashboard/sidebar'
import { AuthGuard } from '@/app/components/common'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const pathname = usePathname()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const sidebarRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const isActive = (path: string) => pathname === path

  const handleLinkClick = (path: string) => {
    setIsDropdownOpen(false)
    setIsSidebarOpen(false)
    router.push(path)
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="relative flex h-screen items-start justify-start overflow-hidden bg-background">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-foreground/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar
          isActive={isActive}
          handleLinkClick={handleLinkClick}
          sidebarRef={sidebarRef}
          isSidebarOpen={isSidebarOpen}
        />

        <div className="flex h-screen flex-1 flex-col overflow-hidden">
          <Header
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            dropdownRef={dropdownRef}
            toggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
            isDropdownOpen={isDropdownOpen}
            handleLinkClick={handleLinkClick}
          />

          <main
            className="flex-1 overflow-y-auto bg-background p-6"
            style={{ scrollbarWidth: 'none' }}
          >
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}