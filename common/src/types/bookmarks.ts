import type { Medium, PaginationParams, Dictionary, Nullable } from '#/types'

export type Bookmark = {
  url: string
  title?: Nullable<string>
  media: Medium[]
  tags: string[]
  timestamp: string
  favorite?: boolean
  extra?: Nullable<Dictionary<string>>
}

export type BookmarksParams = {
  pagination?: Nullable<PaginationParams>
  filters?: Nullable<{
    _ids?: string[]
    urls?: string[]
    tags?: string[]
    titles?: string[]
    favorite?: boolean
  }>
}
