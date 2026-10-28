'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Building2,
  Plus,
  Clock,
  Eye,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Layers,
} from 'lucide-react'
import {
  useGetSellerStatsQuery,
  useGetUserPropertiesQuery,
} from '@/app/lib/features/properties/propertiesApiSlice'
import { useProfileQuery } from '@/app/lib/features/profile/profileApiSlice'
import { Container, MImage, Typography, Skeleton } from '@/app/components/common'


export default function SellerDashboardPage() {
  const router = useRouter()
  const { data: userProfile } = useProfileQuery()
  const { data: stats, isLoading: isStatsLoading } = useGetSellerStatsQuery()
  const { data: properties, isLoading: isPropsLoading } = useGetUserPropertiesQuery()

  const listingCounts = stats?.listingCounts || {
    approved: 0,
    pending: 0,
    rejected: 0,
    total: 0,
  }

  // Calculate cumulative valuation
  const portfolioValuation = (properties || []).reduce((acc, p) => acc + (Number(p.price) || 0), 0)

  // Find any property needing revision
  const rejectedProperties = (properties || []).filter((p) => p.status === 'rejected')

  return (
    <div className="min-h-screen bg-background py-10">
      <Container>
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-border gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Seller Dashboard
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Seller Dashboard
            </h1>
            <p className="text-xs text-body mt-1">
              Manage your property listings, review status, and view tour requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/properties/addProperty"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Property</span>
            </Link>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-sm bg-muted w-fit mb-8">
          <Link
            href="/user/seller"
            className="px-4 py-1.5 rounded-sm bg-card text-foreground font-semibold text-xs shadow-sm transition-all"
          >
            Overview
          </Link>
          <Link
            href="/user/seller/properties"
            className="px-4 py-1.5 rounded-sm text-body hover:text-foreground font-semibold text-xs transition-all"
          >
            My Listings ({properties?.length ?? 0})
          </Link>
          <Link
            href="/user/seller/tours"
            className="px-4 py-1.5 rounded-sm text-body hover:text-foreground font-semibold text-xs transition-all"
          >
            Tours ({stats?.toursBooked ?? 0})
          </Link>
        </div>

        {/* Action Required Warning Banner (If rejected properties exist) */}
        {rejectedProperties.length > 0 && (
          <div className="mb-8 p-4 rounded-sm border border-destructive/30 bg-destructive/10 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-destructive">
                  Action Required: {rejectedProperties.length} Listing(s) Need Updates
                </h4>
                <p className="text-xs text-body mt-0.5">
                  Changes were requested for &ldquo;{rejectedProperties[0].title}&rdquo;.
                </p>
              </div>
            </div>
            <Link
              href="/user/seller/properties"
              className="px-3.5 py-1.5 rounded-sm bg-destructive text-destructive-foreground text-xs font-semibold uppercase tracking-wider hover:bg-destructive/90 transition-colors flex-shrink-0"
            >
              View Details
            </Link>
          </div>
        )}

        {/* 4-KPI Telemetry Cards Grid */}
        {isStatsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Card 1: Valuation */}
            <div className="p-6 rounded-sm bg-card border border-border shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
                Active Portfolio Valuation
              </span>
              <div className="text-2xl font-extrabold text-foreground tracking-tight">
                ${(portfolioValuation / 1000000).toFixed(1)}M <span className="text-xs font-normal text-body">USD</span>
              </div>
              <div className="text-[11px] text-accent font-medium mt-1">
                {listingCounts.total} estates registered
              </div>
            </div>

            {/* Card 2: Approved / Live */}
            <div className="p-6 rounded-sm bg-card border border-border shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
                Active Listings
              </span>
              <div className="text-2xl font-extrabold text-foreground tracking-tight">
                {listingCounts.approved} <span className="text-xs font-normal text-body">Approved</span>
              </div>
              <div className="text-[11px] text-success font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>Visible to buyers</span>
              </div>
            </div>

            {/* Card 3: Pending Verification */}
            <div className="p-6 rounded-sm bg-card border border-border shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
                Pending Review
              </span>
              <div className="text-2xl font-extrabold text-foreground tracking-tight">
                {listingCounts.pending} <span className="text-xs font-normal text-body">Pending</span>
              </div>
              <div className="text-[11px] text-accent font-medium mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>In review</span>
              </div>
            </div>

            {/* Card 4: Scheduled Private Tours */}
            <div className="p-6 rounded-sm bg-card border border-border shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
                Scheduled Tours
              </span>
              <div className="text-2xl font-extrabold text-foreground tracking-tight">
                {stats?.toursBooked ?? 0} <span className="text-xs font-normal text-body">Booked</span>
              </div>
              <div className="text-[11px] text-body font-medium mt-1">
                {stats?.totalViews ?? 0} total views
              </div>
            </div>
          </div>
        )}

        {/* Recent Listings Summary Table */}
        <div className="p-6 rounded-sm bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Your Properties
              </h3>
              <p className="text-xs text-body">
                Track review status and manage your listings.
              </p>
            </div>
            <Link
              href="/user/seller/properties"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>Manage All ({properties?.length ?? 0})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isPropsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-sm" />
              ))}
            </div>
          ) : !properties || properties.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground mb-1">No Properties Added</p>
              <p className="text-xs text-body mb-4">
                Add your first property to start receiving buyer inquiries.
              </p>
              <Link
                href="/properties/addProperty"
                className="inline-flex px-4 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider"
              >
                Add Property
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-body font-semibold uppercase tracking-wider">
                    <th className="pb-3">Property</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {properties.slice(0, 5).map((property) => (
                    <tr key={property._id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-12 rounded-sm overflow-hidden bg-muted flex-shrink-0">
                            {property.images?.[0] ? (
                              <MImage
                                src={property.images[0]}
                                alt={property.title}
                                w={48}
                                h={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Building2 className="h-5 w-5 text-muted-foreground m-auto" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-foreground line-clamp-1">{property.title}</div>
                            <div className="text-[10px] text-body uppercase">{property.type || 'Villa'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 font-semibold text-foreground">
                        ${Number(property.price || 0).toLocaleString()} USD
                      </td>

                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            property.status === 'approved'
                              ? 'bg-success/20 text-success'
                              : property.status === 'rejected'
                              ? 'bg-destructive/20 text-destructive'
                              : 'bg-accent/20 text-accent'
                          }`}
                        >
                          {property.status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                          {property.status === 'pending' && <Clock className="h-3 w-3" />}
                          {property.status === 'rejected' && <AlertCircle className="h-3 w-3" />}
                          <span>{property.status || 'Pending'}</span>
                        </span>
                      </td>

                      <td className="py-3 text-right space-x-2">
                        <Link
                          href={`/properties/${property._id}`}
                          className="px-2.5 py-1 rounded-sm border border-border text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
