'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  Plus,
  Search,
  Eye,
  Calendar,
  AlertCircle,
  ExternalLink,
  Trash2,
  Edit3,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react'
import {
  useGetUserPropertiesQuery,
  useDeletePropertyMutation,
} from '@/app/lib/features/properties/propertiesApiSlice'
import { Container, Skeleton } from '@/app/components/common'
import { toast } from 'react-toastify'


type StatusFilter = 'all' | 'approved' | 'pending' | 'rejected'

export default function SellerPropertiesPage() {
  const { data: properties, isLoading, refetch } = useGetUserPropertiesQuery()
  const [deleteProperty, { isLoading: isDeleting }] = useDeletePropertyMutation()

  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)

  const propertyList = properties || []

  // Counts
  const counts = {
    all: propertyList.length,
    approved: propertyList.filter((p) => p.status === 'approved').length,
    pending: propertyList.filter((p) => p.status === 'pending').length,
    rejected: propertyList.filter((p) => p.status === 'rejected').length,
  }

  // Filtered list
  const filteredProperties = propertyList.filter((property) => {
    const matchesStatus =
      activeFilter === 'all' ? true : property.status === activeFilter
    const matchesSearch =
      property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.category?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Action required properties
  const rejectedList = propertyList.filter((p) => p.status === 'rejected')

  const handleDelete = async (id: string) => {
    try {
      await deleteProperty(id).unwrap()
      toast.success('Listing permanently removed from private registry')
      setPropertyToDelete(null)
      refetch()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to remove listing')
    }
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <Container>
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-xs text-body">
          <Link href="/user/seller" className="hover:text-foreground transition-colors">
            Seller Studio
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Listings Manager</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-border gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Seller Inventory &bull; Property Management
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              My Property Listings
            </h1>
            <p className="text-xs text-body mt-1">
              Check listing status, views, and manage your properties.
            </p>
          </div>

          <Link
            href="/properties/addProperty"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm min-h-[44px]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Property</span>
          </Link>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-sm bg-muted w-fit mb-8">
          <Link
            href="/user/seller"
            className="px-4 py-1.5 rounded-sm text-body hover:text-foreground font-semibold text-xs transition-all"
          >
            Overview
          </Link>
          <Link
            href="/user/seller/properties"
            className="px-4 py-1.5 rounded-sm bg-card text-foreground font-semibold text-xs shadow-sm transition-all"
          >
            My Listings ({counts.all})
          </Link>
          <Link
            href="/user/seller/tours"
            className="px-4 py-1.5 rounded-sm text-body hover:text-foreground font-semibold text-xs transition-all"
          >
            Tours
          </Link>
        </div>

        {/* Action Required Banner (Rejection Notice) */}
        {rejectedList.length > 0 && (
          <div className="mb-8 p-6 rounded-sm border border-destructive/30 bg-destructive/10 space-y-4">
            <div className="flex items-center gap-2 text-destructive font-bold text-sm uppercase tracking-wider">
              <AlertCircle className="h-5 w-5" />
              <span>Updates Requested on {rejectedList.length} Listing(s)</span>
            </div>
            <p className="text-xs text-body leading-relaxed">
              One or more of your properties need updates before they can be approved. Please review the requested changes below and edit your listing.
            </p>

            <div className="space-y-3">
              {rejectedList.map((item) => (
                <div
                  key={item._id}
                  className="p-4 rounded-sm bg-card border border-destructive/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                    <p className="text-xs text-destructive mt-1 font-mono">
                      Reason: {item.rejectionReason || 'Please upload updated verification documents.'}
                    </p>
                  </div>
                  <Link
                    href={`/properties/${item._id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-destructive text-destructive-foreground text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity self-start sm:self-auto"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Audit Finding</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-card text-body hover:text-foreground border border-border'
              }`}
            >
              All Assets ({counts.all})
            </button>
            <button
              onClick={() => setActiveFilter('approved')}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${
                activeFilter === 'approved'
                  ? 'bg-success text-success-foreground shadow-sm'
                  : 'bg-card text-body hover:text-foreground border border-border'
              }`}
            >
              Live &amp; Approved ({counts.approved})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${
                activeFilter === 'pending'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'bg-card text-body hover:text-foreground border border-border'
              }`}
            >
              Pending Review ({counts.pending})
            </button>
            <button
              onClick={() => setActiveFilter('rejected')}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${
                activeFilter === 'rejected'
                  ? 'bg-destructive text-destructive-foreground shadow-sm'
                  : 'bg-card text-body hover:text-foreground border border-border'
              }`}
            >
              Action Required ({counts.rejected})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-body" />
            <input
              type="text"
              placeholder="Search portfolio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 rounded-sm bg-card border border-border text-foreground text-xs focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full rounded-sm" />
              <Skeleton className="h-14 w-full rounded-sm" />
              <Skeleton className="h-14 w-full rounded-sm" />
              <Skeleton className="h-14 w-full rounded-sm" />
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="py-16 text-center">
              <Building2 className="h-10 w-10 text-body mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold text-foreground">No property listings found</p>
              <p className="text-xs text-body mt-1">
                {searchQuery
                  ? 'No matching estates found for your search query.'
                  : 'You have not submitted any properties under this filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[11px] font-mono text-body uppercase tracking-wider">
                    <th className="py-3 px-4">Property &amp; Type</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {filteredProperties.map((prop) => (
                    <tr
                      key={prop._id}
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      {/* Property Asset & Location */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-11 rounded-sm bg-muted overflow-hidden shrink-0 border border-border">
                            {prop.images?.[0] ? (
                              <img
                                src={prop.images[0]}
                                alt={prop.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-body text-[10px]">
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/properties/${prop._id}`}
                              className="font-bold text-foreground hover:text-accent transition-colors line-clamp-1"
                            >
                              {prop.title}
                            </Link>
                            <div className="text-[11px] text-body flex items-center gap-2 mt-0.5">
                              <span>{prop.category || prop.type || 'Property'}</span>
                              <span>&bull;</span>
                              <span>{prop.size || 'Spacious'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-mono font-bold text-foreground">
                        ${Number(prop.price).toLocaleString('en-US')} USD
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {prop.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] bg-success/15 border border-success/30 text-success font-semibold text-[11px]">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Active</span>
                          </span>
                        )}
                        {prop.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] bg-accent/15 border border-accent/30 text-accent font-semibold text-[11px]">
                            <Clock className="h-3 w-3" />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {prop.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] bg-destructive/15 border border-destructive/30 text-destructive font-semibold text-[11px]">
                            <AlertCircle className="h-3 w-3" />
                            <span>Needs Update</span>
                          </span>
                        )}
                      </td>

                      {/* Views */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3 text-body font-mono text-[11px]">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {prop.views || 0} views
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/properties/${prop._id}`}
                            title="View Property"
                            className="p-1.5 rounded-sm border border-border text-body hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/properties/edit/${prop._id}`}
                            title="Edit Property"
                            className="p-1.5 rounded-sm border border-border text-body hover:text-accent hover:border-accent/40 hover:bg-muted transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            title="Delete Listing"
                            onClick={() => setPropertyToDelete(prop._id)}
                            className="p-1.5 rounded-sm border border-border text-body hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {propertyToDelete && (
          <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-sm max-w-md w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm uppercase tracking-wider">
                <AlertCircle className="h-5 w-5" />
                <span>Confirm Removal of Estate</span>
              </div>
              <p className="text-xs text-body leading-relaxed">
                Are you sure you wish to permanently remove this property from the private registry? This will immediately purge syndication and release any scheduled tours.
              </p>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setPropertyToDelete(null)}
                  className="px-4 py-2 rounded-sm border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(propertyToDelete)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-sm bg-destructive text-destructive-foreground hover:opacity-90 text-xs font-bold uppercase tracking-wider transition-opacity min-h-[44px] shadow-sm"
                >
                  {isDeleting ? 'Removing...' : 'Confirm Removal'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
