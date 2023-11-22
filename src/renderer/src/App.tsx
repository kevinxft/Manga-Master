import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from '@renderer/common/useStore'
import MangaWall from '@renderer/components/MangaWall'
import { initMangas, generateTags } from '@renderer/common/utils'

function App(): JSX.Element {
  const rootPath = useStore((state) => state.rootPath)
  const mangas = useStore((state) => state.mangas)
  const setMangas = useStore((state) => state.setMangas)
  const setTags = useStore((state) => state.setTags)
  const navigate = useNavigate()

  useEffect(() => {
    if (rootPath) {
      // initMangas(rootPath, setMangas, setTags)
    } else {
      navigate('/welcome')
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-slate-600">
      <MangaWall />
    </div>
  )
}

export default App
