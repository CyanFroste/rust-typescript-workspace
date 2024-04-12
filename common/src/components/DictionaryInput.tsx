import { isEqual } from 'lodash'
import { CheckIcon, PlusIcon, XIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { Dictionary } from '#/types'

// T extends string | number | boolean
type Props<D extends Dictionary<string>> = {
  values: D
  onChange?: (values: D) => void
}

function defaultValue(): [string, string] {
  return ['', '']
}

function entriesFrom<D extends Dictionary<string>>(data: D) {
  const entries = Object.entries(data)
  if (!entries.length) return [defaultValue()]
  return entries
}

export default function DictionaryInput<D extends Dictionary<string>>({
  values,
  onChange,
}: Props<D>) {
  const [entries, setEntries] = useState(entriesFrom(values))

  useEffect(() => setEntries(entriesFrom(values)), [values])

  const isChanged = useCallback(() => {
    const s = entriesFrom(values)
    if (s.length !== entries.length) return true
    else return !isEqual(s, entries)
  }, [entries, values])

  return (
    <div className="flex flex-col gap-2">
      {entries.map(([key, value], index) => {
        return (
          <div key={index} className="flex flex-col gap-2 py-2 bg-base-100 rounded">
            <div className="flex gap-3 items-center px-3">
              <input
                type="text"
                className="input text-sm"
                placeholder="Enter Key..."
                value={key}
                disabled={!onChange}
                onChange={evt => {
                  const changed = [...entries]
                  changed[index][0] = evt.currentTarget.value
                  setEntries(changed)
                }}
              />

              {onChange && (
                <button
                  onClick={() => {
                    if (entries.length <= 1) return setEntries([defaultValue()])
                    setEntries(entries.filter((_, i) => i !== index))
                  }}
                  className="text-lg shrink-0">
                  <XIcon />
                </button>
              )}
            </div>

            <textarea
              placeholder="Enter Value..."
              className="input resize-none h-12 px-3"
              value={value}
              disabled={!onChange}
              onChange={evt => {
                const changed = [...entries]
                changed[index][1] = evt.currentTarget.value
                setEntries(changed)
              }}
            />
          </div>
        )
      })}

      {onChange && (
        <div className="flex items-center gap-2">
          <button
            className="btn-icon ml-auto"
            onClick={() => setEntries([...entries, defaultValue()])}>
            <PlusIcon />
          </button>

          <button
            className="btn"
            disabled={!isChanged()}
            onClick={() => {
              const filtered = entries.filter(([k, v]) => k.trim() && v.trim())
              // if (!filtered.length) filtered = [defaultValue()]
              onChange?.(Object.fromEntries(filtered) as D)
            }}>
            <CheckIcon /> Done
          </button>
        </div>
      )}
    </div>
  )
}
