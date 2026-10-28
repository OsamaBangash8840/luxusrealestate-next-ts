import React, { type ElementType } from 'react'

import { cn } from '@/app/base/utils/utils'

type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h4Light'
  | 'h5'
  | 'h5Light'
  | 'h5Bold'
  | 'bodyRegular'
  | 'bodyMedium'
  | 'bodyBold'
  | 'smallRegular'
  | 'smallMedium'
  | 'smallBold'
  | 'extraSmallRegular'
  | 'extraSmallMedium'
  | 'extraSmallBold'

const tags: Record<Variant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h4Light: 'h4',
  h5: 'h5',
  h5Light: 'h5',
  h5Bold: 'h5',
  bodyRegular: 'p',
  bodyMedium: 'p',
  bodyBold: 'p',
  smallRegular: 'p',
  smallMedium: 'p',
  smallBold: 'p',
  extraSmallRegular: 'span',
  extraSmallMedium: 'span',
  extraSmallBold: 'span',
}

const styles: Record<Variant, string> = {
  h1: 'font-heading text-heading text-3xl md:text-4xl font-bold leading-tight',
  h2: 'font-heading text-heading text-2xl md:text-3xl font-bold leading-tight',
  h3: 'font-heading text-heading text-xl md:text-2xl font-semibold leading-snug',
  h4: 'font-heading text-heading text-lg md:text-xl font-semibold leading-snug',
  h4Light: 'font-heading text-heading text-lg md:text-xl font-normal leading-snug',
  h5: 'font-heading text-heading text-base md:text-lg font-medium leading-normal',
  h5Light: 'font-heading text-heading text-base md:text-lg font-normal leading-normal',
  h5Bold: 'font-heading text-heading text-base md:text-lg font-semibold leading-normal',
  bodyRegular: 'font-body text-body text-sm md:text-base font-normal leading-relaxed',
  bodyMedium: 'font-body text-body text-sm md:text-base font-medium leading-relaxed',
  bodyBold: 'font-body text-body text-sm md:text-base font-semibold leading-relaxed',
  smallRegular: 'font-body text-body text-xs md:text-sm font-normal leading-relaxed',
  smallMedium: 'font-body text-body text-xs md:text-sm font-medium leading-relaxed',
  smallBold: 'font-body text-body text-xs md:text-sm font-semibold leading-relaxed',
  extraSmallRegular: 'font-body text-body text-xs font-normal leading-relaxed',
  extraSmallMedium: 'font-body text-body text-xs font-medium leading-relaxed',
  extraSmallBold: 'font-body text-body text-xs font-semibold leading-relaxed',
}

interface Props {
  variant?: Variant
  children: React.ReactNode
  className?: string
  as?: ElementType
}

export const Typography = ({
  variant = 'bodyRegular',
  children,
  className,
  as,
}: Props): React.ReactElement => {
  const Tag = as ?? tags[variant]
  return <Tag className={cn(styles[variant], className)}>{children}</Tag>
}