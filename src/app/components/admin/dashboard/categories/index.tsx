'use client'

import React, { useState } from 'react'
import {
  Layers,
  Plus,
  Search,
  Sparkles,
  Tag,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react'
import {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
} from '@/app/lib/features/categories/categoryApiSlice'
import { Typography, Skeleton } from '@/app/components/common'
import { toast } from 'react-toastify'
import Image from 'next/image'

export const CategoryManagement: React.FC = () => {
  const { data: categories = [], isLoading, refetch } = useGetAllCategoriesQuery()
  const [addCategory, { isLoading: isSubmitting }] = useAddCategoryMutation()

  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryImage, setNewCategoryImage] = useState('')

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      const payload: { name: string; images?: string[] } = {
        name: newCategoryName.trim(),
        images: newCategoryImage.trim() ? [newCategoryImage.trim()] : ['/images/villa-modernist.jpg'],
      }

      await addCategory(payload).unwrap()
      toast.success(`Category "${newCategoryName}" registered successfully`)
      setNewCategoryName('')
      setNewCategoryImage('')
      setIsModalOpen(false)
      refetch()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create category')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <Typography
              as="span"
              variant="extraSmallBold"
              className="text-xs uppercase tracking-widest text-accent"
            >
              Property Categories
            </Typography>
          </div>
          <Typography as="h1" variant="h2" className="text-2xl font-bold text-foreground">
            Manage Categories
          </Typography>
          <Typography as="p" variant="smallRegular" className="text-xs text-body mt-1">
            Manage property categories and search filters.
          </Typography>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-body" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-sm bg-card border border-border text-foreground text-xs focus:outline-none focus:border-accent"
          />
        </div>
        <Typography as="span" variant="extraSmallMedium" className="text-xs text-body font-mono">
          {filteredCategories.length} categories active
        </Typography>
      </div>

      {/* Grid of Categories */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Skeleton className="h-64 rounded-sm" />
          <Skeleton className="h-64 rounded-sm" />
          <Skeleton className="h-64 rounded-sm" />
          <Skeleton className="h-64 rounded-sm" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="p-16 text-center bg-card border border-border rounded-sm">
          <Layers className="h-10 w-10 text-body mx-auto mb-3 opacity-40" />
          <Typography as="h3" variant="h4" className="text-base font-bold text-foreground mb-1">
            No Categories Found
          </Typography>
          <Typography as="p" variant="smallRegular" className="text-xs text-body mb-4">
            {searchQuery
              ? 'No categories matched your search query.'
              : 'No categories exist yet. Add the first category above.'}
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => {
            const previewImg = category.images?.[0] || '/images/villa-modernist.jpg'
            return (
              <div
                key={category._id || category.name}
                className="group relative rounded-sm border border-border bg-card overflow-hidden shadow-sm hover:border-accent/50 transition-all duration-300"
              >
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <Image
                    src={previewImg}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-background/90 backdrop-blur-sm border border-border text-[10px] font-mono text-foreground font-semibold">
                      <Tag className="h-2.5 w-2.5 text-accent" />
                      Active
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <Typography
                      as="h3"
                      variant="h4"
                      className="text-base font-bold text-foreground capitalize drop-shadow-sm"
                    >
                      {category.name}
                    </Typography>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-body font-mono">
                    <span>Category ID</span>
                    <span className="text-foreground">{category._id ? category._id.slice(-8) : 'Static'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-body font-mono">
                    <span>Filter</span>
                    <span className="text-accent lowercase">category={encodeURIComponent(category.name)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-sm max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-accent" />
                <Typography as="h3" variant="h4" className="text-base font-bold text-foreground">
                  New Property Category
                </Typography>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-body hover:text-foreground p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modernist Villas, Alpine Châteaux, Waterfront"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  Cover Image URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /images/villa-modernist.jpg or https://..."
                  value={newCategoryImage}
                  onChange={(e) => setNewCategoryImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent"
                />
                <Typography as="p" variant="extraSmallRegular" className="text-[11px] text-body mt-1">
                  Leave blank to use the default image.
                </Typography>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-sm border border-border text-xs font-semibold text-body hover:text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default CategoryManagement
