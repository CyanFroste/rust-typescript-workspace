import { ArrowUpRightFromSquareIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Link } from 'react-router-dom'
import type { LayoutProps } from '#/types'
import { cn } from '#/utils'
import { useState } from 'react'

export type Source = { name: string; url: string; external?: boolean }

type Props = LayoutProps<'trigger' | 'menu'> & { sources: Source[]; use?: (url: string) => void }

export default function Links({ sources, use, className, classes }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn('btn-icon', classes?.trigger, className)}>
        <ArrowUpRightFromSquareIcon />
      </PopoverTrigger>

      <PopoverContent align="center" className={cn('w-44', classes?.menu)}>
        <div className="flex flex-col" onClick={() => setOpen(false)}>
          {sources.map(({ name, url, external }) =>
            external ? (
              <button
                key={name}
                onClick={() => use?.(url)}
                className="flex items-center rounded gap-2 p-2 text-sm outline-none transition-colors hover:bg-base-100">
                {name}
              </button>
            ) : (
              <Link
                key={name}
                to={url}
                className="flex items-center rounded gap-2 p-2 text-sm outline-none transition-colors hover:bg-base-100">
                {name}
              </Link>
            ),
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
