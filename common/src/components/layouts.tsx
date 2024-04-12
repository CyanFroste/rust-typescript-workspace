import type { LayoutProps } from '#/types'
import { cn } from '#/utils'
import { forwardRef } from 'react'

export const GridContainer = forwardRef<HTMLDivElement, LayoutProps<'main' | 'grid'>>(
  ({ children, className, classes }, ref) => (
    <div
      ref={ref}
      className={cn('@container h-full w-full overflow-auto', classes?.main, className)}>
      <div
        className={cn(
          'grid grid-cols-4 @[120rem]:grid-cols-5 @[140rem]:grid-cols-6 gap-6',
          classes?.grid,
        )}>
        {children}
      </div>
    </div>
  ),
)
