import { refreshWindow } from '@/utils'
import { appWindow } from '@tauri-apps/api/window'
import { ArrowLeftIcon, ArrowRightIcon, MinusIcon, RotateCwIcon, XIcon } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function TitleBar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div
      id="title-bar"
      data-tauri-drag-region
      className="flex items-center select-none h-9 shrink-0 relative z-[1000] bg-base-900 text-base-50 pointer-events-auto">
      <Link
        to="/"
        className="title px-3 h-full flex items-center text-xl font-bold hover:bg-base-800 transition-colors">
        YOUR APP NAME
      </Link>

      <button
        className="w-12 h-full grid place-items-center hover:bg-base-800 transition-colors"
        onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="text-lg" />
      </button>

      <button
        className="w-12 h-full grid place-items-center hover:bg-base-800 transition-colors"
        onClick={() => navigate(1)}>
        <ArrowRightIcon className="text-lg" />
      </button>

      <button
        className="w-12 h-full grid place-items-center hover:bg-base-800 transition-colors"
        onClick={evt => {
          if (evt.shiftKey) navigate(0)
          else refreshWindow()
        }}>
        <RotateCwIcon className="text-lg" />
      </button>

      <div className="text-base-400 ml-2 text-sm">{location.pathname}</div>

      <button
        className="w-12 h-full grid place-items-center hover:bg-base-800 transition-colors ml-auto"
        onClick={() => appWindow.minimize()}>
        <MinusIcon className="text-lg" />
      </button>

      <button
        className="w-12 h-full grid place-items-center hover:bg-red-600 hover:text-white transition-colors"
        onClick={() => appWindow.close()}>
        <XIcon className="text-lg" />
      </button>
    </div>
  )
}
