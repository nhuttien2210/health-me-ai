import type { HealhReportErrorResponse } from "@/models/entities/health-report";
import { notification } from "antd";

const errorResponseNotifi = (error: any) => {
  const errorResponse = error as HealhReportErrorResponse;
  notification.warning({
    message: errorResponse?.data ? (errorResponse?.data?.message || 'Unknown Gemini error') : error?.message,
  });
}

export default errorResponseNotifi;
