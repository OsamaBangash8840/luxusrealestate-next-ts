'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  className?: string
  variant?: 'pill' | 'icon'
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'icon',
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={`h-9 w-9 rounded-sm border border-border bg-card/60 animate-pulse ${className}`}
        aria-hidden="true"
      />
    )
  }

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-card hover:bg-muted text-xs font-medium text-foreground transition-all duration-200 shadow-sm ${className}`}
      >
        {isDark ? (
          <>
            <Moon className="h-3.5 w-3.5 text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Dark Mode</span>
          </>
        ) : (
          <>
            <Sun className="h-3.5 w-3.5 text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Light Mode</span>
          </>
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-card hover:bg-muted hover:border-accent/40 text-foreground transition-all duration-200 shadow-sm ${className}`}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-accent transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-foreground/80 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  )
}

