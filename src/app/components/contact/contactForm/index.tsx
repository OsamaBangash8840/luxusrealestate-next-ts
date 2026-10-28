'use client'

import React, { useState } from 'react'
import { useContactMutation } from '@/app/lib/features/contact/contactApiSplice'
import { Container } from '../../common/Container'
import {
  ShieldCheck,
  Building,
  Mail,
  Phone,
  ArrowRight,
  Lock,
  Globe2,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'react-toastify'

interface IPayload {
  name: string
  email: string
  mobile: string
  message: string
}

export const ContactForm: React.FC = () => {
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    mobile?: string
    message?: string
    apiError?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [mandateType, setMandateType] = useState('acquisition')
  const [payload, setPayload] = useState<IPayload>({
    name: '',
    email: '',
    mobile: '',
    message: '',
  })

  const [contact] = useContactMutation()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target
    setPayload({
      ...payload,
      [name]: value,
    })
    setErrors({
      ...errors,
      [name]: '',
      apiError: '',
    })
  }

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string
      email?: string
      mobile?: string
      message?: string
    } = {}

    if (!payload.name.trim()) newErrors.name = 'Full name is required'
    if (!payload.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(payload.email)) {
      newErrors.email = 'Invalid email address format'
    }
    if (!payload.mobile.trim()) {
      newErrors.mobile = 'Mobile phone number is required'
    } else if (!/^\+?[0-9 ]{10,15}$/.test(payload.mobile.trim())) {
      newErrors.mobile = 'Valid phone number with country code is required'
    }
    if (!payload.message.trim()) newErrors.message = 'Please provide details of your mandate'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const fullMessage = `[Mandate: ${mandateType.toUpperCase()}] ${payload.message.trim()}`
      await contact({
        ...payload,
        name: payload.name.trim(),
        email: payload.email.trim(),
        mobile: payload.mobile.trim(),
        message: fullMessage,
      }).unwrap()

      toast.success('Confidential mandate received. A Managing Director will reach out within 4 hours.')
      setPayload({
        name: '',
        email: '',
        mobile: '',
        message: '',
      })
      setErrors({})
    } catch (err: any) {
      setErrors({
        apiError: err?.data?.message || 'An error occurred while submitting. Please try again.',
      })
      toast.error('Failed to submit mandate')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-background py-16">
      <Container>
        {/* Header Breadcrumb */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Private Client Services &bull; Contact Us
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Get in Touch with Our Team
          </h1>
          <p className="text-sm sm:text-base text-body mt-2 leading-relaxed">
            We assist buyers and sellers worldwide with complete confidentiality and dedicated support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Global Offices (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-sm bg-card border border-border shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent block mb-2">
                Our Offices
              </span>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Global Locations
              </h2>
              <p className="text-xs text-body leading-relaxed mb-6">
                Our regional teams can arrange private viewings and provide detailed property information at any of our offices.
              </p>

              <div className="space-y-4 pt-4 border-t border-border">
                {/* Geneva */}
                <div className="p-3.5 rounded-sm bg-background border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-foreground">Geneva Office</span>
                    <span className="text-[10px] text-accent font-semibold uppercase">Central Europe</span>
                  </div>
                  <p className="text-xs text-body">Rue du Rhône 42, 1204 Genève, Switzerland</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">+41 22 819 3000</p>
                </div>

                {/* London */}
                <div className="p-3.5 rounded-sm bg-background border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-foreground">London Office</span>
                    <span className="text-[10px] text-accent font-semibold uppercase">United Kingdom</span>
                  </div>
                  <p className="text-xs text-body">14 Curzon Street, Mayfair, London W1J 5HN</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">+44 20 7946 0912</p>
                </div>

                {/* New York */}
                <div className="p-3.5 rounded-sm bg-background border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-foreground">New York Office</span>
                    <span className="text-[10px] text-accent font-semibold uppercase">Americas</span>
                  </div>
                  <p className="text-xs text-body">432 Park Avenue, Fl 54, New York, NY 10022</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">+1 212 555 0198</p>
                </div>
              </div>
            </div>

            {/* Privacy Guarantee */}
            <div className="p-6 rounded-sm bg-foreground text-background border border-border shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-accent">
                <Lock className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-background">
                  Privacy &amp; Discretion
                </h3>
              </div>
              <p className="text-xs text-background/80 leading-relaxed">
                All inquiries are handled directly by our senior team with strict confidentiality.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-8 rounded-sm bg-card border border-border shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent block mb-1">
              Inquiry Form
            </span>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Send Us a Message
            </h2>

            {errors.apiError && (
              <div className="mb-4 p-3 rounded-sm bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {errors.apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Inquiry Type Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1.5">
                  Inquiry Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'acquisition', label: 'Buying' },
                    { id: 'divestment', label: 'Selling' },
                    { id: 'advisory', label: 'Consultation' },
                    { id: 'viewing', label: 'Property Tour' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMandateType(m.id)}
                      className={`py-2 px-3 rounded-sm border text-xs font-semibold transition-all ${
                        mandateType === m.id
                          ? 'border-accent bg-accent/10 text-accent ring-1 ring-accent'
                          : 'border-border bg-background text-body hover:border-accent/40 hover:text-foreground'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={payload.name}
                  onChange={handleChange}
                  placeholder="Elena Rostova"
                  required
                  className={`w-full p-2.5 rounded-sm border text-sm text-foreground bg-background focus:outline-none focus:ring-1 focus:ring-accent ${
                    errors.name ? 'border-destructive' : 'border-input'
                  }`}
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={payload.email}
                    onChange={handleChange}
                    placeholder="elena@example.com"
                    required
                    className={`w-full p-2.5 rounded-sm border text-sm text-foreground bg-background focus:outline-none focus:ring-1 focus:ring-accent ${
                      errors.email ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Mobile Phone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={payload.mobile}
                    onChange={handleChange}
                    placeholder="+1 (555) 019-2834"
                    required
                    className={`w-full p-2.5 rounded-sm border text-sm text-foreground bg-background focus:outline-none focus:ring-1 focus:ring-accent ${
                      errors.mobile ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.mobile && <p className="text-destructive text-xs mt-1">{errors.mobile}</p>}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                  Your Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="message"
                  value={payload.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us how we can help you with your property search or sale..."
                  required
                  className={`w-full p-2.5 rounded-sm border text-sm text-foreground bg-background focus:outline-none focus:ring-1 focus:ring-accent resize-none ${
                    errors.message ? 'border-destructive' : 'border-input'
                  }`}
                />
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                <span>{isLoading ? 'Sending Message...' : 'Send Message'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  )
}
