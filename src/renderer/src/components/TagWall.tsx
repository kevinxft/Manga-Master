import { Button, Modal, Tag, Popconfirm, Input, InputRef, message } from 'antd'
import { useStore } from '@renderer/common/useStore'
import { useEffect, useRef, useState, useTransition } from 'react'
import { ModalPropsType } from '@renderer/common/constants'
import {
  ClearOutlined,
  CloseSquareOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons'
const { CheckableTag } = Tag

function TagWall(props: ModalPropsType) {
  const [messageApi, contextHolder] = message.useMessage()
  const tags = useStore((state) => state.tags)
  const search = useStore((state) => state.search)
  const autoTags = useStore((state) => state.autoTags)
  const setTags = useStore((state) => state.setTags)
  const setSearch = useStore((state) => state.setSearch)

  const [isEdit, setIsEdit] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [inputVisible, setInputVisible] = useState(false)
  const [newTag, setNewTag] = useState('')
  const tagInputRef = useRef<InputRef>(null)
  const [searchTag, setSearchTag] = useState('')

  const [isPending, startTransition] = useTransition()

  const onInputTag = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(evt.target.value)
  }

  useEffect(() => {
    tagInputRef.current?.focus()
  }, [inputVisible])

  const onInputConfirm = () => {
    const tag = newTag.trim().toLocaleLowerCase()
    if (tags.map((t) => t.toLocaleLowerCase()).includes(tag)) {
      messageApi.open({
        type: 'error',
        content: '该标签已经存在，提示：标签不区分大小写。'
      })
      return
    }
    if (tag) {
      setTags([...tags, tag])
    }
    setInputVisible(false)
  }

  const onToggleTags = (tag, checked) => {
    const nextTags = checked ? [...tags, tag] : tags.filter((t) => t !== tag)
    setTags(nextTags)
  }

  const onToggleSearchTags = (tag, checked) => {
    const nextSearch = checked ? [...search, tag] : search.filter((t) => t !== tag)
    startTransition(() => {
      setSearch(nextSearch)
    })
  }

  const onRemoveTag = (tag) => {
    const nextTags = tags.filter((t) => t !== tag)
    setTags(nextTags)
  }

  const resetUI = () => {
    setIsEdit(false)
    setIsAdd(false)
    setSearchTag('')
  }

  const onSearchTag = (evt) => {
    setSearchTag(evt.target.value.trim())
  }

  const onSaveAdd = () => {
    setIsAdd((val) => !val)
    setSearchTag('')
  }

  return (
    <Modal
      title="标签"
      style={{ top: 40 }}
      open={props.visible}
      centered
      width={1100}
      onCancel={props.onCancel}
      afterClose={resetUI}
      footer={() => null}
    >
      {contextHolder}
      <div className="h-[40vh]  overflow-hidden flex flex-col">
        <div className="flex items-center p-2 bg-slate-100">
          {!isAdd && (
            <div className="flex gap-2">
              <Button
                type="dashed"
                icon={isEdit ? <CloseSquareOutlined /> : <EditOutlined />}
                onClick={() => setIsEdit((value) => !value)}
              />

              {isEdit && (
                <Popconfirm
                  title="清空标签"
                  description="确定清空标签吗？该操作不可逆。"
                  okText="确定"
                  cancelText="不了"
                  onConfirm={() => setTags([])}
                >
                  <Button type="dashed" icon={<ClearOutlined />} />
                </Popconfirm>
              )}
            </div>
          )}
          {isAdd && (
            <Input
              style={{ width: 200 }}
              placeholder="输入标签"
              allowClear
              value={searchTag}
              onChange={onSearchTag}
            ></Input>
          )}
          <Button
            className="ml-auto"
            type="primary"
            icon={isAdd ? <SaveOutlined /> : <PlusCircleOutlined />}
            onClick={onSaveAdd}
          >
            {isAdd ? '保存' : '添加'}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto select-none">
          {isAdd ? (
            (searchTag
              ? autoTags.filter((t) => t.toLowerCase().includes(searchTag.toLowerCase()))
              : autoTags
            ).map((tag) => (
              <CheckableTag
                checked={tags.includes(tag)}
                onChange={(checked) => onToggleTags(tag, checked)}
                className="m-2"
                key={tag}
              >
                {tag}
              </CheckableTag>
            ))
          ) : isEdit ? (
            <>
              {tags.map((tag) => (
                <Tag className="m-2" closable key={tag} onClose={() => onRemoveTag(tag)}>
                  {tag}
                </Tag>
              ))}
              {inputVisible ? (
                <Input
                  ref={tagInputRef}
                  type="text"
                  size="small"
                  className="w-24 m-2"
                  value={newTag}
                  onChange={onInputTag}
                  onBlur={onInputConfirm}
                  onPressEnter={onInputConfirm}
                />
              ) : (
                <Tag
                  onClick={() => {
                    setNewTag('')
                    setInputVisible(true)
                  }}
                  className="bg-white border-dashed cursor-text"
                >
                  <PlusOutlined /> New tag
                </Tag>
              )}
            </>
          ) : (
            tags.map((tag) => (
              <CheckableTag
                checked={search.includes(tag)}
                onChange={(checked) => onToggleSearchTags(tag, checked)}
                className="m-2"
                key={tag}
              >
                {tag}
              </CheckableTag>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}

export default TagWall
