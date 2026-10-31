'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Plus, User, Building2, Heart, ArrowRight } from 'lucide-react'
import { ThemeToggle } from '@/app/components/common'

export const NavMenu = (): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { name: 'Properties', href: '/properties' },
    { name: 'Saved Properties', href: '/favorites' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Seller Dashboard', href: '/user/seller' },
    { name: 'Messages & Inquiries', href: '/chat' },
  ]

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
          <div className="flex items-center justify-between pb-6 border-b border-border mb-8">
            <span className="font-heading text-2xl font-extrabold tracking-widest text-foreground">
              LUXUS
            </span>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="p-2 rounded-sm border border-border text-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col space-y-4 mb-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-foreground hover:text-accent transition-colors flex items-center justify-between py-2 border-b border-border/50"
              >
                <span>{link.name}</span>
                <ArrowRight className="h-4 w-4 text-accent" />
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="mt-auto space-y-3 pt-6 border-t border-border">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-xs font-semibold uppercase tracking-wider text-body">
                Theme Display
              </span>
              <ThemeToggle variant="pill" />
            </div>

            <Link
              href="/properties/addProperty"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-sm border border-border text-foreground hover:bg-muted text-xs font-semibold uppercase tracking-wider min-h-[44px]"
            >
              <Plus className="h-4 w-4 text-accent" />
              <span>List Property</span>
            </Link>

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center py-3 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase tracking-wider min-h-[44px] shadow-sm"
            >
              Member Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}