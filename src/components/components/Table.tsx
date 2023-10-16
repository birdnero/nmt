import { ReactNode, useEffect, useState } from 'react'
import '../diary.scss'
import { FetchFn } from '../ADDITIONAL'
import { Iresult } from '../types'
import { useActions } from '../../store/hooks/useActions'
import Settings from './settings'
import Loading from './loading'
import { Button, Divider, Modal, Space, Tooltip, Typography } from 'antd'
import { SettingTwoTone } from '@ant-design/icons'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip,
    ChartData,
    BubbleDataPoint,
    Point,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs'
import styles from '../styles'
import AddNew from './addNew'


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ChartTooltip
);

const Table: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [FT, setFT] = useState(true)
    const [openSettings, setOpenSettings] = useState(false)
    const { errorMessage } = useActions()
    const [Chartdata, setChartdata] = useState<ChartData<"line", (number | [number, number] | Point | BubbleDataPoint | null)[], unknown>>()
    const [elements, setElements] = useState<ReactNode[]>([])
    const [naming, setNaming] = useState('')


    useEffect(() => {
        if (FT) {
            FetchFn({ type: "get_results" }, (data: Iresult[]) => {
                const data3: Iresult[] = data.map(date => {
                    let answer = { ...date }
                    answer.date = dayjs(date.date).format('MM.DD')
                    return answer
                })
                data3.sort((a, b) => {
                    const dateA = dayjs(a.date);
                    const dateB = dayjs(b.date);
                    return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
                });

                const Objects: {object: string, theme: string[]}[]=[]
                data3.forEach(el3=>{
                    let I_obj = true
                    Objects.forEach(el4=>{
                        if(el4.object === el3.object){
                            I_obj = false
                            let I_theme = true
                            el4.theme.forEach(el5=>{
                                if(el3.theme === el5){
                                    I_theme = false
                                }
                            })
                            if(I_theme){
                                el4.theme.push(el3.theme)
                            }
                        }
                    })
                    if(I_obj){
                        Objects.push({object: el3.object, theme: [el3.theme]})
                    }
                })

                const el33 = Objects[0]
                const labels: string[] = []
                            const success: number[] = []
                            data3.forEach(el5 => {
                                if (el33.object === el5.object && el33.theme[0] === el5.theme) {
                                    setNaming(el5.object + " " + el33.theme[0])
                                    labels.push(el5.date)
                                    success.push(Math.round(100 - ((100 / (el5.tasks - el5.skipped)) * el5.denied)))
                                }
                            })
                            setChartdata({
                                labels: labels,
                                datasets: [
                                    {
                                        backgroundColor: undefined,
                                        label: "%",
                                        data: success,
                                        pointBackgroundColor: styles.$blue,
                                        tension: 0.333,
                                    }
                                ],
                            })

                const Objects_JSX = Objects.map(el3=>(<Space size={"large"} style={{
                    display: "grid",
                    gridTemplateColumns: "25% 5px auto "
                }}>
                    <>{el3.object}</>
                    <Divider type='vertical' />
                    <Space size={"large"} style={{display: "flex", flexWrap: "wrap"}}>
                        {el3.theme.map(el4=>(<Button onClick={() => {
                            const labels: string[] = []
                            const success: number[] = []
                            data3.forEach(el5 => {
                                if (el3.object === el5.object && el4 === el5.theme) {
                                    setNaming(el5.object + " " + el4)
                                    labels.push(el5.date)
                                    success.push(Math.round(100 - ((100 / (el5.tasks - el5.skipped)) * el5.denied)))
                                }
                            })
                            setChartdata({
                                labels: labels,
                                datasets: [
                                    {
                                        backgroundColor: undefined,
                                        label: "%",
                                        data: success,
                                        pointBackgroundColor: styles.$blue,
                                        tension: 0.333,
                                    }
                                ],
                            })
                        }}>
                            {el4}
                        </Button>))}
                    </Space>
                </Space>))
                setElements(Objects_JSX)

            }, setLoading, errorMessage)
            setFT(false)
        }
    }, [])

    return (<>
        <Modal
            title="Налаштування"
            open={openSettings}
            onCancel={() => setOpenSettings(false)}
            onOk={() => setOpenSettings(false)}>
            <Settings />
        </Modal>

        {loading ? <Loading /> : <Space direction='vertical' style={{ width: "100dvw" }}>
            <AddNew />
            <Space style={{ position: "absolute", top: "2.5%", right: "2.5%" }}>
                <Tooltip title='налаштування'>
                    <Button onClick={() => setOpenSettings(true)} type="link" icon={<SettingTwoTone />} />
                </Tooltip>
            </Space>
            <Space direction='vertical' style={{
                width: "95dvw",
                marginRight: "4dvw", 
                marginLeft: "1dvh",
            }}>{elements}</Space>
            {Chartdata ? <div style={{ width: "95dvw", marginRight: "4dvw", marginLeft: "1dvh" }}>
                
                    <Typography.Title level={2} style={{ color: styles.$blue }} >{naming}</Typography.Title>
                
                <Line options={{
                    backgroundColor: "#00000000",
                    scales: {
                        y: {
                            ticks: {
                                callback(tickValue) {
                                    return tickValue + " %"
                                },
                            },
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                drawTicks: false,
                                drawOnChartArea: true,
                            }
                        },
                        x: {
                            ticks: {
                                maxTicksLimit: 10,
                                padding: 15
                            },
                            grid: {
                                drawTicks: false,
                                drawOnChartArea: false,
                            },
                        }
                    },
                }} data={Chartdata ? Chartdata : {
                    labels: [],
                    datasets: [],
                }} />
            </div> : ""}
        </Space>}
    </>)
}

export default Table