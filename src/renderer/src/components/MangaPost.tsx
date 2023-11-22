import { MangaType } from '@renderer/common/useStore'
import { useState } from 'react'
import { InView } from 'react-intersection-observer'

function formatMangaName(path: string) {
  return path.split('/').pop()
}

function MangaPost({ path, post }: MangaType) {
  const [isInView, setInView] = useState(false)
  const onOpen = (path: string) => {
    console.log(process.env.NODE_ENV)
    const isDev = process.env.NODE_ENV === 'development'
    console.log('isDev: ', isDev)
    let prefix = window.location.href
    if (!isDev) {
      prefix = prefix + '/#/'
    }
    console.log(prefix)
    window.electron.ipcRenderer.send('open-window', `${prefix}gallary?path=${path}`)
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
