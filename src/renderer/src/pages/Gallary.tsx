import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { message, FloatButton } from 'antd'
import {
  ColumnHeightOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  HomeOutlined,
  LeftOutlined,
  MinusOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  RightOutlined,
  VerticalAlignMiddleOutlined,
  RollbackOutlined
} from '@ant-design/icons'
import { useStore } from '@renderer/common/useStore'

function Gallary() {
  const interval = useStore((state) => state.interval)
  const setInterval = useStore((state) => state.setInterval)
  const foldGallaryTools = useStore((state) => state.foldGallaryTools)
  const toggleFoldGallaryTools = useStore((state) => state.toggleFoldGallaryTools)

  const navigate = useNavigate()

  const [imgs, setImgs] = useState([])
  const [params] = useSearchParams()
  const [current, setCurrent] = useState(0)
  const [fitWidth, setFitWith] = useState(false)
  const [playing, setPlaying] = useState(false)

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
      setPlaying(false)
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

  useEffect(() => {
    let timer
    const _setInterval = (callback, delay) => {
      timer = setTimeout(() => {
        callback()
        _setInterval(callback, delay)
      }, delay)
    }
    if (playing) {
      _setInterval(onNext, interval * 1000)
    } else {
      clearTimeout(timer)
    }
    return () => clearTimeout(timer)
  }, [playing, interval])

  const onIncInterval = () => {
    setInterval(Math.min(interval + 1, 15))
  }

  const onDecIntercal = () => {
    setInterval(Math.max(interval - 1, 1))
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden select-none bg-slate-900">
      {imgs.length > 0 && (
        <img className={fitWidth ? 'w-full' : ''} onClick={onNext} src={imgs[current]} />
      )}

      {contextHolder}
      <FloatButton
        style={{ top: 30 }}
        className="bg-white"
        description={imgs.length}
        badge={{ count: current + 1, overflowCount: 999 }}
      />

      <FloatButton.Group shape="square">
        {(!foldGallaryTools || playing) && (
          <>
            {playing && (
              <>
                <FloatButton onClick={onIncInterval} className="bg-white" icon={<PlusOutlined />} />
                <FloatButton className="bg-white" description={interval} />
                <FloatButton
                  onClick={onDecIntercal}
                  className="bg-white"
                  icon={<MinusOutlined />}
                />
              </>
            )}
            <FloatButton
              className="bg-white"
              onClick={() => setPlaying((value) => !value)}
              icon={playing ? <PauseOutlined /> : <PlayCircleOutlined />}
            />
          </>
        )}

        {!foldGallaryTools && (
          <>
            <FloatButton className="bg-white" onClick={onNext} icon={<RightOutlined />} />
            <FloatButton className="bg-white" onClick={onPrev} icon={<LeftOutlined />} />
            <FloatButton
              className="bg-white"
              onClick={() => !playing && setCurrent(0)}
              icon={<HomeOutlined />}
            />
            <FloatButton
              className="bg-white"
              onClick={() => setFitWith((value) => !value)}
              icon={fitWidth ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            />
            <FloatButton
              onClick={() => navigate('/')}
              className="bg-white"
              icon={<RollbackOutlined />}
            />
          </>
        )}
        <FloatButton
          className="bg-white"
          onClick={toggleFoldGallaryTools}
          icon={foldGallaryTools ? <ColumnHeightOutlined /> : <VerticalAlignMiddleOutlined />}
        />
      </FloatButton.Group>
    </div>
  )
}

export default Gallary
