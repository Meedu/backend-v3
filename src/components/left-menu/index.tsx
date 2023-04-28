import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./index.module.scss";
import logo from "../../assets/home/logo.png";
import "../../assets/common/iconfont/iconfont.css";

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
    "主页",
    "/",
    <i className={`iconfont icon-icon-study-n`} />,
    null,
    null
  ),
  getItem(
    "装修",
    "decoration",
    <i className="iconfont icon-icon-decorate" />,
    [
      getItem("电脑端", "/decoration/pc", null, null, null),
      getItem("移动端", "/decoration/h5", null, null, null),
      getItem("单页面", "/singlepage/index", null, null, null),
    ],
    null
  ),
  getItem(
    "课程",
    "courses",
    <i className="iconfont icon-icon-lesson" />,
    [
      getItem("录播课", "/course/vod/index", null, null, null),
      getItem("直播课", "/course/live/index", null, null, null),
      getItem("电子书", "/course/book/index", null, null, null),
      getItem("图文", "/course/topic/index", null, null, null),
      getItem("学习路径", "/course/path/index", null, null, null),
    ],
    null
  ),
  getItem(
    "考试",
    "exam",
    <i className="iconfont icon-icon-exam-n" />,
    [
      getItem("题库", "/exam/question/index", null, null, null),
      getItem("试卷", "/exam/paper/index", null, null, null),
      getItem("模拟", "/exam/mockpaper/index", null, null, null),
      getItem("练习", "/exam/practice/index", null, null, null),
    ],
    null
  ),
  getItem(
    "学员",
    "user",
    <i className="iconfont icon-icon-me-n" />,
    [
      getItem("学员列表", "/member/index", null, null, null),
      getItem("学习照片", "/snapshot/index", null, null, null),
    ],
    null
  ),
  getItem(
    "财务",
    "finance",
    <i className="iconfont icon-icon-money-n" />,
    [
      getItem("全部订单", "/order/index", null, null, null),
      getItem("iOS充值", "/order/recharge", null, null, null),
      getItem("余额提现", "/withdrawOrders", null, null, null),
    ],
    null
  ),
  getItem(
    "运营",
    "operate",
    <i className="iconfont icon-icon-operate" />,
    [
      getItem("VIP会员", "/role", null, null, null),
      getItem("积分商城", "/creditMall/index", null, null, null),
      getItem("团购课程", "/tuangou/goods/index", null, null, null),
      getItem("秒杀课程", "/miaosha/goods/index", null, null, null),
      getItem("分销课程", "/multi_level_share/goods/index", null, null, null),
      getItem("站内问答", "/wenda/question/index", null, null, null),
      getItem("兑换活动", "/codeExchanger/index", null, null, null),
      getItem("优惠码", "/promocode", null, null, null),
      getItem("公众号", "/wechat/messagereply/index", null, null, null),
    ],
    null
  ),
  getItem(
    "数据",
    "stats",
    <i className="iconfont icon-icon-stat" />,
    [
      getItem("交易数据", "/stats/transaction/index", null, null, null),
      getItem("商品数据", "/stats/content/index", null, null, null),
      getItem("学员数据", "/stats/member/index", null, null, null),
    ],
    null
  ),
  getItem(
    "系统",
    "system",
    <i className="iconfont icon-icon-setting-n" />,
    [
      getItem("管理人员", "/system/administrator", null, null, null),
      getItem("系统配置", "/system/index", null, null, null),
      getItem("系统日志", "/systemLog/index", null, null, null),
      getItem("功能模块", "/system/application", null, null, null),
    ],
    null
  ),
];

const children2Parent: any = {
  "^/role": ["operate"],
  "^/creditMall": ["operate"],
  "^/tuangou": ["operate"],
  "^/miaosha": ["operate"],
  "^/multi_level_share": ["operate"],
  "^/wenda": ["operate"],
  "^/codeExchanger": ["operate"],
  "^/promocode": ["operate"],
  "^/wechat": ["operate"],
  "^/stats": ["stats"],
  "^/exam": ["exam"],
  "^/member": ["user"],
  "^/snapshot": ["user"],
  "^/order": ["finance"],
  "^/withdrawOrders": ["finance"],
  "^/decoration": ["decoration"],
  "^/singlepage": ["decoration"],
  "^/course": ["courses"],
  "^/system": ["system"],
  "^/systemLog": ["system"],
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
            textAlign: "left",
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
