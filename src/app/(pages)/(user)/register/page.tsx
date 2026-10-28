'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShieldCheck, ArrowRight, Lock, Mail, User, Phone, CheckCircle2 } from 'lucide-react'
import { useRegisterMutation } from '@/app/lib/features/auth/register/registerApiSlice'
import { GoogleLoginButton } from '@/app/components/user/googleBtn'
import { toast } from 'react-toastify'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [error, setError] = useState('')

  const [register, { isLoading }] = useRegisterMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !email.trim() || !password || !phone.trim()) {
      setError('All fields are required for private member registration.')
      return
    }

    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        role,
      }).unwrap()

      toast.success('Registration successful. Please verify your email.')
      router.push('/login')
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Registration failed. Please check inputs.'
      setError(msg)
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/" className="inline-block mb-3">
          <span className="font-heading text-3xl font-extrabold tracking-widest text-foreground">
            LUXUS
          </span>
        </Link>
        <div className="inline-flex items-center gap-1.5 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Member Onboarding &bull; Private Accreditation
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Create Member Account
        </h1>
        <p className="text-xs text-body mt-1">
          Apply for accredited access to prime architectural listings and private negotiations.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="p-8 rounded-sm bg-card border border-border shadow-sm">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-sm bg-muted mb-6">
            <Link
              href="/login"
              className="py-2 text-xs font-semibold rounded-sm text-body hover:text-foreground text-center transition-all"
            >
              Sign In
            </Link>
            <button
              type="button"
              className="py-2 text-xs font-semibold rounded-sm bg-card text-foreground shadow-sm transition-all"
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-sm bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Classification */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1.5">
                Accreditation Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`p-3 rounded-sm border text-left transition-all ${
                    role === 'buyer'
                      ? 'border-accent bg-accent/10 ring-1 ring-accent'
                      : 'border-border bg-background hover:border-accent/40'
                  }`}
                >
                  <div className="text-xs font-bold text-foreground">Private Buyer</div>
                  <div className="text-[10px] text-body">HNW Collector / Family Office</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`p-3 rounded-sm border text-left transition-all ${
                    role === 'seller'
                      ? 'border-accent bg-accent/10 ring-1 ring-accent'
                      : 'border-border bg-background hover:border-accent/40'
                  }`}
                >
                  <div className="text-xs font-bold text-foreground">Principal Seller</div>
                  <div className="text-[10px] text-body">Owner / Certified Broker</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1.5">
                Full Name / Legal Entity
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Elena Rostova"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena@geneva-wealth.ch"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1.5">
                Phone Number (Private Dialing)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+41 22 819 3000"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <span>{isLoading ? 'Creating Account...' : 'Complete Private Registration'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-card px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Or Register With
            </span>
          </div>

          {/* Google OAuth Button */}
          <div className="flex justify-center">
            <GoogleLoginButton />
          </div>

          {/* Trust Assurance */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-2 text-[11px] text-body">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
            <span>Secure Directory &bull; Privacy Protected</span>
          </div>
        </div>
      </div>
    </div>
  )
}
