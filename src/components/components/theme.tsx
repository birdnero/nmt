import { ReactNode, useEffect, useState } from 'react'
import '../diary.scss'
import Loading from './loading'
import { useActions } from '../../store/hooks/useActions'
import { Iobject } from '../types'
import { Button, Input, Modal, Space } from 'antd'
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { FetchFn } from '../ADDITIONAL'

const Themes: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [objectsData, setObjectsData] = useState<Iobject[]>([])
    const [objects, setObjects] = useState<ReactNode[]>([])
    const { errorMessage } = useActions()
    const [openTimetable, setOpenTimeTable] = useState(false)

    const DataAPI = (data: Iobject[]): void => {
        setObjectsData(data)
    }

    useEffect(() => {
        const objects: ReactNode[] = []
        objectsData.forEach(el => {
            if (el.changes != "delete") {
                objects.push(<div key={el.value + el.id}>
                    <Input
                        defaultValue={el.value}
                        onBlur={value => {
                            setObjectsData(prevData => {
                                const answer: Iobject[] = prevData.map(el3 => {
                                    if (el.id === el3.id) {
                                        return {
                                            value: value.target.value,
                                            id: el.id,
                                            changes: el.changes === "new" ? "new" : "changed"
                                        }
                                    } else {
                                        return el3
                                    }
                                })
                                return answer
                            })
                        }}
                        addonAfter={<DeleteOutlined onClick={() => {
                            setObjectsData(prevData => {
                                const answer: Iobject[] = []
                                prevData.forEach(el3 => {
                                    if (el.id === el3.id) {
                                        if (el.changes != "new") {
                                            answer.push({
                                                value: el3.value,
                                                id: el3.id,
                                                changes: "delete"
                                            })
                                        }
                                    } else {
                                        answer.push(el3)
                                    }
                                })
                                return answer
                            })

                        }} />} />
                </div>)
            }
        })
        setObjects(objects)
    }, [objectsData])

    const setNewValues = () => {

        const insert_data: string[] = []
        const update_data: Iobject[] = []
        const delete_data: number[] = []

        objectsData.forEach(el => {
            if (el.changes === "changed" && el.value != "") {
                update_data.push({ value: el.value, id: el.id })
            }
            if (el.changes === "delete") {
                delete_data.push(el.id)
            }
            if (el.changes === "new" && el.value != "") {
                insert_data.push(el.value)
            }
        })
        FetchFn({
            type: "update_themes",
            for_insert: JSON.stringify(insert_data),
            for_delete: JSON.stringify(delete_data),
            for_update: JSON.stringify(update_data),
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

                    <Space style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", justifyContent: "center" }}>{objects}</Space>
                    <Button onClick={() => {
                        setObjectsData(prevData => ([...prevData, { value: "", id: Math.floor(Math.random() * 100), changes: "new" }]))
                    }}>додати</Button>
                </Space>}
        </Modal>
        <Button onClick={() => {
            FetchFn({ type: "get_themes" }, DataAPI, setLoading, errorMessage)
            setOpenTimeTable(true)
        }} >тематики</Button>
    </>)

}

export default Themes