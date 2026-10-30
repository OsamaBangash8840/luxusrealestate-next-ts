'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  FileText,
  MapPin,
  Maximize2,
  User,
  Mail,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react'
import {
  useGetPendingPropertiesQuery,
  useGetApprovedPropertiesQuery,
  useGetRejectedPropertiesQuery,
  useUpdatePropertyStatusMutation,
} from '@/app/lib/features/auth/admin/adminApiSlice'
import { IProperty } from '@/app/lib/features/properties/types'
import { Skeleton } from '@/app/components/common'
import { toast } from 'react-toastify'

type TabType = 'pending' | 'approved' | 'rejected'

export const DashboardProperties = (): React.ReactElement => {
  const searchParams = useSearchParams()
  const initialId = searchParams.get('id')

  const [activeTab, setActiveTab] = useState<TabType>('pending')
  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Redux queries for each status
  const { data: pendingProps, isLoading: isPendingLoading } = useGetPendingPropertiesQuery()
  const { data: approvedProps, isLoading: isApprovedLoading } = useGetApprovedPropertiesQuery()
  const { data: rejectedProps, isLoading: isRejectedLoading } = useGetRejectedPropertiesQuery()

  const [updatePropertyStatus, { isLoading: isUpdating }] = useUpdatePropertyStatusMutation()

  const currentList =
    activeTab === 'pending'
      ? pendingProps || []
      : activeTab === 'approved'
      ? approvedProps || []
      : rejectedProps || []

  // Auto-select property when list loads or URL query param exists
  useEffect(() => {
    if (initialId && currentList.length > 0) {
      const match = currentList.find((p) => p._id === initialId)
      if (match) {
        setSelectedProperty(match)
        return
      }
    }
    if (!selectedProperty && currentList.length > 0) {
      setSelectedProperty(currentList[0])
    } else if (
      selectedProperty &&
      !currentList.some((p) => p._id === selectedProperty._id)
    ) {
      setSelectedProperty(currentList[0] || null)
    }
  }, [currentList, initialId, selectedProperty])

  const handleApprove = async () => {
    if (!selectedProperty) return
    try {
      await updatePropertyStatus({
        id: selectedProperty._id,
        status: 'approved',
      }).unwrap()
      toast.success(
        `Estate "${selectedProperty.title}" successfully approved and syndicated to global discovery.`
      )
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to approve property')
    }
  }

  const handleReject = async () => {
    if (!selectedProperty) return
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for requesting revisions.')
      return
    }

    try {
      await updatePropertyStatus({
        id: selectedProperty._id,
        status: 'rejected',
        rejectionReason: rejectionReason.trim(),
      }).unwrap()
      toast.success(
        `Revision request sent to the seller.`
      )
      setRejectionReason('')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to request revision')
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-border gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Admin Dashboard
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Property Approvals
          </h1>
          <p className="text-xs text-body mt-1">
            Review property details, photos, and decide whether to approve or request changes.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-sm bg-card border border-border">
          <button
            type="button"
            onClick={() => {
              setActiveTab('pending')
              setSelectedProperty(null)
            }}
            className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${
              activeTab === 'pending'
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'text-body hover:text-foreground'
            }`}
          >
            Pending Review ({pendingProps?.length ?? 0})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('approved')
              setSelectedProperty(null)
            }}
            className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${
              activeTab === 'approved'
                ? 'bg-success text-success-foreground shadow-sm'
                : 'text-body hover:text-foreground'
            }`}
          >
            Live &amp; Approved ({approvedProps?.length ?? 0})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('rejected')
              setSelectedProperty(null)
            }}
            className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${
              activeTab === 'rejected'
                ? 'bg-destructive text-destructive-foreground shadow-sm'
                : 'text-body hover:text-foreground'
            }`}
          >
            Needs Revision ({rejectedProps?.length ?? 0})
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      {((activeTab === 'pending' && isPendingLoading) ||
        (activeTab === 'approved' && isApprovedLoading) ||
        (activeTab === 'rejected' && isRejectedLoading)) ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-3">
            <Skeleton className="h-24 w-full rounded-sm" />
            <Skeleton className="h-24 w-full rounded-sm" />
            <Skeleton className="h-24 w-full rounded-sm" />
          </div>
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-96 w-full rounded-sm" />
            <Skeleton className="h-32 w-full rounded-sm" />
          </div>
        </div>
      ) : currentList.length === 0 ? (
        <div className="p-16 rounded-sm bg-card border border-border text-center">
          <Building2 className="h-10 w-10 text-body mx-auto mb-3 opacity-40" />
          <h3 className="text-sm font-semibold text-foreground">No Properties Found</h3>
          <p className="text-xs text-body mt-1">
            There are currently zero estates listed under the &ldquo;{activeTab}&rdquo; verification state.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Properties Sidebar Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-body uppercase tracking-wider block">
              Properties Queue ({currentList.length})
            </span>
            <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
              {currentList.map((item) => {
                const isSelected = selectedProperty?._id === item._id
                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => {
                      setSelectedProperty(item)
                      setActiveImageIndex(0)
                    }}
                    className={`w-full p-3.5 rounded-sm border text-left transition-all ${
                      isSelected
                        ? 'bg-card border-accent shadow-sm'
                        : 'bg-card/50 border-border hover:border-accent/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-11 rounded-sm bg-muted overflow-hidden shrink-0 border border-border">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-body text-[10px]">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-foreground truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-body mt-0.5 font-mono">
                          <span className="font-semibold text-foreground">
                            ${Number(item.price).toLocaleString('en-US')}
                          </span>
                          <span>&bull;</span>
                          <span className="truncate">{item.type || 'Property'}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Area: Property Details & Review Actions (8 cols) */}
          {selectedProperty ? (
            <div className="lg:col-span-8 space-y-6">
              {/* Top Property Details Card */}
              <div className="bg-card border border-border rounded-sm p-6 shadow-sm space-y-6">
                {/* Property Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-border gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-[2px] bg-accent/15 border border-accent/40 text-accent font-mono text-[10px] font-bold uppercase tracking-wider">
                        {typeof selectedProperty.category === 'object' && selectedProperty.category !== null ? selectedProperty.category.name : (selectedProperty.category || 'Featured')}
                      </span>
                      <span className="text-xs font-mono text-body">
                        ID: {selectedProperty._id}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-foreground">
                      {selectedProperty.title}
                    </h2>
                    <p className="text-xs text-body mt-1">
                      Type: <span className="font-semibold text-foreground">{selectedProperty.type || 'Residence'}</span> &bull; Built in <span className="font-semibold text-foreground">{selectedProperty.buildYear || '2024'}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-mono text-body block">
                      Price
                    </span>
                    <span className="text-2xl font-mono font-bold text-foreground">
                      ${Number(selectedProperty.price).toLocaleString('en-US')} USD
                    </span>
                  </div>
                </div>

                {/* Seller Identity & Legal Contact */}
                <div className="p-4 rounded-sm bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-body">
                      Submitting Principal / Seller
                    </span>
                    <div className="flex items-center gap-2 mt-1 font-semibold text-foreground">
                      <User className="h-3.5 w-3.5 text-accent" />
                      <span>{selectedProperty.seller?.username || 'Verified Seller'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-body">
                      Accredited Email Address
                    </span>
                    <div className="flex items-center gap-2 mt-1 font-mono text-body">
                      <Mail className="h-3.5 w-3.5 text-accent" />
                      <span>{selectedProperty.seller?.email || 'confidential@luxus.com'}</span>
                    </div>
                  </div>
                </div>

                {/* Photography Gallery */}
                <div>
                  <span className="text-xs font-bold text-heading uppercase tracking-wider block mb-2">
                    Verified 4K Photography Assets ({selectedProperty.images?.length || 0})
                  </span>
                  <div className="aspect-video w-full rounded-sm overflow-hidden bg-muted border border-border relative mb-3">
                    {selectedProperty.images?.[activeImageIndex] ? (
                      <img
                        src={selectedProperty.images[activeImageIndex]}
                        alt="Estate asset"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-body">
                        No image available
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {selectedProperty.images?.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-20 h-14 rounded-sm overflow-hidden border shrink-0 transition-all ${
                          activeImageIndex === idx
                            ? 'border-accent shadow-sm'
                            : 'border-border opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Asset ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Dimensions & Location */}
                <div>
                  <span className="text-xs font-bold text-heading uppercase tracking-wider block mb-2">
                    Dimensions &amp; Location Coordinates
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-sm bg-muted/40 border border-border text-xs">
                    <div>
                      <span className="block text-[10px] text-body uppercase font-mono">
                        Interior Living Area
                      </span>
                      <span className="font-bold font-mono text-foreground">
                        {selectedProperty.size || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-body uppercase font-mono">
                        Parcel / Lot Size
                      </span>
                      <span className="font-bold font-mono text-foreground">
                        {selectedProperty.lotSize || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-body uppercase font-mono">
                        Spherical Coordinates
                      </span>
                      <span className="font-bold font-mono text-foreground">
                        [{selectedProperty.location?.coordinates?.[0] ?? 0},{' '}
                        {selectedProperty.location?.coordinates?.[1] ?? 0}]
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification Documents */}
                <div>
                  <span className="text-xs font-bold text-heading uppercase tracking-wider block mb-2">
                    Required Verification Documents
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-sm bg-background border border-border text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-accent" />
                        <span className="font-semibold text-foreground">
                          Proof of Ownership.pdf
                        </span>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-sm bg-background border border-border text-xs">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-accent" />
                        <span className="font-semibold text-foreground">
                          Identity &amp; Tax Verification.pdf
                        </span>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                  </div>
                </div>

                {/* Rejection Reason notice if previously rejected */}
                {selectedProperty.status === 'rejected' && selectedProperty.rejectionReason && (
                  <div className="p-4 rounded-sm bg-destructive/10 border border-destructive/30 text-xs">
                    <span className="font-bold text-destructive block mb-1">
                      Revision Requested:
                    </span>
                    <p className="text-body font-mono">{selectedProperty.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Review & Action */}
              <div className="bg-card border border-border rounded-sm p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                    Review &amp; Action
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Option A: Approve */}
                  <div className="p-4 rounded-sm bg-muted/40 border border-border flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                        Option A: Approve Property
                      </h4>
                      <p className="text-[11px] text-body leading-relaxed mb-4">
                        Approves the listing, makes it visible to buyers on the website, and notifies the seller.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={isUpdating || selectedProperty.status === 'approved'}
                      className="w-full py-2.5 rounded-sm bg-success text-success-foreground hover:bg-success/90 text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px] shadow-sm disabled:opacity-40"
                    >
                      {selectedProperty.status === 'approved'
                        ? 'Already Approved'
                        : isUpdating
                        ? 'Processing...'
                        : 'Approve Listing'}
                    </button>
                  </div>

                  {/* Option B: Require Revisions */}
                  <div className="p-4 rounded-sm bg-muted/40 border border-border flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                        Option B: Request Changes
                      </h4>
                      <p className="text-[11px] text-body leading-relaxed mb-2">
                        Specify what needs to be updated or fixed by the seller.
                      </p>
                      <textarea
                        rows={2}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="e.g. Please upload higher resolution photos or provide a more complete address..."
                        className="w-full p-2.5 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent mb-3"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={isUpdating}
                      className="w-full py-2.5 rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px] shadow-sm disabled:opacity-40"
                    >
                      {isUpdating ? 'Saving...' : 'Request Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

