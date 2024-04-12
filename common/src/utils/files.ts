export type File = {
  name: string
  path: string
  size: number
  children?: File[]
  modifiedTime: number
}

export type FileStats = {
  size: number
  isDir: boolean
  isFile: boolean
  modifiedTime: number
}

type ReadDirEntry = string | { path: string }

type SortRule = {
  id?: string
  dir?: 'asc' | 'desc'
  use: 'name' | 'modifiedTime' | ((a: File, b: File) => number)
}

type Options = {
  sortRules?: SortRule[]
  use: {
    getFileStats: (path: string) => Promise<FileStats> | FileStats
    readDir: (path: string) => Promise<ReadDirEntry[]> | ReadDirEntry[]
  }
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

export function compareNames(a: File, b: File, dir = 'asc') {
  return dir === 'asc' ? collator.compare(a.name, b.name) : collator.compare(b.name, a.name)
}

export function compareModifiedTime(a: File, b: File, dir = 'desc') {
  return dir === 'desc' ? b.modifiedTime - a.modifiedTime : a.modifiedTime - b.modifiedTime
}

export async function createFileTree(path: string, options: Options) {
  const fileStats = await options.use.getFileStats(path)

  const file: File = {
    name: getFileName(path),
    path,
    size: fileStats.size,
    modifiedTime: fileStats.modifiedTime,
  }

  if (fileStats.isDir) {
    const entries = await options.use.readDir(path)
    file.children = await Promise.all(
      entries.map(it => createFileTree(typeof it === 'string' ? it : it.path, options)),
    )

    for (const { id, use, dir } of options.sortRules ?? []) {
      if (!dir || (id !== file.name && id !== file.path)) continue

      switch (use) {
        case 'name':
          file.children.sort((a, b) => compareNames(a, b, dir))
          break
        case 'modifiedTime':
          file.children.sort((a, b) => compareModifiedTime(a, b, dir))
          break
        default:
          file.children.sort(use)
      }
    }
  }

  return file
}

export function getFileName(value: string) {
  return value.slice(
    value.lastIndexOf('/', value.length - 2) + 1,
    value.endsWith('/') ? -1 : value.length,
  )
}

export function getFileNameExtension(value: string) {
  return value.slice(((value.lastIndexOf('.') - 1) >>> 0) + 2)
}
