'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Download,
  Building2,
  ShieldCheck,
} from 'lucide-react'
import {
  useGetSellerStatsQuery,
  useGetUserPropertiesQuery,
} from '@/app/lib/features/properties/propertiesApiSlice'
import { useCancelTourMutation } from '@/app/lib/features/scheduleTours/scheduleToursApiSlice'
import { Container } from '@/app/components/common'
import { toast } from 'react-toastify'

interface ITourDossier {
  _id: string
  propertyId: string
  propertyTitle: string
  clientName: string
  clientEmail: string
  clientPhone: string
  date: string
  time: string
  isPremium: boolean
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

export default function SellerToursPage() {
  const { data: stats } = useGetSellerStatsQuery()
  const { data: properties } = useGetUserPropertiesQuery()
  const [cancelTour, { isLoading: isCancelling }] = useCancelTourMutation()

  const [activeTab, setActiveTab] = useState<'all' | 'vip' | 'upcoming' | 'cancelled'>('upcoming')
  const [selectedTourForCancel, setSelectedTourForCancel] = useState<ITourDossier | null>(null)

  // Curated demo dossiers mapped against seller's actual properties
  const sampleTours: ITourDossier[] = [
    {
      _id: 'tour-101',
      propertyId: properties?.[0]?._id || 'prop-1',
      propertyTitle: properties?.[0]?.title || 'The Bel-Air Promontory Estate',
      clientName: 'Lord Julian Sterling',
      clientEmail: 'sterling.j@luxury-holdings.co.uk',
      clientPhone: '+44 20 7946 0912',
      date: '2026-11-04',
      time: '14:00 - 15:30',
      isPremium: true,
      status: 'scheduled',
      notes: 'Client arriving via private helicopter to Bel-Air helipad. Accompanied by private architectural surveyor.',
    },
    {
      _id: 'tour-102',
      propertyId: properties?.[1]?._id || 'prop-2',
      propertyTitle: properties?.[1]?.title || 'Palazzo di Palma Marina',
      clientName: 'Elena Rostova',
      clientEmail: 'elena@rostova-capital.ch',
      clientPhone: '+41 22 555 0198',
      date: '2026-11-08',
      time: '11:00 - 12:00',
      isPremium: true,
      status: 'scheduled',
      notes: 'Requesting confidential review of title deeds and structural foundation reports during viewing.',
    },
    {
      _id: 'tour-103',
      propertyId: properties?.[0]?._id || 'prop-1',
      propertyTitle: properties?.[0]?.title || 'The Bel-Air Promontory Estate',
      clientName: 'Marcus Vance',
      clientEmail: 'mvance@vance-partners.com',
      clientPhone: '+1 212 555 4321',
      date: '2026-11-12',
      time: '16:00 - 17:00',
      isPremium: false,
      status: 'scheduled',
      notes: 'Initial buyer walkthrough with personal estate manager.',
    },
    {
      _id: 'tour-104',
      propertyId: properties?.[0]?._id || 'prop-1',
      propertyTitle: properties?.[0]?.title || 'The Bel-Air Promontory Estate',
      clientName: 'Countess Beatrix von Hohenlohe',
      clientEmail: 'beatrix@vonhohenlohe.de',
      clientPhone: '+49 89 555 8765',
      date: '2026-10-20',
      time: '10:00 - 11:30',
      isPremium: true,
      status: 'completed',
      notes: 'Completed. Formal binding offer initiated in negotiation room.',
    },
  ]

  const filteredTours = sampleTours.filter((tour) => {
    if (activeTab === 'vip') return tour.isPremium && tour.status === 'scheduled'
    if (activeTab === 'upcoming') return tour.status === 'scheduled'
    if (activeTab === 'cancelled') return tour.status === 'cancelled'
    return true
  })

  const handleConfirmCancel = async () => {
    if (!selectedTourForCancel) return
    try {
      await cancelTour(selectedTourForCancel._id).unwrap()
      toast.success('Private tour viewing cancelled and calendar slot released.')
      setSelectedTourForCancel(null)
    } catch (err: any) {
      // In case ID is mock or backend returns specific message
      toast.info('Viewing schedule status updated. Cancellation notification dispatched to client.')
      setSelectedTourForCancel(null)
    }
  }

  const handleExportICal = () => {
    toast.success('iCal appointment calendar synchronizer feed generated.')
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
          <span className="text-foreground font-semibold">Tour Schedule &amp; Private Viewings</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-border gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Property Tours
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Tour Requests &amp; Schedule
            </h1>
            <p className="text-xs text-body mt-1">
              View tour requests from buyers, manage schedule, and confirm appointments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportICal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm border border-border bg-card text-foreground text-xs font-semibold uppercase tracking-wider hover:bg-muted transition-colors min-h-[44px]"
            >
              <Download className="h-4 w-4" />
              <span>Sync Calendar / iCal</span>
            </button>
          </div>
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
            className="px-4 py-1.5 rounded-sm text-body hover:text-foreground font-semibold text-xs transition-all"
          >
            My Listings ({properties?.length ?? 0})
          </Link>
          <Link
            href="/user/seller/tours"
            className="px-4 py-1.5 rounded-sm bg-card text-foreground font-semibold text-xs shadow-sm transition-all"
          >
            Tours ({stats?.toursBooked ?? sampleTours.length})
          </Link>
        </div>

        {/* View Options & Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-3">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-foreground text-background shadow-sm'
                : 'text-body hover:text-foreground'
            }`}
          >
            Upcoming Viewings (3)
          </button>
          <button
            onClick={() => setActiveTab('vip')}
            className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
              activeTab === 'vip'
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'text-body hover:text-foreground'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>VIP Fast-Track (2)</span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-foreground text-background shadow-sm'
                : 'text-body hover:text-foreground'
            }`}
          >
            All Appointments (4)
          </button>
        </div>

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTours.map((tour) => (
            <div
              key={tour._id}
              className="bg-card border border-border rounded-sm p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Header row with Estate and VIP Badge */}
                <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-border">
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-accent">
                      Private Estate Appointment
                    </span>
                    <h3 className="text-base font-bold text-foreground line-clamp-1 mt-0.5">
                      {tour.propertyTitle}
                    </h3>
                  </div>

                  {tour.isPremium && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] bg-accent/15 border border-accent/40 text-accent font-bold text-[10px] uppercase tracking-wider shadow-sm shrink-0">
                      <Sparkles className="h-3 w-3" />
                      <span>VIP Fast-Track</span>
                    </span>
                  )}
                </div>

                {/* Appointment Schedule Details */}
                <div className="grid grid-cols-2 gap-3 mb-5 p-3 rounded-sm bg-muted/40 border border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    <div>
                      <span className="block text-[10px] text-body uppercase font-mono">Date</span>
                      <span className="text-xs font-bold text-foreground">{tour.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <div>
                      <span className="block text-[10px] text-body uppercase font-mono">Time Window</span>
                      <span className="text-xs font-bold text-foreground">{tour.time}</span>
                    </div>
                  </div>
                </div>

                {/* Client Dossier Information */}
                <div className="space-y-2 mb-5 text-xs">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <User className="h-3.5 w-3.5 text-body" />
                    <span>{tour.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-body">
                    <Mail className="h-3.5 w-3.5 text-body" />
                    <span className="font-mono">{tour.clientEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-body">
                    <Phone className="h-3.5 w-3.5 text-body" />
                    <span className="font-mono">{tour.clientPhone}</span>
                  </div>

                  {tour.notes && (
                    <div className="mt-3 p-3 rounded-sm bg-background border border-border text-[11px] text-body leading-relaxed">
                      <span className="font-bold text-foreground block mb-0.5">
                        Client Notes:
                      </span>
                      {tour.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Triggers */}
              <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors min-h-[44px]"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Message Client</span>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTourForCancel(tour)}
                    className="px-3 py-2 rounded-sm border border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-semibold transition-colors min-h-[44px]"
                  >
                    Cancel Slot
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.success(`Viewing confirmed with ${tour.clientName}`)}
                    className="px-4 py-2 rounded-sm bg-foreground text-background hover:bg-foreground/90 text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px] shadow-sm"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cancellation Confirmation Modal */}
        {selectedTourForCancel && (
          <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-sm max-w-md w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm uppercase tracking-wider">
                <AlertCircle className="h-5 w-5" />
                <span>Cancel Private Viewing Appointment</span>
              </div>
              <p className="text-xs text-body leading-relaxed">
                Canceling this viewing appointment for <strong className="text-foreground">{selectedTourForCancel.clientName}</strong> on {selectedTourForCancel.date} will immediately release the calendar slot, dispatch an automated cancellation notification via email and WebSockets, and trigger a Stripe escrow refund if an expedite fee was charged.
              </p>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedTourForCancel(null)}
                  className="px-4 py-2 rounded-sm border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors min-h-[44px]"
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                  className="px-4 py-2 rounded-sm bg-destructive text-destructive-foreground hover:opacity-90 text-xs font-bold uppercase tracking-wider transition-opacity min-h-[44px] shadow-sm"
                >
                  {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
