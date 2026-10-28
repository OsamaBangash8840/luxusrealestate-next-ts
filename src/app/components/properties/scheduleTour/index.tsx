'use client'

import React, { useState } from 'react'
import {
  useAvailableSlotsQuery,
  useScheduleTourMutation,
  useCreatePaymentIntentMutation,
} from '@/app/lib/features/scheduleTours/scheduleToursApiSlice'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Modal } from '../../common/Modal'
import { Button } from '../../common/Button'
import { TextAreaField, TextField } from '../../form'
import { Typography } from '@/app/components/common'
import { ShieldCheck, Sparkles, Check, CreditCard, Clock } from 'lucide-react'

interface ScheduleTourProps {
  propertyId: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type TourTier = 'standard' | 'premium'

export const ScheduleTour: React.FC<ScheduleTourProps> = ({ propertyId, isOpen, setIsOpen }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [date, setDate] = useState<Date | null>(new Date())
  const [selectedTime, setSelectedTime] = useState('')
  const [tier, setTier] = useState<TourTier>('standard')
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [isInitializingPayment, setIsInitializingPayment] = useState(false)

  // Fetch available slots
  const { data, error, isLoading } = useAvailableSlotsQuery({
    date: date ? date.toISOString().split('T')[0] : '',
    propertyId,
  })

  const [scheduleTour, { isLoading: isBooking }] = useScheduleTourMutation()
  const [createPaymentIntent] = useCreatePaymentIntentMutation()

  const handleTierSelect = async (selectedTier: TourTier) => {
    setTier(selectedTier)
    if (selectedTier === 'premium') {
      try {
        setIsInitializingPayment(true)
        const res = await createPaymentIntent({ propertyId }).unwrap()
        const intentId = (res as any)?.paymentIntentId || (res as any)?.data?.paymentIntentId
        setPaymentIntentId(intentId)
        toast.info('VIP Protocol activated: $50.00 escrow inspection fee applied.')
      } catch (err: any) {
        toast.error('Unable to initialize VIP payment intent. Defaulting to standard tour.')
        setTier('standard')
        setPaymentIntentId(null)
      } finally {
        setIsInitializingPayment(false)
      }
    } else {
      setPaymentIntentId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTime || !date) {
      toast.error('Please select a valid date and time slot.')
      return
    }

    // Convert selected time to 24-hour format
    const convertTo24Hour = (time12h: string) => {
      const [time, modifier] = time12h.split(' ')
      let [hours, minutes] = time.split(':')

      if (modifier?.toLowerCase() === 'pm' && hours !== '12') {
        hours = String(parseInt(hours, 10) + 12)
      }
      if (modifier?.toLowerCase() === 'am' && hours === '12') {
        hours = '00'
      }

      return `${hours}:${minutes}`
    }

    const formattedTime = convertTo24Hour(selectedTime)
    const localBookingDateTime = new Date(date)
    const [hours, minutes] = formattedTime.split(':')
    localBookingDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)

    const utcBookingDateTime = new Date(
      localBookingDateTime.getTime() - localBookingDateTime.getTimezoneOffset() * 60000
    )

    try {
      await scheduleTour({
        propertyId,
        name,
        email,
        phone,
        date: utcBookingDateTime.toISOString().split('T')[0],
        time: formattedTime,
        message,
        isPremium: tier === 'premium',
        paymentIntentId: tier === 'premium' ? paymentIntentId || undefined : undefined,
      }).unwrap()

      toast.success(
        tier === 'premium'
          ? 'VIP Guided Tour scheduled! A confirmation email has been sent.'
          : 'Tour scheduled successfully.'
      )
      setIsOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.error || error?.data?.message || 'Error scheduling the tour.')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="sm:max-w-[620px] max-h-[92vh] overflow-y-auto p-6"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 mb-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <Typography
            as="span"
            variant="extraSmallBold"
            className="text-[10px] font-semibold uppercase tracking-widest text-accent"
          >
            Schedule a Tour
          </Typography>
        </div>
        <Typography as="h2" variant="h3" className="text-xl font-bold text-foreground">
          Schedule a Property Tour
        </Typography>
      </div>

      {/* Tour Tier Selector */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          type="button"
          onClick={() => handleTierSelect('standard')}
          className={`p-3.5 rounded-sm border text-left transition-all ${
            tier === 'standard'
              ? 'border-accent bg-accent/5 ring-1 ring-accent'
              : 'border-border bg-card hover:bg-muted'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-foreground">Standard Tour</span>
            <span className="text-[10px] font-mono uppercase text-body">Free</span>
          </div>
          <p className="text-[11px] text-body">
            30-minute private walkthrough of the property with an agent.
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleTierSelect('premium')}
          disabled={isInitializingPayment}
          className={`p-3.5 rounded-sm border text-left transition-all relative ${
            tier === 'premium'
              ? 'border-accent bg-accent/10 ring-1 ring-accent'
              : 'border-border bg-card hover:bg-muted'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-xs font-bold text-foreground">VIP Guided Tour</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-accent">$50 USD</span>
          </div>
          <p className="text-[11px] text-body">
            Dedicated private advisor, complete property documents, and direct consultation.
          </p>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
        <div>
          <label className="block font-semibold uppercase tracking-wider text-body mb-1">
            Full Name
          </label>
          <TextField
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Julian Sterling"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-body mb-1">
              Email Address
            </label>
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="principal@familyoffice.com"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-body mb-1">
              Direct Telephone
            </label>
            <TextField
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+1 (555) 019-2834"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-body mb-1">
              Select Viewing Date
            </label>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              minDate={new Date()}
              required
              className="p-2.5 border border-input bg-background rounded-sm w-full text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-body mb-1">
              Available 30-Min Window
            </label>
            {isLoading ? (
              <p className="text-body p-2.5">Fetching available slots...</p>
            ) : error ? (
              <p className="text-destructive p-2.5">Error fetching windows</p>
            ) : (
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                className="p-2.5 border border-input bg-background rounded-sm w-full text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="">Select an available window</option>
                {data?.availableSlots?.length > 0 ? (
                  data.availableSlots.map(
                    (slot: { start: string; end: string }, index: number) => (
                      <option key={index} value={slot.start}>
                        {slot.start} &ndash; {slot.end}
                      </option>
                    )
                  )
                ) : (
                  <option value="" disabled>
                    No windows remaining for selected date
                  </option>
                )}
              </select>
            )}
          </div>
        </div>

        <div>
          <label className="block font-semibold uppercase tracking-wider text-body mb-1">
            Private Special Requirements &amp; Inquiries
          </label>
          <TextAreaField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Note any specific architectural requirements, advisory delegation, or timing nuances..."
          />
        </div>

        {tier === 'premium' && (
          <div className="p-3 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-between text-xs text-accent">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Stripe 256-Bit Intent Verified ($50.00 USD)</span>
            </div>
            <span className="text-[10px] font-mono font-semibold uppercase">Escrow Refundable</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-body">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            <span>Secure Booking Confirmation</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-sm border border-border text-xs font-semibold text-body hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBooking || isInitializingPayment}
              className="px-5 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isBooking ? 'Registering...' : tier === 'premium' ? 'Confirm VIP Tour ($50)' : 'Confirm Tour'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
