import type { Bookmark, BookmarksParams } from '#/types/bookmarks'
import type { Filters, GetItemsFn } from '#/types/db'
import { oid } from '#/utils/db'

export function getBookmarks(params: BookmarksParams, use: GetItemsFn<Bookmark>) {
  const { _ids, urls, tags } = params.filters ?? {}
  const filters: Filters<Bookmark> = {}

  if (_ids) filters['_id'] = { $in: _ids.map(oid) }
  if (tags) filters['tags'] = { $all: tags }
  if (urls) filters['url'] = urls.length === 1 ? { $regex: urls[0], $options: 'i' } : { $in: urls }

  return use({
    collection: 'bookmarks',
    pagination: params.pagination,
    filters,
  })
}
