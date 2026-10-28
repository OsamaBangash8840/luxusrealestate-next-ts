'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Send,
  Plus,
  BadgeDollarSign,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  LockKeyhole,
  Building,
  Check,
  X,
  CreditCard,
  FileCheck2,
  MessageSquare,
} from 'lucide-react'
import { useGetMessagesQuery, useSendMessageMutation } from '@/app/lib/features/chat/chatApi'
import { useProfileQuery } from '@/app/lib/features/profile/profileApiSlice'
import { useGetSinglePropertyQuery } from '@/app/lib/features/properties/propertiesApiSlice'
import socket from '@/hooks/socket'
import { useAuth } from '@/app/hooks/useAuth'
import { Container, AuthGuard } from '@/app/components/common'
import { toast } from 'react-toastify'

function NegotiationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activePropertyId = searchParams.get('propertyId') || ''
  const activeConversationId = searchParams.get('conversationId') || activePropertyId || 'default-thread'
  const targetSellerId = searchParams.get('sellerId') || ''

  const { data: userProfile } = useProfileQuery()
  const { data: property } = useGetSinglePropertyQuery(activePropertyId, {
    skip: !activePropertyId,
  })
  const { data: rawMessages, refetch } = useGetMessagesQuery(activeConversationId, {
    skip: !activeConversationId || activeConversationId === 'default-thread',
  })
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()

  const [inputMessage, setInputMessage] = useState('')
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')
  const [settlementDays, setSettlementDays] = useState('30')
  const [offerNotes, setOfferNotes] = useState('')
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false)
  const [escrowDepositPaid, setEscrowDepositPaid] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Local optimistic message list to ensure instant response in demo / offline socket mode
  const [localMessages, setLocalMessages] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { token: authToken } = useAuth()
  const token = authToken || ''
  const currentUserId = (userProfile as any)?._id || (userProfile as any)?.id || 'current-user'
  const isBuyer = userProfile?.role !== 'seller'

  // Initialize socket
  useEffect(() => {
    if (token) {
      socket.auth = { token }
      socket.connect()

      socket.emit('joinConversation', {
        conversationId: activeConversationId,
        buyerId: isBuyer ? currentUserId : targetSellerId,
        sellerId: isBuyer ? targetSellerId : currentUserId,
        propertyId: activePropertyId,
      })

      socket.on('newMessage', (newMsg: any) => {
        setLocalMessages((prev) => [...prev, newMsg])
        refetch()
      })

      socket.on('offerStatusUpdated', ({ messageId, status }: any) => {
        setLocalMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId
              ? { ...msg, offerDetails: { ...msg.offerDetails, status } }
              : msg
          )
        )
        toast.info(`Offer status updated: ${status}`)
        refetch()
      })

      return () => {
        socket.off('newMessage')
        socket.off('offerStatusUpdated')
        socket.disconnect()
      }
    }
  }, [token, activeConversationId, activePropertyId, currentUserId, targetSellerId, isBuyer, refetch])

  // Scroll to bottom on message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [rawMessages, localMessages])

  // Combine rawMessages and localMessages
  const allMessages = React.useMemo(() => {
    const list = [...(rawMessages || [])]
    localMessages.forEach((local) => {
      if (!list.some((m) => m._id === local._id)) {
        list.push(local)
      }
    })
    // If empty demo thread, inject initial welcome
    if (list.length === 0 && property) {
      list.push({
        _id: 'welcome-seed',
        senderId: { username: 'Concierge' },
        content: `Direct messaging channel established for ${property.title}. You can ask questions, discuss details, or submit an offer directly.`,
        createdAt: new Date().toISOString(),
        isOffer: false,
      })
    }
    return list
  }, [rawMessages, localMessages, property])

  // Send regular text message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const newMsg = {
      _id: `temp-${Date.now()}`,
      conversationId: activeConversationId,
      content: inputMessage.trim(),
      senderId: { _id: currentUserId, username: userProfile?.username || 'You' },
      createdAt: new Date().toISOString(),
      isOffer: false,
    }

    setLocalMessages((prev) => [...prev, newMsg])
    setInputMessage('')

    try {
      if (socket.connected) {
        socket.emit('newMessage', {
          conversationId: activeConversationId,
          content: newMsg.content,
          senderId: currentUserId,
          messageType: 'text',
        })
      }
      await sendMessage({
        conversationId: activeConversationId,
        content: newMsg.content,
        senderId: currentUserId,
      }).unwrap()
    } catch {
      // Local message remains visible in offline demo mode
    }
  }

  // Submit formal binding offer
  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(offerAmount)
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid acquisition amount')
      return
    }

    const offerMsg = {
      _id: `offer-${Date.now()}`,
      conversationId: activeConversationId,
      content: `Purchase Offer: $${amount.toLocaleString()} USD (${settlementDays}-Day Closing)`,
      senderId: { _id: currentUserId, username: userProfile?.username || 'Buyer' },
      createdAt: new Date().toISOString(),
      isOffer: true,
      offerDetails: {
        amount,
        status: 'pending',
        settlementDays,
        notes: offerNotes.trim() || 'Cash purchase.',
      },
    }

    setLocalMessages((prev) => [...prev, offerMsg])
    setIsOfferModalOpen(false)
    setOfferAmount('')
    setOfferNotes('')

    if (socket.connected) {
      socket.emit('sendOffer', {
        conversationId: activeConversationId,
        amount,
        notes: offerMsg.offerDetails.notes,
        senderId: currentUserId,
      })
    }

    toast.success('Binding formal offer transmitted to principal seller')
  }

  // Respond to offer (accept or reject)
  const handleRespondOffer = (messageId: string, status: 'accepted' | 'rejected') => {
    setLocalMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId
          ? { ...msg, offerDetails: { ...msg.offerDetails, status } }
          : msg
      )
    )

    if (socket.connected) {
      socket.emit('respondToOffer', {
        messageId,
        status,
        notes: status === 'accepted' ? 'Accepted by principal seller.' : 'Declined by principal seller.',
      })
    }

    if (status === 'accepted') {
      toast.success('Offer accepted! Property status locked to Under Escrow.')
      setIsEscrowModalOpen(true)
    } else {
      toast.info('Offer has been declined.')
    }
  }

  // Handle mock escrow deposit wire
  const handlePayEscrowDeposit = () => {
    setIsProcessingPayment(true)
    setTimeout(() => {
      setIsProcessingPayment(false)
      setEscrowDepositPaid(true)
      toast.success('10% Escrow Deposit Wired & Locked in Trust Account')
    }, 1200)
  }

  const cataloguePrice = property?.price ? Number(property.price) : 42500000
  const calculatedDeposit = offerAmount ? Math.round(Number(offerAmount) * 0.1) : Math.round(cataloguePrice * 0.1)

  return (
    <div className="min-h-screen bg-background py-8">
      <Container>
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-body font-medium">
            <Link href="/properties" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Catalogue</span>
            </Link>
            <span className="text-border">/</span>
            <span className="text-accent uppercase tracking-widest font-semibold">
              Negotiation &bull; Ref #{activePropertyId.slice(-6).toUpperCase() || 'ESTATE'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold text-foreground">
              Encrypted Real-Time Session
            </span>
          </div>
        </div>

        {/* Master Negotiation Console Layout (Two-Column) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Property & Transaction Timeline (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Property Summary Pill */}
            <div className="p-6 rounded-sm bg-card border border-border shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent block mb-1">
                Property Discussed
              </span>
              <h2 className="text-lg font-bold text-foreground">
                {property?.title || 'The Bel-Air Promontory Estate'}
              </h2>
              <div className="text-xl font-extrabold text-foreground mt-1 mb-4">
                ${cataloguePrice.toLocaleString()} <span className="text-xs font-normal text-body">USD</span>
              </div>

              {activePropertyId && (
                <Link
                  href={`/properties/${activePropertyId}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline mb-4"
                >
                  <Building className="h-3.5 w-3.5" />
                  <span>View Full Property Details</span>
                </Link>
              )}

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-body">
                <span>Initial Deposit (10%)</span>
                <span className="font-semibold text-foreground">${(cataloguePrice * 0.1).toLocaleString()} USD</span>
              </div>
            </div>

            {/* Transaction Progress Tracker */}
            <div className="p-6 rounded-sm bg-card border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <LockKeyhole className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Transaction Progress
                </h3>
              </div>

              <div className="space-y-4">
                {/* Milestone 1 */}
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-success/20 text-success flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">1. Negotiation</div>
                    <div className="text-[11px] text-body">Chatting &amp; discussing terms</div>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="flex items-start gap-3">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    allMessages.some((m) => m.offerDetails?.status === 'accepted')
                      ? 'bg-success/20 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {allMessages.some((m) => m.offerDetails?.status === 'accepted') ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">2. Offer Accepted</div>
                    <div className="text-[11px] text-body">Both parties agree on price and terms</div>
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="flex items-start gap-3">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    escrowDepositPaid ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    {escrowDepositPaid ? <Check className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">3. Initial Deposit (10%)</div>
                    <div className="text-[11px] text-body">
                      {escrowDepositPaid ? 'Deposit received in escrow' : 'Awaiting deposit upon acceptance'}
                    </div>
                  </div>
                </div>

                {/* Milestone 4 */}
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileCheck2 className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">4. Closing &amp; Ownership Transfer</div>
                    <div className="text-[11px] text-body">Legal registration &amp; keys handover</div>
                  </div>
                </div>
              </div>

              {allMessages.some((m) => m.offerDetails?.status === 'accepted') && !escrowDepositPaid && (
                <button
                  type="button"
                  onClick={() => setIsEscrowModalOpen(true)}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-sm bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider hover:bg-accent/90 transition-colors shadow-sm"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Execute 10% Escrow Wire</span>
                </button>
              )}
            </div>

            {/* Bilateral Trust Protocol */}
            <div className="p-4 rounded-sm bg-muted text-xs text-body leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
              <span>
                Offers formulated through this console constitute formal letters of intent and bind the escrow protocol upon countersignature.
              </span>
            </div>
          </div>

          {/* Right Column: Active Negotiation Stream (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-[740px] rounded-sm bg-card border border-border shadow-sm overflow-hidden">
            {/* Thread Header Bar */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs">
                  {property?.seller?.email ? property.seller.email[0].toUpperCase() : 'S'}
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>{property?.seller?.email ? property.seller.email.split('@')[0] : 'Principal Seller / Atelier'}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  </div>
                  <div className="text-[10px] text-body">Active Socket Session &bull; Direct Principal</div>
                </div>
              </div>

              {/* Offer Trigger Button */}
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider hover:bg-accent/90 transition-colors shadow-sm"
              >
                <BadgeDollarSign className="h-3.5 w-3.5" />
                <span>Make a Formal Offer</span>
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/50">
              {allMessages.map((msg) => {
                const isSentByMe =
                  msg.senderId?._id === currentUserId ||
                  msg.senderId === currentUserId ||
                  msg.senderId?.username === userProfile?.username

                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-body mb-1 px-1">
                      {isSentByMe ? 'You' : msg.senderId?.username || 'Principal Seller'}
                    </span>

                    {msg.isOffer ? (
                      /* Special Formal Offer Card Inside Chat Stream */
                      <div className="w-full max-w-md rounded-sm border-2 border-accent/60 bg-card p-5 shadow-md">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                          <div className="flex items-center gap-1.5">
                            <BadgeDollarSign className="h-4 w-4 text-accent" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                              Binding Acquisition Offer
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider ${
                              msg.offerDetails?.status === 'accepted'
                                ? 'bg-success/20 text-success'
                                : msg.offerDetails?.status === 'rejected'
                                ? 'bg-destructive/20 text-destructive'
                                : 'bg-accent/20 text-accent'
                            }`}
                          >
                            {msg.offerDetails?.status || 'Pending'}
                          </span>
                        </div>

                        <div className="mb-3">
                          <div className="text-xs text-body">Acquisition Valuation</div>
                          <div className="text-2xl font-extrabold text-foreground">
                            ${Number(msg.offerDetails?.amount || 0).toLocaleString()} USD
                          </div>
                          <div className="text-xs text-accent font-medium mt-0.5">
                            Required 10% Escrow Wire: ${Math.round(Number(msg.offerDetails?.amount || 0) * 0.1).toLocaleString()} USD
                          </div>
                        </div>

                        {msg.offerDetails?.notes && (
                          <div className="p-3 rounded-sm bg-muted text-xs text-body mb-4">
                            <span className="font-semibold text-foreground">Terms: </span>
                            {msg.offerDetails.notes}
                          </div>
                        )}

                        {/* Recipient Determination Actions */}
                        {!isSentByMe && msg.offerDetails?.status === 'pending' && (
                          <div className="flex items-center gap-2 pt-3 border-t border-border">
                            <button
                              type="button"
                              onClick={() => handleRespondOffer(msg._id, 'accepted')}
                              className="flex-1 py-2 rounded-sm bg-success text-success-foreground text-xs font-semibold uppercase tracking-wider hover:bg-success/90 transition-colors"
                            >
                              Accept &amp; Open Escrow
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRespondOffer(msg._id, 'rejected')}
                              className="px-4 py-2 rounded-sm border border-destructive text-destructive text-xs font-semibold uppercase tracking-wider hover:bg-destructive/10 transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Standard Text Chat Bubble */
                      <div
                        className={`max-w-md px-4 py-3 rounded-sm text-sm leading-relaxed shadow-sm ${
                          isSentByMe
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-border text-foreground'
                        }`}
                      >
                        {msg.content}
                      </div>
                    )}

                    <span className="text-[9px] text-muted-foreground mt-1 px-1">
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Message Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(true)}
                className="p-2.5 rounded-sm border border-border text-accent hover:bg-muted transition-colors"
                title="Make a formal offer"
              >
                <Plus className="h-4 w-4" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type confidential message or clarification..."
                className="flex-1 p-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />

              <button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <span>Send</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Modal: Formulate Formal Binding Offer */}
        {isOfferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-sm bg-card border border-border p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                    Binding Legal Instrument
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Formulate Formal Acquisition Offer
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitOffer} className="space-y-4">
                <div className="p-3 rounded-sm bg-muted text-xs text-body">
                  Target Estate: <span className="font-semibold text-foreground">{property?.title || 'Selected Estate'}</span>
                  <div className="mt-1">
                    Catalogue Price: <span className="font-semibold text-foreground">${cataloguePrice.toLocaleString()} USD</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                    Acquisition Offer Price (USD) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="39000000"
                    required
                    className="w-full p-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <div className="mt-1.5 text-xs text-accent font-medium">
                    Calculated 10% Initial Deposit: ${calculatedDeposit.toLocaleString()} USD
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                    Closing Period
                  </label>
                  <select
                    value={settlementDays}
                    onChange={(e) => setSettlementDays(e.target.value)}
                    className="w-full p-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="30">30 Days (Fast Close)</option>
                    <option value="45">45 Days (Standard)</option>
                    <option value="60">60 Days (With Inspection / Financing)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                    Special Notes or Conditions
                  </label>
                  <textarea
                    value={offerNotes}
                    onChange={(e) => setOfferNotes(e.target.value)}
                    rows={3}
                    placeholder="Any conditions, preferred closing dates, or questions for the seller..."
                    className="w-full p-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsOfferModalOpen(false)}
                    className="px-4 py-2 rounded-sm border border-border text-xs font-semibold text-body hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-sm bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider hover:bg-accent/90"
                  >
                    <BadgeDollarSign className="h-4 w-4" />
                    <span>Dispatch Binding Offer</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Escrow Wire Settlement */}
        {isEscrowModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-sm bg-card border border-border p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                    Escrow Settlement Protocol
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Wire Initial Escrow Deposit
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEscrowModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!escrowDepositPaid ? (
                <div className="space-y-4">
                  <p className="text-xs text-body leading-relaxed">
                    The principal seller has accepted your terms. To bind the transaction and initiate county title conveyance, please authorize the 10% escrow deposit into our audited trust account.
                  </p>

                  <div className="p-4 rounded-sm bg-muted border border-border space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-body">Escrow Trustee:</span>
                      <span className="font-semibold text-foreground">Luxus Escrow Trust Corp (Geneva)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-body">Deposit Amount (10%):</span>
                      <span className="font-bold text-accent">${calculatedDeposit.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-body">Wire Reference:</span>
                      <span className="font-mono text-foreground">LX-ESC-{activePropertyId.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePayEscrowDeposit}
                    disabled={isProcessingPayment}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-sm bg-success text-success-foreground text-xs font-semibold uppercase tracking-wider hover:bg-success/90 transition-colors shadow-sm"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>{isProcessingPayment ? 'Transmitting Wire...' : `Authorize $${calculatedDeposit.toLocaleString()} Deposit`}</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-success/20 text-success mx-auto flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h4 className="text-base font-bold text-foreground">Payment Received &amp; Held in Escrow</h4>
                  <p className="text-xs text-body leading-relaxed">
                    Transaction reference LX-ESC-{activePropertyId.slice(-6).toUpperCase()} is now held securely in escrow. Closing attorneys have been notified to finalize the title and transfer.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsEscrowModalOpen(false)}
                    className="px-6 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}

export default function NegotiationPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="p-12 text-center text-sm text-body">Loading Negotiation Console...</div>}>
        <NegotiationContent />
      </Suspense>
    </AuthGuard>
  )
}
