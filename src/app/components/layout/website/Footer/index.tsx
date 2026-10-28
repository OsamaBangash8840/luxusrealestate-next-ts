'use client'

import React from 'react'
import Link from 'next/link'
import { ShieldCheck, Lock, Globe2, ArrowUpRight } from 'lucide-react'
import { Container, Typography } from '@/app/components/common'

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card text-foreground transition-colors">
      {/* Top Advisory Banner */}
      <div className="border-b border-border bg-muted/40 py-6">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-body">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <Typography as="span" variant="extraSmallMedium">
                Verified Ownership &bull; Clean Titles
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-accent" />
              <Typography as="span" variant="extraSmallMedium">
                Secure &amp; Confidential Process
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-accent" />
              <Typography as="span" variant="extraSmallMedium">
                Offices in Geneva, London &amp; New York
              </Typography>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline uppercase tracking-wider text-[11px]"
          >
            <Typography as="span" variant="extraSmallBold" className="text-accent uppercase tracking-wider text-[11px]">
              Contact Our Team
            </Typography>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Container>
      </div>

      {/* Main Footer Directory */}
      <div className="py-16">
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block group">
              <Typography
                as="span"
                variant="h3"
                className="text-2xl font-black tracking-widest text-foreground group-hover:text-accent transition-colors"
              >
                LUXUS
              </Typography>
              <Typography
                as="span"
                variant="extraSmallBold"
                className="ml-2 text-[10px] font-mono uppercase tracking-widest text-accent font-bold"
              >
                Luxury Real Estate
              </Typography>
            </Link>
            <Typography as="p" variant="bodyRegular" className="text-sm text-body leading-relaxed max-w-sm">
              The premier marketplace for luxury residences, modern penthouses, and waterfront homes. All properties are carefully verified.
            </Typography>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" />
              <Typography as="span" variant="extraSmallMedium" className="font-mono text-body">
                Secure Online Network Active
              </Typography>
            </div>
          </div>

          {/* Column 1: Properties */}
          <div className="space-y-4">
            <Typography as="h4" variant="extraSmallBold" className="uppercase tracking-wider text-accent font-mono text-xs">
              Properties
            </Typography>
            <ul className="space-y-2.5 text-sm text-body">
              <li>
                <Link href="/properties?category=villa" className="hover:text-foreground transition-colors">
                  <Typography as="span" variant="smallRegular" className="hover:text-foreground transition-colors">
                    Villas
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="/properties?category=penthouse" className="hover:text-foreground transition-colors">
                  <Typography as="span" variant="smallRegular" className="hover:text-foreground transition-colors">
                    Sky Penthouses
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="/properties?category=waterfront" className="hover:text-foreground transition-colors">
                  <Typography as="span" variant="smallRegular" className="hover:text-foreground transition-colors">
                    Waterfront Homes
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="/properties?category=architectural" className="hover:text-foreground transition-colors">
                  <Typography as="span" variant="smallRegular" className="hover:text-foreground transition-colors">
                    Modern Homes
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-foreground transition-colors font-medium text-foreground">
                  <Typography as="span" variant="smallBold" className="text-foreground">
                    View All Properties &rarr;
                  </Typography>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Offices & Advisory */}
          <div className="space-y-4">
            <Typography as="h4" variant="extraSmallBold" className="uppercase tracking-wider text-accent font-mono text-xs">
              Our Offices
            </Typography>
            <ul className="space-y-2.5 text-sm text-body">
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  <Typography as="span" variant="smallRegular" className="hover:text-foreground transition-colors">
                    Geneva Office
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  <Typography as="span" variant="smallRegular" className="hover:text-foreground transition-colors">
                    London Office
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  <Typography as="span" variant="smallRegular" className="hover:text-foreground transition-colors">
                    New York Office
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  <Typography as="span" variant="smallRegular" className="hover:text-foreground transition-colors">
                    Private Listings
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  <Typography as="span" variant="smallRegular" className="hover:text-foreground transition-colors">
                    Property Verification
                  </Typography>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Information */}
          <div className="space-y-4">
            <Typography as="h4" variant="extraSmallBold" className="uppercase tracking-wider text-accent font-mono text-xs">
              Account &amp; Selling
            </Typography>
            <ul className="space-y-2.5 text-sm text-body">
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  <Typography as="span" variant="smallRegular" className="hover:text-foreground transition-colors">
                    Client Portal
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="/user/seller/add-property" className="hover:text-foreground transition-colors">
                  <Typography as="span" variant="smallRegular" className="hover:text-foreground transition-colors">
                    List Your Property
                  </Typography>
                </Link>
              </li>
              <li>
                <Typography as="span" variant="extraSmallRegular" className="text-muted-foreground block text-xs">
                  Verified Legal Compliance
                </Typography>
              </li>
              <li>
                <Typography as="span" variant="extraSmallRegular" className="text-muted-foreground block text-xs">
                  Strict Privacy Protection
                </Typography>
              </li>
            </ul>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-6 text-xs text-body bg-card">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Typography as="p" variant="extraSmallRegular" className="text-xs">
            &copy; {new Date().getFullYear()} LUXUS Real Estate AG. All rights reserved.
          </Typography>
          <div className="flex items-center gap-6 text-xs">
            <Typography as="span" variant="extraSmallRegular">Zurich</Typography>
            <span>&bull;</span>
            <Typography as="span" variant="extraSmallRegular">Geneva</Typography>
            <span>&bull;</span>
            <Typography as="span" variant="extraSmallRegular">London</Typography>
            <span>&bull;</span>
            <Typography as="span" variant="extraSmallRegular">New York</Typography>
            <span>&bull;</span>
            <Typography as="span" variant="extraSmallRegular">Dubai</Typography>
          </div>
        </Container>
      </div>
    </footer>
  )
}
