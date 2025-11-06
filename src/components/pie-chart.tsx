import { Pie, type PieConfig } from "@ant-design/plots";
import { theme } from "antd";
import { forwardRef, memo } from "react";

export type PieChartProps = Omit<PieConfig, "data" | "angleField" | "colorField"> & {
  data: Record<string, any>[];
  angleField: string;
  colorField: string;
  height?: number;
};

const PieChart = forwardRef<HTMLDivElement, PieChartProps>(({
  data,
  angleField,
  colorField,
  height = 250,
  ...rest
}, ref) => {
  const { token } = theme.useToken(); 

  const config: PieConfig = {
    data,
    angleField,
    colorField,
    radius: 1,
    innerRadius: 0,
    height,
    label: {
      type: "inner",
      offset: "-30%",
      content: "{percentage}",
      style: {
        fontSize: 14,
        fontWeight: 600,
        fill: "#fff",
      },
    },
    color: [
      token.colorPrimary,
      token.colorWarning,
      token.colorSuccess,
    ],
    interactions: [{ type: "element-active" }],
    animation: {
      appear: { animation: "wave-in", duration: 800 },
    },
    legend: {
      color: {
        title: false,
        position: 'bottom',
        rowPadding: 5,
      },
    },
    tooltip: false,
    ...rest,
  };

  return <Pie {...config} ref={ref} />;
});

export default memo(PieChart);
