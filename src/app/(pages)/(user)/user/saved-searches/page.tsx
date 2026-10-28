'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  BookmarkCheck,
  ArrowLeft,
  Trash2,
  BellRing,
  Plus,
  SlidersHorizontal,
  X,
  Check,
} from 'lucide-react'
import {
  useGetSavedSearchesQuery,
  useCreateSavedSearchMutation,
  useDeleteSavedSearchMutation,
} from '@/app/lib/features/savedSearches/savedSearchesApiSlice'
import { Container } from '@/app/components/common/Container'
import { toast } from 'react-toastify'

export default function SavedSearchesPage() {
  const { data: savedSearches, isLoading, error } = useGetSavedSearchesQuery()
  const [createSavedSearch, { isLoading: isCreating }] = useCreateSavedSearchMutation()
  const [deleteSavedSearch, { isLoading: isDeleting }] = useDeleteSavedSearchMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant')

  const handleDelete = async (id: string) => {
    try {
      await deleteSavedSearch(id).unwrap()
      toast.success('Search criteria deleted')
    } catch {
      toast.error('Failed to delete search criteria')
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createSavedSearch({
        title: title.trim() || `${location || 'Global'} ${category || 'Estates'}`,
        criteria: {
          location: location.trim(),
          category,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
        },
        frequency,
      }).unwrap()

      toast.success('Search criteria saved. Alert protocol active.')
      setIsModalOpen(false)
      setTitle('')
      setLocation('')
      setCategory('')
      setMinPrice('')
      setMaxPrice('')
    } catch {
      toast.error('Failed to save search criteria')
    }
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-border gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Search Alerts
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Saved Searches &amp; Alerts
            </h1>
            <p className="text-xs text-body mt-1">
              Get notified when new properties matching your preferences are listed.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create New Alert</span>
            </button>
            <Link
              href="/properties"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Catalogue</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-sm bg-muted animate-pulse border border-border" />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center rounded-sm bg-card border border-border">
            <p className="text-destructive font-medium mb-3">Unable to retrieve saved search criteria.</p>
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm bg-primary text-primary-foreground"
            >
              Sign In to Manage Alerts
            </Link>
          </div>
        ) : !savedSearches || savedSearches.length === 0 ? (
          <div className="max-w-md mx-auto p-12 text-center rounded-sm bg-card border border-border shadow-sm">
            <BellRing className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-lg font-bold text-foreground mb-1">No Active Search Alerts</h2>
            <p className="text-xs text-body mb-6">
              Create an automated search monitor to be notified the moment a new modernist villa, sky penthouse, or coastal retreat is admitted into the catalogue.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Configure First Alert</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedSearches.map((search) => (
              <div
                key={search._id}
                className="p-6 rounded-sm bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-base font-bold text-foreground">
                      {search.title || 'Curated Portfolio Alert'}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-sm border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                      <BellRing className="h-3 w-3" />
                      <span>{search.frequency || 'Instant'} Dispatch</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-body">
                    {search.criteria?.location && (
                      <div>
                        Location: <span className="font-semibold text-foreground">{search.criteria.location}</span>
                      </div>
                    )}
                    {search.criteria?.category && (
                      <div>
                        Category: <span className="font-semibold text-foreground capitalize">{search.criteria.category}</span>
                      </div>
                    )}
                    {(search.criteria?.minPrice || search.criteria?.maxPrice) && (
                      <div>
                        Band:{' '}
                        <span className="font-semibold text-foreground">
                          ${(search.criteria.minPrice || 0) / 1000000}M &ndash; ${(search.criteria.maxPrice || 50000000) / 1000000}M USD
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/properties?${new URLSearchParams({
                      location: search.criteria?.location || '',
                      category: search.criteria?.category || '',
                    }).toString()}`}
                    className="px-4 py-2 rounded-sm border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    View Matching Assets
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(search._id)}
                    disabled={isDeleting}
                    className="p-2 rounded-sm border border-border text-body hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete Search Alert"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Create Saved Search */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-sm bg-card border border-border p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <h3 className="text-lg font-bold text-foreground">Configure Market Alert</h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                    Alert Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Bel-Air Modernist Villas"
                    className="w-full p-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                      Target Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Geneva, Tribeca, Beverly Hills"
                      className="w-full p-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                      Property Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="">All Categories</option>
                      <option value="villa">Modernist Villa</option>
                      <option value="penthouse">Sky Penthouse</option>
                      <option value="waterfront">Waterfront Estate</option>
                      <option value="architectural">Architectural Icon</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                      Min Price (USD)
                    </label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="5000000"
                      className="w-full p-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                      Max Price (USD)
                    </label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="35000000"
                      className="w-full p-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                    Notification Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full p-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="instant">Instant (As soon as listed)</option>
                    <option value="daily">Daily Summary</option>
                    <option value="weekly">Weekly Summary</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-sm border border-border text-xs font-semibold text-body hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{isCreating ? 'Activating...' : 'Activate Alert'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
