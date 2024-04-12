import MultiSelect, { SelectOption, type OptionProps } from '#/components/MultiSelect'
import type { GetItemsFn, WithId } from '#/types/db'
import type { Tag } from '#/types/tags'
import { useTagsQuery } from '#/utils/tags'
import { CheckIcon } from 'lucide-react'
import { useMemo } from 'react'

type Props = {
  use: GetItemsFn<Tag>
  container?: HTMLElement
} & (
  | { by?: null; values: WithId<Tag>[]; onChange: (values: WithId<Tag>[]) => void }
  | { by: 'name'; values: string[]; onChange: (values: string[]) => void }
)

function Option({ item, selected, onChange }: OptionProps<WithId<Tag>>) {
  return (
    <SelectOption value={item.name} className="gap-3 break-all" onSelect={() => onChange()}>
      <div className="w-10 h-10 shrink-0 bg-stripes">
        {item.thumbnail && <img src={item.thumbnail} className="w-full h-full object-cover" />}
      </div>

      {item.name}

      {selected && <CheckIcon className="text-lg shrink-0 ml-auto" />}
    </SelectOption>
  )
}

export default function TagMultiSelect({ values, onChange, container, use, by }: Props) {
  const queryTags = useTagsQuery({ use, params: {} })

  const { selected, options } = useMemo(() => {
    const options = queryTags.data ?? []

    const selected = by
      ? options.filter(it => values.some(v => v === it[by]))
      : options.filter(it => values.some(v => v.name === it.name))

    return { options, selected }
  }, [by, queryTags.data, values])

  return (
    <MultiSelect
      values={selected}
      options={options}
      container={container}
      onChange={v => {
        if (by) return onChange(v.map(it => it[by]))
        onChange(v)
      }}
      classes={{ menu: 'w-96' }}
      use={{ Option, stringify: item => item.name }}
    />
  )
}
