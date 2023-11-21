import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from '@renderer/common/useStore'
import MangaWall from '@renderer/components/MangaWall'
function App(): JSX.Element {
  const rootPath = useStore((state) => state.rootPath)
  const setMangas = useStore((state) => state.setMangas)
  const navigate = useNavigate()

  useEffect(() => {
    if (rootPath) {
      console.log(rootPath)
      window.electron.ipcRenderer.invoke('traverse-folder', rootPath).then((res) => setMangas(res))
    } else {
      navigate('/welcome')
    }
  }, [])

  return (
    <div className="flex h-screen bg-slate-600">
      <MangaWall />
    </div>
  )
}

export default App
