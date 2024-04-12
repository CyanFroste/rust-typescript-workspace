import type {
  AddItemsFnParams,
  GetItemsFnParams,
  RemoveItemsFnParams,
  UpdateItemsFnParams,
  WithId,
} from './types/db'
import { request, type RequestFn } from './utils/http'

export async function getDbItems<T>(params: GetItemsFnParams<T>, use: RequestFn = request) {
  const res = await use<WithId<T>[]>('/api/db/items', { method: 'POST', body: params })
  return res.data
}

export async function addDbItems<T>(params: AddItemsFnParams<T>, use: RequestFn = request) {
  const res = await use<WithId<T>[]>('/api/db/items/add', { method: 'POST', body: params })
  return res.data
}

export async function updateDbItems<T>(params: UpdateItemsFnParams<T>, use: RequestFn = request) {
  const res = await use<WithId<T>[]>('/api/db/items/update', { method: 'POST', body: params })
  return res.data
}

export async function removeDbItems<T>(params: RemoveItemsFnParams<T>, use: RequestFn = request) {
  const res = await use<WithId<T>[]>('/api/db/items/remove', { method: 'POST', body: params })
  return res.data
}
