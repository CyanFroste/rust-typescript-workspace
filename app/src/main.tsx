import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomeScreen from './components/HomeScreen'
import TestsScreen from './components/TestsScreen'
import BookmarksScreen from './components/bookmarks/BookmarksScreen'
import DbScreen from './components/db/MainScreen'
import { MainWindow } from './components/windows'

import '#/styles.css'
import '@/styles.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainWindow />,
    children: [
      { path: '', element: <HomeScreen /> },
      { path: 'tests', element: <TestsScreen /> },
      { path: 'db', element: <DbScreen /> },
      { path: 'bookmarks', element: <BookmarksScreen /> },
    ],
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: 2 * 60 * 1000, refetchOnMount: 'always' },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
