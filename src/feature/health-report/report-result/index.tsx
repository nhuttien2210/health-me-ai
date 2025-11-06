import LineChart from "@/components/line-chart";
import PieChart from "@/components/pie-chart";
import useHealthReportStore from "@/stores/useHealthReportStore";
import { Col, Progress, Row, Table, Typography } from "antd";
import { memo, useMemo } from "react";
import { exerciseCalendarColumns } from "./utils";
import DownloadPdfButton from "@/components/download-pdf-button";

const { Text, Title } = Typography;

const HealthReport: React.FC = () => {
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

                    {/* Exercise Calendar */}
                    <Row style={{ marginTop: 16 }}>
                        <Title level={5}>Exercise Calendar</Title>
                        <Col span={24}>
                            <Table bordered size="small" rowKey={'day'} pagination={false} columns={exerciseCalendarColumns} dataSource={exerciseCalendar} />
                        </Col>
                    </Row>

                    {/* Timeline */}
                    <Row style={{ marginTop: 16 }}>
                        <Title level={5}>Timeline</Title>
                        <Progress percent={timeline?.currentProgress || 0} showInfo={false} />
                        <Text>{timeline?.message}</Text>
                    </Row>

                    {/* Activity Composition */}
                    <Row style={{ marginTop: 16 }}>
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
                </Col>

                <Col lg={12} md={24} xs={24}>

                    {/* Weight progress */}
                    <Title level={5}>Weight progress</Title>
                    <LineChart data={weightProgress?.progressData || []} xField="week" yField="weight" />
                    <Text style={{ textAlign: 'center', display: 'block' }}><Text strong>Goal weeks:</Text> {weightProgress?.goalWeeks}</Text>

                    {/* Exercise Effort */}
                    <Row style={{ marginTop: 16 }}>
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

                    {/* Nutrition Breakdown */}
                    <Row style={{ marginTop: 16 }}>
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

                    {/* Body Composition */}
                    <Row style={{ marginTop: 16 }}>
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
            <DownloadPdfButton targetId="report-result" />
        </>
    )
}

export default memo(HealthReport)