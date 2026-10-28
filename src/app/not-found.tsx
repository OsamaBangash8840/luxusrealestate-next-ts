'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, Compass, ArrowLeft, ShieldAlert } from 'lucide-react'
import { Container, Typography } from '@/app/components/common'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-20">
      <Container className="max-w-2xl text-center">
        {/* Notice Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-card px-4 py-1.5 shadow-sm">
          <ShieldAlert className="h-4 w-4 text-accent" />
          <Typography
            as="span"
            variant="extraSmallBold"
            className="font-mono uppercase tracking-widest text-accent text-xs font-semibold"
          >
            Error 404 &bull; Page Not Found
          </Typography>
        </div>

        {/* Headline */}
        <Typography
          as="h1"
          variant="h1"
          className="mb-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground"
        >
          Property Not Found
        </Typography>

        {/* Subtitle */}
        <Typography
          as="p"
          variant="bodyRegular"
          className="mx-auto mb-8 max-w-xl text-base sm:text-lg text-body leading-relaxed"
        >
          The property or page you are looking for does not exist. It may have been sold, removed, or the link may be incorrect.
        </Typography>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Home className="h-4 w-4" />
            <Typography as="span" variant="smallBold" className="text-primary-foreground">
              Back to Home
            </Typography>
          </button>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Compass className="h-4 w-4 text-accent" />
            <Typography as="span" variant="smallBold" className="text-foreground">
              Browse All Properties
            </Typography>
          </Link>
        </div>

        {/* Quick Links Directory */}
        <div className="pt-8 border-t border-border">
          <Typography
            as="span"
            variant="extraSmallBold"
            className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest block mb-4"
          >
            Popular Categories:
          </Typography>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/properties?category=villa"
              className="px-3.5 py-1.5 rounded-full bg-card border border-border hover:border-accent text-xs text-foreground transition-all"
            >
              <Typography as="span" variant="extraSmallMedium">Modernist Villas</Typography>
            </Link>
            <Link
              href="/properties?category=penthouse"
              className="px-3.5 py-1.5 rounded-full bg-card border border-border hover:border-accent text-xs text-foreground transition-all"
            >
              <Typography as="span" variant="extraSmallMedium">Sky Penthouses</Typography>
            </Link>
            <Link
              href="/properties?category=waterfront"
              className="px-3.5 py-1.5 rounded-full bg-card border border-border hover:border-accent text-xs text-foreground transition-all"
            >
              <Typography as="span" variant="extraSmallMedium">Waterfront Havens</Typography>
            </Link>
            <Link
              href="/contact"
              className="px-3.5 py-1.5 rounded-full bg-card border border-border hover:border-accent text-xs text-foreground transition-all"
            >
              <Typography as="span" variant="extraSmallMedium">Private Client Desk</Typography>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
