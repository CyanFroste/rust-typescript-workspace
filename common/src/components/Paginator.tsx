import type { LayoutProps } from '#/types'
import { cn } from '#/utils'
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TextCursorInputIcon,
  XIcon,
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

type Props = LayoutProps & {
  page: number
  total?: number
  onChange: (value: number) => void
}

export default function Paginator({ page, total, onChange, className }: Props) {
  const ref = useRef<HTMLInputElement | null>(null)
  const [showEditor, setShowEditor] = useState(false)

  const goto = useCallback(() => {
    setShowEditor(false)
    if (ref.current?.value) {
      const value = +ref.current.value
      if (page === value || value < 1 || (total && value > total)) return
      onChange(value)
    }
  }, [onChange, page, total])

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <button
        className="btn"
        onClick={() => {
          if (page > 1) {
            setShowEditor(false)
            onChange(page - 1)
          }
        }}>
        <ChevronLeftIcon /> Prev
      </button>

      {showEditor ? (
        <div className="w-full flex items-center gap-2">
          <button onClick={goto} className="btn-icon">
            <XIcon />
          </button>

          <input
            ref={ref}
            autoFocus
            defaultValue={page}
            className="input flex items-center gap-2 py-2 px-3 bg-base-100 rounded min-w-16 text-center"
            onKeyUp={({ key }) => {
              if (key === 'Enter') goto()
              else if (key === 'Escape') setShowEditor(false)
            }}
          />

          <button onClick={goto} className="btn-icon">
            <ArrowRightIcon />
          </button>
        </div>
      ) : (
        <button className="w-full shrink btn" onClick={() => setShowEditor(true)}>
          <div className="text-lg w-[1em] mr-auto" />
          {page}
          <TextCursorInputIcon className="ml-auto" />
        </button>
      )}

      <button
        className="btn"
        onClick={() => {
          if (!total || page < total) {
            setShowEditor(false)
            onChange(page + 1)
          }
        }}>
        Next <ChevronRightIcon />
      </button>
    </div>
  )
}
