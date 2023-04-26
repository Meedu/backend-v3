import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Spin, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { login as loginApi, system } from "../../api/index";
import { loginAction, logoutAction } from "../../store/user/loginUserSlice";

const LoginPage = () => {
  document.title = "登录";
  const dispatch = useDispatch();
  const loginState = useSelector((state: any) => {
    return state.loginUser.value;
  });

  return (
    <>
      <Button
        onClick={() => {
          dispatch(
            loginAction({
              user: {
                name: "霸王",
              },
            })
          );
        }}
      >
        登录吧
      </Button>

      {loginState.isLogin && (
        <Button
          onClick={() => {
            dispatch(logoutAction());
          }}
        >
          {loginState.user.name}
        </Button>
      )}
    </>
  );
};

export default LoginPage;
