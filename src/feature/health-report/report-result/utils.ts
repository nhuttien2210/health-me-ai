import type { ExerciseCalendar } from "@/models/entities/health-report";
import { type TableProps } from "antd";

export const exerciseCalendarColumns: TableProps<ExerciseCalendar>['columns'] = [
    {
        title: "Day",
        dataIndex: "day",
    },
    {
        title: "Activity",
        dataIndex: "activity",
    },
    {
        title: "Duration",
        dataIndex: "duration",
    },
];