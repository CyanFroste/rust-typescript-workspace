import { ErrorFallback, LoadingFallback } from '#/components/fallbacks'
import type { Bookmark } from '#/types/bookmarks'
import type { WithId } from '#/types/db'
import Image from '#/components/Image'
import { open } from '@tauri-apps/api/shell'
import { TrashIcon } from 'lucide-react'
import { Fragment, Suspense, useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { getDbItems } from '@/commands'
import { useBookmarksSuspenseQuery } from '#/utils/bookmarks'
import { request } from '@/utils'

export default function BookmarksScreen() {
  return (
    <div className="screen">
      <div className="action-bar"></div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <Bookmarks />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

function Bookmarks() {
  const query = useBookmarksSuspenseQuery({
    use: getDbItems,
    params: {},
  })

  // const lazyList = useLazyList([query.data])

  return (
    <div className="h-full w-full overflow-auto px-3 pb-3">
      <div className="grid grid-cols-3 gap-6">
        {query.data.map(it => (
          <Card key={it._id} data={it} />
        ))}
      </div>
    </div>
  )
}

type CardProps = { data: WithId<Bookmark> }

function Card({ data }: CardProps) {
  const title = useMemo(() => {
    try {
      return data.title ?? new URL(data.url).origin
    } catch (err) {
      //
    }
  }, [data.title, data.url])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 overflow-auto">
        {data.media.map(it => {
          return (
            <Fragment key={it.url}>
              {it.type === 'image' && (
                <Image
                  use={request}
                  className="h-40 w-40 shrink-0"
                  sources={[{ url: it.url }, { url: it.url, async: true }]}
                />
              )}
            </Fragment>
          )
        })}
      </div>

      <button
        onClick={() => open(data.url)}
        className="p-3 bg-base-100 rounded break-all flex flex-col gap-2 text-start">
        <div className="text-sm text-base-600">{title}</div>
        <div>{data.url}</div>
      </button>

      <div className="flex gap-2 items-center">
        <button className="btn-icon ml-auto" onClick={() => {}}>
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}
