'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, ArrowLeft, Trash2, Calendar, ArrowRight, ShieldCheck } from 'lucide-react'
import { useGetFavoritesQuery, useRemoveFavoriteMutation } from '@/app/lib/features/favorites/favoritesApiSlice'
import { Container, Typography, PropertyCard, PropertyGridSkeleton, ErrorHandler } from '@/app/components/common'
import { toast } from 'react-toastify'

export default function FavoritesPage() {
  const router = useRouter()
  const { data: favorites, isLoading, error } = useGetFavoritesQuery()
  const [removeFavorite, { isLoading: isRemoving }] = useRemoveFavoriteMutation()

  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      await removeFavorite(id).unwrap()
      toast.success('Removed from Saved Properties')
    } catch {
      toast.error('Failed to remove property')
    }
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <Container>
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <Typography
                as="span"
                variant="extraSmallBold"
                className="text-xs font-semibold uppercase tracking-widest text-accent"
              >
                Saved Properties
              </Typography>
            </div>
            <Typography as="h1" variant="h1" className="text-3xl font-extrabold text-foreground tracking-tight">
              My Saved Properties
            </Typography>
            <Typography as="p" variant="smallRegular" className="text-xs text-body mt-1">
              {favorites ? `${favorites.length} saved properties` : 'Loading saved properties...'}
            </Typography>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <Typography as="span" variant="extraSmallBold">All Properties</Typography>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <PropertyGridSkeleton count={4} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" />
        ) : error ? (
          <ErrorHandler
            title="Sign In Required"
            description="Please sign in to view your saved properties."
            showHomeButton={true}
            showResetButton={false}
          />
        ) : !favorites || favorites.length === 0 ? (
          <div className="max-w-md mx-auto p-12 text-center rounded-sm bg-card border border-border shadow-sm">
            <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <Typography as="h2" variant="h3" className="text-lg font-bold text-foreground mb-1">
              No Saved Properties
            </Typography>
            <Typography as="p" variant="smallRegular" className="text-xs text-body mb-6">
              Save properties you are interested in to review them later, schedule tours, or contact sellers.
            </Typography>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              <Typography as="span" variant="smallBold" className="text-primary-foreground">
                Browse Properties
              </Typography>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((property) => (
              <div key={property._id} className="relative group">
                <PropertyCard
                  property={property}
                  onClick={() => router.push(`/properties/${property._id}`)}
                />
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, property._id)}
                  disabled={isRemoving}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-foreground/80 text-background hover:bg-destructive hover:text-destructive-foreground transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                  title="Remove from Saved"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}

