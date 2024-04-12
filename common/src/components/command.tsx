import { cn } from '#/utils'
import { Command as ExternalCommand } from 'cmdk'
import { SearchIcon } from 'lucide-react'
import { forwardRef } from 'react'

export const Command = forwardRef<
  React.ElementRef<typeof ExternalCommand>,
  React.ComponentPropsWithoutRef<typeof ExternalCommand>
>(({ className, ...props }, ref) => (
  <ExternalCommand
    ref={ref}
    {...props}
    className={cn('flex h-full w-full flex-col overflow-hidden', className)}
  />
))

export const CommandList = forwardRef<
  React.ElementRef<typeof ExternalCommand.List>,
  React.ComponentPropsWithoutRef<typeof ExternalCommand.List>
>(({ className, ...props }, ref) => (
  <ExternalCommand.List
    ref={ref}
    {...props}
    className={cn('max-h-80 overflow-y-auto', className)}
  />
))

export const CommandInput = forwardRef<
  React.ElementRef<typeof ExternalCommand.Input>,
  React.ComponentPropsWithoutRef<typeof ExternalCommand.Input>
>(({ className, placeholder = 'Search...', ...props }, ref) => (
  <div className="flex items-center gap-2 py-2 px-3 bg-base-100 rounded" cmdk-input-wrapper="">
    <SearchIcon className="text-lg shrink-0 text-base-600" />
    <ExternalCommand.Input
      ref={ref}
      {...props}
      placeholder={placeholder}
      className={cn('input', className)}
    />
  </div>
))

export const CommandItem = forwardRef<
  React.ElementRef<typeof ExternalCommand.Item>,
  React.ComponentPropsWithoutRef<typeof ExternalCommand.Item>
>(({ className, ...props }, ref) => (
  <ExternalCommand.Item
    ref={ref}
    {...props}
    className={cn(
      'relative flex select-none items-center rounded gap-2 py-2 px-3 outline-none cursor-pointer transition-colors',
      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 aria-selected:bg-base-100',
      className,
    )}
  />
))

export const CommandEmpty = forwardRef<
  React.ElementRef<typeof ExternalCommand.Empty>,
  React.ComponentPropsWithoutRef<typeof ExternalCommand.Empty>
>((props, ref) => <ExternalCommand.Empty ref={ref} {...props} className="h-14 bg-stripes" />)
