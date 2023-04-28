import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./index.module.scss";
import logo from "../../assets/home/logo.png";

function getItem(label: any, key: any, icon: any, children: any, type: any) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem(
    "首页概览",
    "/",
    <i className={`iconfont icon-icon-home`} />,
    null,
    null
  ),
  getItem(
    "分类管理",
    "/resource-category",
    <i className="iconfont icon-icon-category" />,
    null,
    null
  ),
  getItem(
    "资源管理",
    "resource",
    <i className="iconfont icon-icon-file" />,
    [
      getItem("视频", "/videos", null, null, null),
      getItem("图片", "/images", null, null, null),
    ],
    null
  ),
  getItem(
    "课程中心",
    "courses",
    <i className="iconfont icon-icon-study" />,
    [getItem("线上课", "/course", null, null, null)],
    null
  ),
  getItem(
    "学员管理",
    "user",
    <i className="iconfont icon-icon-user" />,
    [
      getItem("学员", "/member/index", null, null, null),
      getItem("部门", "/department", null, null, null),
    ],
    null
  ),
  getItem(
    "系统设置",
    "system",
    <i className="iconfont icon-icon-setting" />,
    [
      getItem("系统配置", "/system/config/index", null, null, null),
      getItem("管理人员", "/system/administrator", null, null, null),
      // getItem("角色配置", "/system/adminroles", null, null, null),
    ],
    null
  ),
];

const children2Parent: any = {
  "^/video": ["resource"],
  "^/image": ["resource"],
  "^/member": ["user"],
  "^/department": ["user"],
  "^/course": ["courses"],
  "^/system": ["system"],
};

export const LeftMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hit = (pathname: string): string[] => {
    for (let p in children2Parent) {
      if (pathname.search(p) >= 0) {
        return children2Parent[p];
      }
    }
    return [];
  };
  const openKeyMerge = (pathname: string): string[] => {
    let newOpenKeys = hit(pathname);
    for (let i = 0; i < openKeys.length; i++) {
      let isIn = false;
      for (let j = 0; j < newOpenKeys.length; j++) {
        if (newOpenKeys[j] === openKeys[i]) {
          isIn = true;
          break;
        }
      }
      if (isIn) {
        continue;
      }
      newOpenKeys.push(openKeys[i]);
    }
    return newOpenKeys;
  };

  // 选中的菜单
  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    location.pathname,
  ]);
  // 展开菜单
  const [openKeys, setOpenKeys] = useState<string[]>(hit(location.pathname));

  const onClick = (e: any) => {
    navigate(e.key);
  };

  useEffect(() => {
    setSelectedKeys([location.pathname]);
    setOpenKeys(openKeyMerge(location.pathname));
  }, [location.pathname]);

  return (
    <div className={styles["left-menu"]}>
      <div
        style={{
          textDecoration: "none",
          position: "sticky",
          top: 0,
          height: 56,
          zIndex: 10,
          background: "#fff",
        }}
      >
        <img
          src={logo}
          className={styles["App-logo"]}
          onClick={() => {
            window.location.href = "/";
          }}
        />
      </div>
      <div className={styles["menu-box"]}>
        <Menu
          onClick={onClick}
          style={{
            width: 200,
            background: "#ffffff",
          }}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          mode="inline"
          items={items}
          onSelect={(data: any) => {
            setSelectedKeys(data.selectedKeys);
          }}
          onOpenChange={(keys: any) => {
            setOpenKeys(keys);
          }}
        />
      </div>
    </div>
  );
};
