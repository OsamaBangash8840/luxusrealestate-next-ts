'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, LogOut, Heart, Building2, ShieldCheck, ChevronDown, Plus, LayoutDashboard } from 'lucide-react'
import { routes } from '@/app/base/utils/constants'
import { Container, Typography } from '@/app/components/common'
import { useAuth } from '@/app/hooks/useAuth'
import { NotificationBell } from '../NotificationBell'
import { NavMenu } from '../NavbarMenu'

export const Navbar = (): React.ReactElement => {
  const router = useRouter()
  const { isAuthenticated, user, isAdmin, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 h-[72px] w-full border-b border-border bg-background/85 backdrop-blur-md transition-all duration-300">
      <Container className="flex h-full items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href={routes.home} className="flex items-center gap-2 group">
            <Typography
              as="span"
              variant="h3"
              className="text-2xl font-extrabold tracking-widest text-foreground group-hover:text-accent transition-colors"
            >
              LUXUS
            </Typography>
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-border">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <Typography
              as="span"
              variant="extraSmallBold"
              className="text-[10px] font-semibold uppercase tracking-widest text-body"
            >
              Luxury Real Estate
            </Typography>
          </div>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href={routes.properties}
            className="text-xs font-semibold uppercase tracking-wider text-body hover:text-foreground transition-colors"
          >
            <Typography as="span" variant="extraSmallBold" className="tracking-wider">
              Properties
            </Typography>
          </Link>
          <Link
            href="/properties?category=villa"
            className="text-xs font-semibold uppercase tracking-wider text-body hover:text-foreground transition-colors"
          >
            <Typography as="span" variant="extraSmallBold" className="tracking-wider">
              Villas
            </Typography>
          </Link>
          <Link
            href="/properties?category=penthouse"
            className="text-xs font-semibold uppercase tracking-wider text-body hover:text-foreground transition-colors"
          >
            <Typography as="span" variant="extraSmallBold" className="tracking-wider">
              Penthouses
            </Typography>
          </Link>
          <Link
            href={routes.contact}
            className="text-xs font-semibold uppercase tracking-wider text-body hover:text-foreground transition-colors"
          >
            <Typography as="span" variant="extraSmallBold" className="tracking-wider">
              Contact
            </Typography>
          </Link>
        </div>

        {/* Right Actions: Add Property & Auth Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/properties/addProperty"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm border border-border text-foreground hover:bg-muted text-xs font-semibold uppercase tracking-wider transition-colors min-h-[40px]"
          >
            <Plus className="h-3.5 w-3.5 text-accent" />
            <Typography as="span" variant="extraSmallBold" className="tracking-wider uppercase">
              Add Property
            </Typography>
          </Link>

          {isAuthenticated && <NotificationBell />}

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-sm hover:bg-muted transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 text-accent font-bold text-xs flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <ChevronDown className="h-3 w-3 text-body" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-sm border border-border bg-card shadow-lg py-1.5 z-50 text-xs">
                  {user?.username && (
                    <div className="px-3.5 py-2 border-b border-border">
                      <p className="font-semibold text-foreground truncate">{user.username}</p>
                      <p className="text-[11px] text-body truncate">{user.email}</p>
                    </div>
                  )}

                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-accent font-semibold hover:bg-accent/10"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    href="/user/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-foreground hover:bg-muted"
                  >
                    <User className="h-3.5 w-3.5 text-accent" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/user/favorites"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-foreground hover:bg-muted"
                  >
                    <Heart className="h-3.5 w-3.5 text-accent" />
                    <span>Saved Properties</span>
                  </Link>
                  <Link
                    href="/user/seller"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-foreground hover:bg-muted"
                  >
                    <Building2 className="h-3.5 w-3.5 text-accent" />
                    <span>Seller Dashboard</span>
                  </Link>
                  <div className="my-1 border-t border-border" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3.5 py-2 text-destructive hover:bg-destructive/10 text-left font-semibold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[40px] shadow-sm"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <NavMenu />
          </div>
        </div>
      </Container>
    </header>
  )
}