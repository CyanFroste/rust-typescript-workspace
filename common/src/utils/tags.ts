import { getTags } from '#/controllers/tags'
import { addDbItems, removeDbItems, updateDbItems } from '#/requests'
import type { GetItemsFn } from '#/types/db'
import type { Tag, TagsParams } from '#/types/tags'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useMutateItems } from './db'
import { request, type RequestFn } from './http'

type UseTagsQueryOptions = { use: GetItemsFn<Tag>; params: TagsParams }

export function useTagsQuery({ params, use }: UseTagsQueryOptions) {
  return useQuery({
    queryKey: ['TAGS', use, ...Object.values(params)],
    queryFn: () => getTags(params, use),
  })
}

export function useTagsSuspenseQuery({ params, use }: UseTagsQueryOptions) {
  return useSuspenseQuery({
    queryKey: ['SUSPENSE_TAGS', use, ...Object.values(params)],
    queryFn: () => getTags(params, use),
  })
}

export function useMutateTags(use: RequestFn = request) {
  return useMutateItems<Tag>({
    collection: 'tags',
    use: {
      adder: useCallback(params => addDbItems(params, use), [use]),
      updater: useCallback(params => updateDbItems(params, use), [use]),
      remover: useCallback(params => removeDbItems(params, use), [use]),
    },
  })
}
