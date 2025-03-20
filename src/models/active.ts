/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-16 20:18:53
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-17 00:24:44
 */
import { Reducer, AnyAction } from "umi";

// 定义 ActiveState 类型
export interface ActiveState {
  activeKey: string; // 当前激活的 Key
  isCollapsed: boolean; // 是否折叠
  isopen: boolean;
  activeLabel: string; // 当前激活的标签
}

export interface ActiveModelType {
  namespace: "active"; // DVA model 的命名空间
  state: ActiveState; // model 状态
  reducers: {
    setActiveKey: Reducer<ActiveState, AnyAction>; // 设置激活的 Key
    setIsCollapsed: Reducer<ActiveState, AnyAction>; // 设置是否折叠
    setActiveLabel: Reducer<ActiveState, AnyAction>; // 设置激活的标签
    toggleIsCollapsed: Reducer<ActiveState, AnyAction>; // 切换折叠状态
    toggleIsOpen: Reducer<ActiveState, AnyAction>;
    setIsOpen: Reducer<ActiveState, AnyAction>;
  };
}

const ActiveModel: ActiveModelType = {
  namespace: "active",

  state: {
    activeKey: "all",
    isCollapsed: false,
    isopen: false,
    activeLabel: "所有",
  },

  reducers: {
    // 设置激活的 key
    setActiveKey(state: ActiveState, { payload }: AnyAction) {
      return { ...state, activeKey: payload };
    },

    // 设置是否折叠
    setIsCollapsed(state: ActiveState, { payload }: AnyAction) {
      return { ...state, isCollapsed: payload };
    },

    setIsOpen(state: ActiveState, { payload }: AnyAction) {
      return { ...state, isopen: payload };
    },

    // 切换open
    toggleIsOpen(state: ActiveState) {
      return { ...state, isopen: !state.isopen };
    },

    // 设置当前激活的标签
    setActiveLabel(state: ActiveState, { payload }: AnyAction) {
      return { ...state, activeLabel: payload };
    },

    // 切换折叠状态
    toggleIsCollapsed(state: ActiveState) {
      return { ...state, isCollapsed: !state.isCollapsed };
    },
  },
};

export default ActiveModel;
