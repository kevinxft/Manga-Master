import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from '@renderer/common/useStore'
function App(): JSX.Element {
  const rootPath = useStore((state) => state.rootPath)
  const navigate = useNavigate()

  useEffect(() => {
    if (rootPath) {
      console.log(rootPath)
    } else {
      navigate('/welcome')
    }
  }, [rootPath])

  return <div className="flex h-screen bg-slate-600">APP</div>
}

export default App
