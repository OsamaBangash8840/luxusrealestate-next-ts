import { cn } from '@/app/base/utils/utils'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * Global Layout Container
 * Enforces the 1280px max-width 12-column grid system with 24px gutters.
 */
export const Container = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1280px] px-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}
