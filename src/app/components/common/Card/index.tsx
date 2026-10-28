'use client'

import React from 'react'

import { cn } from '@/app/base/utils/utils'
import { Card, CardContent } from '../../shadcn/card'

interface CardProps {
  className?: string
  contentClassName?: string
  children?: React.ReactNode
  onClick?: () => void
}

export const Cards: React.FC<CardProps> = ({
  className,
  contentClassName,
  children,
  onClick,
}) => {
  return (
    <Card className={cn('bg-card text-card-foreground border-border', className)}>
      <CardContent className={contentClassName} onClick={onClick}>
        {children}
      </CardContent>
    </Card>
  )
}