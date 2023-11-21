import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Tooltip } from 'antd'
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  LeftOutlined,
  RightOutlined
  // ZoomInOutlined,
  // ZoomOutOutlined
} from '@ant-design/icons'

function Gallary() {
  const [imgs, setImgs] = useState([])
  const [params] = useSearchParams()
  const [current, setCurrent] = useState(0)
  const [fitWidth, setFitWith] = useState(false)
  const [path, setPath] = useState('')

  const getImgs = async (path: string) => {
    const result = await window.electron.ipcRenderer.invoke('get-imgs', path)
    setImgs(result)
  }

  const onPrev = () => {
    setCurrent((value) => {
      if (value > 0) {
        return value - 1
      }
      return value
    })
  }

  const onNext = () => {
    setCurrent((value) => {
      if (value < imgs.length - 1) {
        return value + 1
      }
      return value
    })
  }

  useEffect(() => {
    const initKeyEvents = (e) => {
      console.log(e.key)
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
    console.log(path)
    if (path) {
      getImgs(path)
      setCurrent(0)
    }
  }, [params])

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden bg-slate-900 ">
      {imgs.length > 0 && (
        <img className={fitWidth ? 'w-full' : ''} onClick={onNext} src={imgs[current]} />
      )}
      <div className="flex items-center justify-center p-2 mt-10 rounded-md bg-white/60 ">
        <Tooltip title="上一张">
          <Button disabled={current === 0} icon={<LeftOutlined />} type="text" onClick={onPrev} />
        </Tooltip>
        <Tooltip title="下一张">
          <Button
            disabled={current === imgs.length - 1}
            icon={<RightOutlined />}
            type="text"
            onClick={onNext}
          />
        </Tooltip>
        <Tooltip title={fitWidth ? '原始大小' : '适应屏幕'}>
          <Button
            type="text"
            onClick={() => setFitWith((value) => !value)}
            icon={fitWidth ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          />
        </Tooltip>
        {/* <Button icon={<ZoomInOutlined />} onClick={onZoomIn} type="text" />
        <Button icon={<ZoomOutOutlined />} onClick={onZoonOut} type="text" /> */}
        <div className="px-2 text-sm">
          {current + 1} / {imgs.length}
        </div>
      </div>
    </div>
  )
}

export default Gallary
