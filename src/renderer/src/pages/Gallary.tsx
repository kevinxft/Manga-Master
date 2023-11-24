import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { message, FloatButton } from 'antd'
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons'

function Gallary() {
  const [imgs, setImgs] = useState([])
  const [params] = useSearchParams()
  const [current, setCurrent] = useState(0)
  const [fitWidth, setFitWith] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()

  const getImgs = async (path: string) => {
    const result = await window.electron.ipcRenderer.invoke('get-imgs', path)
    setImgs(result)
  }

  const onPrev = () => {
    setCurrent((value) => {
      if (value > 0) {
        return value - 1
      }
      messageApi.open({
        type: 'warning',
        content: '已经是第一张了'
      })
      return value
    })
  }

  const onNext = () => {
    setCurrent((value) => {
      if (value < imgs.length - 1) {
        return value + 1
      }
      messageApi.open({
        type: 'warning',
        content: '已经是最后一张了'
      })
      return value
    })
  }

  useEffect(() => {
    const initKeyEvents = (e) => {
      if (e.key === ' ') {
        e.preventDefault()
        onNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onNext()
      } else if (e.key === 'x' || e.key === 'Escape') {
        e.preventDefault()
        window.electron.ipcRenderer.invoke('exit-gallary')
      }
    }
    document.addEventListener('keydown', initKeyEvents)
    return () => {
      document.removeEventListener('keydown', initKeyEvents)
    }
  }, [imgs])

  useEffect(() => {
    const path = params.get('path')
    if (path) {
      getImgs(path)
      setCurrent(0)
    }
  }, [params])

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden select-none bg-slate-900">
      {imgs.length > 0 && (
        <img className={fitWidth ? 'w-full' : ''} onClick={onNext} src={imgs[current]} />
      )}

      {contextHolder}

      <FloatButton
        style={{ top: 50, background: '#fff' }}
        description={imgs.length}
        badge={{ count: current + 1, overflowCount: 999 }}
      />

      <FloatButton.Group className="bg-white shadow-sm" shape="square">
        <FloatButton onClick={onPrev} icon={<LeftOutlined />} />
        <FloatButton onClick={onNext} icon={<RightOutlined />} />
        <FloatButton
          onClick={() => setFitWith((value) => !value)}
          icon={fitWidth ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        />
      </FloatButton.Group>
    </div>
  )
}

export default Gallary
