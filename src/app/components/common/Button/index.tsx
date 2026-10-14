'use client'

import React, { type ButtonHTMLAttributes } from 'react'
import Link from 'next/link'

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string
  className?: string
  loading?: boolean
  variant?: 'outline' | 'primary' | 'login' | 'services'
  icon?: React.ReactElement
  iconPosition?: 'left' | 'right'
  href?: string
  children?: React.ReactNode
}

export const Button = ({
  title,
  className = '',
  loading = false,
  variant = 'primary',
  icon,
  iconPosition = 'right',
  href,
  children,
  ...rest
}: IButton): React.ReactElement => {
  // Base styles WITHOUT colors or hovers that bleed into variants
  const baseStyles =
    'inline-flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden'

  const variantStyles = {
    outline:
      'text-[14px] bg-white text-primary border-2 border-primary px-6 py-3 rounded-[20px] w-full  hover:bg-primary hover:text-white',
    primary:
      'text-[14px] bg-primary text-white border-2 border-primary px-6 py-3 rounded-[20px] hover:bg-white hover:text-primary',
    login:
      ' text-[14px] text-foreground bg-transparent border-2 border-transparent px-4 py-2 hover:border-primary hover:text-primary rounded-md',
    services:
      ' text-[14px] text-primary border-2 border-primary bg-transparent px-6 py-2 hover:bg-primary hover:text-white rounded-full',
  }

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${className}`

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="text-[1.2em]">{icon}</span>}
      {loading ? 'Loading...' : title}
      {children}
      {icon && iconPosition === 'right' && <span className="text-[1.2em]">{icon}</span>}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    )
  }

  return (
    <button
      className={combinedClasses}
      disabled={loading}
      {...rest}
    >
      {content}
    </button>
  )
}
