import { Input, Modal, InputRef, message } from 'antd'
import { useRef, useState } from 'react'
import { useStore } from '@renderer/common/useStore'
import { ModalPropsType } from '@renderer/common/constants'

function SearchBar(props: ModalPropsType) {
  const [messageApi, contextHolder] = message.useMessage()
  const [query, setQuery] = useState('')
  const search = useStore((state) => state.search)
  const setSearch = useStore((state) => state.setSearch)
  const inputRef = useRef<InputRef>(null)

  const onSearch = () => {
    const q = query.trim().toLowerCase()
    if (q && search.map((s) => s.toLowerCase()).includes(q)) {
      messageApi.error('标签已存在')
      return
    }
    setSearch([...search, q])
  }

  const autoFocusInput = (open) => {
    if (open) {
      inputRef.current?.focus()
    } else {
      setQuery('')
    }
  }

  const onInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(evt.target.value)
  }

  return (
    <Modal
      title="搜索"
      centered
      open={props.visible}
      onCancel={props.onCancel}
      footer={() => null}
      afterOpenChange={autoFocusInput}
    >
      {contextHolder}
      <Input
        ref={inputRef}
        value={query}
        onChange={onInput}
        placeholder="输入关键词作为标签搜索"
        allowClear
        onPressEnter={onSearch}
      />
    </Modal>
  )
}

export default SearchBar
