import { Modal } from 'antd'
import { ModalPropsType } from '@renderer/common/constants'

function Settings(props: ModalPropsType) {
  return (
    <Modal centered title="Settings" open={props.visible} onCancel={props.onCancel} footer={null}>
      <div>setting 1</div>
    </Modal>
  )
}

export default Settings
