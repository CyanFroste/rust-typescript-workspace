import type { Optional } from '#/types'
import { cn } from '#/utils'
import * as ExternalToast from '@radix-ui/react-toast'
import { XIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { create } from 'zustand'

const LIMIT = 10
const REMOVE_DELAY = 100000

type Store = {
  count: number
  toasts: NonTrivialToast[]
  timeouts: Map<string, ReturnType<typeof setTimeout>>
}

type NonTrivialToast = React.ComponentPropsWithoutRef<typeof Toast> & {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement<typeof ToastAction>
}

type Toast = Pick<NonTrivialToast, 'title' | 'description' | 'action' | 'duration'>

export const useStore = create<Store>(() => ({
  count: 0,
  toasts: [],
  timeouts: new Map(),
}))

function genId() {
  const count = (useStore.getState().count + 1) % Number.MAX_SAFE_INTEGER
  useStore.setState(() => ({ count }))
  return count.toString()
}

const addToRemoveQueue = (id: string) => {
  useStore.setState(state => {
    if (state.timeouts.has(id)) return state

    const timeout = setTimeout(() => {
      state.timeouts.delete(id)
      remove(id)
    }, REMOVE_DELAY)

    state.timeouts.set(id, timeout)
    return state
  })
}

function add(toast: NonTrivialToast) {
  useStore.setState(state => ({ toasts: [toast, ...state.toasts].slice(0, LIMIT) }))
}

function update(toast: Partial<NonTrivialToast>) {
  useStore.setState(state => ({
    toasts: state.toasts.map(t => (t.id === toast.id ? { ...t, ...toast } : t)),
  }))
}

function remove(id?: string) {
  useStore.setState(state => {
    if (!id) return { toasts: [] }
    return { toasts: state.toasts.filter(t => t.id !== id) }
  })
}

export function dismiss(id?: string) {
  if (id) addToRemoveQueue(id)
  else useStore.getState().toasts.forEach(toast => addToRemoveQueue(toast.id))

  useStore.setState(state => {
    return {
      toasts: state.toasts.map(t => (t.id === id || !id ? { ...t, open: false } : t)),
    }
  })
}

export function toast(props: Toast) {
  const id = genId()

  add({
    ...props,
    id,
    open: true,
    onOpenChange: open => {
      if (!open) dismiss(id)
    },
  })

  return {
    id,
    dismiss: () => dismiss(id),
    update: (props: NonTrivialToast) => update({ ...props, id }),
  }
}

export function Toaster() {
  const toasts = useStore(state => state.toasts)

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast key={id} {...props}>
            <div className="flex items-center gap-3">
              <ToastTitle>{title}</ToastTitle>
              <ToastClose />
            </div>
            <ToastDescription>{description}</ToastDescription>
            {action}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

const ToastProvider = ExternalToast.Provider

const ToastViewport = forwardRef<
  React.ElementRef<typeof ExternalToast.Viewport>,
  React.ComponentPropsWithoutRef<typeof ExternalToast.Viewport>
>(({ className, ...props }, ref) => (
  <ExternalToast.Viewport
    ref={ref}
    {...props}
    className={cn(
      'fixed bottom-0 right-0 top-auto max-w-[420px] z-[100] max-h-screen w-full gap-3 flex flex-col-reverse p-3 pointer-events-none',
      className,
    )}
  />
))

const Toast = forwardRef<
  React.ElementRef<typeof ExternalToast.Root>,
  React.ComponentPropsWithoutRef<typeof ExternalToast.Root>
>(({ className, ...props }, ref) => {
  return (
    <ExternalToast.Root
      ref={ref}
      {...props}
      className={cn(
        'group pointer-events-auto relative shrink-0 flex flex-col w-full overflow-hidden rounded border-2 p-3 transition-all bg-base-50 text-base-900',
        'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
        'data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80',
        'data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
        className,
      )}
    />
  )
})

export const ToastAction = forwardRef<
  React.ElementRef<typeof ExternalToast.Action>,
  Optional<React.ComponentPropsWithoutRef<typeof ExternalToast.Action>, 'altText'>
>(({ className, ...props }, ref) => (
  <ExternalToast.Action
    ref={ref}
    {...props}
    altText="toast action"
    className={cn('text-sm btn mt-3 ml-auto', className)}
  />
))

const ToastClose = forwardRef<
  React.ElementRef<typeof ExternalToast.Close>,
  React.ComponentPropsWithoutRef<typeof ExternalToast.Close>
>(({ className, ...props }, ref) => (
  <ExternalToast.Close
    ref={ref}
    {...props}
    toast-close=""
    className={cn('btn-icon ml-auto', className)}>
    <XIcon />
  </ExternalToast.Close>
))

const ToastTitle = forwardRef<
  React.ElementRef<typeof ExternalToast.Title>,
  React.ComponentPropsWithoutRef<typeof ExternalToast.Title>
>(({ className, ...props }, ref) => (
  <ExternalToast.Title ref={ref} {...props} className={cn(className)} />
))

const ToastDescription = forwardRef<
  React.ElementRef<typeof ExternalToast.Description>,
  React.ComponentPropsWithoutRef<typeof ExternalToast.Description>
>(({ className, ...props }, ref) => (
  <ExternalToast.Description
    ref={ref}
    {...props}
    className={cn('text-sm text-base-600', className)}
  />
))
