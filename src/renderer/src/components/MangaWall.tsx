import { useStore } from '@renderer/common/useStore'
import { useInView } from 'react-intersection-observer'
import { syncMangas } from '@renderer/common/utils'
import MangaPost from './MangaPost'
import TagWall from './TagWall'
import SearchBar from './SearchBar'
import Settings from './Settings'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
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
import { FloatButton, Affix, Tag, Button } from 'antd'

function filterMangas(mangas, tags, favorites) {
  if (tags.includes(FAVORITE_SYMBOL)) {
    return mangas.filter((manga) => favorites.includes(manga.path))
  }
  if (tags.length) {
    return mangas.filter((manga) =>
      tags.some((tag) => manga.path.toLocaleLowerCase().includes(tag.toLocaleLowerCase()))
    )
  }
  return mangas
}

function MangaWall(): JSX.Element {
  const mangas = useStore((state) => state.mangas)
  const rootPath = useStore((state) => state.rootPath)
  const autoTags = useStore((state) => state.autoTags)
  const favorites = useStore((state) => state.favorites)
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

  const container = useRef<HTMLDivElement>(null)

  const { ref } = useInView({
    threshold: 0
  })

  const onTop = () => {
    if (container.current) {
      container.current.scrollTo({ top: 0 })
    }
  }

  const onBottom = () => {
    if (container.current) {
      container.current.scrollTo({ top: container.current.scrollHeight })
    }
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

  const _mangas = useMemo(() => {
    return filterMangas(mangas, search, favorites)
  }, [mangas, search, favorites])

  return (
    <>
      <Affix offsetTop={0}>
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
      </Affix>
      <div ref={container} className="h-screen w-[100%] overflow-y-auto scroll-smooth">
        <div
          ref={ref}
          className="grid gap-2 p-2 min-[300px]:grid-cols-2 min-[550px]:grid-cols-3 min-[800px]:grid-cols-4 min-[1050px]:grid-cols-5 min-[1300px]:grid-cols-6 min-[1550px]:grid-cols-7 min-[1800px]:grid-cols-8 min-[2050px]:grid-cols-9 min-[2300px]:grid-cols-10 min-[2550px]:grid-cols-11 min-[2800px]:grid-cols-12"
        >
          {_mangas.map((manga) => (
            <MangaPost key={manga.path} {...manga} />
          ))}
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
      </div>
    </>
  )
}

export default MangaWall
