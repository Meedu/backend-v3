import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Button, Image, Dropdown, message, Menu } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../store/user/loginUserSlice";
import { login, user as member } from "../../api/index";
import { StudentDeviceDialog } from "../../components";
import AppConfig from "../../js/config";
import { checkUrl } from "../../utils/index";
import deviceIcon from "../../assets/img/focus-device.png";
import liveIcon from "../../assets/img/teacher-live-icon.png";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [loading, setLoading] = useState<boolean>(false);
  const [studentDevice, setStudentDevice] = useState<boolean>(false);
  const [showLiveTeacher, setShowLiveTeacher] = useState<boolean>(false);
  const title = useSelector((state: any) => state.loginUser.value.title);
  const user = useSelector((state: any) => state.loginUser.value.user);
  const isLogin = useSelector((state: any) => state.loginUser.value.isLogin);
  const enabledAddons = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddons
  );

  useEffect(() => {
    if (enabledAddons["Zhibo"] === 1) {
      setShowLiveTeacher(true);
    }
  }, [enabledAddons]);

  const items: MenuProps["items"] = [
    {
      label: "修改密码",
      key: "edit_password",
    },
    {
      label: "安全退出",
      key: "login_out",
    },
  ];

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "login_out") {
      if (loading) {
        return;
      }
      setLoading(true);
      login.logout().then((res: any) => {
        message.success("安全退出成功");
        dispatch(logoutAction());
        setLoading(false);
        navigate("/login", { replace: true });
      });
    } else if (key === "edit_password") {
      navigate("/administrator/change-password");
    }
  };

  return (
    <div className={styles["app-header"]}>
      <StudentDeviceDialog
        open={studentDevice}
        onCancel={() => setStudentDevice(false)}
      ></StudentDeviceDialog>
      <div className={styles["main-header"]}>
        <div className={styles["page-name"]}>{title}</div>
        <div className={styles["device-bar"]}>
          <div
            className={styles["device-item"]}
            onClick={() => setStudentDevice(true)}
          >
            <img src={deviceIcon} />
            访问学员端
          </div>
          <i className={styles["column"]}></i>
          {showLiveTeacher && (
            <>
              <div
                className={styles["device-item"]}
                onClick={() => {
                  window.open(
                    checkUrl(AppConfig.url) +
                      "addons/Zhibo/teacher/dist/#/dashboard/index"
                  );
                }}
              >
                <img src={liveIcon} />
                讲师直播端
              </div>
              <i className={styles["column"]}></i>
            </>
          )}
          {isLogin && user && (
            <Button.Group className={styles["user-info"]}>
              <Dropdown menu={{ items, onClick }} placement="bottomRight">
                <div className="d-flex">
                  <span className={styles["name"]}>{user.name}</span>
                  <DownOutlined
                    style={{ fontSize: 12, marginLeft: 5, color: "#606266" }}
                  />
                </div>
              </Dropdown>
            </Button.Group>
          )}
        </div>
      </div>
    </div>
  );
};
