import Image from '#/components/Image'
import type { Classes, Medium } from '#/types'
import { cn } from '#/utils'
import { request } from '#/utils/http'
import {
  CheckIcon,
  CheckSquareIcon,
  ImageIcon,
  PencilIcon,
  SquareIcon,
  TextIcon,
} from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './dialog'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

type Props = {
  data: Medium[]
  onChange?: (values: Medium[]) => void
  classes?: Classes<'trigger'>
}

export default function MediaSelect({ data, onChange, classes }: Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(data)

  useEffect(() => setSelected(data), [data])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn('grid grid-cols-3 gap-2 w-full group', classes?.trigger)}>
        {data.slice(0, 5).map(it => (
          <Fragment key={it.url}>
            {it.type === 'video' && <video className="w-full h-32" autoPlay muted src={it.url} />}
            {it.type === 'image' && (
              <Image
                use={request}
                className="w-full h-32"
                sources={[{ url: it.url }, { url: it.url, async: true }]}
              />
            )}
          </Fragment>
        ))}

        <div
          className="w-full h-32 flex gap-2 flex-col items-center justify-center rounded-none 
          bg-base-100 group-hover:bg-base-900 group-hover:text-base-50 transition-colors">
          {data.length > 5 && `[ +${data.length - 5} ]`}
          {onChange && <PencilIcon className="text-xl" />}
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-screen-2xl h-[60rem] overflow-auto flex flex-col p-0">
        <div className="action-bar">
          <div className="text-2xl">Media</div>
          <div>[ {data.length} ]</div>

          {onChange && (
            <>
              <button
                className="btn ml-auto text-sm"
                onClick={() => setSelected(selected.length > 0 ? [] : data)}>
                {selected.length > 0 ? <CheckSquareIcon /> : <SquareIcon />}
                {selected.length > 0 ? 'Deselect' : 'Select'} All
              </button>

              <button
                className="btn"
                onClick={() => {
                  onChange(selected)
                  setOpen(false)
                }}>
                <CheckIcon /> Done [ {selected.length} ]
              </button>
            </>
          )}
        </div>

        <div className="overflow-auto px-3 pb-3">
          <div className="grid grid-cols-4 gap-6 w-full">
            {data.map((it, index) => {
              if (!onChange) return <Card key={it.url} index={index} data={it} />

              const isSelected = selected.some(s => s.url === it.url)

              return (
                <Card
                  key={it.url}
                  index={index}
                  data={it}
                  selected={isSelected}
                  onSelect={() => {
                    if (isSelected) setSelected(selected.filter(s => s.url !== it.url))
                    else setSelected(selected.concat(it))
                  }}
                />
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

type CardProps = { data: Medium; index: number; selected?: boolean; onSelect?: () => void }

function Card({ data, index, selected, onSelect }: CardProps) {
  return (
    <div className="flex flex-col gap-2 rounded">
      {data.type === 'video' && <video className="w-full h-56" controls muted src={data.url} />}
      {data.type === 'image' && (
        <Image
          use={request}
          onClick={onSelect}
          className="w-full h-56"
          sources={[{ url: data.url }, { url: data.url, async: true }]}
        />
      )}

      <div className="flex items-center gap-2">
        <div className="chip w-10 justify-center">{index + 1}</div>

        <div className="capitalize chip">
          <ImageIcon /> {data.type}
        </div>

        <Popover>
          <PopoverTrigger className="btn-icon">
            <TextIcon />
          </PopoverTrigger>

          <PopoverContent avoidCollisions className="rounded p-0 h-48 w-72">
            <div className="h-full w-full p-3 overflow-auto text-sm break-all">
              <div className="text-base-600 mb-2">{data.name || '[ no name ]'}</div>
              <div>{data.url}</div>
            </div>
          </PopoverContent>
        </Popover>

        {selected && <CheckIcon className="text-lg shrink-0 ml-auto" />}
      </div>
    </div>
  )
}
