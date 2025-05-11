/*
 * @Descripttion: 智能待办事项任务分类
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-04 20:02:11
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-12 18:40:27
 */
import React, { useState, useMemo, useCallback } from "react";
import TextInput from "@/components/task/input/TextInput";
import { Input, Collapse, ConfigProvider } from "antd";
import type { CollapseProps } from "antd";
import TaskItem from "@/components/task/all/TaskItem";
import { ITask } from "@/lib/db/database";
import { useSelector, useDispatch, useNavigate, useLocation } from "umi";
import dayjs from "dayjs";
import objectId from "bson-objectid";
import { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { zh } from "chrono-node";
import type { RepeatRule, RepeatType } from "@/components/task/common/Remind";
import isBetween from "dayjs/plugin/isBetween";

// 扩展 dayjs 功能
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const Span: React.FC<{ text: string; count: number }> = ({ text, count }) =>
  count > 0 ? (
    <>
      <span className="text-xs text-slate-950 font-bold font-sans -ml-2">
        {text}
      </span>
      <span className="ml-2 text-gray-400">{count}</span>
    </>
  ) : null;

const renderTaskItems = (tasks: ITask[]) =>
  tasks.map((task) => <TaskItem key={task._id} id={task._id} />);

const All: React.FC = () => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [textValue, setTextValue] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<number | null>(0);
  const [projectId, setProjectId] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [remindData, setRemindData] = useState<{
    remindTime?: string;
    timeRange?: [Dayjs, Dayjs];
    isAllDay?: boolean;
    repeatRule?: RepeatRule;
  }>({});
  const generatedId = objectId().toHexString();
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: any) => state.task);
  const navigate = useNavigate(); // 使用useNavigate钩子
  const location = useLocation(); // 使用useLocation钩子
  // 使用useMemo优化分组计算，依赖tasks变化
  const groupedTasks = useMemo(() => {
    const now = dayjs().tz("Asia/Shanghai");
    const sevenDaysLater = now.add(7, "day");

    interface GroupedTasks {
      completed: ITask[];
      overdue: ITask[];
      recentSevenDays: ITask[];
      future: ITask[];
      noDate: ITask[];
    }

    return {
      completed: tasks.filter((task: ITask) => task.status === 2),
      overdue: tasks.filter(
        (task: ITask) =>
          task.status !== 2 &&
          task.dueDate &&
          dayjs(task.dueDate).tz("Asia/Shanghai").isBefore(now, "day")
      ),
      recentSevenDays: tasks.filter(
        // 新增的最近七天过滤逻辑
        (task: ITask) =>
          task.status !== 2 &&
          task.dueDate &&
          dayjs(task.dueDate)
            .tz("Asia/Shanghai")
            .isBetween(now, sevenDaysLater, "day", "[]")
      ),
      future: tasks.filter(
        // 修改原upcoming为future
        (task: ITask) =>
          task.status !== 2 &&
          task.dueDate &&
          dayjs(task.dueDate).tz("Asia/Shanghai").isAfter(sevenDaysLater, "day")
      ),
      noDate: tasks.filter((task: ITask) => task.status !== 2 && !task.dueDate),
    } as GroupedTasks;
  }, [tasks]);

  // 动态生成Collapse items，依赖groupedTasks
  const items: CollapseProps["items"] = useMemo(
    () =>
      [
        {
          key: "1",
          label: <Span text="已过期" count={groupedTasks.overdue.length} />,
          children: renderTaskItems(groupedTasks.overdue),
          extra: (
            <span className="text-blue-500 text-xs cursor-pointer">顺延</span>
          ),
        },
        {
          key: "2",
          label: (
            <Span text="最近七天" count={groupedTasks.recentSevenDays.length} />
          ),
          children: renderTaskItems(groupedTasks.recentSevenDays),
        },
        {
          key: "3",
          label: <Span text="更远" count={groupedTasks.future.length} />,
          children: renderTaskItems(groupedTasks.future),
        },
        {
          key: "4",
          label: <Span text="无日期" count={groupedTasks.noDate.length} />,
          children: renderTaskItems(groupedTasks.noDate),
        },
        {
          key: "5",
          label: <Span text="已完成" count={groupedTasks.completed.length} />,
          children: renderTaskItems(groupedTasks.completed),
        },
      ].filter((item) => item.children.length > 0),
    [groupedTasks]
  );

  const handTextChange = useCallback((newValue: string) => {
    setTextValue(newValue);
    const priorityLabels = ["无优先级", "低优先级", "中优先级", "高优先级"];
    const priorityRegex = new RegExp(
      `\\[(${priorityLabels.join("|")})\\]`,
      "g"
    );
    const matchedPriority = newValue.match(priorityRegex);
    if (matchedPriority) {
      const label = matchedPriority[0].replace(/\[|\]/g, ""); // 去掉方括号
      const priorityIndex = priorityLabels.indexOf(label);
      if (priorityIndex !== -1) {
        setSelectedPriority(priorityIndex);
      }
    } else {
      setSelectedPriority(0); // 如果没有匹配到优先级，设置为 null
    }
  }, []);

  const handlePriorityChange = useCallback(
    (newPriority: number, label: string) => {
      setSelectedPriority(newPriority);
      setTextValue((prevText) => {
        const priorityRegex = /\[.*?\]/;
        const existingPriorityMatch = prevText.match(priorityRegex);
        return existingPriorityMatch
          ? prevText.replace(existingPriorityMatch[0], `[${label}]`)
          : `${prevText}[${label}]`;
      });
    },
    []
  );

  const handleCreateTask = useCallback(async () => {
    if (!textValue.trim()) return;
    // 新建文本处理管道
    let finalTitle = textValue;
    let finalDueDate = selectedDate ? dayjs(selectedDate) : null;

    // 严格验证日期
    if (finalDueDate && !finalDueDate.isValid()) {
      console.error("Invalid selectedDate:", selectedDate);
      finalDueDate = null;
    }

    // 阶段1：解析并移除日期信息
    const dateMatches = zh.parse(finalTitle);
    if (dateMatches.length > 0) {
      const firstMatch = dateMatches[0];
      const dateText = firstMatch.text;
      const startPos = firstMatch.index || 0;
      const endPos = startPos + dateText.length;
      // 移除日期文本
      finalTitle = (
        finalTitle.slice(0, startPos) + finalTitle.slice(endPos)
      ).trim();
      // 转换日期对象
      const parsedDate = dayjs(firstMatch.start.date());
      if (parsedDate.isValid()) {
        finalDueDate = parsedDate;
      } else {
        console.error("Invalid parsed date:", firstMatch.text);
        finalDueDate = null;
      }
    }

    // 阶段2：移除优先级标签
    finalTitle = finalTitle.replace(
      /\[(无优先级|低优先级|中优先级|高优先级)\]\s?/g,
      ""
    );
    // 生成RRULE
    const generateRRule = (rule?: RepeatRule) => {
      if (!rule?.type) return "";
      return `FREQ=${rule.type.toUpperCase()}${
        rule.until ? `;UNTIL=${dayjs(rule.until).format("YYYYMMDD")}` : ""
      }`;
    };
    // 处理时间数据
    const processTime = () => {
      if (remindData.timeRange) {
        return {
          startDate: remindData.timeRange[0].toDate(),
          endDate: remindData.timeRange[1].toDate(),
          isAllDay: remindData.isAllDay,
        };
      }
      const remindDayjs = dayjs(remindData.remindTime);
      if (remindDayjs.isValid()) {
        return {
          startDate: remindDayjs.toDate(),
          dueDate: remindDayjs.toDate(),
          isAllDay: remindData.isAllDay,
        };
      } else {
        console.error("Invalid remind time:", remindData.remindTime);
        return {
          startDate: null,
          dueDate: null,
          isAllDay: remindData.isAllDay,
        };
      }
    };
    const newTask: ITask = {
      _id: generatedId,
      title: finalTitle,
      dueDate: finalDueDate ? finalDueDate.toDate() : null,
      priority: selectedPriority || 0,
      tags,
      projectId: projectId === "" ? null : projectId,
      status: 0, // 初始状态为"进行中"
      ...processTime(),
      repeatFlag: generateRRule(remindData.repeatRule),
      reminders:
        remindData.remindTime && dayjs(remindData.remindTime).isValid()
          ? [new Date(remindData.remindTime)]
          : [],
      content: "", // 任务内容（可选）
      attachments: [], // 附件（可选）
      columnId: generatedId, // 默认列ID
      creator: localStorage.getItem("user_id") || "", // 默认创建者
      isDeleted: false, // 默认未删除
      childIds: [], // 默认子任务ID
      createdAt: new Date(), // 默认创建时间
      updatedAt: new Date(), // 默认更新时间
      progress: 0,
      commentCount: 0,
      isAllDay: remindData.isAllDay || false,
      timeZone: "Asia/Shanghai", // 默认时区
    };
    console.log("新建任务数据:", newTask);
    try {
      dispatch({
        type: "task/addTask", // 确保action type正确
        payload: newTask,
      });
      // 清空状态
      setTextValue("");
      setSelectedPriority(0);
      setTags([]);
      setProjectId("");
      setSelectedDate(dayjs().set("hour", 9).format("YYYY-MM-DD"));
      dispatch({ type: "task/loadTasks" });
      const pathParts = location.pathname.split("/");
      const lastPart = pathParts[pathParts.length - 1];

      let newPath = /^[a-zA-Z]+$/.test(lastPart)
        ? `${location.pathname}/${generatedId}`
        : location.pathname.replace(/\/[^/]+$/, `/${generatedId}`);

      if (newPath !== location.pathname) {
        navigate(newPath);
      }
    } catch (error) {
      console.error("创建任务失败:", error);
    }
  }, [textValue, selectedPriority, tags, projectId, selectedDate, remindData]);

  return (
    <div className="container -mt-3 px-4">
      {/* 输入区域 */}
      <Input
        placeholder="+ 添加任务至收集箱"
        variant="filled"
        onFocus={() => setIsInputVisible(true)}
        className={`${isInputVisible || textValue ? "hidden" : ""}`}
        readOnly
      />
      <TextInput
        setRemindInfo={setRemindData}
        initDate={dayjs().format("YYYY-MM-DD")}
        value={textValue}
        projectId={projectId}
        setProjectId={setProjectId}
        selected={selectedPriority}
        onBlur={() => setIsInputVisible(false)}
        setTags={setTags}
        onDateSelect={(date) => setSelectedDate(date)}
        tags={tags}
        onChange={handTextChange}
        onPriorityChange={handlePriorityChange}
        className={`${!isInputVisible && !textValue ? "hidden" : ""}`}
        onSubmit={handleCreateTask}
      />
      <div>
        <ConfigProvider theme={{ token: { paddingSM: 0, paddingLG: 0 } }}>
          <Collapse
            defaultActiveKey={["1"]}
            ghost
            size="small"
            items={items}
            className="bg-white text-left p-2 ml-2 select-none"
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default All;
