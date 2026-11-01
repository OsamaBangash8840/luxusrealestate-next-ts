'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { MImage } from '@/app/components/common'

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const total = images.length || 1

  // Left-1, Left-2, Right-1 slots
  const slot1Index = currentIndex % total
  const slot2Index = (currentIndex + 1) % total
  const slot3Index = (currentIndex + 2) % total

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total)
  }, [total])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % total)
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + total) % total)
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, total])

  return (
    <div className="relative w-full mb-10">
      {/* Fixed Section Gallery Container */}
      <div className="relative w-full h-[360px] sm:h-[460px] md:h-[520px] lg:h-[560px] rounded-sm overflow-hidden border border-border bg-card shadow-sm select-none">
        {/* DESKTOP ROW LAYOUT: 2 ON THE LEFT, 1 ON THE RIGHT */}
        <div className="hidden lg:grid grid-cols-12 gap-3 h-full p-2.5">
          {/* LEFT 2 IMAGES IN ONE ROW (Col span 8 -> 2 columns) */}
          <div className="col-span-8 grid grid-cols-2 gap-3 h-full">
            {/* Left Slot 1 */}
            <div
              onClick={() => openLightbox(slot1Index)}
              className="relative h-full w-full overflow-hidden rounded-sm cursor-pointer group bg-muted border border-border/60"
            >
              <MImage
                src={images[slot1Index]}
                alt={`${title} - View ${slot1Index + 1}`}
                w={800}
                h={600}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-sm bg-card/95 text-foreground text-xs font-semibold backdrop-blur-sm shadow-md flex items-center gap-1.5 border border-border">
                  <Maximize2 className="h-3.5 w-3.5 text-accent" />
                  <span>Inspect High-Res</span>
                </span>
              </div>
              <div className="absolute bottom-3 left-3 rounded-sm bg-card/90 border border-border/80 px-2 py-0.5 text-[10px] font-mono font-semibold text-foreground backdrop-blur-sm shadow-sm">
                View #{slot1Index + 1}
              </div>
            </div>

            {/* Left Slot 2 */}
            <div
              onClick={() => openLightbox(slot2Index)}
              className="relative h-full w-full overflow-hidden rounded-sm cursor-pointer group bg-muted border border-border/60"
            >
              <MImage
                src={images[slot2Index]}
                alt={`${title} - View ${slot2Index + 1}`}
                w={800}
                h={600}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-sm bg-card/95 text-foreground text-xs font-semibold backdrop-blur-sm shadow-md flex items-center gap-1.5 border border-border">
                  <Maximize2 className="h-3.5 w-3.5 text-accent" />
                  <span>Inspect High-Res</span>
                </span>
              </div>
              <div className="absolute bottom-3 left-3 rounded-sm bg-card/90 border border-border/80 px-2 py-0.5 text-[10px] font-mono font-semibold text-foreground backdrop-blur-sm shadow-sm">
                View #{slot2Index + 1}
              </div>
            </div>
          </div>

          {/* RIGHT 1 IMAGE (Col span 4 - Hero / Focal Anchor) */}
          <div
            onClick={() => openLightbox(slot3Index)}
            className="col-span-4 relative h-full w-full overflow-hidden rounded-sm cursor-pointer group bg-muted border border-border/60"
          >
            <MImage
              src={images[slot3Index]}
              alt={`${title} - View ${slot3Index + 1}`}
              w={900}
              h={900}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-foreground/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-3 py-1.5 rounded-sm bg-card/95 text-foreground text-xs font-semibold backdrop-blur-sm shadow-md flex items-center gap-1.5 border border-border">
                <Maximize2 className="h-3.5 w-3.5 text-accent" />
                <span>Inspect High-Res</span>
              </span>
            </div>
            <div className="absolute bottom-3 right-3 rounded-sm bg-card/90 border border-border/80 px-2 py-0.5 text-[10px] font-mono font-semibold text-accent backdrop-blur-sm shadow-sm uppercase tracking-wider">
              Featured Angle #{slot3Index + 1}
            </div>
          </div>
        </div>

        {/* MOBILE & TABLET LAYOUT (< lg): Full width active slide */}
        <div className="lg:hidden relative h-full w-full">
          <MImage
            src={images[currentIndex]}
            alt={`${title} - View ${currentIndex + 1}`}
            w={1200}
            h={800}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openLightbox(currentIndex)}
          />
        </div>

        {/* TOP COUNTER BADGE */}
        <div className="absolute top-4 left-4 z-20 rounded-sm bg-card/95 border border-border px-3 py-1 text-xs font-mono font-semibold text-foreground backdrop-blur-md shadow-sm">
          {total > 1 ? `Angle ${currentIndex + 1} of ${total}` : '1 Photograph'}
        </div>

        {/* NAVIGATION ARROWS (When multiple images exist) */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-sm bg-card/90 border border-border hover:border-accent text-foreground hover:text-accent transition-all shadow-md backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label="Previous property photographs"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-sm bg-card/90 border border-border hover:border-accent text-foreground hover:text-accent transition-all shadow-md backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label="Next property photographs"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* PAGINATION DOTS (When multiple images exist) */}
        {total > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-card/90 border border-border/80 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-md">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-accent'
                    : 'w-2 h-2 bg-muted-foreground/40 hover:bg-foreground/70'
                }`}
                aria-label={`View photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          {/* Top Bar with Title and Close Button */}
          <div className="w-full max-w-6xl flex items-center justify-between pb-4 text-foreground">
            <div className="min-w-0 pr-4">
              <h3 className="font-bold text-base sm:text-lg truncate">{title}</h3>
              <p className="text-xs text-muted-foreground font-mono">
                High-Resolution Asset {lightboxIndex + 1} of {total}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-sm bg-muted/80 hover:bg-muted text-foreground transition-colors border border-border"
              aria-label="Close high-res inspector"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main Inspection Image */}
          <div className="relative w-full max-w-6xl max-h-[75vh] aspect-[16/10] flex items-center justify-center overflow-hidden rounded-sm border border-border bg-card">
            <MImage
              src={images[lightboxIndex]}
              alt={`${title} - High resolution view ${lightboxIndex + 1}`}
              w={1800}
              h={1100}
              className="max-h-full max-w-full object-contain"
            />

            {/* Lightbox Prev / Next */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev - 1 + total) % total)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-sm bg-card/80 border border-border text-foreground hover:bg-card hover:text-accent transition-all shadow-md backdrop-blur-sm"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev + 1) % total)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-sm bg-card/80 border border-border text-foreground hover:bg-card hover:text-accent transition-all shadow-md backdrop-blur-sm"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Thumbnail Strip */}
          {total > 1 && (
            <div className="w-full max-w-4xl mt-4 flex items-center justify-center gap-2 overflow-x-auto py-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative w-16 h-12 rounded-sm overflow-hidden border-2 transition-all shrink-0 ${
                    lightboxIndex === idx ? 'border-accent scale-105' : 'border-border/60 opacity-60 hover:opacity-100'
                  }`}
                >
                  <MImage src={img} alt={`Thumbnail ${idx + 1}`} w={80} h={60} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default PropertyGallery
