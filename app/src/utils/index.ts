import { requestUsing } from '#/utils/http'
import { stringifyQuery, type LinkFn } from '#/utils/urls'
import type { LinkMap } from '@/types'
import { create } from 'zustand'

export const request = requestUsing('tauri')

export const link: LinkFn<LinkMap> = (url, params, stringifyOptions = {}) => {
  return url.slice(url.indexOf('/')) + stringifyQuery(params, stringifyOptions)
  // return (
  //   url.slice(url.indexOf('/')).replaceAll(/{(.*?)}/g, (matched, key: string) => {
  //     return params.path?.[key].toString() ?? matched
  //   }) + stringifyQuery(params, stringifyOptions)
  // )
}

type Store = { windowRefreshCount: number }

export const useStore = create<Store>(() => ({
  windowRefreshCount: 0,
}))

export const refreshWindow = () =>
  useStore.setState(state => ({ windowRefreshCount: state.windowRefreshCount + 1 }))
