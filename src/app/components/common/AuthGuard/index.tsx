'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'
import { Container, Skeleton, Typography } from '@/app/components/common'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'seller' | 'buyer'
  fallback?: React.ReactNode
}

export const AuthGuard = ({
  children,
  requiredRole,
  fallback,
}: AuthGuardProps): React.ReactElement | null => {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, role, isAdmin, isSeller } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`
      router.replace(redirectUrl)
    }
  }, [isLoading, isAuthenticated, pathname, router])

  // Loading state with architectural shimmer
  if (isLoading) {
    return (
      fallback ? <>{fallback}</> : (
        <div className="min-h-[70vh] bg-background py-12">
          <Container className="space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-28" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
          </Container>
        </div>
      )
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Role validation
  if (requiredRole === 'admin' && !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-md p-8 rounded-sm bg-card border border-border shadow-sm text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <Typography as="h2" variant="h3" className="text-xl font-bold text-foreground mb-2">
            Admin Access Required
          </Typography>
          <Typography as="p" variant="smallRegular" className="text-xs text-body mb-6">
            You need administrator permissions to view this page.
          </Typography>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (requiredRole === 'seller' && !isSeller) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-md p-8 rounded-sm bg-card border border-border shadow-sm text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent mb-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <Typography as="h2" variant="h3" className="text-xl font-bold text-foreground mb-2">
            Seller Account Required
          </Typography>
          <Typography as="p" variant="smallRegular" className="text-xs text-body mb-6">
            You must be registered as a seller to list and manage properties.
          </Typography>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default AuthGuard
