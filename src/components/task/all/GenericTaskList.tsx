import React, { useState, useMemo, useCallback } from "react";
import TextInput from "@/components/task/input/TextInput";
import { Input, Collapse, ConfigProvider, Empty } from "antd";
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
import type { RepeatRule } from "@/components/task/common/Remind";

dayjs.extend(utc);
dayjs.extend(timezone);

// 类型定义
export interface GroupConfig {
  key: string;
  label: string;
  filter: (tasks: ITask[], baseDate: Dayjs) => ITask[];
  extra?: React.ReactNode;
  defaultOpen?: boolean;
}

interface GenericTaskPageProps {
  groups: GroupConfig[];
  initDate?: string | Dayjs;
  pageTitle?: string;
  emptyImage?: React.ReactNode;
  description?: string; // 可选的描述文本
}

const Span: React.FC<{ text: string; count: number }> = ({ text, count }) =>
  count > 0 ? (
    <>
      <span className="text-xs text-slate-950 font-bold font-sans -ml-2">
        {text}
      </span>
      <span className="ml-2 text-gray-400">{count}</span>
    </>
  ) : null;

const GenericTaskPage: React.FC<GenericTaskPageProps> = ({
  groups,
  initDate = dayjs(),
  pageTitle = "收集箱",
  emptyImage,
  description = "没有任务",
}) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<number | null>(0);
  const [projectId, setProjectId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs(initDate).format("YYYY-MM-DD")
  );
  const [remindData, setRemindData] = useState<{
    remindTime?: string;
    timeRange?: [Dayjs, Dayjs];
    isAllDay?: boolean;
    repeatRule?: RepeatRule;
  }>({});

  const dispatch = useDispatch();
  const navigate = useNavigate(); // 使用useNavigate钩子
  const location = useLocation(); // 使用useLocation钩子
  const { tasks } = useSelector((state: any) => state.task);
  const generatedId = objectId().toHexString();
  const baseDate = useMemo(
    () => dayjs(initDate).tz("Asia/Shanghai"),
    [initDate]
  );

  // 通用分组逻辑
  const groupedTasks = useMemo(() => {
    return groups.map((group) => ({
      ...group,
      tasks: group.filter(tasks, baseDate),
      count: group.filter(tasks, baseDate).length,
    }));
  }, [tasks, groups, baseDate]);

  // 保持原有的任务创建逻辑
  const handleCreateTask = useCallback(async () => {
    if (!textValue.trim()) return;
    // 新建文本处理管道
    let finalTitle = textValue;
    let finalDueDate = selectedDate ? new Date(selectedDate) : undefined;

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
      finalDueDate = parsedDate.toDate();
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
      return {
        dueDate: dayjs(remindData.remindTime).toDate(),
        isAllDay: remindData.isAllDay,
      };
    };
    const newTask: ITask = {
      _id: generatedId,
      title: finalTitle,
      dueDate: finalDueDate,
      priority: selectedPriority || 0,
      tags,
      projectId,
      status: 0, // 初始状态为"进行中"
      ...processTime(),
      repeatFlag: generateRRule(remindData.repeatRule),
      reminders: remindData.remindTime ? [new Date(remindData.remindTime)] : [],
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

  // 保持原有的输入处理逻辑
  const handleTextChange = useCallback((newValue: string) => {
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

  // 生成Collapse配置
  const collapseItems: CollapseProps["items"] = useMemo(
    () =>
      groupedTasks
        .filter((group) => group.count > 0)
        .map((group) => ({
          key: group.key,
          label: <Span text={group.label} count={group.count} />,
          children: group.tasks.map((task) => (
            <TaskItem key={task._id} id={task._id} />
          )),
          extra: group.extra,
          defaultOpen: group.defaultOpen,
        })),
    [groupedTasks]
  );

  return (
    <div className="container -mt-3 px-4">
      <Input
        placeholder={`+ 添加任务至${pageTitle}`}
        variant="filled"
        onFocus={() => setIsInputVisible(true)}
        className={`${isInputVisible || textValue ? "hidden" : ""}`}
        readOnly
      />

      <TextInput
        setRemindInfo={setRemindData}
        initDate={selectedDate}
        value={textValue}
        projectId={projectId}
        setProjectId={setProjectId}
        selected={selectedPriority}
        onBlur={() => setIsInputVisible(false)}
        setTags={setTags}
        onDateSelect={setSelectedDate}
        tags={tags}
        onChange={handleTextChange}
        onPriorityChange={handlePriorityChange}
        className={`${!isInputVisible && !textValue ? "hidden" : ""}`}
        onSubmit={handleCreateTask}
      />

      <ConfigProvider theme={{ token: { paddingSM: 0, paddingLG: 0 } }}>
        {collapseItems.length > 0 ? (
          <Collapse
            defaultActiveKey={groups
              .filter((g) => g.defaultOpen)
              .map((g) => g.key)}
            ghost
            size="small"
            items={collapseItems}
            className="bg-white text-left p-2 ml-2 select-none"
          />
        ) : (
          <Empty
            image={emptyImage}
            imageStyle={{ height: 80 }}
            //居中显示
            className="mt-48 h-full w-full"
            description={
              <span className="text-gray-400 text-xs">{description}</span>
            }
          />
        )}
      </ConfigProvider>
    </div>
  );
};

export default GenericTaskPage;
