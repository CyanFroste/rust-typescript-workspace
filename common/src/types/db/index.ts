import type { Filter, SortDirection } from 'mongodb'
import type { Nullable, PaginationParams } from '#/types'
import type * as Bookmarks from '#/types/bookmarks'
import type * as Tags from '#/types/tags'

export type WithId<T = unknown> = T & { _id: string }

export type Filters<T> = Filter<T>

export type GetItemsFnParams<T> = {
  collection: CollectionName
  filters?: Nullable<Filters<T>>
  pagination?: Nullable<PaginationParams>
  sort?: Nullable<Partial<Record<keyof T, SortDirection>>>
}

export type AddItemsFnParams<T> = { collection: CollectionName; data: T[] }

export type UpdateItemsFnParams<T> = { collection: CollectionName; data: WithId<T>[] }

export type RemoveItemsFnParams<T> = { collection: CollectionName; data: WithId<T>[] }

export type GetItemsFn<T> = (params: GetItemsFnParams<T>) => Promise<WithId<T>[]>

export type AddItemsFn<T> = (params: AddItemsFnParams<T>) => Promise<WithId<T>[]>

export type UpdateItemsFn<T> = (params: UpdateItemsFnParams<T>) => Promise<WithId<T>[]>

export type RemoveItemsFn<T> = (params: RemoveItemsFnParams<T>) => Promise<WithId<T>[]>

export type CollectionName = keyof CollectionTypeMap

export type CollectionTypeMap = {
  bookmarks: Bookmarks.Bookmark
  tags: Tags.Tag
}
