import { useStore } from '@renderer/common/useStore'
import { syncMangas } from '@renderer/common/utils'
import PostWall, { PostWallType, PostWallFunc } from './PostWall'
import TagWall from './TagWall'
import SearchBar from './SearchBar'
import Settings from './Settings'
import { forwardRef, useEffect, useRef, useState, useTransition } from 'react'
import { FAVORITE_SYMBOL } from '@renderer/common/constants'
import {
  VerticalAlignBottomOutlined,
  TagsOutlined,
  SyncOutlined,
  SettingOutlined,
  VerticalAlignTopOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  ClearOutlined,
  SearchOutlined,
  HeartOutlined,
  HeartFilled
} from '@ant-design/icons'
import { FloatButton, Tag, Button } from 'antd'

const ForwardPostWall = forwardRef(PostWall)

function MangaWall(): JSX.Element {
  const mangas = useStore((state) => state.mangas)
  const rootPath = useStore((state) => state.rootPath)
  const autoTags = useStore((state) => state.autoTags)
  const setMangas = useStore((statte) => statte.setMangas)
  const setAutoTags = useStore((state) => state.setAutoTags)
  const search = useStore((state) => state.search)
  const setSearch = useStore((state) => state.setSearch)
  const [showTags, setShowTags] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const initKeyEvents = (e) => {
      if (showSearch || showTags || showSettings) {
        return
      }
      if (e.key === 't') {
        setShowTags(true)
      } else if (e.key === 'f' || e.key === 's') {
        setShowSearch(true)
      } else if (e.key === 'o') {
        setShowSettings(true)
      } else if (e.key === 'r') {
        setSearch([])
      }
    }
    document.addEventListener('keydown', initKeyEvents)
    return () => {
      document.removeEventListener('keydown', initKeyEvents)
    }
  }, [showSearch, showTags])

  const onSyncMangas = () => {
    if (syncing) {
      return
    }
    setSyncing(true)
    syncMangas(rootPath, (data, tags) => {
      setMangas(data)
      setAutoTags(tags)
      setSyncing(false)
    })
  }

  const onTop = () => {
    postWallRef.current?.toTop()
  }

  const onBottom = () => {
    postWallRef.current?.toBottom()
  }

  const onShowTags = () => {
    setShowTags(true)
  }

  const onToggleTags = (tag) => {
    setSearch(search.filter((search) => search !== tag))
  }

  const onShowFavoriteList = () => {
    if (search.includes(FAVORITE_SYMBOL)) {
      startTransition(() => {
        setSearch([])
      })
    } else {
      startTransition(() => {
        setSearch([FAVORITE_SYMBOL])
      })
    }
  }

  const wrapRef = useRef<HTMLDivElement>(null)
  const [wrapSize, setWrapSize] = useState<PostWallType>({ width: 0, height: 0 })

  useEffect(() => {
    const resize = () => {
      if (wrapRef.current) {
        setWrapSize({
          width: wrapRef.current.clientWidth,
          height: wrapRef.current.clientHeight
        })
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  const postWallRef = useRef<PostWallFunc>()

  return (
    <>
      {!search.includes(FAVORITE_SYMBOL) && search.length > 0 && (
        <div className="flex items-center gap-2 px-2 py-1">
          <Button icon={<ClearOutlined />} onClick={() => setSearch([])} size="small" />
          {search.map((tag) => (
            <Tag key={tag} closeIcon={<CloseCircleOutlined />} onClose={() => onToggleTags(tag)}>
              {tag}
            </Tag>
          ))}
        </div>
      )}
      <div ref={wrapRef} className="flex-1 w-[100%] overflow-hidden">
        <ForwardPostWall {...wrapSize} ref={postWallRef} />
      </div>
      <SearchBar visible={showSearch} onCancel={() => setShowSearch(false)} />
      <TagWall visible={showTags} onCancel={() => setShowTags(false)} />
      <Settings visible={showSettings} onCancel={() => setShowSettings(false)} />
      <FloatButton.Group className="bg-white shadow-sm" shape="square" style={{ right: 34 }}>
        <FloatButton onClick={onTop} icon={<VerticalAlignTopOutlined />} />
        {mangas.length && (
          <FloatButton onClick={() => setShowSearch(true)} icon={<SearchOutlined />} />
        )}
        {autoTags.length > 0 && <FloatButton onClick={onShowTags} icon={<TagsOutlined />} />}
        <FloatButton
          onClick={onShowFavoriteList}
          icon={
            isPending ? (
              <LoadingOutlined />
            ) : search.includes(FAVORITE_SYMBOL) ? (
              <HeartFilled style={{ color: '#FA7070' }} />
            ) : (
              <HeartOutlined />
            )
          }
        />

        <FloatButton onClick={onBottom} icon={<VerticalAlignBottomOutlined />} />
        <FloatButton
          onClick={onSyncMangas}
          icon={syncing ? <LoadingOutlined /> : <SyncOutlined />}
        />
        <FloatButton onClick={() => setShowSettings(true)} icon={<SettingOutlined />} />
      </FloatButton.Group>
    </>
  )
}

export default MangaWall
