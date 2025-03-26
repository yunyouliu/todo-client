// src/models/user.ts
import { Effect, Reducer } from "umi";

export interface UserModelState {
  _id: string;
  token?: string;
}

export interface UserModelType {
  namespace: "user";
  state: UserModelState;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    saveId: Reducer<UserModelState>;
    clearId: Reducer<UserModelState>;
  };
  subscriptions: {
    setup: any;
  };
}

const UserModel: UserModelType = {
  namespace: "user",
  state: {
    _id: "",
    token: "",
  },

  effects: {
    // 登录成功后调用
    *login({ payload }, { put }) {
      // 持久化到 localStorage
      localStorage.setItem("user_id", payload.id);
      localStorage.setItem("t", payload.token);
      yield put({
        type: "saveId",
        payload: payload,
      });
    },

    // 退出登录
    *logout(_, { put }) {
      localStorage.removeItem("user_id");
      yield put({ type: "clearId" });
      yield put({ type: "active/setActiveKey", payload: "1" });
    },
  },

  reducers: {
    saveId(state, { payload }): UserModelState {
      return {
        ...state,
        _id: payload,
      };
    },

    clearId(): UserModelState {
      return {
        _id: "",
      };
    },
  },

  subscriptions: {
    setup({ dispatch }: { dispatch: Function }) {
      // 初始化时从 localStorage 恢复ID
      const savedId = localStorage.getItem("user_id");
      if (savedId) {
        dispatch({
          type: "saveId",
          payload: { id: savedId },
        });
      }
    },
  },
};

export default UserModel;
