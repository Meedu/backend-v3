import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./index.module.scss";
import logo from "../../assets/home/logo.png";
import "../../assets/common/iconfont/iconfont.css";

function getItem(
  label: any,
  key: any,
  icon: any,
  children: any,
  type: any,
  permission: any
) {
  return {
    key,
    icon,
    children,
    label,
    type,
    permission,
  };
}
const items = [
  getItem(
    "主页",
    "/",
    <i className={`iconfont icon-icon-study-n`} />,
    null,
    null,
    null
  ),
  getItem(
    "装修",
    "decoration",
    <i className="iconfont icon-icon-decorate" />,
    [
      getItem("电脑端", "/decoration/pc", null, null, null, "viewBlock"),
      getItem("移动端", "/decoration/h5", null, null, null, "viewBlock"),
      getItem(
        "单页面",
        "/singlepage/index",
        null,
        null,
        null,
        "addons.SinglePage.page.list"
      ),
    ],
    null,
    null
  ),
  getItem(
    "课程",
    "courses",
    <i className="iconfont icon-icon-lesson" />,
    [
      getItem("录播课", "/course/vod/index", null, null, null, "course"),
      getItem(
        "直播课",
        "/course/live/index",
        null,
        null,
        null,
        "addons.Zhibo.course.list"
      ),
      getItem(
        "电子书",
        "/course/book/index",
        null,
        null,
        null,
        "addons.meedu_books.book.list"
      ),
      getItem(
        "图文",
        "/course/topic/index",
        null,
        null,
        null,
        "addons.meedu_topics.topic.list"
      ),
      getItem(
        "班课",
        "/K12/XiaoBanKe/course/index",
        null,
        null,
        null,
        "addons.XiaoBanKe.course.list"
      ),
      getItem(
        "学习路径",
        "/course/path/index",
        null,
        null,
        null,
        "addons.learnPaths.path.list"
      ),
    ],
    null,
    null
  ),
  getItem(
    "考试",
    "exam",
    <i className="iconfont icon-icon-exam-n" />,
    [
      getItem(
        "题库",
        "/exam/question/index",
        null,
        null,
        null,
        "addons.Paper.question.list"
      ),
      getItem(
        "试卷",
        "/exam/paper/index",
        null,
        null,
        null,
        "addons.Paper.paper.list"
      ),
      getItem(
        "模拟",
        "/exam/mockpaper/index",
        null,
        null,
        null,
        "addons.Paper.mock_paper.list"
      ),
      getItem(
        "练习",
        "/exam/practice/index",
        null,
        null,
        null,
        "addons.Paper.practice.list"
      ),
    ],
    null,
    null
  ),
  getItem(
    "学员",
    "user",
    <i className="iconfont icon-icon-me-n" />,
    [
      getItem("学员列表", "/member/index", null, null, null, "member"),
      getItem(
        "学习照片",
        "/snapshot/index",
        null,
        null,
        null,
        "addons.Snapshot.images"
      ),
      getItem(
        "学员证书",
        "/certificate/index",
        null,
        null,
        null,
        "addons.cert.list"
      ),
    ],
    null,
    null
  ),
  getItem(
    "财务",
    "finance",
    <i className="iconfont icon-icon-money-n" />,
    [
      getItem("全部订单", "/order/index", null, null, null, "order"),
      getItem(
        "iOS充值",
        "/order/recharge",
        null,
        null,
        null,
        "addons.TemplateOne.rechargeOrders.list"
      ),
      getItem(
        "余额提现",
        "/withdrawOrders",
        null,
        null,
        null,
        "addons.MultiLevelShare.withdraw.list"
      ),
    ],
    null,
    null
  ),
  getItem(
    "运营",
    "operate",
    <i className="iconfont icon-icon-operate" />,
    [
      getItem("VIP会员", "/role", null, null, null, "role"),
      getItem(
        "积分商城",
        "/creditMall/index",
        null,
        null,
        null,
        "addons.credit1Mall.goods.list"
      ),
      getItem(
        "团购课程",
        "/tuangou/goods/index",
        null,
        null,
        null,
        "addons.TuanGou.goods.list"
      ),
      getItem(
        "秒杀课程",
        "/miaosha/goods/index",
        null,
        null,
        null,
        "addons.MiaoSha.goods.list"
      ),
      getItem(
        "分销课程",
        "/multi_level_share/goods/index",
        null,
        null,
        null,
        "addons.MultiLevelShare.goods.list"
      ),
      getItem(
        "站内问答",
        "/wenda/question/index",
        null,
        null,
        null,
        "addons.Wenda.question.list"
      ),
      getItem(
        "兑换活动",
        "/codeExchanger/index",
        null,
        null,
        null,
        "addons.CodeExchanger.activity.list"
      ),
      getItem("优惠码", "/promocode", null, null, null, "promoCode"),
      getItem(
        "公众号",
        "/wechat/messagereply/index",
        null,
        null,
        null,
        "mpWechatMessageReply"
      ),
    ],
    null,
    null
  ),
  getItem(
    "数据",
    "stats",
    <i className="iconfont icon-icon-stat" />,
    [
      getItem(
        "交易数据",
        "/stats/transaction/index",
        null,
        null,
        null,
        "stats.transaction"
      ),
      getItem(
        "商品数据",
        "/stats/content/index",
        null,
        null,
        null,
        "stats.course"
      ),
      getItem(
        "学员数据",
        "/stats/member/index",
        null,
        null,
        null,
        "stats.user"
      ),
    ],
    null,
    null
  ),
  getItem(
    "系统",
    "system",
    <i className="iconfont icon-icon-setting-n" />,
    [
      getItem(
        "管理人员",
        "/system/administrator",
        null,
        null,
        null,
        "administrator"
      ),
      getItem("系统配置", "/system/index", null, null, null, "setting"),
      getItem("系统日志", "/systemLog/index", null, null, null, "system-log"),
      getItem(
        "功能模块",
        "/system/application",
        null,
        null,
        null,
        "super-slug"
      ),
    ],
    null,
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
  "^/certificate": ["user"],
  "^/order": ["finance"],
  "^/withdrawOrders": ["finance"],
  "^/decoration": ["decoration"],
  "^/singlepage": ["decoration"],
  "^/course": ["courses"],
  "^/K12": ["courses"],
  "^/system": ["system"],
  "^/systemLog": ["system"],
};

export const LeftMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.loginUser.value.user);

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
  const [activeMenus, setActiveMenus] = useState<any>([]);

  const onClick = (e: any) => {
    navigate(e.key);
  };

  useEffect(() => {
    setSelectedKeys([location.pathname]);
    setOpenKeys(openKeyMerge(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    checkMenuPermissions(items, user);
  }, [items, user]);

  const checkMenuPermissions = (items: any, user: any) => {
    let menus: any = [];
    if (!user) {
      setActiveMenus(menus);
      return;
    }

    for (let i in items) {
      let menuItem = items[i];
      if (!menuItem.children) {
        // 一级菜单不做权限控制
        menus.push(menuItem);
        continue;
      }
      let children = [];

      for (let j in menuItem.children) {
        let childrenItem = menuItem.children[j];

        if (childrenItem.permission === "super-slug") {
          // 超管判断
          if (user.is_super) {
            children.push(childrenItem);
          }
          continue;
        }

        if (childrenItem.permission === "system-log") {
          if (
            typeof user.permissions["system.log.admin"] !== "undefined" ||
            typeof user.permissions["system.log.userLogin"] !== "undefined" ||
            typeof user.permissions["system.log.uploadImages"] !== "undefined"
          ) {
            // 存在权限
            children.push(childrenItem);
          }
          continue;
        }

        if (typeof user.permissions[childrenItem.permission] !== "undefined") {
          // 存在权限
          children.push(childrenItem);
        }
      }

      if (children.length > 0) {
        menus.push(Object.assign({}, menuItem, { children: children }));
      }
    }
    setActiveMenus(menus);
  };

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
          items={activeMenus}
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