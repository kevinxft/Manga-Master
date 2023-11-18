import { Button } from 'antd'

function WelcomePage(): JSX.Element {
  return (
    <div className="h-screen grid bg-slate-500">
      <Button className="m-auto bg-slate-400 no-drag" type="primary">
        打开文件夹
      </Button>
    </div>
  )
}

export default WelcomePage
