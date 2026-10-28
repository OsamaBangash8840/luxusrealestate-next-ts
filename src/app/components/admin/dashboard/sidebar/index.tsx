'use client'

import React from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldAlert,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react'

interface SidebarProps {
  isActive: (path: string) => boolean
  handleLinkClick: (path: string) => void
  sidebarRef: React.RefObject<HTMLDivElement>
  isSidebarOpen: boolean
}

export function Sidebar({ isActive, handleLinkClick, sidebarRef, isSidebarOpen }: SidebarProps) {
  const navItems = [
    {
      label: 'Overview & Stats',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Property Approvals',
      path: '/admin/dashboard/properties',
      icon: Building2,
    },
    {
      label: 'Categories',
      path: '/admin/dashboard/categories',
      icon: Layers,
    },
    {
      label: 'Users',
      path: '/admin/dashboard/users',
      icon: Users,
    },
    {
      label: 'Activity Logs',
      path: '/admin/dashboard/logs',
      icon: ShieldAlert,
    },
  ]

  return (
    <aside
      ref={sidebarRef}
      style={{ scrollbarWidth: 'none' }}
      className={`fixed left-0 top-0 z-40 flex h-full w-[280px] flex-col border-r border-border bg-card text-foreground px-5 py-6 transition-transform duration-300 ease-in-out md:relative md:w-64 md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand & Subtitle */}
      <div className="mb-8 px-2">
        <Link href="/" className="inline-block group">
          <span className="font-heading text-xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
            LUXUS
          </span>
        </Link>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
            Admin Dashboard
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <button
              key={item.path}
              onClick={() => handleLinkClick(item.path)}
              type="button"
              className={`flex w-full items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-semibold transition-all ${
                active
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-body hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* System Status Footnote */}
      <div className="pt-4 border-t border-border mt-auto px-2 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-mono text-body">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span>System &amp; WebSockets Connected</span>
        </div>
        <p className="text-[10px] text-body/80 font-mono">
          Admin Control Panel
        </p>
      </div>
    </aside>
  )
}

export default Sidebar