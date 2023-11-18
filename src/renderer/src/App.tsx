import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
function App(): JSX.Element {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/welcome')
  }, [])

  return <div className="h-screen flex bg-slate-600">APP</div>
}

export default App
