import { getBookmarks } from '#/controllers/bookmarks'
import { addDbItems, removeDbItems, updateDbItems } from '#/requests'
import type { Bookmark, BookmarksParams } from '#/types/bookmarks'
import type { GetItemsFn } from '#/types/db'
import { useMutateItems } from '#/utils/db'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { request, type RequestFn } from './http'

type UseBookmarksQueryOptions = { use: GetItemsFn<Bookmark>; params: BookmarksParams }

export function useBookmarksQuery({ params, use }: UseBookmarksQueryOptions) {
  return useQuery({
    queryKey: ['BOOKMARKS', use, ...Object.values(params)],
    queryFn: () => getBookmarks(params, use),
  })
}

export function useBookmarksSuspenseQuery({ params, use }: UseBookmarksQueryOptions) {
  return useSuspenseQuery({
    queryKey: ['SUSPENSE_BOOKMARKS', use, ...Object.values(params)],
    queryFn: () => getBookmarks(params, use),
  })
}

export function useMutateBookmarks(use: RequestFn = request) {
  return useMutateItems<Bookmark>({
    collection: 'bookmarks',
    use: {
      adder: useCallback(params => addDbItems(params, use), [use]),
      updater: useCallback(params => updateDbItems(params, use), [use]),
      remover: useCallback(params => removeDbItems(params, use), [use]),
    },
  })
}
