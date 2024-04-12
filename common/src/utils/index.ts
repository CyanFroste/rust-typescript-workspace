import { config } from '#/constants'
import type { Dictionary, RawParam, RawParams } from '#/types'
import { clsx, type ClassValue } from 'clsx'
import { format as formatDateTime } from 'date-fns'
import { Children } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timestamp(date = new Date()) {
  return date.toISOString()
}

export function formatTimestamp(date: string | Date = new Date()) {
  return formatDateTime(date, config.timestampFormats.dateFns)
}

export const formatNumber = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 2,
}).format

export function parseBooleanParam(value: RawParam) {
  return value?.toString() === 'true'
}

export function parseNumberParam(value: RawParam) {
  if (!value) return
  const it = +value
  if (Number.isNaN(it)) return
  return it
}

export function parseArrayParam<T extends string>(
  value: RawParam,
  validate: (v: unknown) => v is T = (v): v is T => !!v && typeof v === 'string',
) {
  if (Array.isArray(value) && value.length && value.every(validate)) return value
  else if (validate(value)) return [value]
}

export function parsePaginationParams(raw: RawParams) {
  if (!raw?.pagination) return // Array.isArray(raw.pagination) || typeof raw.pagination !== 'object'
  const pagination = raw.pagination as Dictionary<RawParam>
  const limit = parseNumberParam(pagination.limit)

  if (!limit) return
  return { limit, page: parseNumberParam(pagination.page) ?? 1 }
}

export function parseRawFilterParams(raw: RawParams) {
  if (!raw?.filters) return
  return raw.filters as Dictionary<RawParam>
}

export function isVideo(type: string) {
  return type === 'video' || ['mp4', 'webm'].includes(type)
}

export function blobToBase64String(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => resolve(reader.result?.toString() ?? ''))
    reader.addEventListener('error', error => reject(error))
    reader.readAsDataURL(blob)
  })
}

export function isType<T>(_: unknown, condition: boolean): _ is T {
  return condition
}

export function assertType<T>(
  data: unknown,
  use: ((value: unknown) => boolean)[],
): asserts data is T {
  for (const rule of use) {
    if (!rule(data)) throw new Error('invalid type')
  }
}

export function extractSlots<K extends string>(
  children: React.ReactNode | React.ReactNode[],
  schema: Record<K, React.FunctionComponent>,
) {
  const slots: Partial<Record<K, React.ReactNode>> = {}
  const rest: React.ReactNode[] = []

  if (!Children.count(children)) return { slots, rest }
  const schemaEntries = Object.entries(schema) as [K, React.FunctionComponent][]

  Children.forEach(children, child => {
    for (const [key, val] of schemaEntries) {
      if (child && typeof child === 'object' && 'type' in child && child.type === val) {
        if (slots[key]) continue
        slots[key] = child
        return
      }
    }

    rest.push(child)
  })

  return { slots, rest }
}
