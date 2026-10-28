'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, ShieldCheck, MailCheck, Building2, Waves, Sparkles, Compass } from 'lucide-react'
import { Container, Typography } from '@/app/components/common'

const categories = [
  {
    title: 'Modernist Villas',
    count: '14 Properties',
    description: 'Contemporary architecture with open living spaces, private pools, and hillside views.',
    category: 'villa',
    icon: Building2,
    image: '/images/villa-modernist.jpg',
  },
  {
    title: 'Sky Penthouses',
    count: '9 Properties',
    description: 'Top-floor residences featuring panoramic city skyline views and private elevator access.',
    category: 'penthouse',
    icon: Sparkles,
    image: '/images/sky-penthouse.jpg',
  },
  {
    title: 'Waterfront Homes',
    count: '11 Properties',
    description: 'Private waterfront properties with direct beach access and coastal views.',
    category: 'waterfront',
    icon: Waves,
    image: '/images/waterfront-haven.jpg',
  },
  {
    title: 'Architectural Homes',
    count: '4 Properties',
    description: 'Renowned historic homes, mid-century modern classics, and award-winning architecture.',
    category: 'architectural',
    icon: Compass,
    image: '/images/alpine-sanctuary.jpg',
  },
]

export const ForthSection: React.FC = () => {
  return (
    <section className="py-20 bg-background border-t border-border">
      <Container>
        {/* Category Section Header */}
        <div className="mb-12">
          <Typography
            as="span"
            variant="extraSmallBold"
            className="text-xs font-semibold uppercase tracking-widest text-accent block mb-1"
          >
            Property Categories
          </Typography>
          <Typography
            as="h2"
            variant="h2"
            className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight"
          >
            Explore Properties by Style
          </Typography>
        </div>

        {/* Categories 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {categories.map((cat, idx) => {
            const Icon = cat.icon
            return (
              <Link
                key={idx}
                href={`/properties?category=${cat.category}`}
                className="group relative overflow-hidden rounded-sm border border-border bg-card transition-all duration-500 hover:border-accent hover:shadow-xl flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground group-hover:text-accent group-hover:bg-card transition-all shadow-sm">
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-accent" />
                      <Typography
                        as="span"
                        variant="extraSmallBold"
                        className="text-[10px] font-mono text-accent font-semibold uppercase tracking-widest"
                      >
                        {cat.count}
                      </Typography>
                    </div>
                    <Typography
                      as="h3"
                      variant="h4"
                      className="text-base font-bold text-foreground mb-1 group-hover:text-accent transition-colors"
                    >
                      {cat.title}
                    </Typography>
                    <Typography
                      as="p"
                      variant="smallRegular"
                      className="text-xs text-body leading-relaxed line-clamp-2"
                    >
                      {cat.description}
                    </Typography>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Private Client Desk Banner */}
        <div className="relative overflow-hidden rounded-sm bg-foreground text-background p-10 sm:p-16 border border-border shadow-xl">
          {/* Subtle photographic backdrop */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
            style={{ backgroundImage: `url('/images/sky-penthouse.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <Typography
                as="span"
                variant="extraSmallBold"
                className="text-xs font-semibold uppercase tracking-widest text-accent"
              >
                Private Client Services
              </Typography>
            </div>

            <Typography
              as="h2"
              variant="h1"
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 text-background"
            >
              Discreet Luxury Home Purchases
            </Typography>

            <Typography
              as="p"
              variant="bodyRegular"
              className="text-base text-background/80 leading-relaxed mb-8"
            >
              Helping buyers and sellers with private, off-market property transactions worldwide with complete privacy and dedicated assistance.
            </Typography>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-sm bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors shadow-sm"
              >
                <Typography as="span" variant="smallBold" className="text-accent-foreground">
                  Contact Our Team
                </Typography>
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center justify-center rounded-sm border border-background/20 bg-transparent px-8 py-3.5 text-sm font-semibold text-background hover:bg-background/10 transition-colors"
              >
                <Typography as="span" variant="smallBold" className="text-background">
                  Browse All Properties
                </Typography>
              </Link>
            </div>

            <div className="mt-10 pt-6 border-t border-background/15 flex flex-wrap gap-8 text-xs text-background/70 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <Typography as="span" variant="extraSmallMedium" className="text-background/80">
                  Full Confidentiality
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <MailCheck className="h-4 w-4 text-accent" />
                <Typography as="span" variant="extraSmallMedium" className="text-background/80">
                  Dedicated Agent Support
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}