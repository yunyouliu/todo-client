/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-16 00:45:25
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-12-20 15:17:32
 */
import { Effect, Reducer } from "umi";

export interface MyState {
  them: boolean;
  name: string;
  age: number;
}

export interface MyModelType {
  namespace: "myModel";
  state: MyState;
  reducers: {
    save: Reducer<MyState>;
    changeName: Reducer<MyState>;
  };
}

const MyModel: MyModelType = {
  namespace: "myModel",
  state: {
    them: false,
    name: "yunyouliu",
    age: 18,
  },
  reducers: {
    //取反
    save(state) {
      return {
        ...state,
        them: !state.them,
      };
    },
    changeName(state, { payload }) {
      return {
        ...state,
        name: payload,
      };
    },
  },
};


export default MyModel;
