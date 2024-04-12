import { toast } from '#/components/toast'
import type { AddItemsFn, CollectionName, RemoveItemsFn, UpdateItemsFn, WithId } from '#/types/db'
import { useMutation } from '@tanstack/react-query'
import type { ObjectId } from 'mongodb'

type UseMutateItemsOptions<T> = {
  collection: CollectionName
  showGenericToast?: boolean
  use: { adder: AddItemsFn<T>; updater: UpdateItemsFn<T>; remover: RemoveItemsFn<T> }
}

export function oid(id: string) {
  return { $oid: id } as unknown as ObjectId
}

export function useMutateItems<T>({
  collection,
  showGenericToast = true,
  use: { adder, updater, remover },
}: UseMutateItemsOptions<T>) {
  const add = useMutation({
    mutationKey: ['ADD_ITEMS', collection],
    mutationFn: (data: T[]) => adder({ collection, data }),
    onSuccess: (data, vars) => {
      if (!showGenericToast) return

      toast({
        title: 'Add Items',
        description: `${data.length} out of ${vars.length} items were added to "${collection}"`,
        // action: <ToastAction>Show Details</ToastAction>,
      })
    },
  })

  const update = useMutation({
    mutationKey: ['UPDATE_ITEMS', collection],
    mutationFn: (data: WithId<T>[]) => updater({ collection, data }),
    onSuccess: (data, vars) => {
      if (!showGenericToast) return

      toast({
        title: 'Update Items',
        description: `${data.length} out of ${vars.length} items were updated in "${collection}"`,
      })
    },
  })

  const remove = useMutation({
    mutationKey: ['REMOVE_ITEMS', collection],
    mutationFn: (data: WithId<T>[]) => remover({ collection, data }),
    onSuccess: (data, vars) => {
      if (!showGenericToast) return

      toast({
        title: 'Remove Items',
        description: `${data.length} out of ${vars.length} items were removed from "${collection}"`,
      })
    },
  })

  return { add, update, remove }
}
