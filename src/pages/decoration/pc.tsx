import { useState, useEffect, useRef } from "react";
import { Form, message, Button, Input, Row, Col, Dropdown } from "antd";
import type { MenuProps } from "antd";
import Draggable from "react-draggable";
import styles from "./pc.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { viewBlock } from "../../api/index";
import { HelperText } from "../../components";
import { titleAction } from "../../store/user/loginUserSlice";
import { CloseOutlined, LeftOutlined } from "@ant-design/icons";
import navIcon from "../../assets/images/decoration/h5/icon-nav.png";
import announceIcon from "../../assets/images/decoration/h5/icon-announce.png";
import bannerIcon from "../../assets/images/decoration/h5/icon-banner.png";
import linkIcon from "../../assets/images/decoration/h5/icon-link.png";

const DecorationPCPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = "电脑端装修";
    dispatch(titleAction("电脑端装修"));
  }, []);

  return (
    <div className={styles["bg"]}>
      <div className={styles["top-box"]}>
        <div className={styles["btn-back"]} onClick={() => navigate(-1)}>
          <LeftOutlined style={{ marginRight: 4 }} />
          返回
        </div>
        <div className={styles["line"]}></div>
        <div className={styles["name"]}>电脑端首页</div>
      </div>
      <div className={styles["blocks-box"]}>
        <div className={styles["title"]}>拖动添加板块</div>
        <div className={styles["tip"]}>拖动下列图标到右侧预览区</div>
      </div>
      <div className={styles["navs-box"]}>
        <div className={styles["nav-item"]}>
          <img src={navIcon} width={30} height={30} />
          导航管理
        </div>
        <div className={styles["nav-item"]}>
          <img src={announceIcon} width={30} height={30} />
          公告管理
        </div>
        <div className={styles["nav-item"]}>
          <img src={bannerIcon} width={30} height={30} />
          轮播图片
        </div>
        <div className={styles["nav-item"]}>
          <img src={linkIcon} width={30} height={30} />
          友情链接
        </div>
        <div className={styles["tip"]}>点击预览区直接编辑板块</div>
      </div>
    </div>
  );
};

export default DecorationPCPage;
