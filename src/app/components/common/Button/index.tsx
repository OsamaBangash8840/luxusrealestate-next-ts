import React from 'react'
import Link from 'next/link'

import {
  Button as ShadcnButton,
  type ButtonProps as ShadcnButtonProps,
} from '@/app/components/shadcn/button'
import { cn } from '@/app/base/utils/utils'

type ButtonTone = 'brand' | 'success' | 'danger' | 'neutral'

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>,
    Omit<ShadcnButtonProps, 'asChild'> {
  children: React.ReactNode
  className?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  tone?: ButtonTone
}

const toneClasses: Record<ButtonTone, string> = {
  brand: '',
  success: 'bg-success text-success-foreground hover:bg-success/90',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  neutral: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  href,
  type = 'button',
  variant = 'default',
  size = 'default',
  loading = false,
  tone = 'brand',
  disabled = false,
  ...props
}) => {
  const mergedClassName = cn('font-body', toneClasses[tone], className)
  const isDisabled = disabled || loading

  if (href) {
    return (
      <ShadcnButton asChild variant={variant} size={size} className={mergedClassName}>
        <Link href={href}>{children}</Link>
      </ShadcnButton>
    )
  }

  return (
    <ShadcnButton
      type={type}
      variant={variant}
      size={size}
      className={mergedClassName}
      disabled={isDisabled}
      {...props}
    >
      {loading ? 'Please wait...' : children}
    </ShadcnButton>
  )
}