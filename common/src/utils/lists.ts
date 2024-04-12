import { useEffect, useRef } from 'react'

type Options = {
  selector?: string
  once?: boolean
  dispatchEvent?: boolean
  observerOptions?: IntersectionObserverInit
  onIntersection?: (entry: IntersectionObserverEntry) => void
  onEndReached?: () => void
}

const DEFAULT_SELECTOR = '.image, .video'

const DEFAULT_OBSERVER_OPTIONS: IntersectionObserverInit = { rootMargin: '50% 0px' }

export default function useLazyList<T extends HTMLElement = HTMLDivElement>(
  deps: readonly unknown[],
  {
    selector = DEFAULT_SELECTOR,
    once = true,
    dispatchEvent = true,
    observerOptions = {},
    onIntersection,
    onEndReached,
  }: Options = {},
) {
  const ref = useRef<T | null>(null)
  const endItemRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    if (onEndReached) {
      endItemRef.current = document.createElement('div')
      ref.current.append(endItemRef.current)
    }

    const items = ref.current.querySelectorAll(selector)

    const observer = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          const target = entry.target
          onIntersection?.(entry)

          if (dispatchEvent)
            target.dispatchEvent(new CustomEvent('intersection', { detail: entry }))

          if (entry.isIntersecting) {
            if (endItemRef.current === entry.target) onEndReached?.()
            else if (once) observer.unobserve(target)
          }
        }
      },
      { ...DEFAULT_OBSERVER_OPTIONS, ...observerOptions },
    )

    if (endItemRef.current) observer.observe(endItemRef.current)
    for (const item of items) observer.observe(item)

    return () => {
      observer.disconnect()
      endItemRef.current?.remove()
      endItemRef.current = null
    }
  }, [deps, once, selector, dispatchEvent, observerOptions, onIntersection, onEndReached])

  return { ref }
}
