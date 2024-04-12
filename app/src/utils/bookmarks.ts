import type { Bookmark } from '#/types/bookmarks'
import { useMutateItems } from '#/utils/db'
import { addDbItems, removeDbItems, updateDbItems } from '@/commands'

export function useMutateBookmarks() {
  return useMutateItems<Bookmark>({
    collection: 'bookmarks',
    use: {
      adder: addDbItems,
      updater: updateDbItems,
      remover: removeDbItems,
    },
  })
}
