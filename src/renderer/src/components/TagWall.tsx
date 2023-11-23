import { Button, Modal, Tag, Popconfirm } from 'antd'
import { useStore } from '@renderer/common/useStore'
import { useState } from 'react'
import {
  ClearOutlined,
  CloseSquareOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined
} from '@ant-design/icons'
const { CheckableTag } = Tag

type propsType = {
  showTags: boolean
  setShowTags: (show: boolean) => void
}

function TagWall(props: propsType) {
  const tags = useStore((state) => state.tags)
  const search = useStore((state) => state.search)
  const autoTags = useStore((state) => state.autoTags)
  const setTags = useStore((state) => state.setTags)
  const setSearch = useStore((state) => state.setSearch)

  const [isEdit, setIsEdit] = useState(false)
  const [isAdd, setIsAdd] = useState(false)

  const onToggleTags = (tag, checked) => {
    const nextTags = checked ? [...tags, tag] : tags.filter((t) => t !== tag)
    setTags(nextTags)
  }

  const onToggleSearchTags = (tag, checked) => {
    const nextSearch = checked ? [...search, tag] : search.filter((t) => t !== tag)
    setSearch(nextSearch)
  }

  const onRemoveTag = (tag) => {
    const nextTags = tags.filter((t) => t !== tag)
    setTags(nextTags)
  }

  return (
    <Modal
      title="标签"
      style={{ top: 40 }}
      open={props.showTags}
      centered
      width={1100}
      onCancel={() => props.setShowTags(false)}
      footer={() => null}
    >
      <div className="max-h-[80vh] min-h-[20vh] overflow-hidden flex flex-col">
        <div className="flex p-2 bg-slate-100">
          {!isAdd && (
            <div className="flex gap-2">
              <Popconfirm
                title="清空标签"
                description="确定清空标签吗？该操作不可逆。"
                okText="确定"
                cancelText="不了"
                onConfirm={() => setTags([])}
              >
                <Button className="ml-2" type="dashed" icon={<ClearOutlined />} />
              </Popconfirm>
              <Button
                className="ml-auto"
                type="dashed"
                icon={isEdit ? <CloseSquareOutlined /> : <EditOutlined />}
                onClick={() => setIsEdit((value) => !value)}
              ></Button>
            </div>
          )}
          <Button
            className="ml-auto"
            type="primary"
            icon={isAdd ? <SaveOutlined /> : <PlusCircleOutlined />}
            onClick={() => setIsAdd((value) => !value)}
          >
            {isAdd ? '保存' : '添加'}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto select-none">
          {isAdd
            ? autoTags.map((tag) => (
                <CheckableTag
                  checked={tags.includes(tag)}
                  onChange={(checked) => onToggleTags(tag, checked)}
                  className="m-2"
                  key={tag}
                >
                  {tag}
                </CheckableTag>
              ))
            : isEdit
              ? tags.map((tag) => (
                  <Tag className="m-2" closable key={tag} onClose={() => onRemoveTag(tag)}>
                    {tag}
                  </Tag>
                ))
              : tags.map((tag) => (
                  <CheckableTag
                    checked={search.includes(tag)}
                    onChange={(checked) => onToggleSearchTags(tag, checked)}
                    className="m-2"
                    key={tag}
                  >
                    {tag}
                  </CheckableTag>
                ))}
        </div>
      </div>
    </Modal>
  )
}

export default TagWall
