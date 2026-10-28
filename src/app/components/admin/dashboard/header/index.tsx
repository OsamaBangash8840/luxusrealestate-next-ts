'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, ChevronDown, ShieldCheck, Home, LogOut } from 'lucide-react'
import { useAuth } from '@/app/hooks/useAuth'

interface HeaderProps {
  toggleSidebar: () => void
  dropdownRef: React.RefObject<HTMLDivElement>
  toggleDropdown: () => void
  isDropdownOpen: boolean
  handleLinkClick: (path: string) => void
}

export function Header({
  toggleSidebar,
  dropdownRef,
  toggleDropdown,
  isDropdownOpen,
  handleLinkClick,
}: HeaderProps) {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    handleLinkClick('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-6 py-3.5">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-body hover:text-foreground md:hidden focus:outline-none"
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-accent/10 border border-accent/30 text-accent font-mono text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3 w-3" />
            Administrator
          </span>
        </div>
      </div>

      {/* User Actions & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleDropdown}
          className="flex items-center gap-2.5 p-1.5 rounded-sm hover:bg-muted transition-colors focus:outline-none text-left"
        >
          <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground font-mono text-xs font-bold flex items-center justify-center">
            AD
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-foreground leading-none">Super Administrator</p>
            <p className="text-[10px] font-mono text-body mt-0.5">admin@luxus-estates.com</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-body" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-52 rounded-sm border border-border bg-card shadow-lg py-1.5 z-50 text-xs">
            <button
              onClick={() => handleLinkClick('/')}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-body hover:text-foreground hover:bg-muted text-left"
              type="button"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Catalogue Front</span>
            </button>
            <div className="my-1 border-t border-border" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-destructive hover:bg-destructive/10 text-left font-semibold"
              type="button"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Terminate Session</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header