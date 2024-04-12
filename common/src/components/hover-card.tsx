import { cn } from '#/utils'
import * as ExternalHoverCard from '@radix-ui/react-hover-card'
import { forwardRef } from 'react'

export const HoverCard = ExternalHoverCard.Root

export const HoverCardTrigger = ExternalHoverCard.Trigger

export const HoverCardPortal = ExternalHoverCard.Portal

export const HoverCardContent = forwardRef<
  React.ElementRef<typeof ExternalHoverCard.Content>,
  React.ComponentPropsWithoutRef<typeof ExternalHoverCard.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <ExternalHoverCard.Content
    ref={ref}
    {...props}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'z-50 w-64 rounded border-2 bg-base-50 p-3 outline-none',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
  />
))
