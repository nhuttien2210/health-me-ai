import { Line, type LineConfig } from "@ant-design/plots";
import { theme } from "antd";
import { forwardRef, memo } from "react";

export type LineChartProps = Omit<LineConfig, "data" | "xField" | "yField"> & {
  data: Record<string, any>[];
  xField: string;
  yField: string;
  color?: string;
  height?: number;
}

const LineChart = forwardRef<HTMLDivElement, LineChartProps>(({
  data,
  xField,
  yField,
  color,
  height = 250,
  ...rest
}, ref) => {
  const { token } = theme.useToken();

  const config: LineConfig = {
    data,
    xField,
    yField,
    autoFit: true,
    height,
    area: {
      style: { fill: `l(270) 0:${color || token.colorPrimary}22` },
    },
    xAxis: {
      title: { text: xField },
      tickCount: 5,
    },
    yAxis: {
      title: { text: yField },
      tickCount: 5,
    },
    animation: {
      appear: { animation: "path-in", duration: 1200 },
    },
    ...rest,
  };

  return <Line {...config} ref={ref} />;
});

export default memo(LineChart);
