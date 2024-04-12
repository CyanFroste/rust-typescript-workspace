import { cn } from '#/utils'

export default function Spinner({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        'animate-spin rounded-full w-9 h-9 border-4 bg-base-200 border-base-600 border-r-transparent',
        className,
      )}
    />
  )
}
