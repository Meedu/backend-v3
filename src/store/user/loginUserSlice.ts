import { createSlice } from "@reduxjs/toolkit";

type UserStoreInterface = {
  user: any;
  isLogin: boolean;
};

let defaultValue: UserStoreInterface = {
  user: null,
  isLogin: false,
};

const loginUserSlice = createSlice({
  name: "loginUser",
  initialState: {
    value: defaultValue,
  },
  reducers: {
    loginAction(stage, e) {
      stage.value.user = e.payload;
      stage.value.isLogin = true;
    },
    logoutAction(stage) {
      stage.value.user = null;
      stage.value.isLogin = false;
    },
  },
});

export default loginUserSlice.reducer;
export const { loginAction, logoutAction } = loginUserSlice.actions;

export type { UserStoreInterface };
