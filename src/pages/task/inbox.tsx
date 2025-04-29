import React, { useState, useCallback, useMemo } from "react";
import TextInput from "@/components/task/input/TextInput";
import { useSelector, useDispatch, useNavigate, useLocation } from "umi";
import { Input } from "antd";
import TaskItem from "@/components/task/all/TaskItem";
import { ITask } from "@/lib/db/database";
import objectId from "bson-objectid";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";
import { zh } from "chrono-node";
import type { RepeatRule } from "@/components/task/common/Remind";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const Inbox: React.FC = () => {
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
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: any) => state.task);
  const navigate = useNavigate();
  const location = useLocation();

  // 过滤出收集箱任务（没有 projectId）
  const collectionTasks = useMemo(
    () => tasks.filter((task: ITask) => task.projectId === null),
    [tasks]
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
      const label = matchedPriority[0].replace(/\[|\]/g, "");
      const priorityIndex = priorityLabels.indexOf(label);
      if (priorityIndex !== -1) {
        setSelectedPriority(priorityIndex);
      }
    } else {
      setSelectedPriority(0);
    }
  }, []);

  const handleCreateTask = useCallback(async () => {
    if (!textValue.trim()) return;
    const generatedId = objectId().toHexString();
    let finalTitle = textValue;
    let finalDueDate: Dayjs | null = null;

    const dateMatches = zh.parse(finalTitle);
    if (dateMatches.length > 0) {
      const firstMatch = dateMatches[0];
      const dateText = firstMatch.text;
      const startPos = firstMatch.index || 0;
      const endPos = startPos + dateText.length;
      finalTitle = (
        finalTitle.slice(0, startPos) + finalTitle.slice(endPos)
      ).trim();
      const parsedDate = dayjs(firstMatch.start.date());
      if (parsedDate.isValid()) {
        finalDueDate = parsedDate;
      }
    }

    finalTitle = finalTitle.replace(
      /\[(无优先级|低优先级|中优先级|高优先级)\]\s?/g,
      ""
    );

    const generateRRule = (rule?: RepeatRule) => {
      if (!rule?.type) return "";
      return `FREQ=${rule.type.toUpperCase()}${
        rule.until ? `;UNTIL=${dayjs(rule.until).format("YYYYMMDD")}` : ""
      }`;
    };

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
          dueDate: remindDayjs.toDate(),
          isAllDay: remindData.isAllDay,
        };
      } else {
        return { dueDate: null, isAllDay: remindData.isAllDay };
      }
    };

    const newTask: ITask = {
      _id: generatedId,
      title: finalTitle,
      dueDate: finalDueDate ? finalDueDate.toDate() : null,
      priority: selectedPriority || 0,
      tags,
      projectId: null, // 重点：收集箱任务，projectId为null
      status: 0,
      ...processTime(),
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
      isAllDay: remindData.isAllDay || false,
      timeZone: "Asia/Shanghai",
    };

    dispatch({ type: "task/addTask", payload: newTask });
    setTextValue("");
    setSelectedPriority(0);
    setTags([]);
    dispatch({ type: "task/loadTasks" });
  }, [textValue, selectedPriority, tags, remindData, dispatch]);

  function handlePriorityChange(newPriority: number, label: string): void {
    setSelectedPriority(newPriority);
    setTextValue((prevText) => {
      const priorityRegex = /\[.*?\]/;
      const existingPriorityMatch = prevText.match(priorityRegex);
      return existingPriorityMatch
        ? prevText.replace(existingPriorityMatch[0], `[${label}]`)
        : `${prevText} [${label}]`;
    });
  }

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
      <div className="flex flex-col gap-2 mt-4">
        {collectionTasks.map((task: ITask) => (
          <TaskItem key={task._id} id={task._id} />
        ))}
        {collectionTasks.length === 0 && (
          <div className="text-center text-gray-400 mt-10">暂无任务～</div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
