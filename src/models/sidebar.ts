/*
 * @Descripttion: Sidebar Model for task management with visible property and sorting
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-16
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-02-27 19:00:30
 */

import { Reducer, AnyAction } from "umi";

// 定义侧边栏项的接口，新增 visible 属性
export interface SidebarItem {
  key: string; // 唯一标识
  icon: string; // 图标名称或图标类名
  label: string; // 文字标签
  size: number; // 图标的大小
  count?: number; // 可选的计数
  path?: string; //可选的路径 为底部图标独有
  layout?: boolean; // 可选参数默认为 true
  visible: boolean; // 控制显示/隐藏的属性，默认为 true
}

// 定义侧边栏的状态接口
export interface SidebarState {
  sidebarData: SidebarItem[]; // 侧边栏的所有项
  buttomIcons: SidebarItem[]; // 底部的按钮图标
  drawerButtomIcons: SidebarItem[]; // 抽屉底部的按钮图标
}

// 定义侧边栏模型的类型
export interface SidebarModelType {
  namespace: "sidebar"; // 模型的命名空间
  state: SidebarState; // 模型的状态
  reducers: {
    setSidebarData: Reducer<SidebarState, AnyAction>; // 设置侧边栏数据
    reorderSidebarData: Reducer<SidebarState, AnyAction>; // 重新排序侧边栏项
    addSidebarItem: Reducer<SidebarState, AnyAction>; // 添加侧边栏项
    removeSidebarItem: Reducer<SidebarState, AnyAction>; // 删除侧边栏项
    toggleVisibility: Reducer<SidebarState, AnyAction>; // 切换侧边栏项的可见性
  };
}

// 定义侧边栏模型
const SidebarModel: SidebarModelType = {
  namespace: "sidebar", // 命名空间

  // 初始状态，包含 sidebarData 和 buttomIcons
  state: {
    sidebarData: [
      {
        key: "/task/all",
        size: 18,
        icon: "suoyou",
        label: "所有",
        count: 11,
        visible: true,
      },
      {
        key: "/task/today",
        icon: `day${new Date().getDate()}`,
        label: "今天",
        size: 18,
        count: 1,
        visible: true,
      },
      {
        key: "/task/tomorrow",
        icon: "mingtian",
        label: "明天",
        size: 18,
        visible: true,
      },
      {
        key: "/task/week",
        icon: `icons-${new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()}`,
        label: "最近7天",
        size: 22,
        count: 1,
        visible: true,
      },
      {
        key: "/task/assignedme",
        icon: "zhipai",
        label: "指派给我",
        size: 18,
        visible: true,
      },
      {
        key: "/task/inbox",
        icon: "shoujixiang",
        label: "收集箱",
        size: 18,
        visible: true,
      },
      {
        key: "/task/abstract",
        icon: "zhaiyao",
        label: "摘要",
        layout:false,
        size: 18,
        visible: true,
      },
    ],
    buttomIcons: [
      {
        key: "/task/completed",
        icon: "renwu",
        size: 18,
        label: "已完成",
        visible: true,
      },
      {
        key: "/task/abandoned",
        icon: "fangqi",
        size: 20,
        label: "已放弃",
        visible: true,
      },
      {
        key: "/task/trash",
        icon: "lajitong",
        size: 18,
        label: "垃圾桶",
        visible: true,
      },
    ],
    drawerButtomIcons: [
      {
        key: "/task/completed",
        icon: "renwu",
        size: 18,
        label: "已完成",
        visible: true,
      },
      {
        key: "/task/abandoned",
        icon: "fangqi",
        size: 20,
        label: "已放弃",
        visible: true,
      },
      {
        key: "/task/trash",
        icon: "lajitong",
        size: 18,
        label: "垃圾桶",
        visible: true,
      },
      {
        key: "/habit",
        icon: "daka-copy",
        size: 18,
        label: "习惯",
        visible: true,
      },
      {
        key: "/focus",
        icon: "zhuanzhumoshi",
        size: 18,
        label: "专注",
        visible: true,
      },
    ],
  },

  reducers: {
    // 设置侧边栏数据
    setSidebarData(state: SidebarState, { payload }: AnyAction) {
      return { ...state, sidebarData: payload };
    },

    // 重新排序侧边栏数据
    // 排序时可以选择只对可见项进行排序，排序后再恢复隐藏项
    reorderSidebarData(state: SidebarState, { payload }: AnyAction) {
      // 如果需要隐藏项不参与排序，可以过滤掉不可见项
      const visibleItems = state.sidebarData.filter((item) => item.visible);
      const hiddenItems = state.sidebarData.filter((item) => !item.visible);

      // 排序可见项
      const sortedVisibleItems = visibleItems.sort((a, b) => {
        // 根据自定义排序规则，比如按 key 排序
        return a.key.localeCompare(b.key);
      });

      // 合并排序后的可见项和隐藏项
      return {
        ...state,
        sidebarData: [...sortedVisibleItems, ...hiddenItems],
      };
    },

    // 添加新的侧边栏项
    addSidebarItem(state: SidebarState, { payload }: AnyAction) {
      return { ...state, sidebarData: [...state.sidebarData, payload] };
    },

    // 删除一个侧边栏项
    removeSidebarItem(state: SidebarState, { payload }: AnyAction) {
      return {
        ...state,
        sidebarData: state.sidebarData.filter((item) => item.key !== payload),
      };
    },

    // 切换侧边栏项的可见性
    // 切换侧边栏项的 visible 状态
    toggleVisibility(state: SidebarState, { payload }: AnyAction) {
      return {
        ...state,
        sidebarData: state.sidebarData.map((item) =>
          item.key === payload ? { ...item, visible: !item.visible } : item
        ),
      };
    },
  },
};

export default SidebarModel;
