import { MangaType } from '@renderer/common/useStore'

function formatMangaName(path: string) {
  return path.split('/').pop()
}

function MangaPost({ path, post }: MangaType) {
  const onOpen = (path: string) => {
    const url = `${window.location.origin}/#/gallary?path=${path}`
    window.electron.ipcRenderer.send('open-window', url)
  }
  return (
    <div className="rounded-lg overflow-hidden relative flex flex-col bg-slate-100 aspect-[1/1.42]">
      <div className="absolute bottom-0 text-sm">{formatMangaName(path)}</div>
      <img
        className="absolute transition-all top-0 object-cover cursor-pointer z-0 h-[100%] max-w-none hover:right-0"
        src={post}
        onClick={() => onOpen(path)}
      />
    </div>
  )
}

export default MangaPost
