import * as ExternalDialog from '@radix-ui/react-dialog'
import { cn } from '#/utils'
import { forwardRef } from 'react'

export const Dialog = ExternalDialog.Root

export const DialogTrigger = ExternalDialog.Trigger

export const DialogPortal = ExternalDialog.Portal

export const DialogClose = ExternalDialog.Close

export const DialogOverlay = forwardRef<
  React.ElementRef<typeof ExternalDialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof ExternalDialog.Overlay>
>(({ className, ...props }, ref) => (
  <ExternalDialog.Overlay
    ref={ref}
    {...props}
    className={cn(
      'fixed inset-0 z-50 bg-base-900/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
  />
))

DialogOverlay.displayName = 'DialogOverlay'

export const DialogContent = forwardRef<
  React.ElementRef<typeof ExternalDialog.Content>,
  React.ComponentPropsWithoutRef<typeof ExternalDialog.Content> & { container?: HTMLElement }
>(({ className, children, container, ...props }, ref) => (
  <DialogPortal container={container}>
    <DialogOverlay />
    <ExternalDialog.Content
      ref={ref}
      {...props}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 rounded w-full max-w-screen-xl -translate-x-1/2 -translate-y-1/2 bg-base-50 p-3 duration-200',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2',
        className,
      )}>
      {children}
    </ExternalDialog.Content>
  </DialogPortal>
))

DialogContent.displayName = 'DialogContent'
