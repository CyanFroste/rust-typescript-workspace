import { cn } from '#/utils'
import * as ExternalPopover from '@radix-ui/react-popover'
import { forwardRef } from 'react'

export const Popover = ExternalPopover.Root

export const PopoverTrigger = ExternalPopover.Trigger

export const PopoverAnchor = ExternalPopover.Anchor

export const PopoverContent = forwardRef<
  React.ElementRef<typeof ExternalPopover.Content>,
  React.ComponentPropsWithoutRef<typeof ExternalPopover.Content> & { container?: HTMLElement }
>(({ className, align = 'center', sideOffset = 6, container, ...props }, ref) => (
  <ExternalPopover.Portal container={container}>
    <ExternalPopover.Content
      ref={ref}
      {...props}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-60 rounded p-3 bg-base-50 text-base-900 outline-none border-2',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
    />
  </ExternalPopover.Portal>
))
