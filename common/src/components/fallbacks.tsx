import type { LayoutProps } from '#/types'
import { cn } from '#/utils'
import { AlertCircleIcon, RotateCwIcon } from 'lucide-react'
import { useMemo } from 'react'
import Spinner from './Spinner'

type ErrorFallbackProps = LayoutProps & {
  error?: Error
  resetErrorBoundary?: () => void
  onReset?: () => void
}

export function ErrorFallback({
  error,
  className,
  resetErrorBoundary,
  onReset,
}: ErrorFallbackProps) {
  const onRetry = useMemo(() => resetErrorBoundary ?? onReset, [onReset, resetErrorBoundary])

  return (
    <div className={cn('w-full h-full @container', className)}>
      <div className="bg-stripes p-6 w-full h-full overflow-auto">
        <div className="flex flex-col bg-base-50 @[14rem]:py-6 h-full items-center justify-center overflow-auto">
          <div className="text-red-500 leading-none flex items-center gap-2 @sm:text-lg">
            <AlertCircleIcon className="text-lg" /> Error
          </div>

          <div className="whitespace-pre-wrap break-all overflow-auto text-sm @sm:text-base hidden @[14rem]:block mt-3 px-6">
            {error?.message || error?.stack || 'Something went wrong'}
          </div>

          {onRetry && (
            <>
              <button className="btn-icon mt-3 @sm:hidden" onClick={onRetry}>
                <RotateCwIcon />
              </button>
              <button className="btn mt-6 hidden @sm:flex" onClick={onRetry}>
                <RotateCwIcon /> Retry
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function LoadingFallback({ className, classes }: LayoutProps<'container' | 'spinner'>) {
  return (
    <div
      className={cn(
        'grid place-items-center w-full h-full @container',
        classes?.container,
        className,
      )}>
      <Spinner
        className={cn('h-7 w-7 @[12rem]:h-8 @[12rem]:w-8 @sm:h-9 @sm:w-9', classes?.spinner)}
      />
    </div>
  )
}
