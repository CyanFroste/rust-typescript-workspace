import type { PaginationParams, Dictionary, Nullable } from '#/types'

export type Tag = {
  name: string
  timestamp: string
  thumbnail?: Nullable<string>
  favorite?: boolean
  extra?: Nullable<Dictionary<string>>
}

export type TagsParams = {
  pagination?: Nullable<PaginationParams>
  filters?: Nullable<{
    _ids?: string[]
    names?: string[]
    favorite?: boolean
  }>
}
