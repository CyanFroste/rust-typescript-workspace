import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { UndoIcon } from 'lucide-react'
import {
  ReactEventHandler,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  ReactZoomPanPinchContentRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch'
import type { IntersectionEvent } from '#/types'
import { cn } from '#/utils'
import type { RequestFn } from '#/utils/http'
import { ErrorFallback, LoadingFallback } from './fallbacks'

type Source = { url?: string; async?: boolean }

type EventHandler = ReactEventHandler<HTMLImageElement>

type CommonProps = { controls?: boolean; cover?: boolean }

// export type AsyncLoader = (src: string) => Promise<string | Blob | ArrayBuffer | Uint8Array>

export type Props = CommonProps & {
  sources: Source[]
  lazy?: boolean
  className?: string
  onClick?: () => void
  use: RequestFn
}

export default function Image({ sources, lazy, className, controls, cover, onClick, use }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  const [cursor, setCursor] = useState(0)
  const [enabled, setEnabled] = useState(!lazy)

  const { url, async } = useMemo(() => {
    return sources[cursor] ?? {}
  }, [sources, cursor])

  useEffect(() => {
    const target = ref.current
    if (!target || !lazy) return

    function listener(evt: IntersectionEvent) {
      setEnabled(evt.detail.isIntersecting)
    }

    target.addEventListener('intersection', listener)
    return () => target.removeEventListener('intersection', listener)
  }, [lazy])

  const onLoad = useCallback(() => {
    if (lazy && ref.current) {
      ref.current.style.minHeight = '0px'
      ref.current.style.height = ref.current.clientHeight + 'px'
    }
  }, [lazy])

  const onError = useCallback(() => {
    if (cursor < sources.length - 1) setCursor(cursor + 1)
  }, [cursor, sources.length])

  // const onReset = useCallback(() => {
  //   setCursor(0)
  // }, [])

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'image group flex relative isolate bg-base-100 overflow-hidden',
        onClick && 'cursor-pointer',
        className,
      )}>
      {enabled &&
        (async ? (
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                fallbackRender={({ error, resetErrorBoundary }) => {
                  if (cursor < sources.length - 1) {
                    setCursor(cursor + 1)
                    resetErrorBoundary()
                  }

                  return <ErrorFallback error={error} />
                }}>
                <Suspense fallback={<LoadingFallback />}>
                  <AsyncImage
                    src={url}
                    onLoad={onLoad}
                    controls={controls}
                    cover={cover}
                    use={use}
                  />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        ) : (
          <NativeImage
            src={url}
            onLoad={onLoad}
            onError={onError}
            controls={controls}
            cover={cover}
          />
        ))}
    </div>
  )
}

type NativeImageProps = CommonProps & {
  src?: string
  onLoad: EventHandler
  onError: EventHandler
  onReset?: () => void
}

// put '' src, otherwise onError won't trigger
function NativeImage({ src = '', onLoad, onError, controls, cover }: NativeImageProps) {
  const ref = useRef<HTMLImageElement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    setLoading(true)
    setError(false)
  }, [src])

  useEffect(() => {
    if (!ref.current) return
    setLoading(!ref.current.complete)
    setError(ref.current.complete && !ref.current.naturalHeight)
  }, [])

  const onLoadInternal: ReactEventHandler<HTMLImageElement> = useCallback(
    evt => {
      if (evt.currentTarget.complete && evt.currentTarget.naturalHeight) {
        setLoading(false)
        setError(false)
      }
      onLoad(evt)
    },
    [onLoad],
  )

  const onErrorInternal: ReactEventHandler<HTMLImageElement> = useCallback(
    evt => {
      setLoading(false)
      setError(true)
      onError(evt)
    },
    [onError],
  )

  return (
    <>
      {error && <ErrorFallback className="absolute z-30 inset-0" />}

      {loading && <LoadingFallback className="absolute z-20 inset-0 bg-base-100" />}

      <TransformWrapper disabled={!controls}>
        {ctx => (
          <>
            {controls && <ControlPanel ctx={ctx} />}

            <TransformComponent contentClass="!w-full !h-full" wrapperClass="!w-full !h-full">
              <img
                ref={ref}
                src={src}
                onLoad={onLoadInternal}
                onError={onErrorInternal}
                className={cn('w-full h-full', cover ? 'object-cover' : 'object-contain')}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </>
  )
}

type AsyncImageProps = CommonProps & { src?: string; onLoad: EventHandler; use: RequestFn }

function AsyncImage({ src, onLoad, controls, cover, use }: AsyncImageProps) {
  const query = useSuspenseQuery({
    queryKey: ['ASYNC_IMAGE', src],
    queryFn: async () => {
      if (!src) throw new Error('missing src')

      const res = await use(src, { responseType: 'binary' })
      const blob =
        res.data instanceof Blob
          ? res.data
          : new Blob([new Uint8Array(res.data as ArrayBufferLike)], {
              type: res.headers['content-type']!,
            })

      return URL.createObjectURL(blob)
    },
  })

  return (
    <TransformWrapper disabled={!controls}>
      {ctx => (
        <>
          {controls && <ControlPanel ctx={ctx} />}

          <TransformComponent contentClass="!w-full !h-full" wrapperClass="!w-full !h-full">
            <img
              src={query.data}
              onLoad={onLoad}
              className={cn('w-full h-full', cover ? 'object-cover' : 'object-contain')}
            />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  )
}

type ControlPanelProps = { ctx: ReactZoomPanPinchContentRef }

function ControlPanel({ ctx }: ControlPanelProps) {
  return (
    <div className="absolute top-3 right-3 z-10 transition-opacity group-hover:opacity-100 opacity-0">
      <button className="btn-icon" onClick={() => ctx.resetTransform()}>
        <UndoIcon />
      </button>
    </div>
  )
}
