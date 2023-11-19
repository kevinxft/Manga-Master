import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function Gallary() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  useEffect(() => {
    console.log(params.get('path'))
  }, [params])
  return <div onClick={() => navigate('/')}>Gallary</div>
}

export default Gallary
