import { Space } from 'antd'
import '../diary.scss'
import Object from './object'
import Theme from './theme'

const Settings: React.FC = () => {
    

    return (<Space size="large">
        <Object />
        <Theme />
        {/* <DeleteResults /> */}
    </Space>)
}

export default Settings