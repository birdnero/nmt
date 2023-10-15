import { Button, DatePicker, Input, Modal, Select, SelectProps, Space, Tooltip, Typography } from "antd"
import { useState } from "react"
import { FetchFn } from "../ADDITIONAL"
import { Iadditional } from "../types"
import dayjs from 'dayjs';
import Loading from "./loading"
import { LoadingOutlined } from "@ant-design/icons"
import { useActions } from "../../store/hooks/useActions";

const AddNew: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [openAdd, setOpenAdd] = useState(false)

    const [options1, setOptions1] = useState<SelectProps['options']>()
    const [options2, setOptions2] = useState<SelectProps['options']>()
    const { errorMessage } = useActions()

    const [option1Value, setOption1Value] = useState<string>('')
    const [option2Value, setOption2Value] = useState<string>('')
    const [Date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
    const [name, setName] = useState<string>('')
    const [tasks, setTasks] = useState<number | null>(null)
    const [denied, setDenied] = useState<number | null>(null)
    const [skipped, setSkipped] = useState<number | null>(null)
    const [description, setDescription] = useState<string>('')

    const SendErrorMessage = (message: React.ReactNode | string, time: number = 1.5): void => {
        if (errorMessage) {
            errorMessage({
                args: {
                    content: message,
                },
                time: time
            })
        }
    }


    const getNeededInfo = () => {
        FetchFn({
            type: "get_nmt_additional"
        },
            (data: Iadditional[]) => {
                const objects: Iadditional[] = []
                const themes: Iadditional[] = []
                data.forEach(el3 => {
                    if (el3.type === "object") {
                        objects.push(el3)
                    } else {
                        themes.push(el3)
                    }
                })
                const options_1: SelectProps['options'] = objects.map(el3 => ({
                    label: el3.value,
                    value: el3.value,
                }))
                const options_2: SelectProps['options'] = themes.map(el3 => ({
                    label: el3.value,
                    value: el3.value,
                }))

                setOptions1(options_1)
                setOptions2(options_2)
            }, setLoading, errorMessage)
    }

    const okFn = () => {

        if (option1Value != "" && option2Value != "" && Date != "" && tasks != null && denied != null && skipped != null) {
            if (tasks - skipped < denied) {
                SendErrorMessage("щось не так з пропущеними")
            } else {
                FetchFn({
                    type: 'add_new_result',
                    object: option1Value,
                    theme: option2Value,
                    name: name,
                    date: Date,
                    tasks: tasks,
                    denied: denied,
                    skipped: skipped,
                    description: description
                }, () => {
                    setOpenAdd(false)
                }, setLoading2, errorMessage)
            }
        } else {
            SendErrorMessage("не введено інформацію")
        }
    }

    return (<>
        <Modal
            title={false}
            open={openAdd}
            onCancel={() => setOpenAdd(false)}
            onOk={() => okFn()}
            okButtonProps={{ icon: loading2 ? <LoadingOutlined /> : null }}>
            {loading ? <Loading /> :
                <Space direction="vertical" style={{ width: "80%" }}>
                    <Select
                        style={{ width: "100%" }}
                        options={options1}
                        onChange={value => setOption1Value(value)}
                    />

                    <Select
                        style={{ width: "100%" }}
                        options={options2}
                        onChange={value => setOption2Value(value)} />

                    <Input placeholder="опис / назва (не обов'язково)" onChange={(value) => setName(value.target.value)} value={name} />

                    <Space>
                        <DatePicker
                            onChange={(date, dateString) => {
                                setDate(dateString)
                                date ?? null//просто заглушка
                            }}
                            format={"YYYY-MM-DD"}
                            defaultValue={dayjs()}
                        />
                        <Typography.Text>дата</Typography.Text>
                    </Space>

                    <Space>
                        <Input style={{ width: "3rem" }} onChange={(value) => {
                            const new_value = value.target.value.match(/\d/g)?.join("")
                            if (new_value) {
                                setTasks(parseInt(new_value))
                            } else {
                                setTasks(0)
                            }
                        }} value={tasks ? tasks : ""} />
                        <Typography.Text>кількість завдань</Typography.Text>
                    </Space>

                    <Space>
                        <Input style={{ width: "3rem" }} onChange={(value) => {
                            const new_value = value.target.value.match(/\d/g)?.join("")
                            if (new_value) {
                                setDenied(parseInt(new_value))
                            } else {
                                setDenied(0)
                            }
                        }} value={denied ? denied : ""} />
                        <Typography.Text>не пройдених</Typography.Text>
                    </Space>

                    <Space>
                        <Input style={{ width: "3rem" }} onChange={(value) => {
                            const new_value = value.target.value.match(/\d/g)?.join("")
                            if (new_value) {
                                setSkipped(parseInt(new_value))
                            } else {
                                setSkipped(0)
                            }
                        }} value={skipped ? skipped : ""} />
                        <Typography.Text>пропущених</Typography.Text>
                    </Space>

                    <Input.TextArea onChange={(value) => setDescription(value.target.value)} value={description} placeholder="додатково (не обов'язково)" autoSize={{ maxRows: 2, minRows: 2 }} />
                </Space>}
        </Modal >
        <Space align="center" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Tooltip title='додати'>
                <Button onClick={() => {
                    setOption1Value('')
                    setOption2Value('')
                    setName('')
                    setTasks(null)
                    setDenied(null)
                    setSkipped(null)
                    setDescription('')
                    setOpenAdd(true)
                    getNeededInfo()
                }}>+</Button>
            </Tooltip>
        </Space>
    </>
    )
}

export default AddNew