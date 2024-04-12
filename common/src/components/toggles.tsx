import type { LayoutProps } from '#/types'
import { cn } from '#/utils'
import { CheckCircleIcon, CheckSquareIcon, CircleIcon, SquareIcon } from 'lucide-react'

type CommonProps = LayoutProps & { value?: boolean; onChange: (value: boolean) => void }

export function Checkbox({ value = false, onChange, children, className }: CommonProps) {
  return (
    <label className={cn('btn cursor-pointer', value && 'active', className)}>
      <input
        type="checkbox"
        hidden
        checked={value}
        onChange={evt => onChange(evt.currentTarget.checked)}
      />
      {value ? <CheckSquareIcon /> : <SquareIcon />}
      {children}
    </label>
  )
}

export function Radio({ value = false, onChange, children, className }: CommonProps) {
  return (
    <label className={cn('btn cursor-pointer', value && 'active', className)}>
      <input
        type="radio"
        hidden
        checked={value}
        onChange={evt => onChange(evt.currentTarget.checked)}
      />
      {value ? <CheckCircleIcon /> : <CircleIcon />}
      {children}
    </label>
  )
}
