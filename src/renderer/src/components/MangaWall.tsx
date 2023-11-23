import { useStore } from '@renderer/common/useStore'
import { useInView } from 'react-intersection-observer'
import { syncMangas } from '@renderer/common/utils'
import MangaPost from './MangaPost'
import TagWall from './TagWall'
import { useRef, useState } from 'react'
import {
  SearchOutlined,
  VerticalAlignBottomOutlined,
  TagsOutlined,
  SyncOutlined,
  SettingOutlined,
  VerticalAlignTopOutlined,
  CloseCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import { FloatButton, Input, Modal, Affix, Tag } from 'antd'

function filterMangas(mangas, tags) {
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
  const setMangas = useStore((statte) => statte.setMangas)
  const setAutoTags = useStore((state) => state.setAutoTags)
  const search = useStore((state) => state.search)
  const setSearch = useStore((state) => state.setSearch)
  const [showTags, setShowTags] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [syncing, setSyncing] = useState(false)

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

  return (
    <>
      <Affix offsetTop={0}>
        {search.length > 0 && (
          <div className="flex items-center px-2 py-1">
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
          {filterMangas(mangas, search).map((manga) => (
            <MangaPost key={manga.path} {...manga} />
          ))}
        </div>

        <Modal
          title="搜索"
          open={showSearch}
          centered
          onCancel={() => setShowSearch(false)}
          footer={() => null}
        >
          <Input.Search allowClear enterButton="搜索" />
        </Modal>

        <TagWall showTags={showTags} setShowTags={setShowTags} />

        <FloatButton.Group className="bg-white shadow-sm" shape="square" style={{ right: 34 }}>
          <FloatButton onClick={onTop} icon={<VerticalAlignTopOutlined />} />
          <FloatButton onClick={() => setShowSearch(true)} icon={<SearchOutlined />} />
          <FloatButton onClick={onBottom} icon={<VerticalAlignBottomOutlined />} />
          <FloatButton onClick={onShowTags} icon={<TagsOutlined />} />
          <FloatButton
            onClick={onSyncMangas}
            icon={syncing ? <LoadingOutlined /> : <SyncOutlined />}
          />
          <FloatButton icon={<SettingOutlined />} />
        </FloatButton.Group>
      </div>
    </>
  )
}

export default MangaWall
