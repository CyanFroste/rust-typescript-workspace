import type { Tag, TagsParams } from '#/types/tags'
import type { Filters, GetItemsFn } from '#/types/db'
import { oid } from '#/utils/db'

export function getTags(params: TagsParams, use: GetItemsFn<Tag>) {
  const { _ids, names } = params.filters ?? {}
  const filters: Filters<Tag> = {}

  if (_ids) filters['_id'] = { $in: _ids.map(oid) }
  if (names)
    filters['name'] = names.length === 1 ? { $regex: names[0], $options: 'i' } : { $in: names }

  return use({
    collection: 'tags',
    pagination: params.pagination,
    filters,
  })
}
