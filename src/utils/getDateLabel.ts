/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-03-20 21:51:26
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-20 22:31:43
 */
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

interface DateLabel {
  label: string;
  color: "blue" | "red";
}

export const getDateLabel = (
  selectedDate: string | Date | null
): DateLabel | null => {
  if (!selectedDate) return null;

  const today = dayjs();
  const date = dayjs(selectedDate);

  if (date.isSame(today, "day")) {
    return { label: "今天", color: "blue" };
  }

  if (date.isBefore(today, "day")) {
    if (date.isSame(today.subtract(1, "day"), "day")) {
      return { label: "昨天", color: "red" };
    }
    return {
      label:
        date.year() === today.year()
          ? date.format("M/D")
          : date.format("YYYY/M/D"),
      color: "red",
    };
  }

  if (date.isSame(today.add(1, "day"), "day")) {
    return { label: "明天", color: "blue" };
  }

  const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const weekStart = today.startOf("isoWeek");
  for (let i = 0; i < 7; i++) {
    if (date.isSame(weekStart.add(i, "day"), "day")) {
      return { label: weekDays[i], color: "blue" };
    }
  }

  return {
    label:
      date.year() === today.year()
        ? date.format("M/D")
        : date.format("YYYY/M/D"),
    color: "blue",
  };
};


export const formatRelativeDate = (
  selectedDate: string | Date | null
): DateLabel | null => {
  if (!selectedDate) return null;

  const today = dayjs();
  const date = dayjs(selectedDate);

  const diffDays = date.diff(today, "day");
  const diffMonths = date.diff(today, "month");
  const diffYears = date.diff(today, "year");

  let label = "";
  if (date.isSame(today, "day")) {
    label = "今天";
  } else if (Math.abs(diffYears) >= 1) {
    label = `${Math.abs(diffYears)}年${diffYears > 0 ? "后" : "前"}`;
  } else if (Math.abs(diffMonths) >= 1) {
    label = `${Math.abs(diffMonths)}个月${diffMonths > 0 ? "后" : "前"}`;
  } else if (Math.abs(diffDays) >= 1) {
    label = `${Math.abs(diffDays)}天${diffDays > 0 ? "后" : "前"}`;
  }

  label += `,${date.year() === today.year() ? date.format("M月D日") : date.format("YYYY/M/D")}`;

  return {
    label,
    color: date.isBefore(today, "day") ? "red" : "blue",
  };
};
