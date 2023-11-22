import { useStore } from '@renderer/common/useStore'
import { useInView } from 'react-intersection-observer'
import MangaPost from './MangaPost'
import { createRef, useEffect, useState } from 'react'
import {
  SearchOutlined,
  VerticalAlignBottomOutlined,
  TagsOutlined,
  SyncOutlined,
  SettingOutlined,
  VerticalAlignTopOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import { Button, FloatButton, Input, Modal, Affix, Tag } from 'antd'

function filterMangas(mangas, tags) {
  if (tags.length) {
    return mangas.filter((manga) => tags.some((tag) => manga.path.includes(tag)))
  }
  return mangas
}

function MangaWall(): JSX.Element {
  const mangas = useStore((state) => state.mangas)
  const tags = useStore((state) => state.tags)
  const setSearch = useStore((state) => state.setSearch)
  const [showTags, setShowTags] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTags, setSearchTags] = useState<string[]>([])

  const container = createRef<HTMLDivElement>()

  const { ref } = useInView({
    threshold: 0
  })

  const onTop = () => {
    if (container.current) {
      container.current.scrollTo({ top: 0 })
    }
    console.dir(container.current)
  }

  const onBottom = () => {
    if (container.current) {
      container.current.scrollTo({ top: container.current.scrollHeight })
    }
  }

  const onShowTags = () => {
    setShowTags(true)
  }

  const onToggleTags = (tag: string) => {
    setSearchTags((value) => {
      if (value.includes(tag)) {
        return value.filter((t) => t !== tag)
      }
      return [...value, tag]
    })
  }

  useEffect(() => {
    console.log('searchTags', searchTags)

    setSearch(searchTags)
  }, [searchTags])

  return (
    <>
      <Affix offsetTop={0}>
        {searchTags.length > 0 && (
          <div className="flex items-center justify-end pt-2">
            {searchTags.map((tag) => (
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
          {filterMangas(mangas, searchTags).map((manga) => (
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

        <Modal
          title="标签"
          open={showTags}
          centered
          width={1000}
          onCancel={() => setShowTags(false)}
          footer={() => null}
        >
          {tags.map((tag) => (
            <Button
              onClick={() => onToggleTags(tag)}
              key={tag}
              type={searchTags.includes(tag) ? 'primary' : 'dashed'}
              className="m-1"
            >
              {tag}
            </Button>
          ))}
        </Modal>

        <FloatButton.Group className="bg-white shadow-sm" shape="square" style={{ right: 34 }}>
          <FloatButton onClick={onTop} icon={<VerticalAlignTopOutlined />} />
          <FloatButton onClick={() => setShowSearch(true)} icon={<SearchOutlined />} />
          <FloatButton onClick={onBottom} icon={<VerticalAlignBottomOutlined />} />
          <FloatButton onClick={onShowTags} icon={<TagsOutlined />} />
          <FloatButton icon={<SyncOutlined />} />
          <FloatButton icon={<SettingOutlined />} />
        </FloatButton.Group>
      </div>
    </>
  )
}

export default MangaWall
