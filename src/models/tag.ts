import { Reducer, AnyAction, Subscription } from "umi";
import { tagApi } from "@/api";

export interface ITag extends Document {
  _id: string; // 标签唯一标识符
  name: string; // 标签名称
  user: string; // 所属用户
  color?: string; // 标签颜色（如 #00FF00）
  isDeleted: boolean; // 软删除标记
  createdAt: Date;
  updatedAt: Date;
} // 引入ITag接口

// 定义 TagState 类型
export interface TagState {
  tags: ITag[]; // 存储ITag对象数组
}

export interface TagModelType {
  namespace: "tag";
  state: TagState;
  reducers: {
    setTags: Reducer<TagState, AnyAction>;
    addTag: Reducer<TagState, AnyAction>;
    removeTag: Reducer<TagState, AnyAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

// 从 localStorage 读取 tags 数据
const loadTagsFromStorage = (): ITag[] => {
  try {
    const storedTags = localStorage.getItem("tags");
    return storedTags ? JSON.parse(storedTags) : [];
  } catch (error) {
    console.error("Failed to load tags from localStorage:", error);
    return [];
  }
};

// 持久化 tags 到 localStorage
const saveTagsToStorage = (tags: ITag[]) => {
  try {
    localStorage.setItem("tags", JSON.stringify(tags));
  } catch (error) {
    console.error("Failed to save tags to localStorage:", error);
  }
};

const TagModel: TagModelType = {
  namespace: "tag",

  state: {
    tags: [],
  },

  subscriptions: {
    setup({ dispatch }) {
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

      const storedTags = loadTagsFromStorage();
      if (storedTags.length > 0) {
        dispatch({
          type: "setTags",
          payload: storedTags,
        });
      } else {
        fetchTags();
      }

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
    setTags(state: TagState, { payload }: AnyAction) {
      saveTagsToStorage(payload);
      return { ...state, tags: payload };
    },

    addTag(state: TagState, { payload }: AnyAction) {
      const newTags = [...state.tags, payload];
      saveTagsToStorage(newTags);

      // Sync with backend
      tagApi.addTag(payload).catch((error) => {
        console.error("Failed to add tag to backend:", error);
      });

      return { ...state, tags: newTags };
    },

    removeTag(state: TagState, { payload }: AnyAction) {
      const newTags = state.tags.filter((tag) => tag._id !== payload._id);
      saveTagsToStorage(newTags);

      // Sync with backend
      tagApi.removeTag(payload._id).catch((error) => {
        console.error("Failed to remove tag from backend:", error);
      });

      return { ...state, tags: newTags };
    },
  },
};

export default TagModel;