'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Menu,
  X,
  Plus,
  User,
  Building2,
  Heart,
  ArrowRight,
  LayoutDashboard,
  CheckSquare,
  Tags,
  Users,
  Bookmark,
  MessageSquare,
  FileText,
  Calendar,
  LogOut,
} from 'lucide-react'
import { ThemeToggle } from '@/app/components/common'
import { useAuth } from '@/app/hooks/useAuth'

export const NavMenu = (): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, isAdmin, logout } = useAuth()
  const isSellerRole = !isAdmin && user?.role === 'seller'
  const isBuyerRole = !isAdmin && user?.role !== 'seller'

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="p-2 text-foreground focus:outline-none"
        aria-label="Open mobile menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
            <span className="font-heading text-2xl font-extrabold tracking-widest text-foreground">
              LUXUS
            </span>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="p-2 rounded-sm border border-border text-foreground hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Identity Pill (if logged in) */}
          {isAuthenticated && user?.username && (
            <div className="mb-6 p-4 rounded-sm border border-border bg-card flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="font-bold text-foreground text-sm truncate">{user.username}</p>
                <p className="text-xs text-body truncate font-mono">{user.email}</p>
              </div>
              <span className="px-2 py-0.5 rounded-[2px] bg-accent/15 border border-accent/40 text-accent text-[10px] font-bold uppercase tracking-wider shrink-0">
                {isAdmin ? 'Admin' : isSellerRole ? 'Seller' : 'Member'}
              </span>
            </div>
          )}

          {/* Role-Specific Navigation Links */}
          <nav className="flex flex-col space-y-2 mb-8">
            {/* ADMIN MOBILE NAVIGATION */}
            {isAuthenticated && isAdmin && (
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4 text-accent" />
                    <span>Admin Dashboard</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/admin/dashboard/pending-properties"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-accent" />
                    <span>Review Approvals</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/admin/dashboard/categories"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span className="flex items-center gap-2">
                    <Tags className="h-4 w-4 text-accent" />
                    <span>Category Manager</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/admin/dashboard/users"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" />
                    <span>User Moderation</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/properties"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span>Browse Public Site</span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/user/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span>Admin Profile</span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
              </>
            )}

            {/* SELLER MOBILE NAVIGATION */}
            {isAuthenticated && isSellerRole && (
              <>
                <Link
                  href="/user/seller"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-accent" />
                    <span>Seller Overview</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/user/seller/properties"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent" />
                    <span>My Listed Properties</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/properties/addProperty"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-accent" />
                    <span>List New Property</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/user/seller/tours"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>Tour Inquiries</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/properties"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span>Browse Properties</span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/user/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span>Partner Profile</span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
              </>
            )}

            {/* BUYER MOBILE NAVIGATION */}
            {isAuthenticated && isBuyerRole && (
              <>
                <Link
                  href="/properties"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span>Browse All Properties</span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/user/favorites"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-accent" />
                    <span>Saved Properties</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/user/saved-searches"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-accent" />
                    <span>Saved Searches &amp; Alerts</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/chat"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-accent" />
                    <span>Messages &amp; Inquiries</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/user/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-accent" />
                    <span>My Profile</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
              </>
            )}

            {/* GUEST (LOGGED OUT) MOBILE NAVIGATION */}
            {!isAuthenticated && (
              <>
                <Link
                  href="/properties"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span>All Properties</span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/properties?category=villa"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span>Modernist Villas</span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/properties?category=apartment"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span>Sky Penthouses</span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2.5 border-b border-border/40"
                >
                  <span>Contact Concierge</span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
              </>
            )}
          </nav>

          {/* Footer CTAs */}
          <div className="mt-auto space-y-3 pt-6 border-t border-border">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-xs font-semibold uppercase tracking-wider text-body">
                Theme Display
              </span>
              <ThemeToggle variant="pill" />
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-sm border border-destructive/40 bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-wider min-h-[44px]"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center py-3 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase tracking-wider min-h-[44px] shadow-sm"
              >
                Member Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
