/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-16 20:10:00
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-01-16 20:11:29
 */
import { Reducer, AnyAction } from "umi";

// 定义 TagItem 类型
export interface TagItem {
  key: string; // 唯一标识符
  label: string; // 标签文字
  icon?: string; // 可选的图标
  color?: string; // 可选的颜色
  visible: boolean; // 控制是否显示该项
}

// 定义 TagState 类型
export interface TagState {
  tag: TagItem[]; // 存储标签数据
}

export interface TagModelType {
  namespace: "tag"; // DVA model 的命名空间
  state: TagState; // model 状态
  reducers: {
    setTag: Reducer<TagState, AnyAction>; // 设置 tag 数据
    addTagItem: Reducer<TagState, AnyAction>; // 向 tag 中添加项
    removeTagItem: Reducer<TagState, AnyAction>; // 从 tag 中移除项
    toggleVisible: Reducer<TagState, AnyAction>; // 切换可见性
    reorderTag: Reducer<TagState, AnyAction>; // 根据拖拽结果更新 tag 顺序
  };
}

const TagModel: TagModelType = {
  namespace: "tag",

  state: {
    tag: [
      {
        key: "10086",
        label: "生日",
        icon: "biaoqian",
        color: "#35CB27",
        visible: true,
      },
      {
        key: "10087",
        label: "生活",
        icon: "biaoqian",
        color: "rgb(241, 168, 58)",
        visible: true,
      },
    ],
  },

  reducers: {
    // 设置 tag 数据
    setTag(state: TagState, { payload }: AnyAction) {
      return { ...state, tag: payload };
    },

    // 向 tag 中添加项
    addTagItem(state: TagState, { payload }: AnyAction) {
      return { ...state, tag: [...state.tag, payload] };
    },

    // 从 tag 中移除项
    removeTagItem(state: TagState, { payload }: AnyAction) {
      return {
        ...state,
        tag: state.tag.filter((item) => item.key !== payload),
      };
    },

    // 切换 tag 中项的可见性
    toggleVisible(state: TagState, { payload }: AnyAction) {
      const newTags = state.tag.map((item) =>
        item.key === payload ? { ...item, visible: !item.visible } : item
      );
      return { ...state, tag: newTags };
    },

    // 更新 tag 顺序，基于拖拽操作
    reorderTag(state: TagState, { payload }: AnyAction) {
      return { ...state, tag: payload }; // 更新排序后的 tag
    },
  },
};

export default TagModel;
