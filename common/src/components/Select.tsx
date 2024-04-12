import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { useEffect, useState } from 'react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { cn } from '#/utils'
import type { Classes } from '#/types'

export const SelectTrigger = PopoverTrigger

export const SelectOption = CommandItem

type Value = NonNullable<unknown>

export type TriggerProps<T extends Value> = {
  value: T
  open: boolean
  stringified: string
  className?: string
}

export type OptionProps<T extends Value> = {
  item: T
  value: T
  onChange: (value?: T) => void
  stringified: string
  selected: boolean
  className?: string
}

export type Props<T extends Value> = {
  value: T
  onChange: (value: T) => void
  options: T[]
  classes?: Classes<'trigger' | 'option' | 'menu'>
  container?: HTMLElement
  use?: {
    stringify: (value: T) => string
    Trigger?: (props: TriggerProps<T>) => React.ReactNode
    Option?: (props: OptionProps<T>) => React.ReactNode
  }
  filter?: (value: string, search: string) => number
  onSearch?: (search: string) => void
}

function DefaultTrigger<T extends Value>({ open, stringified, className }: TriggerProps<T>) {
  return (
    <SelectTrigger className={cn('w-64 btn gap-3 capitalize', open && 'active', className)}>
      {stringified}
      <ChevronDownIcon className="shrink-0 ml-auto" />
    </SelectTrigger>
  )
}

function DefaultOption<T extends Value>({
  onChange,
  stringified,
  selected,
  className,
}: OptionProps<T>) {
  return (
    <SelectOption
      value={stringified}
      className={cn('capitalize', className)}
      onSelect={() => onChange()}>
      {stringified} {selected && <CheckIcon className="text-lg ml-auto" />}
    </SelectOption>
  )
}

export default function Select<T extends Value>({
  value,
  onChange,
  options,
  classes,
  use,
  container,
  filter,
  onSearch,
}: Props<T>) {
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [value])

  const Trigger = use?.Trigger ?? DefaultTrigger
  const Option = use?.Option ?? DefaultOption
  const stringify = use?.stringify ?? (it => it.toString())

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Trigger
        value={value}
        open={open}
        stringified={stringify(value)}
        className={classes?.trigger}
      />

      <PopoverContent className={cn('w-64 p-0', classes?.menu)} container={container}>
        <Command filter={filter} shouldFilter={!onSearch}>
          <div className="p-3">
            <CommandInput onValueChange={onSearch} />
          </div>

          <CommandList className="px-3 pb-3">
            <CommandEmpty />

            {options.map(item => {
              const stringified = stringify(item)
              const selected = stringified === stringify(value)

              return (
                <Option
                  key={stringified}
                  stringified={stringified}
                  item={item}
                  value={value}
                  selected={selected}
                  className={classes?.option}
                  onChange={v => {
                    if (v) onChange(v)
                    else if (!selected) onChange(item)
                  }}
                />
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
