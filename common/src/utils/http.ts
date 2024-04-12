import { toast } from '#/components/toast'
import type { Dictionary, GenericResponse, Nullable } from '#/types'
import {
  API_URL,
  stringifyQuery,
  type StringifyOptions as QueryStringifyOptions,
} from '#/utils/urls'
import * as Tauri from '@tauri-apps/api/http'
import * as Axios from 'axios'

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ResponseType = 'json' | 'text' | 'binary'

export type Headers = Dictionary<Nullable<string>>

export type Options<Q> = {
  method?: Method
  responseType?: ResponseType
  headers?: Headers
  query?: Q
  body?: Dictionary | Dictionary[]
  queryStringifyOptions?: QueryStringifyOptions
}

export type Response<T> = { data: T; status: number; headers: Headers }

export type RequestFn = typeof request

type Use = 'axios' | 'tauri' | RequestFn

function getAxiosResponseType(type: ResponseType) {
  if (type === 'binary') return 'blob'
  return type
}

function getTauriResponseType(type: ResponseType) {
  switch (type) {
    case 'binary':
      return Tauri.ResponseType.Binary
    case 'text':
      return Tauri.ResponseType.Text
    default:
    case 'json':
      return Tauri.ResponseType.JSON
  }
}

export async function request<T, Q extends Dictionary = Dictionary>(
  baseUrl: string,
  {
    method = 'GET',
    responseType = 'json',
    query,
    body,
    headers = {},
    queryStringifyOptions = {},
  }: Options<Q> = {},
  use: Use = 'axios',
): Promise<Response<T>> {
  let url = !query ? baseUrl : baseUrl + stringifyQuery(query, queryStringifyOptions)

  if (url.startsWith('/api')) url = API_URL + url

  console.log('REQUEST', {
    method,
    url,
    responseType,
    body,
    headers,
  })

  let response: Response<T>

  switch (use) {
    case 'tauri':
      try {
        const res = await Tauri.fetch<T>(url, {
          method,
          headers: { 'User-Agent': '<your_user_agent>', ...headers },
          responseType: getTauriResponseType(responseType),
          ...(body && { body: Tauri.Body.json(body) }),
        })

        if (!res.ok) throw new Error((res.data as Nullable<GenericResponse>)?.message)

        response = { data: res.data, headers: res.headers, status: res.status }
        break
      } catch (error) {
        console.error(error)

        toast({ title: 'Request Failed', description: (error as Error).message })
        throw error
      }

    case 'axios':
      try {
        const res = await Axios.default<T>(url, {
          method,
          headers,
          responseType: getAxiosResponseType(responseType),
          ...(body && { data: body }),
        })

        response = { data: res.data, headers: res.headers as Headers, status: res.status }
      } catch (error) {
        console.error(error)

        const err = error as Axios.AxiosError<GenericResponse>
        const message = err.response?.data?.message ?? err.message

        toast({ title: 'Request Failed', description: message })
        throw new Error(message)
      }

      break
    default:
      response = await use(url, {
        method,
        responseType,
        query,
        body,
        headers,
        queryStringifyOptions,
      })
  }

  console.log('RESPONSE', {
    method,
    url,
    responseType,
    body,
    requestHeaders: headers,
    ...response,
  })

  return response
}

export function requestUsing(use: Use) {
  return <T, Q extends Dictionary = Dictionary>(baseUrl: string, options?: Options<Q>) =>
    request<T, Q>(baseUrl, options, use)
}
