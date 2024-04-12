import { Toaster } from '#/components/toast'
import TitleBar from '@/components/TitleBar'
import { useStore } from '@/utils'
import { useProcess } from '@/utils/processes'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

export function MainWindow() {
  const dbProcess = useProcess('db')
  const refreshCount = useStore(state => state.windowRefreshCount)

  useEffect(() => {
    dbProcess.init()
    if (!dbProcess.isKilled) dbProcess.spawn()
  }, [dbProcess])

  return (
    <>
      <TitleBar />
      <Outlet key={refreshCount} />
      <Toaster />
    </>
  )
}
