import React, { useEffect, useState } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import { useSelector } from "umi";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const Abstract: React.FC = () => {
  const [vd, setVd] = useState<Vditor>();
  const taskList = useSelector((state: any) => state.task.tasks); // 你可能需要根据实际路径修改

  // 模拟当前周时间范围
  const startOfWeek = dayjs().startOf("week").add(1, "day"); // 周一
  const endOfWeek = dayjs().endOf("week").add(1, "day"); // 周日

  const generateMarkdown = () => {
    const completedTasks = taskList.filter(
      (task: any) =>
        task.status === 2 &&
        dayjs(task.remindTime).isBetween(startOfWeek, endOfWeek, null, "[]")
    );

    const pendingTasks = taskList.filter(
      (task: any) =>
        task.status !== 2 &&
        dayjs(task.remindTime).isBetween(startOfWeek, endOfWeek, null, "[]")
    );
    const completedList = completedTasks
      .map(
        (t: any) =>
          `- [${dayjs(t.remindTime).format("M月D日")}] ${t.title || "无标题"}`
      )
      .join("\n");

    const pendingList = pendingTasks
      .map((t: any) => `- ${t.title || "无标题"}`)
      .join("\n");

    return `# ${startOfWeek.format("M月D日")}-${endOfWeek.format("M月D日")}

#### ✅ 已完成
${completedList || "暂无"}

#### ❌ 未完成
${pendingList || "暂无"}
`;
  };

  useEffect(() => {
    const vditor = new Vditor("vditor", {
      after: () => {
        vditor.setValue(generateMarkdown());
        setVd(vditor);
      },
      minHeight: 600,
      width: "100%",
    });

    return () => {
      vd?.destroy();
      setVd(undefined);
    };
  }, [taskList]); // 当 taskList 改变时更新内容

  return (
    <div className="flex flex-col h-full w-full p-3">
      <div id="vditor" className="vditor text-left mt-2 !p-0" />
    </div>
  );
};

export default Abstract;
