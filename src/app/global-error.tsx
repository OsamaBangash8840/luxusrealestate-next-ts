'use client'

import React, { useEffect } from 'react'
import { ErrorHandler } from '@/app/components/common'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Critical global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen flex items-center justify-center font-body">
        <ErrorHandler
          error={error}
          reset={reset}
          title="Critical System Error"
          description="A critical failure interrupted the application core. Please return to the home page or retry."
          showHomeButton={true}
          showResetButton={true}
        />
      </body>
    </html>
  )
}
