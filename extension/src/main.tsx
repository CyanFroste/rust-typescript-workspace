import { Toaster } from '#/components/toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Container from './components/Container'

import commonStyles from '#/styles.css?inline'
import styles from './styles.css?inline'
// import '#/styles.css'

const router = createBrowserRouter([
  {
    path: '*',
    element: <Container />,
    // children: [{ path: '/some-path', element: <SomePageLayout /> }],
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: 2 * 60 * 1000 },
  },
})

const host = document.createElement('div')
const shadow = host.attachShadow({ mode: 'open' })
const root = document.createElement('div')

host.id = '<your_extension_name>-host'
root.id = '<your_extension_name>'
root.className = 'fixed z-[9000] font-mono text-base-900 text-base text-start'

shadow.append(root)
document.body.append(host)

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <style type="text/css">{commonStyles}</style>
    <style type="text/css">{styles}</style>

    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
)
