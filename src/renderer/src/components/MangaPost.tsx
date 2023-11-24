import { MangaType } from '@renderer/common/useStore'
import { Button } from 'antd'
import { useState } from 'react'
import { InView } from 'react-intersection-observer'
import { useStore } from '@renderer/common/useStore'
import { HeartFilled, HeartOutlined, SearchOutlined } from '@ant-design/icons'

function formatMangaName(path: string) {
  return path.split('/').pop()
}

function MangaPost({ path, post }: MangaType) {
  const [isInView, setInView] = useState(false)
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
    <InView
      className="rounded-lg overflow-hidden relative bg-slate-100 aspect-[1/1.42] group"
      as="div"
      onChange={(inView) => !isInView && inView && setInView(true)}
    >
      <img
        className="absolute transition-all top-0 object-cover cursor-pointer h-[100%] max-w-none"
        src={isInView ? post : ''}
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
    </InView>
  )
}

export default MangaPost
