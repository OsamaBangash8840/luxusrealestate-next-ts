'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Container, Typography } from '@/app/components/common'

export const HeroSection = () => {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location.trim()) params.set('location', location.trim())
    if (propertyType) params.set('category', propertyType)
    if (priceRange) params.set('price', priceRange)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative flex min-h-[780px] items-center justify-center bg-background py-24 overflow-hidden">
      {/* Background Hero Asset with Architectural Filter */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 scale-100"
        style={{
          backgroundImage: `url('/images/villa-modernist.jpg')`,
        }}
      />
      {/* Dynamic Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/65 to-background" />
      <div className="absolute inset-0 bg-radial from-transparent via-background/30 to-background pointer-events-none" />

      {/* Hero Content */}
      <Container className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-card/90 backdrop-blur-sm px-4 py-1.5 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <Typography
            as="span"
            variant="extraSmallBold"
            className="uppercase tracking-widest text-accent text-xs font-semibold"
          >
            Luxury Real Estate &bull; Worldwide
          </Typography>
        </div>

        {/* Headline */}
        <Typography
          as="h1"
          variant="h1"
          className="mb-6 max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08]"
        >
          Luxury Homes &amp; Exceptional Living
        </Typography>

        {/* Subtitle */}
        <Typography
          as="p"
          variant="bodyRegular"
          className="mb-10 max-w-2xl text-base sm:text-lg md:text-xl text-body font-normal leading-relaxed"
        >
          Discover exceptional luxury estates, modern penthouses, and waterfront retreats in the world&apos;s most desirable locations.
        </Typography>

        {/* Hero Search System Glassmorphism Console */}
        <div className="w-full max-w-4xl rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-5 sm:p-7 shadow-2xl">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
              {/* Location Input */}
              <div className="text-left">
                <Typography
                  as="label"
                  variant="extraSmallBold"
                  className="mb-2 block uppercase tracking-wider text-accent font-mono text-xs font-bold"
                >
                  Location
                </Typography>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Bel-Air, Tribeca, Geneva..."
                  className="w-full rounded-md border border-input bg-background/90 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                />
              </div>

              {/* Property Type */}
              <div className="text-left">
                <Typography
                  as="label"
                  variant="extraSmallBold"
                  className="mb-2 block uppercase tracking-wider text-accent font-mono text-xs font-bold"
                >
                  Category
                </Typography>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full rounded-md border border-input bg-background/90 p-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                >
                  <option value="">All Categories</option>
                  <option value="villa">Modernist Villa</option>
                  <option value="penthouse">Sky Penthouse</option>
                  <option value="waterfront">Waterfront Estate</option>
                  <option value="architectural">Architectural Icon</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="text-left">
                <Typography
                  as="label"
                  variant="extraSmallBold"
                  className="mb-2 block uppercase tracking-wider text-accent font-mono text-xs font-bold"
                >
                  Acquisition Band
                </Typography>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full rounded-md border border-input bg-background/90 p-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                >
                  <option value="">Any Range</option>
                  <option value="5m-15m">$5M &ndash; $15M</option>
                  <option value="15m-30m">$15M &ndash; $30M</option>
                  <option value="30m+">$30M+ USD</option>
                </select>
              </div>

              {/* Submit CTA */}
              <div>
                <button
                  type="submit"
                  className="flex h-[46px] w-full items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-bold text-accent-foreground shadow-sm transition-all hover:bg-accent/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <Search className="h-4 w-4" />
                  <Typography as="span" variant="smallBold" className="text-accent-foreground">
                    Explore Portfolio
                  </Typography>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Filter Tags */}
          <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-body">
            <Typography
              as="span"
              variant="extraSmallBold"
              className="text-foreground text-[11px] uppercase tracking-wider font-mono font-semibold"
            >
              Curated Highlights:
            </Typography>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => router.push('/properties?category=villa')}
                className="px-2.5 py-1 rounded-full bg-muted/60 hover:bg-muted text-foreground transition-colors text-[11px]"
              >
                Bel-Air Villas
              </button>
              <button
                type="button"
                onClick={() => router.push('/properties?category=penthouse')}
                className="px-2.5 py-1 rounded-full bg-muted/60 hover:bg-muted text-foreground transition-colors text-[11px]"
              >
                Manhattan Penthouses
              </button>
              <button
                type="button"
                onClick={() => router.push('/properties?category=waterfront')}
                className="px-2.5 py-1 rounded-full bg-muted/60 hover:bg-muted text-foreground transition-colors text-[11px]"
              >
                Cap d&apos;Antibes Waterfront
              </button>
              <button
                type="button"
                onClick={() => router.push('/properties?category=architectural')}
                className="px-2.5 py-1 rounded-full bg-muted/60 hover:bg-muted text-foreground transition-colors text-[11px]"
              >
                St. Moritz Compounds
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl w-full border-t border-border pt-8 text-center">
          <div>
            <Typography variant="h2" className="text-2xl md:text-3xl font-extrabold text-foreground">
              $2.4B+
            </Typography>
            <Typography variant="extraSmallBold" className="text-xs text-body mt-1 uppercase tracking-wider font-mono">
              Properties Sold
            </Typography>
          </div>
          <div>
            <Typography variant="h2" className="text-2xl md:text-3xl font-extrabold text-foreground">
              100%
            </Typography>
            <Typography variant="extraSmallBold" className="text-xs text-body mt-1 uppercase tracking-wider font-mono">
              Verified Listings
            </Typography>
          </div>
          <div>
            <Typography variant="h2" className="text-2xl md:text-3xl font-extrabold text-foreground">
              34
            </Typography>
            <Typography variant="extraSmallBold" className="text-xs text-body mt-1 uppercase tracking-wider font-mono">
              Global Cities
            </Typography>
          </div>
          <div>
            <Typography variant="h2" className="text-2xl md:text-3xl font-extrabold text-foreground">
              Top 15%
            </Typography>
            <Typography variant="extraSmallBold" className="text-xs text-body mt-1 uppercase tracking-wider font-mono">
              Selected Quality
            </Typography>
          </div>
        </div>
      </Container>
    </section>
  )
}

