import { toast } from '#/components/toast'
import type { Nullable } from '#/types'
import { killProcess } from '@/commands'
import type { Process, ProcessEvent } from '@/types'
import { Child, Command } from '@tauri-apps/api/shell'
import { useCallback, useState } from 'react'
import { create } from 'zustand'

type Store = { db: Process }

function createProcess(): Process {
  return { cmd: null, events: [], child: null, isKilled: false }
}

export const useProcessStore = create<Store>(() => ({ db: createProcess() }))

export const addEvent = (name: keyof Store, evt: ProcessEvent<string>) =>
  useProcessStore.setState(state => ({
    [name]: { ...state[name], events: state[name].events.concat(evt) },
  }))

export const setCmd = (name: keyof Store, cmd: Nullable<Command>) =>
  useProcessStore.setState({
    [name]: { ...createProcess(), cmd },
  })

export const setChild = (name: keyof Store, child: Nullable<Child>) =>
  useProcessStore.setState(state => ({ [name]: { ...state[name], child } }))

export const setIsKilled = (name: keyof Store, isKilled: boolean) =>
  useProcessStore.setState(state => ({
    [name]: { ...state[name], isKilled, child: isKilled ? null : state[name].child },
  }))

export function useProcess(name: keyof Store) {
  const process = useProcessStore(state => state[name])

  const init = useCallback(() => {
    if (process.cmd) return
    const cmd = new Command(name)

    cmd.stdout.on('data', data => addEvent(name, { type: 'stdout', data }))
    cmd.stderr.on('data', data => addEvent(name, { type: 'stderr', data }))
    cmd.on('error', err => addEvent(name, { type: 'error', message: err }))
    cmd.on('close', data => {
      addEvent(name, { type: 'term', ...data })
      setIsKilled(name, true)
    })

    setCmd(name, cmd)
  }, [name, process.cmd])

  const spawn = useCallback(async () => {
    if (!process.cmd || process.child) return

    const child = await process.cmd.spawn()
    setIsKilled(name, false)
    setChild(name, child)
  }, [process.cmd, process.child, name])

  const kill = useCallback(async () => {
    if (!process.child) return

    await process.child.kill()
    setIsKilled(name, true)
  }, [name, process.child])

  return {
    cmd: process.cmd,
    child: process.child,
    isKilled: process.isKilled,
    events: process.events,
    init,
    spawn,
    kill,
  }
}

export function useUnmanagedProcess(name: string) {
  const [isKilling, setIsKilling] = useState(false)

  const kill = useCallback(async () => {
    setIsKilling(true)

    const killed = await killProcess(name)
    setIsKilling(false)

    if (killed) {
      return toast({
        title: 'Killed unmanaged process',
        description: `Killed process with name: ${killed.name} and PID: ${killed.pid}`,
      })
    }

    toast({ title: 'Not Found', description: 'Failed to find any unmanaged process' })
  }, [name])

  return { kill, isKilling }
}
