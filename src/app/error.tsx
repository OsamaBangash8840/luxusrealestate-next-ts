'use client'

import React, { useEffect } from 'react'
import { ErrorHandler } from '@/app/components/common/ErrorHandler'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled error caught in root boundary:', error)
  }, [error])

  return (
    <ErrorHandler
      error={error}
      reset={reset}
      title="Something Went Wrong"
      description="An error occurred while loading this page. You can return to the home page or try again."
      showHomeButton={true}
      showResetButton={true}
    />
  )
}
