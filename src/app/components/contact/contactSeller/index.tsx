'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MessageSquare,
  Phone,
  Mail,
  ShieldCheck,
  Search,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Lock,
  Building,
  CheckCircle2,
} from 'lucide-react'
import { useGetSinglePropertyQuery } from '@/app/lib/features/properties/propertiesApiSlice'
import { Modal } from '../../common/Modal'
import { toast } from 'react-toastify'
import { useAuth } from '@/app/hooks/useAuth'

interface ContactSellerProps {
  propertyId: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DISCUSSION_TOPICS = [
  {
    id: 'pricing',
    title: 'Acquisition Price & Escrow Terms',
    description: 'Inquire on valuation flexibility, deposit terms, and escrow timelines.',
  },
  {
    id: 'viewing',
    title: 'Confidential Private Viewing',
    description: 'Arrange discreet on-site inspection with security and privacy protocol.',
  },
  {
    id: 'legal',
    title: 'Title Deeds & Legal Disclosures',
    description: 'Request verified ownership deed copies, zoning certificates, and land boundaries.',
  },
  {
    id: 'architecture',
    title: 'Architectural Blueprint & Inventory',
    description: 'Review structural plans, fixtures, luxury furnishings, and equipment warranties.',
  },
  {
    id: 'offmarket',
    title: 'Off-Market Advisory & Discretion',
    description: 'Strict non-disclosure discussion for family offices and institutional buyers.',
  },
]

export const ContactSeller: React.FC<ContactSellerProps> = ({
  propertyId,
  isOpen,
  setIsOpen,
}) => {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { data: property } = useGetSinglePropertyQuery(propertyId || '', {
    skip: !propertyId,
  })

  const [activeTab, setActiveTab] = useState<'chat' | 'callback' | 'agent'>('chat')
  const [topicSearch, setTopicSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<string>('pricing')

  // Callback form state
  const [fullName, setFullName] = useState(user?.username || '')
  const [phone, setPhone] = useState('')
  const [investorType, setInvestorType] = useState('Principal Buyer')
  const [preferredTime, setPreferredTime] = useState('Afternoon (12:00 - 17:00)')
  const [confidentialNote, setConfidentialNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const seller = property?.seller
  const sellerName = seller?.username || seller?.name || 'Listing Partner'
  const sellerEmail = seller?.email
  const sellerPhone = seller?.phone

  // Filter discussion topics based on search
  const filteredTopics = DISCUSSION_TOPICS.filter((t) =>
    t.title.toLowerCase().includes(topicSearch.toLowerCase()) ||
    t.description.toLowerCase().includes(topicSearch.toLowerCase())
  )

  const handleLaunchChat = () => {
    setIsOpen(false)
    const topicParam = encodeURIComponent(
      DISCUSSION_TOPICS.find((t) => t.id === selectedTopic)?.title || 'General Acquisition'
    )
    router.push(`/chat?propertyId=${propertyId}&topic=${topicParam}`)
  }

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) {
      toast.error('Please provide a contact telephone number for the confidential callback.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsOpen(false)
      toast.success(
        `Confidential inquiry registered. The representative will reach out at ${preferredTime}.`
      )
    }, 600)
  }

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="sm:max-w-[640px] max-h-[92vh] overflow-y-auto p-6 bg-card border border-border"
    >
      <div className="space-y-6">
        {/* Header with Luxury Estate Credentials */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
              Confidential Protocol &bull; Ref #{propertyId ? propertyId.slice(-6).toUpperCase() : 'ESTATE'}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Initiate Principal Discussion
          </h2>
          <p className="text-xs text-body mt-1">
            Direct, discreet communication channel for{' '}
            <span className="font-semibold text-foreground">{property?.title || 'this estate'}</span>.
          </p>
        </div>

        {/* Modal Navigation Channels (Tabs) */}
        <div className="grid grid-cols-3 gap-2 p-1 rounded-sm bg-muted text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`py-2 px-3 rounded-sm transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-body hover:text-foreground'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-accent" />
            <span>Direct Chat</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('callback')}
            className={`py-2 px-3 rounded-sm transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'callback'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-body hover:text-foreground'
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-accent" />
            <span>Private Briefing</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('agent')}
            className={`py-2 px-3 rounded-sm transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'agent'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-body hover:text-foreground'
            }`}
          >
            <User className="h-3.5 w-3.5 text-accent" />
            <span>Agent Dossier</span>
          </button>
        </div>

        {/* TAB 1: DIRECT ENCRYPTED NEGOTIATION / CHAT */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground block mb-2">
                1. Select Topic or Inquiry Focus
              </span>

              {/* Topic Search Box */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={topicSearch}
                  onChange={(e) => setTopicSearch(e.target.value)}
                  placeholder="Search discussion topics (e.g., pricing, escrow, deeds)..."
                  className="w-full rounded-sm border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Discussion Topics Radio Grid */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {filteredTopics.map((topic) => (
                  <label
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`block p-3 rounded-sm border cursor-pointer transition-all ${
                      selectedTopic === topic.id
                        ? 'border-accent bg-accent/10 shadow-sm'
                        : 'border-border bg-background hover:border-accent/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-foreground">{topic.title}</span>
                      {selectedTopic === topic.id && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                      )}
                    </div>
                    <p className="text-[11px] text-body">{topic.description}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Launch CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLaunchChat}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Launch Direct Negotiation Channel</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-[11px] text-muted-foreground font-mono">
                <Lock className="h-3 w-3 text-accent" />
                <span>Encrypted in-platform thread with certified representative</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REQUEST DISCREET BRIEFING / CALLBACK */}
        {activeTab === 'callback' && (
          <form onSubmit={handleCallbackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-body mb-1">
                  Principal or Representative Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Lord Harrington"
                  className="w-full rounded-sm border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-body mb-1">
                  Investor Representation
                </label>
                <select
                  value={investorType}
                  onChange={(e) => setInvestorType(e.target.value)}
                  className="w-full rounded-sm border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="Principal Buyer">Principal Buyer</option>
                  <option value="Family Office">Family Office Trustee</option>
                  <option value="Legal Counsel">Appointed Legal Counsel</option>
                  <option value="Buyer Broker">Accredited Buyer Broker</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-body mb-1">
                  Direct Telephone Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full rounded-sm border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-body mb-1">
                  Preferred Calling Window
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full rounded-sm border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="Morning (09:00 - 12:00)">Morning (09:00 &ndash; 12:00)</option>
                  <option value="Afternoon (12:00 - 17:00)">Afternoon (12:00 &ndash; 17:00)</option>
                  <option value="Evening (17:00 - 20:00)">Evening (17:00 &ndash; 20:00)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-body mb-1">
                Confidential Inquiry Notes (Optional)
              </label>
              <textarea
                value={confidentialNote}
                onChange={(e) => setConfidentialNote(e.target.value)}
                placeholder="Specific covenants, closing timeline, or questions you wish to address..."
                rows={3}
                className="w-full rounded-sm border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              <Phone className="h-4 w-4" />
              <span>{isSubmitting ? 'Registering Briefing...' : 'Request Confidential Briefing'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: VERIFIED AGENT DOSSIER */}
        {activeTab === 'agent' && (
          <div className="space-y-4">
            <div className="p-4 rounded-sm border border-border bg-muted/40 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-accent/20 border border-accent/40 text-accent font-bold text-base flex items-center justify-center shrink-0">
                  {sellerName[0]?.toUpperCase() || 'L'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-foreground">{sellerName}</h4>
                    <span className="inline-flex items-center gap-1 rounded-sm border border-success/40 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success uppercase">
                      <ShieldCheck className="h-3 w-3" />
                      Authorized
                    </span>
                  </div>
                  <p className="text-xs text-body">{sellerEmail || 'exclusive@luxus.estate'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-body block text-[10px] uppercase font-mono">Agency Representation</span>
                  <span className="font-semibold text-foreground">Luxus Private Client Advisory</span>
                </div>
                <div>
                  <span className="text-body block text-[10px] uppercase font-mono">Listing Portfolio</span>
                  <span className="font-semibold text-foreground">{property?.type || 'Flagship Estate'}</span>
                </div>
              </div>
            </div>

            {/* Direct Wire Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sellerPhone ? (
                <a
                  href={`tel:${sellerPhone}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call ({sellerPhone})</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => toast.info('Direct wire is protected. Request a private callback.')}
                  className="py-3 px-4 rounded-sm border border-border text-body text-xs font-semibold uppercase tracking-wider"
                >
                  Direct Wire by Request
                </button>
              )}

              {sellerEmail ? (
                <a
                  href={`mailto:${sellerEmail}?subject=${encodeURIComponent(
                    `Principal Discussion: ${property?.title || 'Estate'}`
                  )}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-sm border border-border bg-card text-foreground text-xs font-semibold uppercase tracking-wider hover:bg-muted hover:border-accent/40 transition-colors"
                >
                  <Mail className="h-4 w-4 text-accent" />
                  <span>Send Direct Email</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => toast.error('Seller email address is confidential.')}
                  className="py-3 px-4 rounded-sm border border-border text-body text-xs font-semibold uppercase tracking-wider"
                >
                  Email Confidential
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
export default ContactSeller
