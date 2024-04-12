import DictionaryInput from '#/components/DictionaryInput'
import TagMultiSelect from '#/components/tags/TagMultiSelect'
import { ErrorFallback, LoadingFallback } from '#/components/fallbacks'
import { ToastAction, toast } from '#/components/toast'
import { useState } from 'react'
import Select from '#/components/Select'
import { downloadAndSaveFile, getDbItems } from '@/commands'
import type { Tag } from '#/types/tags'
import type { WithId } from '#/types/db'
import type { Medium } from '#/types'
import MediaSelect from '#/components/MediaView'

const NOOP = () => {}

export default function TestScreen() {
  return (
    <div className="screen overflow-auto">
      <div className="p-3 flex flex-col gap-6">
        <FileTests />
        <SelectTests />
        <ToastTests />
        <DictionaryInputTests />
        <ErrorFallbackTests />
        <LoadingFallbackTests />
      </div>
    </div>
  )
}

function FileTests() {
  return (
    <>
      <div className="text-xl">Files</div>

      <div className="flex items-center gap-6">
        <button
          className="btn"
          onClick={() =>
            downloadAndSaveFile(
              'https://th.bing.com/th?&id=OVP.JsVY-ClRZl4lltf-PZD7jwHgFo&w=320&h=180&c=7&pid=1.7&rs=1',
              '../../test.jpg',
            )
          }>
          Download and Save
        </button>
      </div>
    </>
  )
}

function SelectTests() {
  const [tags, setTags] = useState<WithId<Tag>[]>([])
  const [tagNames, setTagNames] = useState<string[]>([])
  const [name, setName] = useState('name')

  const [media, setMedia] = useState<Medium[]>(
    Array.from({ length: 20 }).map((_, i) => ({
      type: 'image',
      url: `https://picsum.photos/300?random=${i + 1}`,
      name: 'Random ' + i + 1,
    })),
  )

  return (
    <>
      <div className="text-xl">Selects</div>

      <div className="flex items-center gap-6">
        <TagMultiSelect by="name" values={tagNames} onChange={setTagNames} use={getDbItems} />

        <TagMultiSelect values={tags} onChange={setTags} use={getDbItems} />

        <Select value={name} onChange={setName} options={['cyan', 'hybrid', 'batman', 'reaper']} />

        <MediaSelect data={media} onChange={setMedia} classes={{ trigger: 'w-[40rem]' }} />

        <MediaSelect data={media} classes={{ trigger: 'w-[40rem]' }} />
      </div>
    </>
  )
}

function ToastTests() {
  return (
    <>
      <div className="text-xl">Toasts</div>

      <div>
        <button
          className="btn"
          onClick={() => {
            toast({
              title: 'Toast',
              description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum dolor ut consequatur optio possimus repudiandae ratione tempora necessitatibus eaque? Ipsam ipsa iusto magnam error enim nulla temporibus veniam nemo at?',
              duration: 10000,
            })

            toast({
              title: 'Toast',
              description: 'lorem ipsum shit',
              duration: 10000,
              action: <ToastAction>Action</ToastAction>,
            })
          }}>
          Show Toast
        </button>
      </div>
    </>
  )
}

function DictionaryInputTests() {
  const [values1, setValues1] = useState({
    name: 'cyan',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non cum a qui. Saepe eum minus aspernatur magnam assumenda, suscipit ad?',
  })

  const [values2, setValues2] = useState({})

  return (
    <>
      <div className="text-xl">Dictionary Inputs</div>

      <div className="flex gap-6">
        <div className="w-[500px]">
          <DictionaryInput values={values1} onChange={setValues1} />
        </div>

        <div className="w-[500px]">
          <DictionaryInput values={values2} onChange={setValues2} />
        </div>
      </div>
    </>
  )
}

function ErrorFallbackTests() {
  const error = new Error(
    'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio sunt expedita unde quasi voluptatum a perspiciatis, amet accusantium adipisci aperiam labore fugiat dignissimos minus omnis praesentium excepturi mollitia ea! Id?',
  )

  return (
    <>
      <div className="text-xl">Error Fallbacks</div>

      <div className="flex gap-3 flex-wrap">
        <div className="w-[600px] h-[600px] bg-base-100">
          <ErrorFallback error={error} onReset={NOOP} />
        </div>

        <div className="w-[400px] h-[400px] bg-base-100">
          <ErrorFallback error={error} onReset={NOOP} />
        </div>

        <div className="w-80 h-80 bg-base-100">
          <ErrorFallback error={error} onReset={NOOP} />
        </div>

        <div className="w-60 h-60 bg-base-100">
          <ErrorFallback error={error} onReset={NOOP} />
        </div>

        <div className="w-56 h-56 bg-base-100">
          <ErrorFallback error={error} onReset={NOOP} />
        </div>

        <div className="h-52 w-52 bg-base-100">
          <ErrorFallback error={error} onReset={NOOP} />
        </div>

        <div className="h-40 w-40 bg-base-100">
          <ErrorFallback error={error} onReset={NOOP} />
        </div>
      </div>

      <div className="text-xl">Error Fallbacks [ No Reset ]</div>

      <div className="flex gap-3 flex-wrap">
        <div className="w-[600px] h-[600px] bg-base-100">
          <ErrorFallback error={error} />
        </div>

        <div className="w-[400px] h-[400px] bg-base-100">
          <ErrorFallback error={error} />
        </div>

        <div className="w-80 h-80 bg-base-100">
          <ErrorFallback error={error} />
        </div>

        <div className="w-60 h-60 bg-base-100">
          <ErrorFallback error={error} />
        </div>

        <div className="w-56 h-56 bg-base-100">
          <ErrorFallback error={error} />
        </div>

        <div className="h-52 w-52 bg-base-100">
          <ErrorFallback error={error} />
        </div>

        <div className="h-40 w-40 bg-base-100">
          <ErrorFallback error={error} />
        </div>
      </div>
    </>
  )
}

function LoadingFallbackTests() {
  return (
    <>
      <div className="text-xl">Loading Fallbacks</div>

      <div className="flex gap-3 flex-wrap">
        <div className="w-[600px] h-[600px] bg-base-100">
          <LoadingFallback />
        </div>

        <div className="w-[400px] h-[400px] bg-base-100">
          <LoadingFallback />
        </div>

        <div className="w-80 h-80 bg-base-100">
          <LoadingFallback />
        </div>

        <div className="w-60 h-60 bg-base-100">
          <LoadingFallback />
        </div>

        <div className="w-56 h-56 bg-base-100">
          <LoadingFallback />
        </div>

        <div className="h-52 w-52 bg-base-100">
          <LoadingFallback />
        </div>

        <div className="h-44 w-44 bg-base-100">
          <LoadingFallback />
        </div>

        <div className="h-40 w-40 bg-base-100">
          <LoadingFallback />
        </div>
      </div>
    </>
  )
}
