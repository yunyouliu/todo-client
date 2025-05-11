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

  renderType?: "collapse" | "list";
}

interface GenericTaskPageProps {
  groups: GroupConfig[];
  initDate?: string | Dayjs;
  pageTitle?: string;
  emptyImage?: React.ReactNode;
  description?: string;
  navigateTo?: string;
  isVisible?: boolean;
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
  isVisible = true,
  description = "没有任务",
  navigateTo,
}) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<number | null>(0);
  const [projectId, setProjectId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
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
  const { collapseGroups, listGroups } = useMemo(() => {
    const processed = groups.map((group) => ({
      ...group,
      tasks: group.filter(tasks, baseDate),
      count: group.filter(tasks, baseDate).length,
      renderType: group.renderType || "collapse", // 默认使用折叠
    }));

    return {
      collapseGroups: processed.filter((g) => g.renderType === "collapse"),
      listGroups: processed.filter((g) => g.renderType === "list"),
    };
  }, [tasks, groups, baseDate]);
  console.log("collapseGroups:", collapseGroups);
  console.log("listGroups:", listGroups);

  // 保持原有的任务创建逻辑
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
      console.log("Parsed date:", parsedDate);
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
          dueDate: remindData.timeRange[1].toDate(),
          isAllDay: remindData.isAllDay || false,
        };
      }

      const remindDayjs = dayjs(remindData.remindTime);
      if (remindDayjs.isValid()) {
        return {
          startDate: remindDayjs.toDate(),
          dueDate: remindDayjs.toDate(),
          isAllDay: remindData.isAllDay || false,
        };
      }

      // 如果没有手动设置提醒，fallback到解析到的自然语言时间
      if (finalDueDate && finalDueDate.isValid()) {
        return {
          dueDate: finalDueDate.toDate(),
          isAllDay: false,
        };
      }

      // 全都没有
      return {
        startDate: null,
        dueDate: null,
        isAllDay: false,
      };
    };

    const { startDate, dueDate, isAllDay } = processTime();
    console.log("处理后的时间数据:", { startDate, dueDate, isAllDay });

    const newTask: ITask = {
      _id: generatedId,
      title: finalTitle,
      dueDate,
      priority: selectedPriority || 0,
      tags,
      projectId: projectId === "" ? null : projectId,
      status: 0,
      startDate,
      repeatFlag: generateRRule(remindData.repeatRule),
      reminders:
        remindData.remindTime && dayjs(remindData.remindTime).isValid()
          ? [new Date(remindData.remindTime)]
          : [],
      content: "",
      attachments: [],
      columnId: generatedId,
      creator: localStorage.getItem("user_id") || "",
      isDeleted: false,
      childIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
      commentCount: 0,
      isAllDay,
      timeZone: "Asia/Shanghai",
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
      setSelectedDate(dayjs().format("YYYY-MM-DD"));
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
      collapseGroups
        .filter((group) => group.count > 0)
        .map((group) => ({
          key: group.key,
          label: <Span text={group.label} count={group.count} />,
          children: group.tasks.map((task) => (
            <TaskItem key={task._id} id={task._id} navigateTo={navigateTo} />
          )),
          extra: group.extra,
          defaultOpen: group.defaultOpen,
        })),
    [collapseGroups]
  );

  // 生成直接展示的任务列表
  const listTasks = useMemo(
    () => listGroups.flatMap((group) => group.tasks),
    [listGroups]
  );
  const hasTasks = useMemo(
    () => groups.some((group) => group.filter(tasks, baseDate).length > 0),
    [tasks, groups, baseDate]
  );

  return (
    <div className="container -mt-3 px-4">
      {isVisible && (
        <>
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
        </>
      )}

      <ConfigProvider theme={{ token: { paddingSM: 0, paddingLG: 0 } }}>
        {hasTasks ? (
          <>
            {/* 折叠分组 */}
            {collapseItems.length > 0 && (
              <Collapse
                defaultActiveKey={collapseGroups
                  .filter((g) => g.defaultOpen)
                  .map((g) => g.key)}
                ghost
                size="small"
                items={collapseItems}
                className="bg-white text-left p-2 ml-2 select-none"
              />
            )}

            {/* 直接展示的分组 */}
            {listGroups.map(
              (group) =>
                group.tasks.length > 0 && (
                  <div key={group.key} className="mt-2">
                    {/* <div className="text-xs font-bold text-slate-950 mb-2">
                      {group.label} ({group.count})
                    </div> */}
                    {group.tasks.map((task) => (
                      <TaskItem
                        key={task._id}
                        id={task._id}
                        navigateTo={navigateTo}
                      />
                    ))}
                  </div>
                )
            )}
          </>
        ) : (
          <Empty
            image={emptyImage}
            imageStyle={{ height: 80 }}
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
