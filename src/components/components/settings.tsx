import { Space } from 'antd'
import '../diary.scss'
import Object from './object'
import Theme from './theme'
import Edit from './edit'

const Settings: React.FC = () => {
    

    return (<Space size="large">
        <Object />
        <Theme />
        <Edit />
        {/* <DeleteResults /> */}
    </Space>)
}

export default Settings