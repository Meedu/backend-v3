import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { message, Modal, Button, Tabs } from "antd";
import { system } from "../../../api/index";
import { useDispatch, useSelector } from "react-redux";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { titleAction } from "../../../store/user/loginUserSlice";
import systemIcon from "../../../assets/images/config/system.png";
import paymentIocn from "../../../assets/images/config/payment.png";
import roleIcon from "../../../assets/images/config/role.png";
import loginIcon from "../../../assets/images/config/login.png";
import wechatIcon from "../../../assets/images/config/wechat.png";
import messageIcon from "../../../assets/images/config/message.png";
import videoIocn from "../../../assets/images/config/video.png";
import picIcon from "../../../assets/images/config/pic.png";
import aliIcon from "../../../assets/images/config/ali.png";
import cameraIcon from "../../../assets/images/config/camera.png";
import gaodeIcon from "../../../assets/images/config/gaode.png";
import k12Icon from "../../../assets/images/config/k12.png";
import searchIcon from "../../../assets/images/config/search.png";
import importIcon from "../../../assets/images/config/import.png";
import h5Icon from "../../../assets/images/config/h5.png";
import weixinIcon from "../../../assets/images/config/weixin.png";

const SystemConfigPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const enabledAddons = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddons
  );
  const groups = [
    {
      name: "网站信息",
      value: "系统",
      images: systemIcon,
      sign: "",
    },
    {
      name: "支付配置",
      value: "支付",
      images: paymentIocn,
      sign: "",
    },
    {
      name: "用户注册",
      value: "会员",
      images: roleIcon,
      sign: "",
    },
    {
      name: "登录控制",
      value: "登录",
      images: loginIcon,
      sign: "",
    },
    {
      name: "微信公众号",
      value: "微信公众号",
      images: wechatIcon,
      sign: "",
    },
    {
      name: "短信服务",
      value: "短信",
      images: messageIcon,
      sign: "",
    },
    {
      name: "视频存储",
      value: "视频",
      images: videoIocn,
      sign: "",
    },
    {
      name: "图片存储",
      value: "图片存储",
      images: picIcon,
      sign: "",
    },
    {
      name: "视频加密",
      value: "视频加密",
      images: aliIcon,
      sign: "视频加密",
    },
    {
      name: "随机拍照",
      value: "随机拍照",
      images: cameraIcon,
      sign: "Snapshot",
    },
    {
      name: "高德地图",
      value: "高德地图",
      images: gaodeIcon,
      sign: "",
    },
    {
      name: "K12配置",
      value: "K12",
      images: k12Icon,
      sign: "XiaoBanKe",
    },
    {
      name: "全局搜索",
      value: "全文搜索",
      images: searchIcon,
      sign: "",
    },
    {
      name: "插件配置",
      value: "插件配置",
      images: importIcon,
      sign: "",
    },
    {
      name: "IOS配置",
      value: "IOS",
      images: h5Icon,
      sign: "TemplateOne",
    },
    {
      name: "微信小程序",
      value: "微信小程序",
      images: weixinIcon,
      sign: "TemplateOne",
    },
    {
      name: "实名认证",
      value: "微信实名认证",
      images: roleIcon,
      sign: "",
    },
  ];

  useEffect(() => {
    document.title = "系统配置";
    dispatch(titleAction("系统配置"));
  }, []);

  const check = (sign: string) => {
    if (
      sign === "视频加密" &&
      (enabledAddons["AliyunHls"] === 1 ||
        enabledAddons["TencentCloudHls"] === 1)
    ) {
      return true;
    } else if (enabledAddons[sign] === 1 || sign === "") {
      return true;
    } else {
      return false;
    }
  };

  const goConfig = (value: string) => {};

  return (
    <div className={styles["config-box"]}>
      <div className={styles["options"]}>
        <div className={styles["title"]}>基本配置</div>
        <div className={styles["body"]}>
          {groups.map((item: any, index: number) => {
            return (
              check(item.sign) && (
                <div
                  key={index}
                  className={styles["item"]}
                  onClick={() => goConfig(item.value)}
                >
                  <img src={item.images} />
                  <span>{item.name}</span>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SystemConfigPage;
