import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { useState } from 'react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { cn } from '#/utils'
import type { Classes } from '#/types'

export const SelectTrigger = PopoverTrigger

export const SelectOption = CommandItem

type Value = NonNullable<unknown>

export type TriggerProps<T extends Value> = {
  values: T[]
  open: boolean
  className?: string
  label?: string
}

export type OptionProps<T extends Value> = {
  item: T
  values: T[]
  onChange: (values?: T[]) => void
  selected: boolean
  stringified: string
  className?: string
}

type Props<T extends Value> = {
  label?: string
  values: T[]
  options: T[]
  onChange: (values: T[]) => void
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

function DefaultTrigger<T extends Value>({
  values,
  open,
  className,
  label = 'Select',
}: TriggerProps<T>) {
  return (
    <SelectTrigger className={cn('w-64 btn gap-3', open && 'active', className)}>
      {label}
      <div className="flex items-center ml-auto gap-2">
        {values.length > 0 && `[ ${values.length} ]`}
        <ChevronDownIcon className="shrink-0" />
      </div>
    </SelectTrigger>
  )
}

function DefaultOption<T extends Value>({
  onChange,
  className,
  stringified,
  selected,
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

export default function MultiSelect<T extends Value>({
  values,
  onChange,
  options,
  label,
  classes,
  use,
  container,
  filter,
  onSearch,
}: Props<T>) {
  const [open, setOpen] = useState(false)

  const Trigger = use?.Trigger ?? DefaultTrigger
  const Option = use?.Option ?? DefaultOption
  const stringify = use?.stringify ?? (it => it.toString())

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Trigger values={values} open={open} className={classes?.trigger} label={label} />

      <PopoverContent className={cn('w-64 p-0', classes?.menu)} container={container}>
        <Command filter={filter} shouldFilter={!onSearch}>
          <div className="p-3">
            <CommandInput onValueChange={onSearch} />
          </div>

          <CommandList className="px-3 pb-3">
            <CommandEmpty />

            {options.map(item => {
              const stringified = stringify(item)
              const selected = values.some(v => stringified === stringify(v))

              return (
                <Option
                  key={stringify(item)}
                  stringified={stringified}
                  item={item}
                  values={values}
                  className={classes?.option}
                  selected={selected}
                  onChange={v => {
                    if (v) onChange(v)
                    else if (selected) onChange(values.filter(v => v !== item))
                    else onChange([...values, item])
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
