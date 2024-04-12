import type { CollectionStats, Dictionary, Nullable, ProcessStats } from '#/types'
import type {
  AddItemsFnParams,
  CollectionTypeMap,
  GetItemsFnParams,
  RemoveItemsFnParams,
  UpdateItemsFnParams,
  WithId,
} from '#/types/db'
import type { FileStats } from '#/utils/files'
import { invoke } from '@tauri-apps/api/tauri'

export function getFileStats(path: string) {
  return invoke<FileStats>('get_file_stats', { path })
}

export function downloadAndSaveFile(url: string, path: string) {
  return invoke<void>('download_and_save_file', { url, path })
}

export function killProcess(name: string) {
  return invoke<Nullable<ProcessStats>>('kill_process', { name })
}

export function getDbCollectionStats() {
  return invoke<CollectionStats[]>('get_db_collection_stats')
}

export function backupDb() {
  return invoke<string>('backup_db')
}

export function createUniqueDbIndex(collection: keyof CollectionTypeMap, keys: Dictionary<number>) {
  return invoke<string>('create_unique_db_index', { collection, keys })
}

export function getDbItems<T>(params: GetItemsFnParams<T>) {
  return invoke<WithId<T>[]>('get_db_items', { params })
}

export function addDbItems<T>(params: AddItemsFnParams<T>) {
  return invoke<WithId<T>[]>('add_db_items', { params })
}

export function updateDbItems<T>(params: UpdateItemsFnParams<T>) {
  return invoke<WithId<T>[]>('update_db_items', { params })
}

export function removeDbItems<T>(params: RemoveItemsFnParams<T>) {
  return invoke<WithId<T>[]>('remove_db_items', { params })
}
