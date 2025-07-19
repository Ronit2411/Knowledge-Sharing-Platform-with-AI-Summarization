import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Badge = forwardRef(({ className, variant = 'default', children, ...props }, ref) => {
  const variants = {
    default: 'bg-secondary-100 text-secondary-900',
    secondary: 'bg-secondary-100 text-secondary-900',
    destructive: 'bg-red-100 text-red-900',
    outline: 'border border-secondary-300 text-secondary-700',
    primary: 'bg-primary-100 text-primary-900',
  }

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

export { Badge } 