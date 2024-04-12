import { link } from '@/utils'
import { DatabaseIcon, FileHeartIcon, FlaskConicalIcon, HashIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomeScreen() {
  return (
    <div className="screen">
      <div className="flex flex-col justify-center h-full mx-auto">
        <div className="text-2xl mb-6">Core</div>

        <div className="flex gap-2 mb-16">
          <Link to={link('/bookmarks', {})} className="btn">
            <FileHeartIcon /> Bookmarks
          </Link>

          <Link to="/#" className="btn">
            <HashIcon /> Tags
          </Link>
        </div>

        <div className="text-2xl mb-6">Miscellaneous</div>

        <div className="flex gap-2">
          <Link to="/tests" className="btn">
            <FlaskConicalIcon /> Tests
          </Link>

          <Link to="/db" className="btn">
            <DatabaseIcon /> Database [ MongoDB ]
          </Link>
        </div>
      </div>
    </div>
  )
}
