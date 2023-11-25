import { MangaType } from '@renderer/common/useStore'
import { Button } from 'antd'
import { useStore } from '@renderer/common/useStore'
import { HeartFilled, HeartOutlined, SearchOutlined } from '@ant-design/icons'

function formatMangaName(path: string) {
  return path ? path.split('/').pop() : path
}

function MangaPost({ path, post }: MangaType) {
  const favorites = useStore((state) => state.favorites)
  const setFavorites = useStore((state) => state.setFavorites)
  const onOpen = () => {
    const prefix = window.location.origin + window.location.pathname + '#/'
    window.electron.ipcRenderer.send('open-window', `${prefix}gallary?path=${path}`)
  }

  const toggleFavorite = (path, checked = true) => {
    if (checked) {
      setFavorites([...favorites, path])
    } else {
      setFavorites(favorites.filter((p) => p !== path))
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-lg bg-slate-100 group h-full w-full`}>
      <img
        className="absolute transition-all top-0 object-cover cursor-pointer h-[100%] max-w-none"
        src={post}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:bg-black/60">
        <div
          className={`absolute right-2 top-2 rounded-[100%] group-hover:block ${
            favorites.includes(path) ? '' : 'hidden'
          }`}
        >
          {favorites.includes(path) ? (
            <Button
              type="text"
              shape="circle"
              onClick={() => toggleFavorite(path, false)}
              icon={<HeartFilled style={{ color: '#FA7070' }} />}
            />
          ) : (
            <Button
              shape="circle"
              onClick={() => toggleFavorite(path, true)}
              icon={<HeartOutlined />}
            />
          )}
        </div>

        <div className="absolute hidden gap-2 group-hover:flex">
          <Button shape="circle" onClick={onOpen} icon={<SearchOutlined />} />
        </div>

        <div className="absolute bottom-0 z-10 hidden text-sm text-white group-hover:block">
          {formatMangaName(path)}
        </div>
      </div>
    </div>
  )
}

export default MangaPost
