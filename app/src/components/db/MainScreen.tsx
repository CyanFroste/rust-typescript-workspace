import { ErrorFallback, LoadingFallback } from '#/components/fallbacks'
import { ToastAction, toast } from '#/components/toast'
import { config } from '#/constants'
import { backupDb, createUniqueDbIndex, getDbCollectionStats } from '@/commands'
import { useProcess, useUnmanagedProcess } from '@/utils/processes'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { open as openExternal } from '@tauri-apps/api/shell'
import { cn } from '#/utils'
import { BoxIcon, FilesIcon, HardDriveIcon } from 'lucide-react'
import prettyBytes from 'pretty-bytes'
import { Suspense, useCallback } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export default function MainScreen() {
  const queryClient = useQueryClient()

  const process = useProcess('db')
  const unmanagedProcess = useUnmanagedProcess(config.db.processName)

  const start = useCallback(async () => {
    await process.spawn()
    await queryClient.invalidateQueries({ queryKey: ['db_collections'] })
  }, [process, queryClient])

  const mutationBackup = useMutation({
    mutationFn: backupDb,
    onError: err => {
      toast({ title: 'DB Backup', description: err.message })
    },
    onSuccess: path => {
      toast({
        title: 'DB Backup',
        description: `Successfully created backups on ${path}`,
        action: <ToastAction onClick={() => openExternal(path)}>Show</ToastAction>,
      })
    },
  })

  const mutationCreateUniqueIndices = useMutation({
    mutationFn: async () => {
      return Promise.all([
        createUniqueDbIndex('bookmarks', { url: 1 }),
        createUniqueDbIndex('tags', { name: 1 }),
      ])
    },
    onError: err => {
      toast({ title: 'Create Unique Indices', description: err.message })
    },
    onSuccess: data => {
      toast({
        title: 'Create Unique Indices',
        description: `Successfully created ${data.length} unique indices [ ${data.join(', ')} ]`,
      })
    },
  })

  return (
    <div className="screen">
      <div className="px-3 py-6 flex items-center gap-2">
        <button
          className="btn"
          onClick={() => mutationCreateUniqueIndices.mutate()}
          disabled={mutationCreateUniqueIndices.isPending}>
          Create Unique Indices
        </button>

        <button
          className="btn"
          onClick={() => mutationBackup.mutate()}
          disabled={!process.child || mutationBackup.isPending}>
          Backup
        </button>

        <button onClick={() => openExternal(config.db.backupPath)} className="btn">
          <FilesIcon />
          <div className="text-sm">
            {config.db.backupPath}/{'{timestamp}'}/{'{collection_name}'}.json
          </div>
        </button>

        {!process.child ? (
          <>
            <button onClick={start} className="btn ml-auto">
              Start
            </button>

            <button
              className="btn"
              onClick={unmanagedProcess.kill}
              disabled={unmanagedProcess.isKilling}>
              Kill Unmanaged
            </button>
          </>
        ) : (
          <button onClick={process.kill} className="btn ml-auto">
            Stop [ PID: {process.child.pid} ]
          </button>
        )}
      </div>

      <div className="flex h-full overflow-auto gap-6">
        <div className="flex-1 flex">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingFallback />}>
              <div className="w-full h-full overflow-auto pl-3 pb-3">
                <div className="text-2xl mb-6">Collections</div>

                <Collections />
              </div>
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="flex-1 flex">
          <div className="w-full h-full overflow-auto pr-3 pb-3">
            <div className="text-2xl mb-6">Logs</div>

            <div className="flex flex-col gap-4">
              {process.events.map((evt, index) => {
                return (
                  <div key={index} className="flex gap-2 items-start">
                    <div
                      className={cn(
                        'chip capitalize w-20 justify-center',
                        evt.type !== 'stdout' && 'text-red-600 bg-red-100',
                      )}>
                      {evt.type}
                    </div>

                    <div className="whitespace-pre-wrap break-all">
                      {(evt.type === 'stdout' || evt.type === 'stderr') && evt.data}

                      {evt.type === 'error' && evt.message}

                      {evt.type === 'term' && (
                        <>
                          {evt.code && `Code: ${evt.code}`}
                          {evt.signal && `Signal: ${evt.signal}`}
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Collections() {
  const query = useSuspenseQuery({
    queryKey: ['DB_COLLECTION_STATS'],
    queryFn: getDbCollectionStats,
  })

  return (
    <div className="grid grid-cols-3 gap-6">
      {query.data.map(it => (
        <div key={it.name} className="flex flex-col p-3 bg-base-100 rounded">
          <div className="text-lg mb-6">{it.name}</div>

          <div className="flex items-center gap-2 mb-2">
            <BoxIcon /> <div>{it.count} items</div>
          </div>

          <div className="flex items-center gap-2 text-base-600 text-sm">
            <HardDriveIcon />
            <div>
              {prettyBytes(it.size)} [ {prettyBytes(it.itemSize)} per item ]
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
