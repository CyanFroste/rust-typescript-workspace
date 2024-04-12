import type { Nullable } from '#/types'
import type * as Bookmarks from '#/types/bookmarks'
import type { Child, Command } from '@tauri-apps/api/shell'

export type LinkMap = {
  '/bookmarks': Bookmarks.BookmarksParams
}

export type ProcessEvent<T> =
  | { type: 'stdout' | 'stderr'; data: T }
  | { type: 'error'; message: string }
  | { type: 'term'; code: Nullable<number>; signal: Nullable<number> }

export type Process = {
  cmd: Nullable<Command>
  child: Nullable<Child>
  isKilled: boolean
  events: ProcessEvent<string>[]
}
