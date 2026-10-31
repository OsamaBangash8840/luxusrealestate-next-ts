'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, Compass, Search, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react'
import { Container, Typography } from '@/app/components/common'

export default function NotFound() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/properties?location=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/properties')
    }
  }

  return (
    <div className="flex min-h-[82vh] items-center justify-center bg-background px-4 py-16">
      <Container className="max-w-3xl text-center">
        {/* Monumental Architectural 404 Watermark & Status Eyebrow */}
        <div className="relative mb-6 flex flex-col items-center justify-center">
          {/* Giant Monumental 404 Display Numeral */}
          <span
            aria-hidden="true"
            className="text-[120px] sm:text-[180px] md:text-[220px] font-black tracking-tighter leading-none select-none text-foreground/[0.07] font-mono pointer-events-none"
          >
            404
          </span>

          {/* Floating Luxury Status Pill anchored over the numeral */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-sm border border-accent/40 bg-card/95 px-4 py-2 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <ShieldAlert className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-accent">
                HTTP 404 &bull; Page Not Found
              </span>
            </div>
          </div>
        </div>

        {/* Primary Clear Headline */}
        <Typography
          as="h1"
          variant="h1"
          className="mb-3 text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground"
        >
          Page Not Found
        </Typography>

        {/* Reassuring Context Narrative */}
        <Typography
          as="p"
          variant="bodyRegular"
          className="mx-auto mb-8 max-w-xl text-sm sm:text-base text-body leading-relaxed"
        >
          The page or estate address you requested could not be resolved. The listing may have been acquired, the URL may contain a typographical error, or the record has been relocated.
        </Typography>

        {/* Embedded Fast-Search Console */}
        <form
          onSubmit={handleSearchSubmit}
          className="mx-auto mb-8 max-w-md flex items-center gap-2 p-1.5 rounded-sm border border-border bg-card shadow-sm focus-within:border-accent transition-colors"
        >
          <div className="relative flex-1 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, enclave, or estate title..."
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        {/* Primary Navigation Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Home className="h-4 w-4" />
            <span>Return to Sanctuary</span>
          </Link>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm border border-border bg-card text-foreground text-xs font-semibold uppercase tracking-wider hover:bg-muted hover:border-accent/40 transition-colors"
          >
            <Compass className="h-4 w-4 text-accent" />
            <span>Explore Active Estates</span>
          </Link>
        </div>

        {/* Curated Enclaves Directory Links */}
        <div className="pt-8 border-t border-border">
          <div className="flex items-center justify-center gap-1.5 mb-4 text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
            <Sparkles className="h-3 w-3 text-accent" />
            <span>Curated Architectural Portfolios</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href="/properties?category=villa"
              className="px-3.5 py-1.5 rounded-sm bg-card border border-border hover:border-accent text-xs font-medium text-foreground transition-all flex items-center gap-1.5"
            >
              <span>Modernist Villas</span>
              <ArrowRight className="h-3 w-3 text-accent" />
            </Link>

            <Link
              href="/properties?category=penthouse"
              className="px-3.5 py-1.5 rounded-sm bg-card border border-border hover:border-accent text-xs font-medium text-foreground transition-all flex items-center gap-1.5"
            >
              <span>Sky Penthouses</span>
              <ArrowRight className="h-3 w-3 text-accent" />
            </Link>

            <Link
              href="/properties?category=waterfront"
              className="px-3.5 py-1.5 rounded-sm bg-card border border-border hover:border-accent text-xs font-medium text-foreground transition-all flex items-center gap-1.5"
            >
              <span>Waterfront Havens</span>
              <ArrowRight className="h-3 w-3 text-accent" />
            </Link>

            <Link
              href="/properties?category=architectural"
              className="px-3.5 py-1.5 rounded-sm bg-card border border-border hover:border-accent text-xs font-medium text-foreground transition-all flex items-center gap-1.5"
            >
              <span>Architectural Icons</span>
              <ArrowRight className="h-3 w-3 text-accent" />
            </Link>

            <Link
              href="/contact"
              className="px-3.5 py-1.5 rounded-sm bg-card border border-border hover:border-accent text-xs font-medium text-foreground transition-all flex items-center gap-1.5"
            >
              <span>Private Client Desk</span>
              <ArrowRight className="h-3 w-3 text-accent" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
