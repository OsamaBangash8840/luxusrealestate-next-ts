'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, Home, RefreshCw, ShieldAlert, ArrowLeft } from 'lucide-react'
import { Typography, Container } from '@/app/components/common'

export interface ErrorHandlerProps {
  error?: Error & { digest?: string }
  reset?: () => void
  title?: string
  description?: string
  showHomeButton?: boolean
  showResetButton?: boolean
  autoRedirectSeconds?: number
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  error,
  reset,
  title = 'Something Went Wrong',
  description = 'An unexpected error occurred while loading this page. Please try again or return to the home page.',
  showHomeButton = true,
  showResetButton = true,
  autoRedirectSeconds,
}) => {
  const router = useRouter()
  const [countdown, setCountdown] = React.useState<number | null>(
    autoRedirectSeconds && autoRedirectSeconds > 0 ? autoRedirectSeconds : null
  )

  React.useEffect(() => {
    if (countdown === null) return
    if (countdown <= 0) {
      router.push('/')
      return
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)
    return () => clearTimeout(timer)
  }, [countdown, router])

  const handleBackToHome = () => {
    router.push('/')
  }

  return (
    <div className="flex min-h-[65vh] items-center justify-center bg-background px-4 py-16">
      <Container className="max-w-2xl text-center">
        {/* Error Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-1.5 shadow-sm">
          <ShieldAlert className="h-4 w-4 text-destructive" />
          <Typography
            variant="extraSmallBold"
            className="font-mono uppercase tracking-widest text-destructive"
          >
            System Exception &bull; Code {error?.digest ? error.digest.slice(0, 8) : '500'}
          </Typography>
        </div>

        {/* Headline using Typography component */}
        <Typography
          variant="h1"
          className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
        >
          {title}
        </Typography>

        {/* Description using Typography */}
        <Typography
          variant="bodyRegular"
          className="mx-auto mb-8 max-w-xl text-base text-body leading-relaxed sm:text-lg"
        >
          {description}
        </Typography>

        {/* Technical Error Details (Discreet) */}
        {error?.message && (
          <div className="mx-auto mb-8 max-w-md rounded-md border border-border bg-card p-4 text-left shadow-sm">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
              <div className="space-y-1 overflow-hidden">
                <Typography variant="extraSmallBold" className="font-mono uppercase tracking-wider text-accent">
                  Diagnostics
                </Typography>
                <Typography variant="smallRegular" className="font-mono text-xs text-muted-foreground break-words line-clamp-3">
                  {error.message}
                </Typography>
              </div>
            </div>
          </div>
        )}

        {/* Countdown notice if enabled */}
        {countdown !== null && countdown > 0 && (
          <Typography variant="smallRegular" className="mb-6 text-xs text-muted-foreground font-mono">
            Redirecting to home in {countdown}s...
          </Typography>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {showHomeButton && (
            <button
              type="button"
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          )}

          {showResetButton && reset && (
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <RefreshCw className="h-4 w-4 text-accent" />
              <span>Retry Operation</span>
            </button>
          )}

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-sm border border-transparent px-4 py-3 text-sm font-semibold text-body hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Active Estates</span>
          </Link>
        </div>
      </Container>
    </div>
  )
}
