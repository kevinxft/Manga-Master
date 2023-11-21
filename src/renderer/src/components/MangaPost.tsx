import { MangaType } from '@renderer/common/useStore'
import { useState } from 'react'
import { InView } from 'react-intersection-observer'

function formatMangaName(path: string) {
  return path.split('/').pop()
}

function MangaPost({ path, post }: MangaType) {
  const [isInView, setInView] = useState(false)
  const onOpen = (path: string) => {
    const url = `${window.location.href}gallary?path=${path}`
    window.electron.ipcRenderer.send('open-window', url)
  }
  return (
    <InView
      className="rounded-lg overflow-hidden relative flex flex-col bg-slate-100 aspect-[1/1.42]"
      as="div"
      onChange={(inView) => !isInView && inView && setInView(true)}
    >
      <div className="absolute bottom-0 z-10 text-sm">{formatMangaName(path)}</div>
      <img
        className="absolute transition-all top-0 object-cover cursor-pointer h-[100%] max-w-none"
        src={isInView ? post : ''}
        onClick={() => onOpen(path)}
      />
    </InView>
  )
}

export default MangaPost
