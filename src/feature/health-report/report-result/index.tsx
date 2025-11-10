import DownloadPdfButton from "@/components/download-pdf-button";
import LineChart from "@/components/line-chart";
import PieChart from "@/components/pie-chart";
import useWindowSize from "@/hooks/useWindowSize";
import useHealthReportStore from "@/stores/useHealthReportStore";
import { Col, Divider, Progress, Row, Table, theme, Typography } from "antd";
import { memo, useMemo } from "react";
import { exerciseCalendarColumns } from "./utils";

const { Text, Title } = Typography;

const HealthReport: React.FC = () => {
    const { size } = useWindowSize();
    const {token} = theme.useToken();
    const healthReport = useHealthReportStore((state) => state.healthReport);

    const summary = useMemo(() => healthReport?.summary, [healthReport?.summary]);
    const weightProgress = useMemo(() => healthReport?.charts?.weightProgress, [healthReport?.charts?.weightProgress]);
    const exerciseCalendar = useMemo(() => healthReport?.exerciseCalendar, [healthReport?.exerciseCalendar]);
    const exerciseEffort = useMemo(() => healthReport?.charts?.exerciseEffort.map((item) => ({
        ...item,
        type: 'Calories Burned'
    })), [healthReport?.charts?.exerciseEffort]);
    const timeline = useMemo(() => healthReport?.timeline, [healthReport?.timeline]);
    const nutritionBreakdown = useMemo(() => healthReport?.charts?.nutritionBreakdown, [healthReport?.charts?.nutritionBreakdown]);
    const bodyComposition = useMemo(() => healthReport?.charts?.bodyComposition, [healthReport?.charts?.bodyComposition]);
    const activityComposition = useMemo(() => healthReport?.charts?.activityComposition, [healthReport?.charts?.activityComposition]);
    
    return (
        <>
            <Row gutter={[32, 16]}  id="report-result">
                <Col lg={12} md={24} xs={24}>

                    {/* Summary */}
                    <Row gutter={[0, 8]}>
                        <Title level={5}>Summary</Title>
                        <Col span={24}>
                            <Text strong>Name: </Text> {summary?.name || '-'}
                        </Col>
                        <Col span={24}>
                            <Text strong>Age: </Text> {summary?.age || '-'}
                        </Col>
                        <Col span={24}>
                            <Text strong>Current Weight: </Text> {healthReport?.summary?.currentWeight || '-'} kg
                        </Col>
                        <Col span={24}>
                            <Text strong>Goal Weight: </Text> {healthReport?.summary?.goalWeight || '-'} kg
                        </Col>
                        <Col span={24}>
                            <Text>Current health is {summary?.bmiCategory || '-'}.</Text>
                        </Col>
                        <Col span={24}>
                            <Text>{summary?.healthSummary}</Text>
                        </Col>
                    </Row>
                    <Divider />

                    {/* Exercise Calendar */}
                    <Row>
                        <Title level={5}>Exercise Calendar</Title>
                        <Col span={24}>
                            <Table bordered size="small" rowKey={'day'} pagination={false} columns={exerciseCalendarColumns} dataSource={exerciseCalendar} />
                        </Col>
                    </Row>
                    <Divider  />

                    {/* Timeline */}
                    <Row>
                        <Title level={5}>Timeline</Title>
                        <Progress percent={timeline?.currentProgress || 0} showInfo={false} />
                        <Text>{timeline?.message}</Text>
                    </Row>
                    <Divider />

                    {/* Activity Composition */}
                    <Row>
                        <Title level={5}>Activity Composition</Title>
                        <Col span={24}>
                            <PieChart
                                data={activityComposition || []}
                                angleField="value"
                                colorField="type"
                                label={{
                                    text: ({ value }: { value: number }) => `${value}%`,
                                    style: {
                                        fontWeight: 'bold',
                                    },
                                }}
                            />
                        </Col>
                    </Row>
                    {size.width <= token.screenLG && <Divider />}
                </Col>

                <Col lg={12} md={24} xs={24}>

                    {/* Weight progress */}
                    <Row>
                        <Col span={24}>
                            <Title level={5}>Weight progress</Title>
                            <LineChart data={weightProgress?.progressData || []} xField="week" yField="weight" />
                            <Text style={{ textAlign: 'center', display: 'block' }}><Text strong>Goal weeks:</Text> {weightProgress?.goalWeeks}</Text>
                        </Col>
                    </Row>
                    <Divider />

                    {/* Exercise Effort */}
                    <Row>
                        <Title level={5}>Exercise Effort</Title>
                        <Col span={24}>
                            <LineChart
                                data={exerciseEffort || []}
                                xField="day"
                                yField="caloriesBurned"
                                colorField="type"
                                legend={false}
                            />
                        </Col>
                    </Row>
                    <Divider />

                    {/* Nutrition Breakdown */}
                    <Row>
                        <Title level={5}>Nutrition Breakdown</Title>
                        <Col span={24}>
                            <PieChart
                                data={nutritionBreakdown?.macros || []}
                                angleField="percentage"
                                colorField="type"
                                label={{
                                    text: ({ percentage }: { percentage: number }) => `${percentage}%`,
                                    style: {
                                        fontWeight: 'bold',
                                    },
                                }}
                            />
                        </Col>
                    </Row>
                    <Divider />

                    {/* Body Composition */}
                    <Row>
                        <Title level={5}>Body Composition</Title>
                        <Col span={24}>
                            <PieChart
                                data={bodyComposition || []}
                                angleField="value"
                                colorField="type"
                                label={{
                                    text: ({ value }: { value: number }) => `${value}%`,
                                    style: {
                                        fontWeight: 'bold',
                                    },
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Divider />
            <DownloadPdfButton targetId="report-result" />
        </>
    )
}

export default memo(HealthReport)