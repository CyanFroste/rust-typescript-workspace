declare global {
  interface HTMLElementEventMap {
    intersection: IntersectionEvent
  }
}

export type Medium = {
  type: 'image' | 'video'
  url: string
  name?: Nullable<string>
}

export type GenericResponse = { message: string }

export type SortOrder = 1 | -1 | 0

export type ProcessStats = { name: string; pid: number }

export type CollectionStats = {
  name: string
  count: number
  size: number
  itemSize: number
}

export type RawParam = Nullable<string | string[]>

export type RawParams = Dictionary<Nullable<RawParam | Dictionary<RawParam>>>

export type PaginationParams = { page?: number; limit: number }

export type IntersectionEvent = CustomEvent<IntersectionObserverEntry>

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>

export type Classes<T extends string = string> = Partial<Record<T, string>>

export type LayoutProps<C extends string = string> = {
  children?: React.ReactNode
  className?: string
  classes?: Classes<C>
}

// UTILS

export type Nullable<T> = T | null | undefined

export type Dictionary<T = unknown> = Record<string, T>

export type ValueOf<T> = T[keyof T]

export type Optional<T, K extends keyof T> = Omit<T, K> & Pick<Partial<T>, K>

export type Replace<T, K extends keyof T, N> = Omit<T, K> & Record<K, N>

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> | null }
