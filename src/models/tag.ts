import { Reducer, AnyAction, Subscription } from "umi";
import { tagApi } from "@/api"; // 导入 tagApi

// 定义 TagState 类型
export interface TagState {
  tags: string[]; // 只存标签名称数组
}

export interface TagModelType {
  namespace: "tag"; // DVA model 的命名空间
  state: TagState; // model 状态
  reducers: {
    setTags: Reducer<TagState, AnyAction>; // 设置 tags 数据
    addTag: Reducer<TagState, AnyAction>; // 添加新标签
    removeTag: Reducer<TagState, AnyAction>; // 删除标签
  };
  subscriptions: {
    setup: Subscription; // 订阅数据变化
  };
}

// 从 localStorage 读取 tags 数据
const loadTagsFromStorage = (): string[] => {
  try {
    const storedTags = localStorage.getItem("tags");
    return storedTags ? JSON.parse(storedTags) : [];
  } catch (error) {
    console.error("Failed to load tags from localStorage:", error);
    return [];
  }
};

// 持久化 tags 到 localStorage
const saveTagsToStorage = (tags: string[]) => {
  try {
    localStorage.setItem("tags", JSON.stringify(tags));
  } catch (error) {
    console.error("Failed to save tags to localStorage:", error);
  }
};

const TagModel: TagModelType = {
  namespace: "tag",

  state: {
    tags: [], // 初始值为空，subscriptions 里再初始化
  },

  subscriptions: {
    setup({ dispatch }) {
      // 从 tagApi 获取数据并存入 Redux Store
      const fetchTags = async () => {
        try {
          const response = await tagApi.getTags();
          const tags = response.data || [];
          dispatch({
            type: "setTags",
            payload: tags,
          });
        } catch (error) {
          console.error("Failed to fetch tags:", error);
        }
      };

      // 尝试从 localStorage 加载数据（如果 API 请求失败）
      const storedTags = loadTagsFromStorage();
      if (storedTags.length > 0) {
        dispatch({
          type: "setTags",
          payload: storedTags,
        });
      } else {
        fetchTags(); // 从 API 加载数据
      }

      // 监听 localStorage 变化
      window.addEventListener("storage", () => {
        const updatedTags = loadTagsFromStorage();
        dispatch({
          type: "setTags",
          payload: updatedTags,
        });
      });
    },
  },

  reducers: {
    // 设置 tags 数据
    setTags(state: TagState, { payload }: AnyAction) {
      saveTagsToStorage(payload);
      return { ...state, tags: payload };
    },

    // 添加新标签
    addTag(state: TagState, { payload }: AnyAction) {
      const newTags = [...state.tags, payload];
      saveTagsToStorage(newTags);
      return { ...state, tags: newTags };
    },

    // 删除标签
    removeTag(state: TagState, { payload }: AnyAction) {
      const newTags = state.tags.filter((tag) => tag !== payload);
      saveTagsToStorage(newTags);
      return { ...state, tags: newTags };
    },
  },
};

export default TagModel;
