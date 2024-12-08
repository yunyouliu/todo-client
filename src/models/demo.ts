/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-16 00:45:25
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-11-16 12:42:05
 */
import { Effect, Reducer } from "umi";

export interface MyState {
  them: boolean;
}

export interface MyModelType {
  namespace: "myModel";
  state: MyState;
  reducers: {
    save: Reducer<MyState>;
  };
}

const MyModel: MyModelType = {
  namespace: "myModel",
  state: {
     them: false
  },
  reducers: {
    //取反
    save(state) {
      return {
        ...state,
        them: !state.them
      };
    }
  },
};

export default MyModel;
