import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@renderer/common/useStore'

function WelcomePage(): JSX.Element {
  const setRootPath = useStore((state) => state.setRootPath)
  const navigate = useNavigate()
  const onSelectFolder = async () => {
    const path = await window.electron.ipcRenderer.invoke('select-folder')
    if (path) {
      setRootPath(path)
      setTimeout(() => {
        navigate('/')
      }, 0)
    }
  }
  return (
    <div className="grid h-screen bg-slate-500 drag">
      <Button className="m-auto bg-slate-400 no-drag" type="primary" onClick={onSelectFolder}>
        打开文件夹
      </Button>
    </div>
  )
}

export default WelcomePage
