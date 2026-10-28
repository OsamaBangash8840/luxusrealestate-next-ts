'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react'
import { useLoginMutation } from '@/app/lib/features/auth/login/authApiSlice'
import { useAuth } from '@/app/hooks/useAuth'
import { GoogleLoginButton } from '@/app/components/user/googleBtn'
import { Typography } from '@/app/components/common'
import { toast } from 'react-toastify'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTarget = searchParams.get('redirect')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [login, { isLoading }] = useLoginMutation()
  const { login: authenticateUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please provide your email address and password.')
      return
    }

    try {
      const response = await login({
        email: email.trim(),
        password,
      }).unwrap()

      const userObj = (response as any)?.data?.user || (response as any)?.user || response
      const token = (response as any)?.data?.token || (response as any)?.token || null

      // Synchronize centralized auth state and cookies
      authenticateUser(userObj, token)

      toast.success('Welcome back to Luxus')

      if (redirectTarget && redirectTarget.startsWith('/')) {
        router.push(redirectTarget)
      } else if (userObj?.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/properties')
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Authentication failed. Please verify credentials.'
      setError(msg)
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/" className="inline-block mb-3">
          <Typography
            as="span"
            variant="h2"
            className="font-heading text-3xl font-extrabold tracking-widest text-foreground hover:text-accent transition-colors"
          >
            LUXUS
          </Typography>
        </Link>
        <div className="inline-flex items-center gap-1.5 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <Typography
            as="span"
            variant="extraSmallBold"
            className="text-xs font-semibold uppercase tracking-widest text-accent"
          >
            Welcome Back
          </Typography>
        </div>
        <Typography as="h1" variant="h2" className="text-2xl font-bold text-foreground tracking-tight">
          Sign In to Your Account
        </Typography>
        <Typography as="p" variant="smallRegular" className="text-xs text-body mt-1">
          Access your saved properties, messages, and scheduled tours.
        </Typography>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="p-8 rounded-sm bg-card border border-border shadow-sm">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-sm bg-muted mb-6">
            <button
              type="button"
              className="py-2 text-xs font-semibold rounded-sm bg-card text-foreground shadow-sm transition-all"
            >
              Sign In
            </button>
            <Link
              href="/register"
              className="py-2 text-xs font-semibold rounded-sm text-body hover:text-foreground text-center transition-all"
            >
              Register
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-sm bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="principal@familyoffice.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-body">
                  Password
                </label>
                <Link
                  href="/forget-password"
                  className="text-xs text-accent hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Portfolio'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-card px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Or Authenticate Via
            </span>
          </div>

          {/* Google OAuth Button */}
          <div className="flex justify-center">
            <GoogleLoginButton />
          </div>

          {/* Privacy & Trust Assurance */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-2 text-[11px] text-body">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            <span>256-Bit Encrypted Confidential Protocol</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center" />}>
      <LoginForm />
    </Suspense>
  )
}
