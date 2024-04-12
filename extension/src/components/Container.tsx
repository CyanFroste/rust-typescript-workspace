import { cn } from '#/utils'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

export default function Container() {
  const [show, setShow] = useState(true)

  return (
    <div
      className={cn(
        'fixed inset-0 isolate w-[500px] bg-white transition-transform shadow-xl',
        show ? 'translate-x-0' : '-translate-x-full',
      )}>
      <button
        onClick={() => setShow(!show)}
        style={{
          transform: `translateY(${show ? `calc(-${window.innerHeight - 8}px + 100%)` : '-8px'})`,
        }}
        className="absolute left-full ml-2 bottom-0 bg-base-900 py-1 px-2 text-xl font-bold tracking-wide
        text-base-50 rounded border-4 whitespace-nowrap transition-transform duration-200 delay-200">
        SHOW / HIDE
      </button>

      <Outlet />
    </div>
  )
}
