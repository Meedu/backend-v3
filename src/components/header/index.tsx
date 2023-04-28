import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Image } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, user as member } from "../../api/index";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  console.log(useLocation());
  const user = useSelector((state: any) => state.loginUser.value.user);

  return (
    <div className={styles["app-header"]}>
      <div className={styles["main-header"]}>
        <div className={styles["page-name"]}>主页</div>
      </div>
    </div>
  );
};
