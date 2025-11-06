import useHealthReportStore from "@/stores/useHealthReportStore";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Spin, theme, Typography } from "antd";
import React from "react";
import CollectDataForm from "./collect-data-form";

const ReportResult = React.lazy(() => import("./report-result"));
const { Title } = Typography;

const HealthReport: React.FC = () => {
  const { token } = theme.useToken();
  const healthReport = useHealthReportStore((state) => state.healthReport);
  const clearReport = useHealthReportStore((state) => state.clearReport);

  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          {healthReport && (
            <Button
              icon={<LeftCircleOutlined />}
              type="text"
              onClick={clearReport}
            />
          )}
          <Title style={{ margin: 0 }} level={4}>
            Healthy Me AI
          </Title>
        </Flex>
      }
      style={{
        maxWidth: 720,
        margin: "auto",
        boxShadow: token.boxShadowSecondary,
        borderRadius: token.borderRadiusLG,
      }}
    >
      {!healthReport ? (
        <CollectDataForm />
      ) : (
        <React.Suspense
          fallback={
            <Flex justify="center" align="center">
              <Spin spinning />
            </Flex>
          }
        >
          <ReportResult />
        </React.Suspense>
      )}
    </Card>
  );
};

export default HealthReport;
