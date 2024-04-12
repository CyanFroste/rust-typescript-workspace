import { config } from '#/constants'
import type { RawParams } from '#/types'
import qs, { type IStringifyOptions } from 'qs'
import { useMemo } from 'react'
import { useParams as usePathParams, useSearchParams } from 'react-router-dom'

export type StringifyOptions = IStringifyOptions & { append?: boolean }

export type LinkFn<M> = <K extends keyof M>(
  url: K,
  params?: M[K],
  stringifyOptions?: StringifyOptions,
) => string

export const DEFAULT_STRINGIFY_OPTIONS: StringifyOptions = {
  encode: false,
  addQueryPrefix: true,
  arrayFormat: 'repeat',
}

export function stringifyQuery<Q>(query: Q, options: StringifyOptions) {
  const stringified = qs.stringify(query, { ...DEFAULT_STRINGIFY_OPTIONS, ...options })
  if (options.append) return '&' + stringified.slice(stringified.indexOf('?') + 1)
  return stringified
}

export function useUrlParams<T = RawParams>(use?: (raw: RawParams) => T) {
  const pathParams = usePathParams()
  const [searchParams] = useSearchParams()

  const parsed = useMemo(() => {
    const raw = { ...pathParams, ...qs.parse(searchParams.toString()) } as RawParams

    if (use) return use(raw)
    return raw as T
  }, [pathParams, searchParams, use])

  return parsed
}

export function stripHostFromUrl(value: URL | string) {
  if (!value) return value
  const url = value instanceof URL ? value : new URL(value)
  return url.pathname + url.search
}

export function areUrlsEqual(a: string, b: string) {
  return (
    (a.startsWith('/') ? a : stripHostFromUrl(a)) === (b.startsWith('/') ? b : stripHostFromUrl(b))
  )
}

export const API_URL = `http://localhost:${config.servers.api.port}`

export function getProxyUrl(url: string) {
  return `${API_URL}/api/proxy/${url}`
}
