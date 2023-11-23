import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from '@renderer/common/useStore'
import MangaWall from '@renderer/components/MangaWall'
import { initMangas } from '@renderer/common/utils'

function App(): JSX.Element {
  const rootPath = useStore((state) => state.rootPath)
  const mangas = useStore((state) => state.mangas)
  const setMangas = useStore((state) => state.setMangas)
  const setAutoTags = useStore((state) => state.setAutoTags)
  const navigate = useNavigate()

  useEffect(() => {
    if (rootPath) {
      if (mangas.length === 0) {
        initMangas(rootPath, setMangas, setAutoTags)
      }
    } else {
      navigate('/welcome')
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-slate-600">
      <div className="p-4 drag"></div>
      <MangaWall />
    </div>
  )
}

export default App
