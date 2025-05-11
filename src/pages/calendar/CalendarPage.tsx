import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { Calendar, Col, Row, Select, Button, Space, Badge } from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { RRule } from "rrule";
import { useSelector } from "umi";
import type { ITask } from "@/lib/db/database";

dayjs.locale("zh-cn");
dayjs.extend(isBetween);

const priorityColorMap: Record<number, string> = {
  3: "#e74c3c", // 高优先级
  2: "#f39c12", // 中优先级
  1: "#2ecc71", // 低优先级
  0: "#95a5a6", // 无优先级
};

const colorPalette = [
  "#f9a8d4", // pink
  "#facc15", // yellow
  "#4ade80", // green
  "#60a5fa", // blue
  "#a78bfa", // purple
  "#fb923c", // orange
  "#34d399", // emerald
  "#c084fc", // violet
  "#fcd34d", // amber
  "#5eead4", // teal
  "#818cf8", // indigo
  "#fca5a5", // red
  "#d1fae5", // light green
  "#fef9c3", // light yellow
  "#fef08a", // light orange
  "#e0f2fe", // light blue
  "#c7f9cc", // light green
];

const App: React.FC = () => {
  const { tasks } = useSelector((state: any) => state.task);

  // 动态计算有效范围
  const validRange: [Dayjs, Dayjs] = [
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ];

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") {
      const listData = getEventsFromTasks(
        tasks.filter((task: ITask) => !task.isDeleted)
      );
      console.log("listData", listData);

      return (
        <ul className="m-0 p-0 list-none min-h-[120px]">
          {listData
            .filter(
              (event) =>
                dayjs(event.start).isSame(current, "day") &&
                event.extendedProps.priority !== undefined
            )
            .map((item) => (
              <li key={item.id} className="mb-1">
                <div
                  className="text-xs px-1 py-1 rounded-sm truncate 
                    border-l-4 shadow-sm hover:shadow-md transition-all"
                  style={{
                    backgroundColor: item.backgroundColor,
                    borderColor: item.backgroundColor,
                    color: getContrastColor(item.backgroundColor),
                  }}
                >
                  <span className="font-medium text-black">
                    {item.title || "无标题"}
                  </span>
                  {!item.extendedProps.isAllDay && (
                    <span className="float-right text-opacity-80">
                      {dayjs(item.start).format("HH:mm")}
                    </span>
                  )}
                </div>
              </li>
            ))}
        </ul>
      );
    }
    return null;
  };

  // 计算文字对比色
  const getContrastColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000" : "#fff";
  };

  // 自定义日历头部
  const customHeader: CalendarProps<Dayjs>["headerRender"] = ({
    value,
    onChange,
  }) => (
    <div className="p-4 border-b border-gray-200 bg-white">
      <Row justify="space-between" align="middle">
        <Col>
          <h4 className="text-xl font-medium m-0">
            {value.format("YYYY年MM月")}
            <span className="text-sm ml-2 text-gray-500">
              ({tasks.filter((t: any) => !t.isDeleted).length}个任务)
            </span>
          </h4>
        </Col>
        <Col>
          <Space>
            <Button className="items-center mr-2">
              <span>+</span>
            </Button>
          </Space>

          <Space>
            <Select
              value={value.year()}
              onChange={(year) => onChange(value.year(year))}
              options={Array.from({ length: 10 }, (_, i) => ({
                value: dayjs().year() - i,
                label: `${dayjs().year() - i}年`,
              }))}
            />
          </Space>
          <Space>
            <Select
              value={value.month() + 1}
              onChange={(month) => onChange(value.month(month - 1))}
              options={Array.from({ length: 12 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}月`,
              }))}
            />
            <Button onClick={() => onChange(dayjs())}>今天</Button>
          </Space>
        </Col>
      </Row>
    </div>
  );

  return (
    <div
      className="border border-gray-200 rounded-lg h-[calc(100vh-100px)] 
      overflow-hidden bg-white shadow-sm"
    >
      <Calendar
        headerRender={customHeader}
        cellRender={cellRender}
        validRange={validRange}
        mode="month"
      />
    </div>
  );
};

function getColorForTask(id: string) {
  const hash = Array.from(id).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  return colorPalette[hash % colorPalette.length];
}

// 事件生成逻辑优化
function getEventsFromTasks(tasks: ITask[]) {
  const events: any[] = [];

  const parseDate = (date: any) => {
    const d = dayjs(date);
    return d.isValid() ? d : null;
  };

  for (const task of tasks) {
    const baseStart = parseDate(task.startDate);
    const baseEnd = parseDate(task.dueDate || task.startDate);
    const isAllDay = task.isAllDay;

    if (!baseStart?.isValid() || !baseEnd?.isValid()) continue;

    // 处理重复任务
    if (task.repeatFlag) {
      try {
        const rule = RRule.fromString(task.repeatFlag);
        const occurrences = rule.between(
          baseStart.toDate(),
          dayjs().add(1, "year").toDate(),
          true
        );

        occurrences.forEach((occur) => {
          events.push({
            id: `${task._id}-${dayjs(occur).format("YYYYMMDD")}`,
            title: task.title,
            start: occur,
            end: isAllDay
              ? dayjs(occur).endOf("day").toDate()
              : dayjs(occur).add(baseEnd.diff(baseStart)).toDate(),
            // backgroundColor: priorityColorMap[task.priority] || "#bdc3c7",
            backgroundColor: getColorForTask(task._id),
            extendedProps: task,
          });
        });
      } catch (err) {
        console.error("RRule解析失败:", task.repeatFlag, err);
      }
      continue;
    }

    // 单次任务
    events.push({
      id: task._id,
      title: task.title,
      start: baseStart.toDate(),
      end: baseEnd.toDate(),
      // backgroundColor: priorityColorMap[task.priority] || "#bdc3c7",
      backgroundColor: getColorForTask(task._id),
      extendedProps: task,
    });
  }

  return events;
}

export default App;
