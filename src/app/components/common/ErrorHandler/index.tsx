'use client'

import React from 'react'
import { AlertTriangle, Home, RefreshCw, ShieldAlert, ArrowLeft } from 'lucide-react'
import { Typography, Container, Button } from '@/app/components/common'

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
  const [countdown, setCountdown] = React.useState<number | null>(
    autoRedirectSeconds && autoRedirectSeconds > 0 ? autoRedirectSeconds : null
  )

  React.useEffect(() => {
    if (countdown === null) return
    if (countdown <= 0) {
      if (typeof window !== 'undefined') {
        window.location.assign('/')
      }
      return
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  return (
    <div className="flex min-h-[65vh] items-center justify-center bg-background px-4 py-16">
      <Container className="max-w-2xl text-center">
        {/* Error Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-1.5 shadow-sm">
          <ShieldAlert className="h-4 w-4 text-destructive" />
          <Typography
            as="span"
            variant="extraSmallBold"
            className="font-mono uppercase tracking-widest text-destructive"
          >
            System Exception &bull; Code {error?.digest ? error.digest.slice(0, 8) : '500'}
          </Typography>
        </div>

        {/* Headline using Typography component */}
        <Typography
          as="h1"
          variant="h1"
          className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
        >
          {title}
        </Typography>

        {/* Description using Typography */}
        <Typography
          as="p"
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
                <Typography
                  as="span"
                  variant="extraSmallBold"
                  className="font-mono uppercase tracking-wider text-accent"
                >
                  Diagnostics
                </Typography>
                <Typography
                  as="p"
                  variant="smallRegular"
                  className="font-mono text-xs text-muted-foreground break-words line-clamp-3"
                >
                  {error.message}
                </Typography>
              </div>
            </div>
          </div>
        )}

        {/* Countdown notice if enabled */}
        {countdown !== null && countdown > 0 && (
          <Typography
            as="p"
            variant="smallRegular"
            className="mb-6 text-xs text-muted-foreground font-mono"
          >
            Redirecting to home in {countdown}s...
          </Typography>
        )}

        {/* Action Controls using shared Button & Typography */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {showHomeButton && (
            <Button href="/" variant="default" className="gap-2 px-6 py-3">
              <Home className="h-4 w-4" />
              <Typography as="span" variant="smallBold" className="text-primary-foreground">
                Back to Home
              </Typography>
            </Button>
          )}

          {showResetButton && reset && (
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              className="gap-2 px-6 py-3 bg-card text-foreground border-border hover:bg-muted"
            >
              <RefreshCw className="h-4 w-4 text-accent" />
              <Typography as="span" variant="smallBold" className="text-foreground">
                Retry Operation
              </Typography>
            </Button>
          )}

          <Button
            href="/properties"
            variant="ghost"
            className="gap-2 px-4 py-3 text-body hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <Typography as="span" variant="smallBold">
              Browse Active Estates
            </Typography>
          </Button>
        </div>
      </Container>
    </div>
  )
}
