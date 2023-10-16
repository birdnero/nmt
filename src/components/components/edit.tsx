import { ReactNode, useEffect, useState } from 'react'
import '../diary.scss'
import Loading from './loading'
import { useActions } from '../../store/hooks/useActions'
import { IeditResult } from '../types'
import { Button, Modal, Space, Typography } from 'antd'
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { FetchFn } from '../ADDITIONAL'
import dayjs from 'dayjs'

const { Text } = Typography

const Objects: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [objectsData, setObjectsData] = useState<IeditResult[]>([])
    const [objects, setObjects] = useState<ReactNode[]>([])
    const { errorMessage } = useActions()
    const [openTimetable, setOpenTimeTable] = useState(false)

    const DataAPI = (data: IeditResult[]): void => {
        setObjectsData(data)
    }

    useEffect(() => {
        const objects: ReactNode[] = []
        objectsData.forEach(el => {
            if (el.changes != "delete") {
                objects.push(<div
                    key={el.id}
                    style={{
                        display: "grid",
                        gridTemplateColumns: " 2fr 5fr 5fr 1fr 1fr",
                        gap: "5px",
                        alignItems: "center"
                    }}>
                    <Text>{dayjs(el.date).format('MM.DD')}</Text>
                    <Text>{el.object}</Text>
                    <Text>{el.theme}</Text>
                    <Text>{Math.round(100 - ((100 / (el.tasks - el.skipped)) * el.denied))}{"%"}</Text>
                    <Button
                        onClick={() => {
                            setObjectsData(prevData => prevData.map(el3 => {
                                if (el3.id === el.id) {
                                    return {
                                        ...el3,
                                        changes: "delete"
                                    }
                                } else {
                                    return el3
                                }
                            }))
                        }}
                        icon={<DeleteOutlined />} />
                </div>)
            }
        })
        setObjects(objects)
    }, [objectsData])

    const setNewValues = () => {

        const delete_data: number[] = []

        objectsData.forEach(el => {
            if (el.changes === "delete") {
                delete_data.push(el.id)
            }
        })
        FetchFn({
            type: "edit_results",
            for_delete: JSON.stringify(delete_data),
        }, () => {
            setOpenTimeTable(false)
        }, setLoading2, errorMessage)
    }


    return (<>
        <Modal
            className="timetable_modal"
            title={false}
            open={openTimetable}
            onCancel={() => {
                setOpenTimeTable(false)
            }}
            onOk={() => {
                setNewValues()
            }}
            okButtonProps={{ icon: loading2 ? <LoadingOutlined /> : null }}
        >
            {loading ? <Loading /> :
                <Space align='center' direction='vertical'>

                    <Space style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr", justifyContent: "center" }}>
                        {objects}
                    </Space>
                </Space>}
        </Modal>
        <Button onClick={() => {
            FetchFn({ type: "get_results" }, DataAPI, setLoading, errorMessage)
            setOpenTimeTable(true)
        }} >редагувати</Button>
    </>)

}

export default Objects